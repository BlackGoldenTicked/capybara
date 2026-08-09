import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { decodeHtmlEntities, htmlToSnippet } from './lib/html'

export type ItemStatus = 'inbox' | 'later' | 'favorite' | 'archived'
export type SourceType = 'rss' | 'x' | 'wechat' | 'tophub' | 'github' | 'x_bookmark' | 'manual'

export interface Item {
  id: number
  source_type: SourceType
  source_name: string
  url: string
  title: string
  author: string
  summary: string
  content_text: string
  content_html: string
  cover_url: string
  cover_path: string
  status: ItemStatus
  is_read: number
  published_at: string
  fetched_at: string
}

export interface Feed {
  id: number
  type: string
  name: string
  url: string
  config_json: string
  schedule_min: number
  last_fetched_at: string
  error_count: number
  last_error: string
  enabled: number
  etag: string
  last_modified: string
}

export interface Board {
  id: number
  name: string
  updated_at: string
}

export interface Document {
  id: number
  title: string
  content_json: string
  markdown_cache: string
  status: string
  updated_at: string
}

let dbPath = ''
let db: DatabaseSync
let assetsDir = ''
let imagesDir = ''

// ============ 数据库路径配置 ============

/** db-config.json 的固定位置（始终在 userData 根） */
function getDbConfigPath(): string {
  return path.join(app.getPath('userData'), 'db-config.json')
}

/** 读取自定义数据库路径配置，未设置则返回空字符串 */
function readDbConfig(): string | null {
  try {
    const raw = fs.readFileSync(getDbConfigPath(), 'utf-8')
    const cfg = JSON.parse(raw) as { dbPath?: string }
    if (cfg.dbPath && typeof cfg.dbPath === 'string' && cfg.dbPath.trim()) {
      const p = cfg.dbPath.trim()
      // 如果是目录，自动补全文件名
      try {
        if (fs.statSync(p).isDirectory()) return path.join(p, 'readflow.db')
      } catch { /* 文件还不存在，直接当文件路径使用 */ }
      return p
    }
  } catch { /* 配置文件不存在或格式错误，使用默认路径 */ }
  return null
}

/** 写入自定义数据库路径，传空字符串则清空配置（恢复默认） */
function writeDbConfig(dbPathValue: string): void {
  const p = getDbConfigPath()
  if (!dbPathValue.trim()) {
    try { fs.unlinkSync(p) } catch { /* 文件本来就不存在 */ }
  } else {
    fs.writeFileSync(p, JSON.stringify({ dbPath: dbPathValue.trim() }, null, 2), 'utf-8')
  }
}

/** 设置自定义数据库路径（由设置页调用，验证路径合法性） */
export function setCustomDbPath(newPath: string): { ok: boolean; error?: string } {
  if (!newPath.trim()) {
    writeDbConfig('')
    return { ok: true }
  }
  const resolved = path.resolve(newPath.trim())
  // 验证父目录存在
  const parent = path.dirname(resolved)
  if (!fs.existsSync(parent)) {
    return { ok: false, error: `目录不存在：${parent}` }
  }
  // 验证父目录可写
  try {
    fs.accessSync(parent, fs.constants.W_OK)
  } catch {
    return { ok: false, error: `目录不可写：${parent}` }
  }
  writeDbConfig(resolved)
  return { ok: true }
}

/** 获取当前已配置的自定义路径（用于 UI 显示），无则返回空 */
export function getCustomDbPath(): string {
  return readDbConfig() ?? ''
}

/** 获取当前使用的数据库文件绝对路径 */
export function canonicalDbPath(): string {
  return dbPath
}

export function getAssetsDir(): string { return assetsDir }
export function getImagesDir(): string { return imagesDir }
/** 诊断/内部用途：暴露 DatabaseSync 实例（仅限主进程内使用，绝不给渲染进程） */
export function getDb(): DatabaseSync { return db }
/** 清除单个 feed 的条件缓存头（etag/last_modified），下次请求不走 304 强制全量拉取 */
export function clearFeedCache(id: number) {
  db.prepare('UPDATE feeds SET etag = \'\', last_modified = \'\' WHERE id = ?').run(id)
}
/** 清除全部 feed 的条件缓存头，用于强制全量刷新 */
export function clearAllFeedCache() {
  db.prepare('UPDATE feeds SET etag = \'\', last_modified = \'\'').run()
}

// ===== 数据库路径（单一权威位置，禁止随意变更！） =====
// 所有应用数据（库 + images + backups + board-assets）统一集中在 userData/readflow/ 下，
// 库文件固定为 userData/readflow/readflow.db。
// 历史上曾经改过路径（扁平的 userData/readflow.db），导致「替换 app 后旧数据被孤立、开空库」的事故。
// 因此：本路径今后绝不能再改；若迫不得已要改，必须把旧路径加入 legacyDbCandidates() 以便自动迁移。
function defaultDbPath(): string {
  return path.join(app.getPath('userData'), 'readflow.db')
}
// 历史上曾用过的旧库路径：v0.7.33 的嵌套位置 userData/readflow/readflow.db。
// 启动时会把「旧位置有数据、新位置为空」的旧库原样复制过来，避免数据凭空消失。
function legacyDbCandidates(): string[] {
  return [path.join(app.getPath('userData'), 'readflow', 'readflow.db')]
}

export function getDbFile(): string {
  // 惰性兜底：即便 initDb 因异常（如数据库被占用）未跑完，也能算出本应使用的库路径，
  // 避免设置页「数据库位置」永远显示「加载中」而给不出任何诊断信息。
  if (!dbPath) {
    try { dbPath = defaultDbPath() } catch { /* app 未就绪，返回空 */ }
  }
  return dbPath
}

/** 统计某库条目数；文件不存在 / 非合法库时返回 -1（视为「无数据」） */
function countItems(p: string): number {
  try {
    const d = new DatabaseSync(p)
    const n = (d.prepare('SELECT COUNT(*) c FROM items').get() as { c: number }).c
    d.close()
    return n
  } catch {
    return -1
  }
}

/**
 * 安全迁移历史旧库：仅当「权威库不存在或为空」且「某旧路径有数据」时，把旧库（含 -wal/-shm 兄弟文件）
 * 整体复制到权威位置。复制后做校验，成功才把旧库挪到 .migrated 备份（不再被使用，但保留以防万一）。
 * 绝不覆盖已有数据的权威库。
 */
function migrateLegacyDatabase(canonical: string) {
  const canonN = countItems(canonical)
  if (canonN > 0) return // 权威库已有数据，绝不覆盖
  let best = ''
  let bestN = 0
  for (const cand of legacyDbCandidates()) {
    if (cand === canonical || !fs.existsSync(cand)) continue
    const n = countItems(cand)
    if (n > bestN) { bestN = n; best = cand }
  }
  if (!best) return
  const dir = path.dirname(canonical)
  fs.mkdirSync(dir, { recursive: true })
  // 复制旧库（含 WAL 兄弟文件）到权威位置
  for (const ext of ['', '-wal', '-shm']) {
    const src = best + ext
    if (fs.existsSync(src)) { try { fs.copyFileSync(src, canonical + ext) } catch { /* 单文件失败忽略 */ } }
  }
  // 校验复制结果，成功则把旧库挪到 .migrated 备份
  const copiedN = countItems(canonical)
  if (copiedN >= bestN) {
    for (const ext of ['', '-wal', '-shm']) {
      try { fs.renameSync(best + ext, best + ext + '.migrated') } catch { /* 不存在则忽略 */ }
    }
    console.log(`[initDb] 已从历史旧路径迁移数据库：${best} -> ${canonical}（${copiedN} 条条目）`)
  } else {
    console.error(`[initDb] 旧库迁移校验失败，已保留原文件：${best}`)
  }
}

export function checkpoint(): void { try { db.exec('PRAGMA wal_checkpoint(TRUNCATE)') } catch { /* */ } }

// 定期 WAL checkpoint：每 30 分钟或 WAL 文件超过 10MB 时自动截断
let walTimer: ReturnType<typeof setInterval> | null = null
const WAL_CHECKPOINT_INTERVAL = 30 * 60 * 1000
const WAL_SIZE_THRESHOLD = 10 * 1024 * 1024

function startWalCheckpoint() {
  walTimer = setInterval(() => {
    try {
      const walFile = dbPath.replace(/\.db$/, '.db-wal')
      const stat = fs.statSync(walFile)
      if (stat.size > WAL_SIZE_THRESHOLD) {
        console.log(`[db] WAL 文件 ${(stat.size / 1024 / 1024).toFixed(1)}MB，执行 checkpoint`)
        checkpoint()
      }
    } catch { /* WAL 文件可能不存在 */ }
  }, WAL_CHECKPOINT_INTERVAL)
}

export function stopWalCheckpoint() {
  if (walTimer) { clearInterval(walTimer); walTimer = null }
}

/**
 * 单层化收尾：若仍存在 v0.7.33 的嵌套数据子目录 userData/readflow/，
 * 把里面的 images/backups/board-assets 上移到 userData 根，再删除空壳。
 * 若嵌套目录里还残留未迁移的库文件（.db/.migrated），则保留该目录，绝不误删。
 */
function relocateLegacyDataDir(userData: string) {
  const legacy = path.join(userData, 'readflow')
  if (!fs.existsSync(legacy) || !fs.statSync(legacy).isDirectory()) return
  // 上移数据子目录
  for (const name of ['images', 'backups', 'board-assets']) {
    const src = path.join(legacy, name)
    const dst = path.join(userData, name)
    if (fs.existsSync(src) && !fs.existsSync(dst)) {
      try {
        fs.renameSync(src, dst)
      } catch {
        try { fs.cpSync(src, dst, { recursive: true }); fs.rmSync(src, { recursive: true, force: true }) } catch { /* 忽略 */ }
      }
    }
  }
  // 把嵌套目录里遗留的 .migrated 备份文件上移到 userData 根（避免残留一个空壳 readflow/ 文件夹）
  try {
    for (const f of fs.readdirSync(legacy)) {
      if (f.includes('.migrated')) {
        const s = path.join(legacy, f)
        const d = path.join(userData, 'legacy-' + f)
        if (!fs.existsSync(d)) { try { fs.renameSync(s, d) } catch { /* 忽略 */ } }
      }
    }
  } catch { /* 忽略 */ }
  // 删除空壳嵌套目录，实现真正单层
  try {
    if (fs.readdirSync(legacy).length === 0) fs.rmdirSync(legacy)
  } catch { /* 残留文件则保留 */ }
}

export function initDb() {
  // 读取自定义数据库路径（db-config.json），未设置则使用默认 userData 根
  const customPath = readDbConfig()
  const defaultDir = app.getPath('userData')
  let baseDir: string

  if (customPath) {
    dbPath = customPath
    // 数据目录（images/backups/board-assets）跟随数据库文件所在目录
    baseDir = path.dirname(customPath)
    console.log('[initDb] 使用自定义数据库路径：', dbPath)
  } else {
    baseDir = defaultDir
    dbPath = path.join(baseDir, 'readflow.db')
    console.log('[initDb] 使用默认数据库路径：', dbPath)
  }

  fs.mkdirSync(path.join(baseDir, 'images'), { recursive: true })
  fs.mkdirSync(path.join(baseDir, 'backups'), { recursive: true })
  // 仅在默认路径下做旧库迁移（自定义路径无需迁移）
  if (!customPath) {
    try { migrateLegacyDatabase(dbPath) } catch (e) { console.error('[initDb] 迁移旧库失败：', (e as Error).message) }
    try { relocateLegacyDataDir(defaultDir) } catch (e) { console.error('[initDb] 迁移数据子目录失败：', (e as Error).message) }
  }
  assetsDir = path.join(baseDir, 'board-assets')
  fs.mkdirSync(assetsDir, { recursive: true })
  imagesDir = path.join(baseDir, 'images')
  db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  console.log('[initDb] 数据库文件：', dbPath)
  console.log('[initDb] 数据目录：', baseDir)
  migrate()
  // 定期 WAL checkpoint，防止长时间运行后 WAL 文件膨胀
  startWalCheckpoint()
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_type TEXT NOT NULL DEFAULT 'manual',
      source_name TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      content_text TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'inbox',
      is_read INTEGER NOT NULL DEFAULT 0,
      published_at TEXT NOT NULL DEFAULT '',
      fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(url, source_type)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS feeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'rss',
      name TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      config_json TEXT NOT NULL DEFAULT '',
      schedule_min INTEGER NOT NULL DEFAULT 120,
      last_fetched_at TEXT NOT NULL DEFAULT '',
      error_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT NOT NULL DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 1,
      etag TEXT NOT NULL DEFAULT '',
      last_modified TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      quote TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '未命名白板',
      snapshot_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS board_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_id INTEGER NOT NULL,
      kind TEXT NOT NULL DEFAULT 'ref',
      item_id INTEGER,
      x REAL NOT NULL DEFAULT 0,
      y REAL NOT NULL DEFAULT 0,
      w REAL NOT NULL DEFAULT 240,
      h REAL NOT NULL DEFAULT 140,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      payload TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_board_cards_board ON board_cards(board_id);
    CREATE TABLE IF NOT EXISTS board_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_id INTEGER NOT NULL,
      from_id INTEGER NOT NULL,
      to_id INTEGER NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(board_id, from_id, to_id)
    );
    CREATE INDEX IF NOT EXISTS idx_board_links_board ON board_links(board_id);
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '未命名文档',
      content_json TEXT NOT NULL DEFAULT '',
      markdown_cache TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_items_status ON items(status, fetched_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_feeds_url ON feeds(url);
  `)
  // 增量列迁移（node:sqlite 无 ALTER IF NOT EXISTS，try/catch 容错）
  for (const col of ['content_html TEXT NOT NULL DEFAULT ""', 'cover_path TEXT NOT NULL DEFAULT ""', 'cover_url TEXT NOT NULL DEFAULT ""']) {
    try { db.exec(`ALTER TABLE items ADD COLUMN ${col}`) } catch { /* 列已存在 */ }
  }
  // 来源抓取失败的真实原因（排查「无法获取数据」用），老库补列
  try { db.exec(`ALTER TABLE feeds ADD COLUMN last_error TEXT NOT NULL DEFAULT ''`) } catch { /* 列已存在 */ }
  // 条件请求缓存头（ETag / Last-Modified），支持 304 增量跳过下载
  try { db.exec(`ALTER TABLE feeds ADD COLUMN etag TEXT NOT NULL DEFAULT ''`) } catch { /* 列已存在 */ }
  try { db.exec(`ALTER TABLE feeds ADD COLUMN last_modified TEXT NOT NULL DEFAULT ''`) } catch { /* 列已存在 */ }
  // FTS5 全文索引（不可用则降级 LIKE）
  try {
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS items_fts USING fts5(
        title, summary, content_text, content='items', content_rowid='id', tokenize='unicode61'
      );
      CREATE TRIGGER IF NOT EXISTS items_ai AFTER INSERT ON items BEGIN
        INSERT INTO items_fts(rowid,title,summary,content_text) VALUES(new.id,new.title,new.summary,new.content_text); END;
      CREATE TRIGGER IF NOT EXISTS items_ad AFTER DELETE ON items BEGIN
        INSERT INTO items_fts(items_fts,rowid,title,summary,content_text) VALUES('delete',old.id,old.title,old.summary,old.content_text); END;
      CREATE TRIGGER IF NOT EXISTS items_au AFTER UPDATE ON items BEGIN
        INSERT INTO items_fts(items_fts,rowid,title,summary,content_text) VALUES('delete',old.id,old.title,old.summary,old.content_text);
        INSERT INTO items_fts(rowid,title,summary,content_text) VALUES(new.id,new.title,new.summary,new.content_text); END;
    `)
    const ftsN = (db.prepare('SELECT COUNT(*) n FROM items_fts').get() as { n: number }).n
    const itemsN = (db.prepare('SELECT COUNT(*) n FROM items').get() as { n: number }).n
    // items 与 items_fts 行数不一致时全量重建索引（兜底触发器失效 / 老库脱节）
    if (ftsN !== itemsN) db.exec(`INSERT INTO items_fts(items_fts) VALUES('rebuild')`)
  } catch { /* FTS5 不可用，降级 LIKE */ }

  // 修复旧数据中 HTML 实体编码的摘要/正文（RSS description 常把 <img> 整段编码，导致卡片与阅读区裸奔源码）
  try { repairHtmlEncodedItems() } catch (e) { console.error('[initDb] 修复 HTML 实体编码失败：', (e as Error).message) }
}

/** 一次性修复：把 summary / content_html / content_text 中仍含 &lt; &gt; 等实体编码的行清洗还原。
 * 注意：summary 只取前 300 字符，不能用来反推完整 content_html，因此 content_html 为空时保持为空，
 * 等下次非 304 刷新时由 rss.ts 写入完整 decoded HTML。
 */
function repairHtmlEncodedItems(): number {
  const rows = db.prepare(`
    SELECT id, summary, content_text, content_html FROM items
    WHERE summary LIKE '%&lt;%' OR summary LIKE '%&gt;%'
       OR content_text LIKE '%&lt;%' OR content_text LIKE '%&gt;%'
       OR content_html LIKE '%&lt;%' OR content_html LIKE '%&gt;%'
  `).all() as Array<{ id: number; summary: string; content_text: string; content_html: string }>
  if (!rows.length) return 0
  const update = db.prepare('UPDATE items SET summary = ?, content_text = ?, content_html = ? WHERE id = ?')
  let fixed = 0
  for (const row of rows) {
    const summary = htmlToSnippet(row.summary)
    const contentText = htmlToSnippet(row.content_text)
    const contentHtml = row.content_html ? decodeHtmlEntities(row.content_html) : ''
    update.run(summary, contentText, contentHtml, row.id)
    fixed++
  }
  console.log(`[initDb] 修复 ${fixed} 条 HTML 实体编码的摘要/正文`)
  return fixed
}

export type View = 'rss' | 'read' | 'later' | 'favorite' | 'archived' | 'all'

/** 列表投影：只取列表/卡片需要的列，避免把整篇正文（content_html / content_text）跨 IPC 传来传去（性能优化 #1） */
export interface ItemRow {
  id: number
  source_type: SourceType
  source_name: string
  url: string
  title: string
  author: string
  summary: string
  cover_url: string
  cover_path: string
  status: ItemStatus
  is_read: number
  published_at: string
  fetched_at: string
}

const LIST_COLS = 'i.id,i.source_type,i.source_name,i.url,i.title,i.author,i.summary,i.cover_url,i.cover_path,i.status,i.is_read,i.published_at,i.fetched_at'

function hasFts(): boolean {
  return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='items_fts'").get()
}

function sanitizeMatch(input: string): string {
  // 把用户输入拆词、各自加引号，防止 FTS5 操作符注入；支持前缀匹配
  return input.split(/\s+/).filter(Boolean).map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ')
}

function buildListWhere(view: View, search: string, sourceType: string | null, sourceName: string | null): { where: string; args: SQLInputValue[] } {
  const args: SQLInputValue[] = []
  const conds: string[] = []
  if (search && hasFts()) {
    conds.push('i.id IN (SELECT rowid FROM items_fts WHERE items_fts MATCH ?)')
    args.push(sanitizeMatch(search))
  } else if (search) {
    conds.push('(i.title LIKE ? OR i.summary LIKE ? OR i.content_text LIKE ?)')
    const q = `%${search}%`; args.push(q, q, q)
  }
  // 按来源过滤（GitHub ★ / Twitter 书签）时忽略 status 视图，展示该来源全部条目
  if (sourceType) {
    conds.push('i.source_type = ?'); args.push(sourceType)
  } else {
    // GitHub ★ / Twitter 书签是独立侧栏集合，不混入 RSS 类视图（含「全部」/「未读」），避免主阅读流被污染
    conds.push("i.source_type NOT IN ('github','x_bookmark')")
    if (view === 'rss') { conds.push("i.status = 'inbox' AND i.is_read = 0") }
    else if (view === 'read') { conds.push('i.is_read = 1') }
    else if (view !== 'all') { conds.push('i.status = ?'); args.push(view) }
  }
  // 按订阅源名称（source_name，即 feed.name）筛选；与上方视图条件叠加
  if (sourceName) { conds.push('i.source_name = ?'); args.push(sourceName) }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
  return { where, args }
}

/** 分页列表：按订阅源翻页浏览历史条目，每次一页 15 条 */
export function listItemsPage(view: View, search: string, sourceType: string | null, sourceName: string | null, page: number, pageSize: number): ItemRow[] {
  const { where, args } = buildListWhere(view, search, sourceType, sourceName)
  const orderBy = 'COALESCE(i.published_at, i.fetched_at) DESC'
  const limitArgs: SQLInputValue[] = [...args, pageSize, page * pageSize]
  console.log('[listItemsPage]', { view, search, sourceType, sourceName, page, pageSize, where, args })
  const rows = search && hasFts()
    ? db.prepare(`SELECT ${LIST_COLS} FROM items i ${where} ORDER BY (SELECT rank FROM items_fts WHERE rowid = i.id) LIMIT ? OFFSET ?`).all(...limitArgs) as unknown as ItemRow[]
    : db.prepare(`SELECT ${LIST_COLS} FROM items i ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(...limitArgs) as unknown as ItemRow[]
  console.log('[listItemsPage] returned', rows.length)
  return rows
}

export function listItems(view: View, search: string, sourceType?: string | null, sourceName?: string | null): ItemRow[] {
  return listItemsPage(view, search, sourceType ?? null, sourceName ?? null, 0, 500)
}

/** 各来源条目计数，供侧边栏 GitHub ★ / Twitter 书签 等分区显示数量 */
export function sourceCounts(): Record<string, number> {
  const rows = db.prepare('SELECT source_type, COUNT(*) AS n FROM items GROUP BY source_type').all() as unknown as Array<{ source_type: string; n: number }>
  const c: Record<string, number> = {}
  for (const r of rows) c[r.source_type] = r.n
  return c
}

/** 详情接口：按需取单条完整数据（含正文），避免列表把正文全量传来（性能优化 #1） */
export function getItem(id: number): Item | undefined {
  return db.prepare('SELECT * FROM items WHERE id = ?').get(id) as Item | undefined
}

export function counts(): Record<View, number> {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN status = 'inbox' AND is_read = 0 AND source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS rss,
      COALESCE(SUM(CASE WHEN is_read = 1 AND source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS read,
      COALESCE(SUM(CASE WHEN status = 'later' AND source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS later,
      COALESCE(SUM(CASE WHEN status = 'favorite' AND source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS favorite,
      COALESCE(SUM(CASE WHEN status = 'archived' AND source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS archived,
      COALESCE(SUM(CASE WHEN source_type NOT IN ('github','x_bookmark') THEN 1 ELSE 0 END), 0) AS "all"
    FROM items
  `).get() as unknown as Record<View, number>
  return row
}

export function updateStatus(id: number, status: ItemStatus) {
  db.prepare('UPDATE items SET status = ?, is_read = 1 WHERE id = ?').run(status, id)
}

export function markRead(id: number) {
  db.prepare('UPDATE items SET is_read = 1 WHERE id = ?').run(id)
}
/** 显式设置已读/未读（卡片列表的「已读」图标可切换） */
export function setRead(id: number, isRead: boolean) {
  db.prepare('UPDATE items SET is_read = ? WHERE id = ?').run(isRead ? 1 : 0, id)
}
/** 删除单条条目（item_tags 通过 ON DELETE CASCADE 自动清理；白板引用卡片保留自身副本） */
export function deleteItem(id: number): { removed: boolean } {
  const r = db.prepare('DELETE FROM items WHERE id = ?').run(id)
  return { removed: r.changes > 0 }
}

export function addItem(input: Partial<Item>): { id: number } {
  const r = db.prepare(`INSERT OR IGNORE INTO items (source_type, source_name, url, title, author, summary, content_text, cover_url, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'inbox', datetime('now'))`)
    .run(input.source_type ?? 'manual', input.source_name ?? '手动收集', input.url ?? '',
      input.title ?? '', input.author ?? '', input.summary ?? '', input.content_text ?? '', input.cover_url ?? '')
  return { id: Number(r.lastInsertRowid) }
}

export function listTags(): Array<{ id: number; name: string; color: string }> {
  return db.prepare('SELECT * FROM tags ORDER BY name').all() as unknown as Array<{ id: number; name: string; color: string }>
}

export function getSetting(key: string): string | undefined {
  const r = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
  return r?.value
}

export function setSetting(key: string, value: string) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value)
}

// ===================== Feeds（订阅源） =====================
export function listFeeds(): Feed[] {
  return db.prepare('SELECT * FROM feeds ORDER BY created_at DESC').all() as unknown as Feed[]
}
export function addFeed(f: { type: string; name: string; url: string; schedule_min?: number; config_json?: string }): Feed {
  // 幂等：相同 url 已存在时返回已有源，避免 UNIQUE(url) 约束抛错（手动添加与 Discover 批量行为一致）
  if (feedExists(f.url)) {
    const existing = listFeeds().find((x) => x.url === f.url)
    if (existing) return existing
  }
  const r = db.prepare('INSERT OR IGNORE INTO feeds (type, name, url, schedule_min, config_json) VALUES (?, ?, ?, ?, ?)')
    .run(f.type, f.name, f.url, f.schedule_min ?? 120, f.config_json ?? '')
  return { id: Number(r.lastInsertRowid), type: f.type, name: f.name, url: f.url, config_json: f.config_json ?? '', schedule_min: f.schedule_min ?? 120, last_fetched_at: '', error_count: 0, last_error: '', enabled: 1, etag: '', last_modified: '' }
}
export function deleteFeed(id: number) { db.prepare('DELETE FROM feeds WHERE id = ?').run(id) }
export function feedExists(url: string): boolean {
  return !!db.prepare('SELECT 1 FROM feeds WHERE url = ?').get(url)
}
export function dueFeeds(): Feed[] {
  return db.prepare(`SELECT * FROM feeds WHERE enabled = 1 AND (
      last_fetched_at = '' OR
      (julianday('now') - julianday(last_fetched_at)) * 1440 >= schedule_min
    ) ORDER BY last_fetched_at ASC`).all() as unknown as Feed[]
}
export function markFeedFetched(id: number, error: boolean, errMsg?: string, etag?: string, lastModified?: string) {
  if (error) db.prepare(`UPDATE feeds SET last_fetched_at = datetime('now'), error_count = error_count + 1, last_error = ? WHERE id = ?`).run(errMsg ? String(errMsg).slice(0, 300) : '', id)
  // 成功：复位错误并回存缓存头（304 时 etag/last_modified 为空 → 保留原值，故仅在前述非空时覆盖）
  else db.prepare(`UPDATE feeds SET last_fetched_at = datetime('now'), error_count = 0, last_error = '', etag = ?, last_modified = ? WHERE id = ?`).run(etag ?? '', lastModified ?? '', id)
}

// ===================== upsertItem（采集器去重写入） =====================
export function upsertItem(input: Partial<Item>): { id: number; changed: boolean } {
  const url = input.url ?? ''
  const st = input.source_type ?? 'manual'
  const existing = db.prepare('SELECT id, title, summary, content_text, content_html, cover_url FROM items WHERE url = ? AND source_type = ?').get(url, st) as
    { id: number; title: string; summary: string; content_text: string; content_html: string; cover_url: string } | undefined
  if (existing) {
    // 内容完全相同则跳过（避免每次抓取都触发表上的 FTS5 触发器重建索引，写放大修复 #10）
    const same =
      existing.title === (input.title ?? '') &&
      existing.summary === (input.summary ?? '') &&
      existing.content_text === (input.content_text ?? '') &&
      existing.content_html === (input.content_html ?? '') &&
      existing.cover_url === (input.cover_url ?? '')
    if (same) return { id: existing.id, changed: false }
  }
  const r = db.prepare(`INSERT INTO items (source_type, source_name, url, title, author, summary, content_text, content_html, cover_url, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'inbox', ?)
    ON CONFLICT(url, source_type) DO UPDATE SET
      title = excluded.title, summary = excluded.summary,
      content_text = excluded.content_text, content_html = excluded.content_html,
      cover_url = excluded.cover_url, published_at = excluded.published_at`)
    .run(st, input.source_name ?? '', url,
      input.title ?? '', input.author ?? '', input.summary ?? '', input.content_text ?? '',
      input.content_html ?? '', input.cover_url ?? '', input.published_at ?? new Date().toISOString())
  const id = Number(r.lastInsertRowid) || existing?.id || 0
  // 手动同步 items_fts：先删该 rowid 再重插（覆盖 ON CONFLICT UPDATE 路径触发器可能失效的情况，确保 FTS 索引与 items 一致）
  if (id) {
    try {
      db.prepare(`INSERT INTO items_fts(items_fts, rowid) VALUES('delete', ?)`).run(id)
      db.prepare(`INSERT INTO items_fts(rowid, title, summary, content_text) VALUES (?,?,?,?)`).run(id, input.title ?? '', input.summary ?? '', input.content_text ?? '')
    } catch { /* FTS5 不可用时忽略 */ }
  }
  return { id, changed: r.changes > 0 }
}

/**
 * 仅当条目当前无封面时补一个（不覆盖已有 og:image）。
 * 用于 RSS 自带缩略图给预算外条目兜底，避免把已抓取到的更好封面降级成媒体缩略图。
 */
export function fillCoverIfEmpty(id: number, url: string): boolean {
  if (!url) return false
  const cur = db.prepare('SELECT cover_url, cover_path FROM items WHERE id = ?').get(id) as
    { cover_url: string; cover_path: string } | undefined
  if (!cur) return false
  if (cur.cover_url || cur.cover_path) return false
  db.prepare('UPDATE items SET cover_url = ? WHERE id = ?').run(url, id)
  return true
}

/** 下载封面到本地 images/，离线可用（配合画廊/白板，修复 #8 封面本地化） */
export async function storeCover(id: number, url: string): Promise<void> {
  if (!url || !imagesDir) return
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ReadFlow' }, signal: AbortSignal.timeout(15_000) })
    if (!res.ok) return
    const buf = Buffer.from(await res.arrayBuffer())
    let ext = path.extname(new URL(url).pathname)
    if (ext.length > 5 || ext.length < 2) ext = '.jpg'
    const file = path.join(imagesDir, `${id}${ext}`)
    fs.writeFileSync(file, buf)
    db.prepare('UPDATE items SET cover_path = ? WHERE id = ?').run(`${id}${ext}`, id)
  } catch { /* 封面下载失败不阻塞主流程 */ }
}

/** 数据保留策略：清理过量/过旧条目，但永久保留“已收藏 / 白板引用”的条目（修复 #11） */
export function enforceRetention(maxTotal = 8000, keepArchived = 3000): { removed: number } {
  const boarded = db.prepare('SELECT COALESCE(item_id, -1) AS id FROM board_cards').all() as Array<{ id: number }>
  const safe = new Set(boarded.map((b) => b.id))
  const whereSafe = (extra: string) =>
    `${extra} AND id NOT IN (SELECT COALESCE(item_id,-1) FROM board_cards) AND status != 'favorite'`
  // 1) 归档超量：保留最新 keepArchived 条，删除更旧的归档
  db.prepare(`DELETE FROM items WHERE ${whereSafe("status = 'archived'")} AND id IN (
    SELECT id FROM items WHERE ${whereSafe("status = 'archived'")} ORDER BY fetched_at DESC LIMIT -1 OFFSET ?)`).run(keepArchived)
  // 2) 总量封顶：保留最新 maxTotal 条，删除更旧的
  db.prepare(`DELETE FROM items WHERE ${whereSafe('1=1')} AND id IN (
    SELECT id FROM items WHERE ${whereSafe('1=1')} ORDER BY fetched_at DESC LIMIT -1 OFFSET ?)`).run(maxTotal)
  // 3) 维护 FTS 索引与体积
  try { db.exec('INSERT INTO items_fts(items_fts) VALUES("optimize")') } catch { /* */ }
  const removed = 0
  void safe
  return { removed }
}

/**
 * 用户触发的保留策略清理（设置 → 操作 → 立即清理）。
 * 仅清理「已归档」且抓取早于 keepArchivedDays 天的条目，以及单库超出 maxItems 时
 * 最旧的归档；白板引用与收藏永不被清理。返回实际删除条数。
 */
export function purgeOldItems(keepArchivedDays: number, maxItems: number): { purged: number } {
  const safe = "id NOT IN (SELECT COALESCE(item_id,-1) FROM board_cards) AND status != 'favorite'"
  const before = (db.prepare('SELECT COUNT(*) AS c FROM items').get() as { c: number }).c
  const days = Math.max(0, Math.floor(keepArchivedDays))
  if (days > 0) {
    db.prepare(`DELETE FROM items WHERE status = 'archived' AND ${safe} AND datetime(fetched_at) < datetime('now', '-' || ? || ' days')`).run(days)
  }
  const cap = Math.max(100, Math.floor(maxItems))
  db.prepare(`DELETE FROM items WHERE ${safe} AND id IN (
    SELECT id FROM items WHERE ${safe} ORDER BY datetime(fetched_at) DESC LIMIT -1 OFFSET ?)`).run(cap)
  try { db.exec('INSERT INTO items_fts(items_fts) VALUES("optimize")') } catch { /* */ }
  const after = (db.prepare('SELECT COUNT(*) AS c FROM items').get() as { c: number }).c
  return { purged: Math.max(0, before - after) }
}

/** 批量添加订阅源（来源管理批量导入，减少 IPC 往返） */
export function addFeeds(list: Array<{ type: string; name: string; url: string; schedule_min?: number }>): number {
  const stmt = db.prepare('INSERT OR IGNORE INTO feeds (type, name, url, schedule_min) VALUES (?, ?, ?, ?)')
  let added = 0
  for (const f of list) { const r = stmt.run(f.type, f.name, f.url, f.schedule_min ?? 120); if (r.changes) added++ }
  return added
}

/** 批量操作（修复 #19）：按视图标记全部已读 / 清空收集箱 */
export function markAllRead(view: View) {
  if (view === 'rss') db.prepare("UPDATE items SET is_read = 1 WHERE status = 'inbox' AND is_read = 0 AND source_type NOT IN ('github','x_bookmark')").run()
  else if (view === 'read') return
  else if (view === 'all') db.prepare("UPDATE items SET is_read = 1 WHERE status != 'favorite' AND source_type NOT IN ('github','x_bookmark')").run()
  else db.prepare('UPDATE items SET is_read = 1 WHERE status = ?').run(view)
}
export function clearInbox() {
  db.prepare("DELETE FROM items WHERE status = 'inbox' AND id NOT IN (SELECT COALESCE(item_id,-1) FROM board_cards)").run()
}

// ===================== Boards（白板） =====================
export function listBoards(): Board[] {
  return db.prepare('SELECT id, name, updated_at FROM boards ORDER BY updated_at DESC').all() as unknown as Board[]
}
export function createBoard(name: string): Board {
  const r = db.prepare('INSERT INTO boards (name) VALUES (?)').run(name || '未命名白板')
  return { id: Number(r.lastInsertRowid), name: name || '未命名白板', updated_at: new Date().toISOString() }
}

// ===================== Board Cards（白板卡片，独立持久化） =====================
export interface StoredCard {
  id: number
  board_id: number
  kind: 'ref' | 'text' | 'link' | 'image' | 'file' | 'video'
  item_id: number | null
  x: number; y: number; w: number; h: number
  title: string; body: string; payload: string
  created_at: string
}
export interface NewCard {
  board_id: number
  kind: 'ref' | 'text' | 'link' | 'image' | 'file' | 'video'
  item_id: number | null
  x: number; y: number; w: number; h: number
  title: string; body: string; payload: string
  _sourcePath?: string
}

function getCard(id: number): StoredCard {
  return db.prepare('SELECT * FROM board_cards WHERE id = ?').get(id) as unknown as StoredCard
}

/** 把本地文件拷入 board-assets 目录，以 cardId 命名，避免重名；返回可被 board-asset:// 协议访问的元数据 */
function stageAsset(sourcePath: string, cardId: number): { file: string; name: string; size: number; mime: string } {
  const ext = path.extname(sourcePath) || ''
  const name = path.basename(sourcePath)
  const dest = path.join(assetsDir, `${cardId}${ext}`)
  fs.copyFileSync(sourcePath, dest)
  const size = fs.statSync(dest).size
  return { file: `${cardId}${ext}`, name, size, mime: '' }
}

function removeAsset(payload: string) {
  try { const p = JSON.parse(payload || '{}'); if (p.file) fs.unlinkSync(path.join(assetsDir, p.file)) } catch { /* 已不存在 */ }
}

function migrateSnapshotToCards(boardId: number) {
  const existing = db.prepare('SELECT COUNT(*) n FROM board_cards WHERE board_id = ?').get(boardId) as { n: number }
  if (existing.n > 0) return
  const b = db.prepare('SELECT snapshot_json FROM boards WHERE id = ?').get(boardId) as { snapshot_json: string }
  let nodes: Array<{ itemId?: number; x?: number; y?: number; w?: number; h?: number }> = []
  try { nodes = JSON.parse(b.snapshot_json || '{}').nodes || [] } catch { nodes = [] }
  if (!nodes.length) return
  const stmt = db.prepare(`INSERT INTO board_cards (board_id, kind, item_id, x, y, w, h) VALUES (?, 'ref', ?, ?, ?, ?, ?)`)
  for (const n of nodes) stmt.run(boardId, n.itemId ?? null, n.x ?? 0, n.y ?? 0, n.w ?? 240, n.h ?? 140)
}

export function listCards(boardId: number): StoredCard[] {
  migrateSnapshotToCards(boardId)
  return db.prepare('SELECT * FROM board_cards WHERE board_id = ? ORDER BY created_at ASC, id ASC').all(boardId) as unknown as StoredCard[]
}

export function addCard(c: NewCard): StoredCard {
  const r = db.prepare(`INSERT INTO board_cards (board_id, kind, item_id, x, y, w, h, title, body, payload)
    VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(c.board_id, c.kind, c.item_id ?? null, c.x, c.y, c.w, c.h, c.title, c.body, c.payload || '{}')
  const id = Number(r.lastInsertRowid)
  if (c._sourcePath && (c.kind === 'image' || c.kind === 'file' || c.kind === 'video')) {
    const meta = stageAsset(c._sourcePath, id)
    const p = JSON.parse(c.payload || '{}')
    p.file = meta.file; p.name = meta.name; p.size = meta.size; p.mime = meta.mime
    db.prepare('UPDATE board_cards SET payload = ? WHERE id = ?').run(JSON.stringify(p), id)
  }
  return getCard(id)
}

export function updateCard(
  id: number,
  patch: Partial<{ title: string; body: string; payload: string; w: number; h: number; kind: string; item_id: number | null }>,
  _sourcePath?: string
): StoredCard {
  const cur = getCard(id)
  let payload = patch.payload ?? cur.payload
  const isAsset = cur.kind === 'image' || cur.kind === 'file' || cur.kind === 'video'
  if (_sourcePath && isAsset) {
    removeAsset(cur.payload)
    const meta = stageAsset(_sourcePath, id)
    const p = JSON.parse(payload || '{}')
    p.file = meta.file; p.name = meta.name; p.size = meta.size; p.mime = meta.mime
    payload = JSON.stringify(p)
  }
  const sets: string[] = []
  const args: SQLInputValue[] = []
  if (patch.title !== undefined) { sets.push('title = ?'); args.push(patch.title) }
  if (patch.body !== undefined) { sets.push('body = ?'); args.push(patch.body) }
  if (patch.payload !== undefined || _sourcePath) { sets.push('payload = ?'); args.push(payload) }
  if (patch.w !== undefined) { sets.push('w = ?'); args.push(patch.w) }
  if (patch.h !== undefined) { sets.push('h = ?'); args.push(patch.h) }
  if (patch.kind !== undefined) { sets.push('kind = ?'); args.push(patch.kind) }
  if (patch.item_id !== undefined) { sets.push('item_id = ?'); args.push(patch.item_id) }
  if (sets.length) { args.push(id); db.prepare(`UPDATE board_cards SET ${sets.join(', ')} WHERE id = ?`).run(...args) }
  return getCard(id)
}

export function moveCard(id: number, x: number, y: number) {
  db.prepare('UPDATE board_cards SET x = ?, y = ? WHERE id = ?').run(x, y, id)
}

export function deleteCard(id: number) {
  const cur = getCard(id)
  if (cur) removeAsset(cur.payload)
  db.prepare('DELETE FROM board_cards WHERE id = ?').run(id)
}

export function renameBoard(id: number, name: string) {
  db.prepare(`UPDATE boards SET name = ?, updated_at = datetime('now') WHERE id = ?`).run(name, id)
}

export function deleteBoard(id: number) {
  const cards = db.prepare('SELECT payload FROM board_cards WHERE board_id = ?').all(id) as Array<{ payload: string }>
  for (const c of cards) removeAsset(c.payload)
  db.prepare('DELETE FROM board_links WHERE board_id = ?').run(id)
  db.prepare('DELETE FROM board_cards WHERE board_id = ?').run(id)
  db.prepare('DELETE FROM boards WHERE id = ?').run(id)
}

// ===================== Board Links（卡片间关系连线） =====================
export interface BoardLink { id: number; board_id: number; from_id: number; to_id: number; label: string }

export function listLinks(boardId: number): BoardLink[] {
  return db.prepare('SELECT * FROM board_links WHERE board_id = ?').all(boardId) as unknown as BoardLink[]
}
export function addLink(boardId: number, fromId: number, toId: number, label = ''): BoardLink | null {
  if (fromId === toId) return null
  const r = db.prepare('INSERT OR IGNORE INTO board_links (board_id, from_id, to_id, label) VALUES (?,?,?,?)')
    .run(boardId, fromId, toId, label)
  if (r.changes === 0) return null
  return { id: Number(r.lastInsertRowid), board_id: boardId, from_id: fromId, to_id: toId, label }
}
export function deleteLink(id: number) {
  db.prepare('DELETE FROM board_links WHERE id = ?').run(id)
}
export function updateLink(id: number, label: string) {
  db.prepare('UPDATE board_links SET label = ? WHERE id = ?').run(label, id)
}

// ===================== Documents（写作） =====================
export function listDocuments(): Document[] {
  return db.prepare('SELECT id, title, status, updated_at FROM documents ORDER BY updated_at DESC').all() as unknown as Document[]
}
export function createDocument(title: string): Document {
  const r = db.prepare('INSERT INTO documents (title) VALUES (?)').run(title || '未命名文档')
  return { id: Number(r.lastInsertRowid), title: title || '未命名文档', content_json: '', markdown_cache: '', status: 'draft', updated_at: new Date().toISOString() }
}
export function getDocument(id: number): Document {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as unknown as Document
}
export function saveDocument(id: number, content_json: string, markdown_cache: string, title: string) {
  db.prepare(`UPDATE documents SET content_json = ?, markdown_cache = ?, title = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(content_json, markdown_cache, title, id)
}
export function deleteDocument(id: number) { db.prepare('DELETE FROM documents WHERE id = ?').run(id) }

// ===================== 数据库内省（开发者模式 / 数据查看） =====================
// 仅列出用户表（排除 sqlite_ 内部表），列结构来自 PRAGMA table_info。
// dbRows 的表名强制走白名单校验，杜绝 SQL 注入。
export interface TableColumn { name: string; type: string; pk: boolean }
export interface TableInfo { name: string; columns: TableColumn[]; rowCount: number }

export function dbTables(): TableInfo[] {
  const names = (db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`).all() as Array<{ name: string }>).map((r) => r.name)
  return names.map((name) => {
    const cols = db.prepare(`PRAGMA table_info(${quoteIdent(name)})`).all() as Array<{ name: string; type: string; pk: number }>
    const n = (db.prepare(`SELECT COUNT(*) c FROM ${quoteIdent(name)}`).get() as { c: number }).c
    return {
      name,
      columns: cols.map((c) => ({ name: c.name, type: c.type || '', pk: c.pk === 1 })),
      rowCount: n
    }
  })
}

export function dbRows(table: string, limit = 100, offset = 0): { columns: string[]; rows: Array<Record<string, unknown>> } {
  const allowed = new Set(dbTables().map((t) => t.name))
  if (!allowed.has(table)) throw new Error('未知或受保护的表：' + table)
  const l = Math.max(1, Math.min(1000, Math.floor(limit)))
  const o = Math.max(0, Math.floor(offset))
  const cols = db.prepare(`PRAGMA table_info(${quoteIdent(table)})`).all() as Array<{ name: string }>
  const rows = db.prepare(`SELECT * FROM ${quoteIdent(table)} LIMIT ? OFFSET ?`).all(l, o) as Array<Record<string, unknown>>
  return { columns: cols.map((c) => c.name), rows }
}

/** 安全引用标识符：双重校验，仅放行 [A-Za-z0-9_]，其余一律拒绝（PRAGMA/表名不接收外部参数绑定） */
function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error('非法标识符：' + name)
  return '"' + name.replace(/"/g, '') + '"'
}
