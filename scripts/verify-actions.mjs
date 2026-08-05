// Verification for the new per-card actions: setRead toggle, deleteItem cascade, openExternal guard.
import { DatabaseSync } from 'node:sqlite'
import { test, assertEq, assert } from './mini-test.mjs'

const db = new DatabaseSync(':memory:')
db.exec(`
  CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_type TEXT NOT NULL DEFAULT 'manual', url TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
    content_text TEXT NOT NULL DEFAULT '', content_html TEXT NOT NULL DEFAULT '',
    cover_url TEXT NOT NULL DEFAULT '', cover_path TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'inbox', is_read INTEGER NOT NULL DEFAULT 0,
    published_at TEXT NOT NULL DEFAULT '', fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(url, source_type)
  );
  CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, color TEXT NOT NULL DEFAULT '');
  CREATE TABLE item_tags (
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, tag_id)
  );
`)
db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS items_fts USING fts5(title, summary, content_text, content='items', content_rowid='id', tokenize='unicode61');
  CREATE TRIGGER items_ai AFTER INSERT ON items BEGIN INSERT INTO items_fts(rowid,title,summary,content_text) VALUES(new.id,new.title,new.summary,new.content_text); END;
  CREATE TRIGGER items_ad AFTER DELETE ON items BEGIN INSERT INTO items_fts(items_fts,rowid,title,summary,content_text) VALUES('delete',old.id,old.title,old.summary,old.content_text); END;`)

function setRead(id, isRead) { db.prepare('UPDATE items SET is_read = ? WHERE id = ?').run(isRead ? 1 : 0, id) }
function deleteItem(id) { const r = db.prepare('DELETE FROM items WHERE id = ?').run(id); return { removed: r.changes > 0 } }

function openExternalGuard(url) {
  try { const u = new URL(url); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false }
}

test('setRead toggles is_read', () => {
  const id = Number(db.prepare("INSERT INTO items (url,title) VALUES ('u1','T1')").run().lastInsertRowid)
  assertEq(db.prepare('SELECT is_read n FROM items WHERE id=?').get(id).n, 0)
  setRead(id, true); assertEq(db.prepare('SELECT is_read n FROM items WHERE id=?').get(id).n, 1)
  setRead(id, false); assertEq(db.prepare('SELECT is_read n FROM items WHERE id=?').get(id).n, 0)
})

test('deleteItem removes item and cascades item_tags, keeps tag', () => {
  const id = Number(db.prepare("INSERT INTO items (url,title) VALUES ('u2','T2')").run().lastInsertRowid)
  const tagId = Number(db.prepare("INSERT INTO tags (name) VALUES ('news')").run().lastInsertRowid)
  db.prepare('INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?)').run(id, tagId)
  assertEq(db.prepare('SELECT COUNT(*) n FROM item_tags WHERE item_id=?').get(id).n, 1)
  const res = deleteItem(id)
  assert(res.removed === true, 'deleteItem should report removed')
  assert(!db.prepare('SELECT 1 FROM items WHERE id=?').get(id), 'item must be gone')
  assert(!db.prepare('SELECT 1 FROM item_tags WHERE item_id=?').get(id), 'item_tags must cascade-delete')
  assert(db.prepare('SELECT 1 FROM tags WHERE id=?').get(tagId), 'tag itself must survive')
  // fts trigger cleanup must not throw
  assertEq(db.prepare('SELECT COUNT(*) n FROM items_fts WHERE rowid=?').get(id).n, 0)
})

test('openExternal allows only http/https', () => {
  assert(openExternalGuard('https://example.com/a') === true, 'https allowed')
  assert(openExternalGuard('http://example.com') === true, 'http allowed')
  assert(openExternalGuard('javascript:alert(1)') === false, 'javascript blocked')
  assert(openExternalGuard('file:///etc/passwd') === false, 'file blocked')
  assert(openExternalGuard('ftp://x') === false, 'ftp blocked')
  assert(openExternalGuard('not a url') === false, 'garbage blocked')
})

console.log('ALL ACTION VERIFICATION TESTS PASSED')
