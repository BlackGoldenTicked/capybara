import http from 'node:http'
import crypto from 'node:crypto'
import { addItem, getSetting, setSetting, SourceType } from './db'

const PORT = 47832

/**
 * 本地 ingest 服务：供 ReadFlow Clip 浏览器扩展把 X 收藏/网页推送到客户端。
 * 只监听 127.0.0.1；首次启动生成随机 token，扩展通过 GET /pair 完成配对。
 */
export function startIngestServer() {
  let token = getSetting('clip_token')
  if (!token) {
    token = crypto.randomBytes(18).toString('hex')
    setSetting('clip_token', token)
  }

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, app: 'readflow' }))
      return
    }
    // 配对只允许本机回环请求（http server 本就只绑 127.0.0.1，双保险）
    if (req.method === 'GET' && req.url === '/pair') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ token }))
      return
    }
    if (req.method === 'POST' && req.url === '/ingest') {
      if (req.headers.authorization !== `Bearer ${token}`) {
        res.writeHead(401); res.end('unauthorized'); return
      }
      let body = ''
      req.on('data', (c) => { body += c; if (body.length > 2_000_000) req.destroy() })
      req.on('end', () => {
        try {
          const p = JSON.parse(body)
          const result = addItem({
            source_type: (p.source_type ?? 'manual') as SourceType,
            source_name: p.source_name ?? '浏览器扩展',
            url: String(p.url ?? ''),
            title: String(p.title ?? ''),
            author: String(p.author ?? ''),
            summary: String(p.summary ?? ''),
            content_text: String(p.content_text ?? '')
          })
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, id: result.id }))
        } catch {
          res.writeHead(400); res.end('bad request')
        }
      })
      return
    }
    res.writeHead(404); res.end()
  })

  server.listen(PORT, '127.0.0.1')
  return server
}
