import fs from 'node:fs'
import { getDbFile, checkpoint, getSetting } from './db'

/** 把本地数据库快照上传到 WebDAV（如坚果云）。先 checkpoint 再读文件，保证一致性。 */
export async function backupWebDAV(): Promise<{ ok: boolean; size: number; at: string }> {
  const url = getSetting('webdav_url')
  const user = getSetting('webdav_user')
  const pass = getSetting('webdav_pass')
  if (!url) throw new Error('未配置 WebDAV 地址')
  checkpoint()
  const buf = fs.readFileSync(getDbFile())
  const target = url.endsWith('/') ? url + 'capybara-backup.db' : url + '/capybara-backup.db'
  const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' }
  if (user) headers.Authorization = 'Basic ' + Buffer.from(`${user}:${pass ?? ''}`).toString('base64')
  const res = await fetch(target, { method: 'PUT', headers, body: buf })
  if (!res.ok) throw new Error(`WebDAV 上传失败 ${res.status}`)
  return { ok: true, size: buf.length, at: new Date().toISOString() }
}
