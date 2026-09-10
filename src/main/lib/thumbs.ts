/**
 * 书签链接的网页缩略图（Eagle 式卡片封面）
 *
 * - 卡片首次展示时由主进程用隐藏窗口加载网页并截图，JPEG 缓存到磁盘
 *   （userData/images/thumbs/<sha1(url)>.jpg），渲染层经 cover:// 协议引用：
 *   cover://thumbs/<sha1>.jpg —— 复用已有的 cover 协议，无需新增 scheme
 * - 串行队列 + 复用单个隐藏窗口；in-flight 去重；失败写 .fail 标记，7 天后才重试
 * - 收藏内容变动很少，缓存长期有效，不做主动刷新
 */

import { BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { getImagesDir } from '../db'

const THUMB_W = 640 // 缓存图宽度（高度按比例）
const CAPTURE_W = 1280 // 捕获视口宽
const CAPTURE_H = 1024 // 捕获视口高
const LOAD_TIMEOUT = 20_000 // 页面加载超时
const SETTLE_MS = 1500 // did-finish-load 后等待懒加载渲染
const FAIL_TTL = 7 * 24 * 3600 * 1000 // 失败标记有效期
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

/** 推送给渲染层的缩略图就绪事件载荷；rel 为 null 表示捕获失败 */
export interface ThumbReady {
  url: string
  rel: string | null
}
export type ThumbSender = (payload: ThumbReady) => void

function thumbsDir(): string {
  const dir = path.join(getImagesDir(), 'thumbs')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function hashOf(url: string): string {
  return crypto.createHash('sha1').update(url).digest('hex')
}

/** 已缓存则返回 cover:// 下的相对路径，否则 null */
function cachedRel(url: string): string | null {
  const rel = `thumbs/${hashOf(url)}.jpg`
  return fs.existsSync(path.join(getImagesDir(), rel)) ? rel : null
}

/** 近期捕获失败过（7 天内）则不再重试，避免反复加载死链 */
function failedRecently(url: string): boolean {
  try {
    const st = fs.statSync(path.join(thumbsDir(), `${hashOf(url)}.fail`))
    return Date.now() - st.mtimeMs < FAIL_TTL
  } catch {
    return false
  }
}

function markFail(url: string): null {
  try { fs.writeFileSync(path.join(thumbsDir(), `${hashOf(url)}.fail`), '') } catch { /* ignore */ }
  return null
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ===== 隐藏捕获窗口（复用单实例） =====
let win: BrowserWindow | null = null
function captureWindow(): BrowserWindow {
  if (win && !win.isDestroyed()) return win
  win = new BrowserWindow({
    show: false,
    width: CAPTURE_W,
    height: CAPTURE_H,
    webPreferences: { contextIsolation: true, nodeIntegration: false, backgroundThrottling: false },
  })
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  return win
}

// ===== 串行捕获队列 =====
const queue: string[] = []
const inflight = new Set<string>()
let pumping = false
let sender: ThumbSender | null = null

/**
 * 批量查询缓存并把未缓存的 url 入队；立即返回 { url: rel | null }。
 * 捕获完成后通过 send 回调推送 ThumbReady（由调用方转发给渲染层）。
 */
export function requestThumbs(urls: string[], send: ThumbSender): Record<string, string | null> {
  sender = send
  const out: Record<string, string | null> = {}
  for (const u of urls) {
    const rel = cachedRel(u)
    out[u] = rel
    if (rel) continue
    if (failedRecently(u) || inflight.has(u) || queue.includes(u)) continue
    queue.push(u)
  }
  void pump()
  return out
}

/** 强制重新捕获：删除缓存与失败标记后重新入队（卡片上的刷新按钮） */
export function refreshThumb(url: string, send: ThumbSender): void {
  sender = send
  try { fs.unlinkSync(path.join(getImagesDir(), `thumbs/${hashOf(url)}.jpg`)) } catch { /* 本就无缓存 */ }
  try { fs.unlinkSync(path.join(thumbsDir(), `${hashOf(url)}.fail`)) } catch { /* ignore */ }
  if (!inflight.has(url) && !queue.includes(url)) queue.push(url)
  void pump()
}

async function pump(): Promise<void> {
  if (pumping) return
  pumping = true
  try {
    while (queue.length > 0) {
      const url = queue.shift()!
      inflight.add(url)
      const rel = await captureOne(url)
      inflight.delete(url)
      sender?.({ url, rel })
    }
  } finally {
    pumping = false
  }
}

async function captureOne(url: string): Promise<string | null> {
  try {
    const u = new URL(url)
    if (!/^https?:$/.test(u.protocol)) return null
  } catch {
    return null
  }

  const w = captureWindow()
  let failed = false
  const onFinish = () => { failed = false }
  const onFail = () => { failed = true }

  try {
    w.webContents.on('did-finish-load', onFinish)
    w.webContents.on('did-fail-load', onFail)
    try {
      await Promise.race([
        w.webContents.loadURL(url, { userAgent: UA }),
        sleep(LOAD_TIMEOUT),
      ])
    } catch {
      failed = true // loadURL 直接 reject（DNS/证书等）
    }
    if (failed) return markFail(url)

    // 等待懒加载内容（图片/字体/SPA 首屏）
    await sleep(SETTLE_MS)

    const img = await w.webContents.capturePage()
    if (img.isEmpty()) return markFail(url)
    const buf = img.resize({ width: THUMB_W }).toJPEG(82)
    const rel = `thumbs/${hashOf(url)}.jpg`
    fs.writeFileSync(path.join(getImagesDir(), rel), buf)
    try { fs.unlinkSync(path.join(thumbsDir(), `${hashOf(url)}.fail`)) } catch { /* ignore */ }
    return rel
  } catch {
    return markFail(url)
  } finally {
    w.webContents.off('did-finish-load', onFinish)
    w.webContents.off('did-fail-load', onFail)
  }
}
