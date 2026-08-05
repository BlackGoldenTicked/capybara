import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dir = mkdtempSync(join(tmpdir(), 'rf-board-'))
const assets = join(dir, 'assets')
import { mkdirSync, writeFileSync, copyFileSync, statSync } from 'node:fs'; mkdirSync(assets, { recursive: true })
const db = new DatabaseSync(join(dir, 't.db'))

db.exec(`CREATE TABLE boards (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, updated_at TEXT);
CREATE TABLE board_cards (id INTEGER PRIMARY KEY AUTOINCREMENT, board_id INTEGER, kind TEXT, item_id INTEGER, x REAL, y REAL, w REAL, h REAL, title TEXT, body TEXT, payload TEXT);
CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, title TEXT);
CREATE TABLE board_links (id INTEGER PRIMARY KEY AUTOINCREMENT, board_id INTEGER, from_id INTEGER, to_id INTEGER, label TEXT);`)
const getAssetsDir = () => assets
function stageAsset(sourcePath, cardId) { const ext = sourcePath.slice(sourcePath.lastIndexOf('.')); const dest = join(assets, `${cardId}${ext}`); copyFileSync(sourcePath, dest); const size = statSync(dest).size; return { file: `${cardId}${ext}`, name: sourcePath.split('/').pop(), size, mime: '' } }
function addCard(c) {
  const r = db.prepare(`INSERT INTO board_cards (board_id,kind,item_id,x,y,w,h,title,body,payload) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(c.board_id, c.kind, c.item_id ?? null, c.x, c.y, c.w, c.h, c.title, c.body, c.payload || '{}')
  const id = Number(r.lastInsertRowid)
  if (c._sourcePath && ['image','file','video'].includes(c.kind)) { const m = stageAsset(c._sourcePath, id); const p = JSON.parse(c.payload||'{}'); p.file=m.file;p.name=m.name;p.size=m.size;p.mime=m.mime; db.prepare('UPDATE board_cards SET payload=? WHERE id=?').run(JSON.stringify(p), id) }
  return db.prepare('SELECT * FROM board_cards WHERE id=?').get(id)
}
const listCards = (b) => db.prepare('SELECT * FROM board_cards WHERE board_id=?').all(b)
const delCard = (id) => db.prepare('DELETE FROM board_cards WHERE id=?').run(id)

let pass = 0, fail = 0
const ok = (c, m) => { if (c) { pass++; console.log('  ok -', m) } else { fail++; console.log('  FAIL -', m) } }

db.prepare('INSERT INTO boards (name) VALUES (?)').run('B')
const boardId = Number(db.prepare('SELECT last_insert_rowid()').get()['last_insert_rowid()'])
db.prepare("INSERT INTO items (url,title) VALUES ('u','T')").run()
const itemId = Number(db.prepare('SELECT last_insert_rowid()').get()['last_insert_rowid()'])

// 1) text / link / ref：直接创建
const kinds = ['text','link','image','video','file','ref']
for (const k of kinds) {
  const c = addCard({ board_id: boardId, kind: k, item_id: k==='ref'?itemId:null, x: 10, y: 10, w: 240, h: 140, title: `c-${k}`, body: 'b', payload: k==='link'?'{"url":"https://x.com"}':'{}' })
  ok(c && c.kind === k && c.id > 0, `addCard ${k} 创建成功`)
}
// 2) image 带附件：payload 应写入 file/name/size
writeFileSync(join(dir, 'a.png'), Buffer.from('fake-png'))
const img = addCard({ board_id: boardId, kind: 'image', x:0,y:0, w:240, h:140, title:'pic', body:'', payload:'{}', _sourcePath: join(dir,'a.png') })
const ip = JSON.parse(img.payload); ok(ip.file && ip.name==='a.png' && ip.size>0, 'image 附件已落地 payload')

// 3) listCards 返回全部 7 张
ok(listCards(boardId).length === 7, 'listCards 返回 7 张')

// 4) deleteCard 级联可用
delCard(img.id); ok(listCards(boardId).length === 6, 'deleteCard 删除成功')

console.log(`\n${fail===0 ? 'PASSED' : 'FAILED'} — ${pass} ok, ${fail} fail`)
process.exit(fail===0?0:1)
