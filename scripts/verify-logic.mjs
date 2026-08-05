// Standalone verification of critical DB logic from src/main/db.ts
// Replicates exact SQL to validate: FTS-incremental upsert, retention, projection.
import { DatabaseSync } from 'node:sqlite'
import { test, assertEq, assert } from './mini-test.mjs'

const db = new DatabaseSync(':memory:')
db.exec(`
  CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_type TEXT NOT NULL DEFAULT 'manual',
    source_name TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    author TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    content_text TEXT NOT NULL DEFAULT '',
    content_html TEXT NOT NULL DEFAULT '',
    cover_url TEXT NOT NULL DEFAULT '',
    cover_path TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'inbox',
    is_read INTEGER NOT NULL DEFAULT 0,
    published_at TEXT NOT NULL DEFAULT '',
    fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(url, source_type)
  );
  CREATE TABLE board_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    kind TEXT NOT NULL DEFAULT 'ref',
    item_id INTEGER,
    x REAL NOT NULL DEFAULT 0, y REAL NOT NULL DEFAULT 0,
    w REAL NOT NULL DEFAULT 240, h REAL NOT NULL DEFAULT 140,
    title TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '',
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE discover_cache (
    full_name TEXT PRIMARY KEY, feeds_json TEXT NOT NULL,
    cached_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)
db.exec(`
  CREATE VIRTUAL TABLE items_fts USING fts5(
    title, summary, content_text, content='items', content_rowid='id', tokenize='unicode61'
  );
  CREATE TRIGGER items_ai AFTER INSERT ON items BEGIN
    INSERT INTO items_fts(rowid,title,summary,content_text) VALUES(new.id,new.title,new.summary,new.content_text); END;
  CREATE TRIGGER items_ad AFTER DELETE ON items BEGIN
    INSERT INTO items_fts(items_fts,rowid,title,summary,content_text) VALUES('delete',old.id,old.title,old.summary,old.content_text); END;
  CREATE TRIGGER items_au AFTER UPDATE ON items BEGIN
    INSERT INTO items_fts(items_fts,rowid,title,summary,content_text) VALUES('delete',old.id,old.title,old.summary,old.content_text);
    INSERT INTO items_fts(rowid,title,summary,content_text) VALUES(new.id,new.title,new.summary,new.content_text); END;
`)

const LIST_COLS = 'i.id,i.source_type,i.source_name,i.url,i.title,i.author,i.summary,i.cover_url,i.cover_path,i.status,i.is_read,i.published_at,i.fetched_at'

// ---- replicated functions ----
function upsertItem(input) {
  const url = input.url ?? ''
  const st = input.source_type ?? 'manual'
  const existing = db.prepare('SELECT id, title, summary, content_text, content_html, cover_url FROM items WHERE url = ? AND source_type = ?').get(url, st)
  if (existing) {
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
  return { id, changed: r.changes > 0 }
}
function listItems(view, search, tagId) {
  const args = []
  const conds = []
  if (search) { conds.push('(i.title LIKE ? OR i.summary LIKE ? OR i.content_text LIKE ?)'); const q = `%${search}%`; args.push(q, q, q) }
  if (view !== 'all') { conds.push('i.status = ?'); args.push(view) }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
  return db.prepare(`SELECT ${LIST_COLS} FROM items i ${where} ORDER BY i.fetched_at DESC`).all(...args)
}
function enforceRetention(maxTotal = 8, keepArchived = 3) {
  const whereSafe = (extra) => `${extra} AND id NOT IN (SELECT COALESCE(item_id,-1) FROM board_cards) AND status != 'favorite'`
  db.prepare(`DELETE FROM items WHERE ${whereSafe("status = 'archived'")} AND id IN (
    SELECT id FROM items WHERE ${whereSafe("status = 'archived'")} ORDER BY fetched_at DESC LIMIT -1 OFFSET ?)`).run(keepArchived)
  db.prepare(`DELETE FROM items WHERE ${whereSafe('1=1')} AND id IN (
    SELECT id FROM items WHERE ${whereSafe('1=1')} ORDER BY fetched_at DESC LIMIT -1 OFFSET ?)`).run(maxTotal)
  try { db.exec('INSERT INTO items_fts(items_fts) VALUES("optimize")') } catch {}
  return { removed: 0 }
}

// ===================== TESTS =====================
test('upsertItem first insert -> changed true, fts row created', () => {
  const a = upsertItem({ url: 'https://x.com/1', source_type: 'rss', title: 'T1', content_text: 'hello world', content_html: '<p>hi</p>' })
  assert(a.changed === true, 'first insert should report changed')
  const ftsCount = db.prepare('SELECT COUNT(*) n FROM items_fts WHERE rowid = ?').get(a.id).n
  assert(ftsCount === 1, 'fts should have 1 row for new item')
})

test('upsertItem identical re-insert -> changed false (FTS NOT rebuilt)', () => {
  const a = upsertItem({ url: 'https://x.com/1', source_type: 'rss', title: 'T1', content_text: 'hello world', content_html: '<p>hi</p>' })
  assert(a.changed === false, 'identical re-insert must be skipped')
  // fts row count must remain exactly 1 (no UPDATE fired => no trigger churn)
  const ftsCount = db.prepare('SELECT COUNT(*) n FROM items_fts WHERE rowid = ?').get(a.id).n
  assert(ftsCount === 1, 'fts row must NOT be duplicated after identical re-insert')
})

test('upsertItem changed content -> changed true, fts updated', () => {
  const a = upsertItem({ url: 'https://x.com/1', source_type: 'rss', title: 'T1-new', content_text: 'updated body', content_html: '<p>new</p>' })
  assert(a.changed === true, 'changed content should report changed')
  const row = db.prepare('SELECT title, content_text FROM items WHERE id = ?').get(a.id)
  assertEq(row.title, 'T1-new')
  assertEq(row.content_text, 'updated body')
})

test('listItems projection omits heavy columns', () => {
  const rows = listItems('all', '')
  assert(rows.length >= 1, 'should return rows')
  for (const r of rows) {
    assert(!('content_text' in r), 'content_text must NOT be in projection')
    assert(!('content_html' in r), 'content_html must NOT be in projection')
  }
})

test('retention keeps favorites & boarded, purges oldest', () => {
  // clear and seed deterministically
  db.exec('DELETE FROM items; DELETE FROM items_fts; DELETE FROM board_cards;')
  const ids = []
  for (let i = 0; i < 20; i++) {
    const r = db.prepare("INSERT INTO items (source_type, url, title, status, fetched_at) VALUES ('rss', ?, ?, 'inbox', ?)")
      .run(`https://x.com/${i}`, `T${i}`, `2024-01-${String(i + 1).padStart(2, '0')} 00:00:00`)
    ids.push(Number(r.lastInsertRowid))
  }
  db.exec("INSERT INTO items_fts(rowid,title,summary,content_text) SELECT id,title,'',content_text FROM items")
  // protect the oldest two: one favorite, one boarded
  const favId = ids[0], boardId = ids[1]
  db.prepare("UPDATE items SET status = 'favorite' WHERE id = ?").run(favId)
  db.prepare('INSERT INTO board_cards (board_id, item_id) VALUES (1, ?)').run(boardId)
  enforceRetention(8, 3) // keep newest 8 (excluding protected)
  const remaining = db.prepare('SELECT id FROM items ORDER BY id').all().map(r => r.id)
  const total = db.prepare('SELECT COUNT(*) n FROM items').get().n
  assertEq(total, 10) // 8 newest deletable + 1 favorite + 1 boarded
  // protected items must survive; oldest deletable purged; newest deletable kept
  assert(db.prepare('SELECT 1 FROM items WHERE id = ?').get(favId), 'favorite must be kept')
  assert(db.prepare('SELECT 1 FROM items WHERE id = ?').get(boardId), 'boarded must be kept')
  assert(!db.prepare('SELECT 1 FROM items WHERE id = ?').get(ids[2]), 'oldest non-protected must be purged')
  assert(db.prepare('SELECT 1 FROM items WHERE id = ?').get(ids[19]), 'newest deletable must be kept')
})

test('discover cache roundtrip', () => {
  db.prepare('INSERT INTO discover_cache (full_name, feeds_json) VALUES (?, ?)').run('a/b', '[{"url":"x"}]')
  const r = db.prepare('SELECT feeds_json FROM discover_cache WHERE full_name = ?').get('a/b')
  assertEq(r.feeds_json, '[{"url":"x"}]')
})

console.log('ALL VERIFICATION TESTS PASSED')
