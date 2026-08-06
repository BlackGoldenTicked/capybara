import { app, BrowserWindow, ipcMain, protocol, shell, dialog } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import {
  initDb, listItems, listItemsPage, getItem, counts, updateStatus, markRead, setRead, deleteItem, addItem,
  View, ItemStatus,
  listFeeds, addFeed, addFeeds, deleteFeed, upsertItem,
  listBoards, createBoard, deleteBoard,
  listCards, addCard, updateCard, moveCard, deleteCard, renameBoard, getAssetsDir, getImagesDir,
  listLinks, addLink, deleteLink, updateLink,
  getSetting, setSetting, sourceCounts, getDbFile,
  storeCover, enforceRetention, getDiscoverCache, setDiscoverCache, markAllRead, clearInbox, purgeOldItems, checkpoint,
  dbTables, dbRows
} from './db'
import { startIngestServer } from './ingest'
import { startScheduler, refreshFeed, runDue, refreshAllFeeds } from './sources/scheduler'
import { extractArticle } from './sources/readability'
import { backupWebDAV } from './sync'
import { searchRssRepos, extractFeeds } from './sources/githubDiscover'
import { netLog, setNetLogWindow } from './netlog'
import { diagSnapshot, diagTestPurge, diagRefreshFeed, diagRefreshAll, forceRefreshFeed, forceRefreshAll } from './diag'

if (!app.isPackaged) {
  try {
    const devUserData = path.join(process.cwd(), '.readflow-userData')
    fs.mkdirSync(devUserData, { recursive: true })
    app.setPath('userData', devUserData)
    app.commandLine.appendSwitch('no-sandbox')
    app.commandLine.appendSwitch('disable-gpu-sandbox')
  } catch {}
}

/** 轻量 OPML 解析：提取所有带 xmlUrl 的 outline（兼容嵌套分组），返回 {title,url} 列表 */
function parseOpml(xml: string): Array<{ title: string; url: string }> {
  const decode = (s: string) => s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')  // &amp; 必须最后，避免二次解码
    .trim()
  const out: Array<{ title: string; url: string }> = []
  const re = /<outline\b([^>]*?)\/?>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(xml))) {
    const attrs = m[1]
    const xmlUrl = /xmlurl\s*=\s*"([^"]*)"/i.exec(attrs)?.[1]
      || /xmlurl\s*=\s*'([^']*)'/i.exec(attrs)?.[1]
    if (!xmlUrl) continue
    const title = /title\s*=\s*"([^"]*)"/i.exec(attrs)?.[1]
      || /text\s*=\s*"([^"]*)"/i.exec(attrs)?.[1]
      || xmlUrl
    out.push({ title: decode(title), url: decode(xmlUrl) })
  }
  return out
}

/** Twitter / X 书签导入产出的规整记录 */
interface TweetRec {
  url: string
  title: string
  text: string
  content_html: string
  cover_url: string
  author: string
  created_at: string
}

/**
 * 解析 Twitter / X 书签导出文件：
 * - 纯 JSON 数组 / 含 bookmarks / tweets / data 字段的对象
 * - CSV（列名兼容 full_text / fulltext / text / content、screen_name / username、created_at 等）
 * 修复：此前 CSV 只匹配 fulltext（无下划线），导致 full_text 列（带下划线）正文全空；
 * 现统一规整表头（去非字母数字）、按记录解析（支持字段内换行/逗号），并抽取封面与解码 HTML 实体。
 */
function parseTwitterExport(raw: string): TweetRec[] {
  let data: unknown
  try { data = JSON.parse(raw) }
  catch { return parseTwitterCsv(raw) }
  return parseTwitterJson(data)
}

function parseTwitterJson(data: unknown): TweetRec[] {
  let arr: Array<Record<string, unknown>> = []
  if (Array.isArray(data)) arr = data as Array<Record<string, unknown>>
  else if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.bookmarks)) arr = o.bookmarks as Array<Record<string, unknown>>
    else if (Array.isArray(o.tweets)) arr = o.tweets as Array<Record<string, unknown>>
    else if (Array.isArray(o.data)) arr = o.data as Array<Record<string, unknown>>
  }
  const out: TweetRec[] = []
  for (const t of arr) {
    const rec: Record<string, string> = {
      url: str(pick(t, 'url', 'expandedUrl', 'expanded_url', 'tweetUrl', 'tweet_url', 'permalink', 'link')),
      text: str(pick(t, 'fullText', 'full_text', 'text', 'content', 'body')),
      screen_name: str(pick(t, 'screen_name', 'screenName', 'username', 'handle', 'user')),
      name: str(pick(t, 'name', 'displayName', 'display_name')),
      created_at: str(pick(t, 'createdAt', 'created_at', 'date', 'time', 'timestamp')),
      cover_url: str(pick(t, 'cover_url', 'coverUrl', 'media_url_https', 'mediaUrl', 'image'))
    }
    const norm = normalizeTweet(rec)
    if (norm) out.push(norm)
  }
  return out
}

/** RFC4180 兼容的 CSV 记录解析：支持字段内换行 / 逗号 / 双引号转义 */
function parseCsvRecords(raw: string): string[][] {
  const rows: string[][] = []
  let field = '', row: string[] = [], inQ = false, i = 0
  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { pushField(); rows.push(row); row = [] }
  while (i < raw.length) {
    const ch = raw[i]
    if (inQ) {
      if (ch === '"') {
        if (raw[i + 1] === '"') { field += '"'; i += 2; continue }
        inQ = false; i++; continue
      }
      field += ch; i++; continue
    }
    if (ch === '"') { inQ = true; i++; continue }
    if (ch === ',') { pushField(); i++; continue }
    if (ch === '\r') { if (raw[i + 1] === '\n') i++; pushRow(); i++; continue }
    if (ch === '\n') { pushRow(); i++; continue }
    field += ch; i++
  }
  if (field.length > 0 || row.length > 0) pushRow()
  return rows
}

function parseTwitterCsv(raw: string): TweetRec[] {
  const rows = parseCsvRecords(raw)
  if (rows.length < 2) return []
  const normHdr = rows[0].map((h) => normHeader(h))
  const idxOf = (...names: string[]) => normHdr.findIndex((h) => names.includes(h))
  const iUrl = idxOf('url', 'expandedurl', 'tweeturl', 'permalink', 'link')
  const iText = idxOf('fulltext', 'text', 'content', 'body')
  const iHandle = idxOf('screenname', 'username', 'handle', 'author')
  const iName = idxOf('name', 'displayname')
  const iDate = idxOf('createdat', 'date', 'time', 'timestamp')
  const iMedia = idxOf('media')
  const iCover = idxOf('profileimageurl', 'profileimage', 'cover', 'coverurl')
  if (iUrl < 0) return []
  const out: TweetRec[] = []
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i]
    const get = (idx: number) => (idx >= 0 ? (c[idx] || '').trim() : '')
    const cover = get(iCover) || extractMedia(get(iMedia))
    const rec: Record<string, string> = {
      url: get(iUrl),
      text: get(iText),
      screen_name: get(iHandle),
      name: get(iName),
      created_at: get(iDate),
      cover_url: cover
    }
    const norm = normalizeTweet(rec)
    if (norm) out.push(norm)
  }
  return out
}

/** 把一行/一条原始记录规整为 TweetRec：解码 HTML 实体、抽取封面、生成正文 HTML、统一时间 */
function normalizeTweet(rec: Record<string, string>): TweetRec | null {
  const url = (rec.url || '').trim()
  if (!url) return null
  const text = decodeEntities(rec.text || '')
  const handle = (rec.screen_name || '').trim()
  const name = (rec.name || '').trim()
  const cover = (rec.cover_url || '').trim()
  const created = rec.created_at ? toIso(rec.created_at) : ''
  const firstLine = text.split('\n')[0].trim()
  const title = firstLine.slice(0, 120) || (handle ? `@${handle}` : url)
  const html = `<p>${text.replace(/\n/g, '<br/>')}</p>` + (cover ? `<figure><img src="${cover}" referrerpolicy="no-referrer" loading="lazy"/></figure>` : '')
  const author = handle ? `@${handle}` : name
  return { url, title, text, content_html: html, cover_url: cover, author, created_at: created }
}

function pick(o: Record<string, unknown>, ...names: string[]): unknown {
  for (const n of names) { if (o[n] != null) return o[n] }
  return undefined
}

/** 规整表头字段名：小写并去除非字母数字（让 full_text 匹配 fulltext） */
function normHeader(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** 从 media JSON 列抽取第一张图片地址：优先真实图(original) / 缩略图，最后才用 t.co 短链 */
function extractMedia(json: string): string {
  if (!json) return ''
  try {
    const v = JSON.parse(json)
    const list: Array<Record<string, unknown>> = Array.isArray(v) ? v : (v && Array.isArray(v.media) ? v.media : [])
    for (const m of list) {
      const u = str(m.media_url_https || m.media_url || m.original || m.thumbnail || m.url)
      if (u) return u
    }
  } catch { /* 非 JSON 忽略 */ }
  return ''
}

/** 把 Twitter 时间串 / 其它常见格式归一化为 ISO；失败回退空串（调用方用 now 兜底） */
function toIso(s: string): string {
  const d = new Date(s.replace(' +0000', ' +00:00'))
  return isNaN(d.getTime()) ? '' : d.toISOString()
}

/** 解码 HTML 实体（&amp; 必须最后替换，避免二次解码） */
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

function str(v: unknown): string { return typeof v === 'string' ? v : (v == null ? '' : String(v)) }

// 自定义协议：渲染进程通过 board-asset://<file> 安全访问白板本地附件（图片/视频/文件）
protocol.registerSchemesAsPrivileged([
  { scheme: 'board-asset', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
  { scheme: 'cover', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
])

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1080, minHeight: 680,
    title: '阅流 ReadFlow', titleBarStyle: 'hiddenInset', backgroundColor: '#1f1f1d',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: false
    }
  })
  if (process.env.ELECTRON_RENDERER_URL) mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  else mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.on('closed', () => { mainWindow = null })
  // 网络诊断日志转发目标：开发者模式关闭时窗口仍持有引用，仅面板不渲染
  setNetLogWindow(mainWindow)
  // 开发者模式：启动时自动打开 DevTools（排查网络 / 抓取 / 渲染问题）
  if (getSetting('developer_mode') === '1') mainWindow.webContents.openDevTools()
}

/** 采集完成后通知渲染进程刷新（不阻塞调度） */
function notifyRefresh() {
  mainWindow?.webContents.send('sources:updated')
}

function registerIpc() {
  const handlers: Record<string, (...args: never[]) => unknown> = {
    'app:version': () => app.getVersion(),
    // 暴露数据库文件绝对路径，便于用户在「设置 → 操作」里核对自己运行的 app 到底指向哪个库
    'app:dbFile': () => getDbFile(),
    'app:openDbDir': (() => { try { shell.openPath(path.dirname(getDbFile())); } catch { /* 忽略 */ } return true }) as never,
    // 启动引导：一次性返回外观 / 音效 / 快捷键 / 开发者模式 / 布局 / 版本，把渲染进程启动时的多次
    // settings:get 顺序往返合并为 1 次 IPC，缩短首屏耗时（app:bootstrap）
    'app:bootstrap': (() => {
      const g = (k: string) => getSetting(k)
      const num = (k: string, d: number) => { const v = Number(g(k)); return Number.isFinite(v) && v !== 0 ? v : d }
      const bool = (k: string) => g(k) === '1'
      const theme = g('theme'); const cardStyle = g('card_style')
      const weight = g('font_weight') || 'normal'
      const appearance = {
        theme: (['system', 'light', 'dark'].includes(theme ?? '') ? theme : 'system') as 'system' | 'light' | 'dark',
        cardStyle: (cardStyle && cardStyle !== 'none' ? cardStyle : 'none') as string,
        fontFamily: g('font_family') ?? '',
        fontScale: Math.min(2, Math.max(0.7, Number(g('font_scale')) || 1)),
        fontWeight: (['thin', 'normal', 'bold'].includes(weight) ? weight : 'normal') as string
      }
      return {
        appearance,
        soundEnabled: bool('sound_enabled'),
        soundVolume: Number(g('sound_volume')) || 0.7,
        shortcuts: g('shortcuts'),
        developerMode: bool('developer_mode'),
        layout: {
          sideW: num('side_w', 196),
          listW: num('list_w', 320),
          feedW: num('feed_w', 188),
          sideCollapsed: bool('side_collapsed')
        },
        version: app.getVersion()
      }
    }) as never,
    // 用系统默认浏览器打开链接（仅放行 http/https，避免伪协议风险）
    'shell:openExternal': ((url: string) => {
      try {
        const u = new URL(url)
        if (u.protocol === 'http:' || u.protocol === 'https:') void shell.openExternal(url)
      } catch { /* 非法 URL 忽略 */ }
    }) as never,
    'items:list': ((view: View, search: string, sourceType?: string, sourceName?: string) => listItems(view, search, sourceType ?? null, sourceName ?? null)) as never,
    'items:listPage': ((view: View, search: string, sourceType: string, sourceName: string, page: number, pageSize: number) => listItemsPage(view, search, sourceType || null, sourceName || null, page, pageSize)) as never,
    'items:sourceCounts': (() => sourceCounts()) as never,
    'items:get': ((id: number) => getItem(id)) as never,
    'items:counts': (() => counts()) as never,
    'items:updateStatus': ((id: number, status: ItemStatus) => { updateStatus(id, status); return counts() }) as never,
    'items:markRead': ((id: number) => markRead(id)) as never,
    'items:setRead': ((id: number, isRead: boolean) => setRead(id, isRead)) as never,
    'items:delete': ((id: number) => deleteItem(id)) as never,
    'items:markAllRead': ((view: View) => { markAllRead(view); return counts() }) as never,
    'items:clearInbox': (() => { clearInbox(); return counts() }) as never,

    'feeds:list': (() => listFeeds()) as never,
    'feeds:add': ((type: string, name: string, url: string, scheduleMin: number) => addFeed({ type, name, url, schedule_min: scheduleMin })) as never,
    'feeds:addMany': ((list: Array<{ type: string; name: string; url: string; schedule_min?: number }>) => addFeeds(list)) as never,
    'feeds:delete': ((id: number) => deleteFeed(id)) as never,
    'feeds:refresh': (async (id: number) => { const n = await refreshFeed(id); notifyRefresh(); return n }) as never,
    // 强制刷新全部已启用订阅源（忽略到期判断），用于「全部刷新」按钮；
    // 后台定时仍走 runDue（仅到期源），二者职责分离（修复 RSS 逻辑：全部刷新=真正全刷）
    'sources:refreshAll': (async () => { await refreshAllFeeds(); notifyRefresh(); return true }) as never,

    'items:quickAdd': (async (url: string) => {
      const item = addItem({ source_type: 'manual', source_name: '手动收集', url, title: url })
      // 异步补全正文，不阻塞
      void extractArticle(url).then((art) => {
        if (art) {
          upsertItem({ source_type: 'manual', source_name: '手动收集', url, title: art.title || url, summary: art.summary, content_text: art.text, content_html: art.html, cover_url: art.image })
          if (art.image) void storeCover(item.id, art.image)
        }
        notifyRefresh()
      }).catch(() => {})
      return item
    }) as never,

    'settings:get': ((key: string) => getSetting(key) ?? '') as never,
    'settings:set': ((key: string, value: string) => setSetting(key, value)) as never,
    // 开发者模式：立即开关 DevTools（store 同时持久化 developer_mode 设置）
    'devtools:toggle': (() => {
      if (!mainWindow) return
      if (mainWindow.webContents.isDevToolsOpened()) mainWindow.webContents.closeDevTools()
      else mainWindow.webContents.openDevTools({ mode: 'detach' })
    }) as never,
    'settings:purge': ((days: number, max: number) => purgeOldItems(days, max)) as never,

    // ===== 数据库内省（开发者模式 / 数据查看）：列出表结构与数据，表名白名单防注入 =====
    'db:tables': (() => dbTables()) as never,
    'db:rows': ((table: string, limit: number, offset: number) => dbRows(table, limit, offset)) as never,

    // ===== 刷新诊断：清空验证 / 单源/全量刷新 / 强制刷新 =====
    'diag:snapshot': (() => diagSnapshot()) as never,
    'diag:testPurge': ((days: number, max: number) => diagTestPurge(days, max)) as never,
    'diag:testRefreshOne': (async (id: number) => diagRefreshFeed(id)) as never,
    'diag:testRefreshAll': (async () => diagRefreshAll()) as never,
    'diag:testForceOne': (async (id: number) => forceRefreshFeed(id)) as never,
    'diag:testForceAll': (async () => forceRefreshAll()) as never,

    'boards:list': (() => listBoards()) as never,
    'boards:create': ((name: string) => createBoard(name)) as never,
    'boards:delete': ((id: number) => deleteBoard(id)) as never,
    'boards:cards': ((boardId: number) => listCards(boardId)) as never,
    'boards:addCard': ((c: never) => addCard(c as never)) as never,
    'boards:updateCard': ((id: number, patch: never, sourcePath?: string) => updateCard(id, patch as never, sourcePath)) as never,
    'boards:moveCard': ((id: number, x: number, y: number) => moveCard(id, x, y)) as never,
    'boards:deleteCard': ((id: number) => deleteCard(id)) as never,
    'boards:rename': ((id: number, name: string) => renameBoard(id, name)) as never,
    'boards:openFile': ((file: string) => { void shell.openPath(path.join(getAssetsDir(), file)) }) as never,
    'boards:links': ((boardId: number) => listLinks(boardId)) as never,
    'boards:addLink': ((boardId: number, fromId: number, toId: number) => addLink(boardId, fromId, toId)) as never,
    'boards:deleteLink': ((id: number) => deleteLink(id)) as never,
    'boards:updateLink': ((id: number, label: string) => updateLink(id, label)) as never,

    'discover:repos': ((query: string) => searchRssRepos(query)) as never,
    'discover:feeds': (async (fullName: string, branch: string) => {
      const cached = getDiscoverCache(fullName)
      if (cached) return JSON.parse(cached) as Array<{ url: string; title: string }>
      const feeds = await extractFeeds(fullName, branch)
      setDiscoverCache(fullName, JSON.stringify(feeds))
      return feeds
    }) as never,

    'feeds:importOpml': (async () => {
      const res = await dialog.showOpenDialog(mainWindow!, {
        title: '导入 OPML 订阅源',
        properties: ['openFile'],
        filters: [{ name: 'OPML / XML', extensions: ['opml', 'xml'] }]
      })
      if (res.canceled || !res.filePaths.length) return { added: 0, skipped: 0, total: 0 }
      const xml = fs.readFileSync(res.filePaths[0], 'utf-8')
      const feeds = parseOpml(xml)
      const existing = new Set((listFeeds()).map((f) => f.url))
      const toAdd = feeds.filter((f) => !existing.has(f.url)).map((f) => ({ type: 'rss', name: f.title || f.url, url: f.url, schedule_min: 60 }))
      const added = addFeeds(toAdd)
      const skipped = feeds.length - toAdd.length
      notifyRefresh()
      return { added, skipped, total: feeds.length }
    }) as never,

    // ===== GitHub ★：按用户名拉取 starred 仓库，写入阅读列表（source_type=github） =====
    'github:fetchStars': (async (username: string) => {
      const name = (username || '').trim()
      if (!name) throw new Error('请填写 GitHub 用户名')
      const token = getSetting('github_token') || ''
      const headers: Record<string, string> = { 'User-Agent': 'ReadFlow', 'Accept': 'application/vnd.github+json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      let page = 1, added = 0
      const seen = new Set<string>()
      while (page <= 10) {  // 至多拉取 1000 个 star，避免超大账户卡死
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(name)}/starred?per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(20000) })
        if (res.status === 403) throw new Error('GitHub API 速率超限（60 次/小时），可在系统配置填入 Token 提升额度')
        if (!res.ok) throw new Error('GitHub API 错误 ' + res.status)
        const repos = await res.json() as Array<{ html_url: string; full_name: string; owner?: { login: string; avatar_url?: string }; description?: string; pushed_at?: string; created_at?: string }>
        if (!repos.length) break
        for (const r of repos) {
          if (seen.has(r.html_url)) continue
          seen.add(r.html_url)
          const item = upsertItem({
            source_type: 'github', source_name: 'GitHub ★', url: r.html_url, title: r.full_name,
            author: r.owner?.login ?? '', summary: r.description || '', cover_url: r.owner?.avatar_url || '',
            published_at: r.pushed_at || r.created_at || new Date().toISOString()
          })
          if (item.changed) added++
        }
        page++
      }
      setSetting('github_stars_user', name)
      notifyRefresh()
      return { added, total: seen.size }
    }) as never,

    // ===== Twitter/X 书签：导入本地导出文件（X API 读取书签需付费凭证，走导入最现实） =====
    'twitter:importBookmarks': (async () => {
      const res = await dialog.showOpenDialog(mainWindow!, {
        title: '导入 Twitter / X 书签',
        properties: ['openFile'],
        filters: [{ name: 'JSON / CSV', extensions: ['json', 'csv', 'txt'] }]
      })
      if (res.canceled || !res.filePaths.length) return { added: 0, total: 0 }
      const raw = fs.readFileSync(res.filePaths[0], 'utf-8')
      const tweets = parseTwitterExport(raw)
      let added = 0
      for (const t of tweets) {
        const item = upsertItem({
          source_type: 'x_bookmark', source_name: 'Twitter 书签', url: t.url, title: t.title,
          author: t.author, summary: t.text, content_text: t.text, content_html: t.content_html,
          cover_url: t.cover_url, published_at: t.created_at || new Date().toISOString()
        })
        if (item.changed && t.cover_url) void storeCover(item.id, t.cover_url)
        if (item.changed) added++
      }
      notifyRefresh()
      return { added, total: tweets.length }
    }) as never,

    'sync:backup': (async () => backupWebDAV()) as never
  }
  for (const [channel, fn] of Object.entries(handlers)) {
    // ipcMain.handle 回调首参为 IpcMainInvokeEvent，需剥离后再交给业务函数
    ipcMain.handle(channel, (_e, ...args) => (fn as (...a: unknown[]) => unknown)(...args))
  }
}

app.whenReady().then(() => {
  // 1) 数据库先行（同步、极快），但即便失败也要让窗口打开，避免「整片空白」
  try { initDb() } catch (e) { console.error('[initDb] failed:', (e as Error).message) }
  registerIpc()
  // 注册 board-asset:// 协议，把白板附件目录映射出去供渲染进程加载
  protocol.registerFileProtocol('board-asset', (request, callback) => {
    try {
      const rel = decodeURIComponent(request.url.replace(/^board-asset:\/\//, '')).replace(/^\/+/, '').split('?')[0]
      callback({ path: path.join(getAssetsDir(), rel) })
    } catch {
      callback({ error: -2 })
    }
  })
  // 注册 cover:// 协议，把本地化的封面图目录映射出去（离线可用，修复 #8/#13）
  protocol.registerFileProtocol('cover', (request, callback) => {
    try {
      const rel = decodeURIComponent(request.url.replace(/^cover:\/\//, '')).replace(/^\/+/, '').split('?')[0]
      callback({ path: path.join(getImagesDir(), rel) })
    } catch {
      callback({ error: -2 })
    }
  })
  // 2) 窗口先行：保证 UI 永远能打开；次级服务（ingest / scheduler）即便抛错也不再拖垮窗口
  createWindow()
  try { startIngestServer() } catch (e) { console.error('[ingest] failed:', (e as Error).message) }
  try { startScheduler(notifyRefresh) } catch (e) { console.error('[scheduler] failed:', (e as Error).message) }
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

// 退出前截断 WAL，避免 .db-wal 无限增长、下次启动回放变慢（修复 RSS 逻辑：重启/更新后体验）
app.on('before-quit', () => { try { checkpoint() } catch { /* */ } })
