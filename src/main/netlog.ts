import type { BrowserWindow } from 'electron'

export interface NetLogEntry {
  time: number
  url: string
  method?: string
  status: number
  ms: number
  bytes: number
  ok: boolean
  error: string
  source?: string
}

let win: BrowserWindow | null = null

/** 由主窗口创建时注入，netLog 才能把日志发往渲染进程 */
export function setNetLogWindow(w: BrowserWindow | null) { win = w }

/** 上报一条网络请求日志到渲染进程（开发者模式的诊断面板会显示） */
export function netLog(entry: Omit<NetLogEntry, 'time'>) {
  const full: NetLogEntry = { time: Date.now(), ...entry }
  try { win?.webContents.send('net:log', full) } catch { /* 窗口未就绪时静默 */ }
  // 同时打到 stdout，方便从终端启动的用户直接看
  const tag = full.ok ? 'OK ' : 'ERR'
  const status = full.status ? `HTTP ${full.status}` : (full.error || 'no-status')
  // eslint-disable-next-line no-console
  console.log(`[net:${tag}] ${full.source || ''} ${full.method || 'GET'} ${full.url} → ${status} ${full.bytes}B/${full.ms}ms${full.error && !full.ok ? ' :: ' + full.error : ''}`)
}

/**
 * 规范化任意异常为单行可读错误（rss-parser / axios / 网络错误可能抛出非 Error 对象）。
 * 优先取 code（ENOTFOUND / ETIMEDOUT / ECONNREFUSED / HTTP_xxx）、status、message，最后兜底 stack/序列化。
 */
export function extractError(err: unknown, url?: string): string {
  if (!err) return 'unknown error'
  if (typeof err === 'string') return err.slice(0, 300)
  if (err instanceof Error) {
    const e = err as Error & { code?: string; status?: number; statusCode?: number }
    const parts: string[] = []
    if (e.code) parts.push(e.code)
    const st = e.status ?? e.statusCode
    if (st) parts.push('HTTP ' + st)
    if (err.message && !parts.some((p) => err.message.includes(p))) parts.push(err.message)
    if (!parts.length) parts.push(err.name || 'Error')
    return [...new Set(parts)].map((p) => p.slice(0, 200)).join(' · ') + (url ? ` @ ${url}` : '')
  }
  try { return (JSON.stringify(err) + (url ? ` @ ${url}` : '')).slice(0, 300) }
  catch { return (String(err) + (url ? ` @ ${url}` : '')).slice(0, 300) }
}
