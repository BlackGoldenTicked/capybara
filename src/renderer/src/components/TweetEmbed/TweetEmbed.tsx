import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { extractTweetId, buildEmbedPageUrl } from '../../lib/tweet'
import { Icon } from '../icons'
import './TweetEmbed.css'

/**
 * X / Twitter 官方 Embedded Post 展示组件。
 *
 * 通过 sandbox iframe 加载本地宿主页 public/tweet-embed.html，宿主页内部用 X 官方
 * widgets.js 渲染帖子（头像 / 用户名 / 正文 / 图片 / 视频 / Quote / 交互），
 * 并用 ResizeObserver + postMessage 回传高度，实现高度自适应。
 *
 * 设计原则（见技术方案）：
 *   - 不自己解析 / 仿制 Tweet UI，交给 X 官方 Embed；
 *   - 不使用 <webview>、不关闭 webSecurity、不在主渲染进程运行 X 脚本；
 *   - sandbox 必须含 allow-same-origin：实测 widgets.js 在 opaque-origin（无该标志）下
 *     createTweet 会 resolve null（unavailable）导致渲染失败；加上后高度/就绪回传正常。
 *   - 失败时展示错误卡（重新加载 / 在 X 中打开）并可回退到本地正文快照。
 */
export interface TweetEmbedProps {
  /** 推文 URL（x.com / twitter.com / mobile.* / ?s=20 / /photo/1 均可）。 */
  url: string
  theme?: 'light' | 'dark'
  /** 隐藏会话上下文（只展示单条推文）。默认 true。 */
  hideThread?: boolean
  /** 隐藏媒体（图片 / 视频 / 卡片）。默认 false。 */
  hideMedia?: boolean
  width?: number | string
  /** 「在 X 中打开」回调；一般传主进程的 openInBrowser。 */
  onOpenExternal?: (url: string) => void
  /** 加载失败时在错误卡下方展示的本地快照（如导入的正文 + 图片）。 */
  fallback?: ReactNode
}

type Status = 'idle' | 'loading' | 'ready' | 'error'

const MSG_SOURCE = 'capybara-tweet-embed'
const MIN_HEIGHT = 180
const READY_TIMEOUT = 15000

interface EmbedMessage {
  source?: string
  id?: string
  type?: 'resize' | 'ready' | 'error'
  height?: number
}

export function TweetEmbed({
  url,
  theme = 'light',
  hideThread = true,
  hideMedia = false,
  width = '100%',
  onOpenExternal,
  fallback,
}: TweetEmbedProps) {
  const id = extractTweetId(url)
  const [nonce, setNonce] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<Status>(id ? 'idle' : 'error')
  const [height, setHeight] = useState(MIN_HEIGHT)
  const wrapRef = useRef<HTMLDivElement>(null)

  // 懒加载：进入视口才挂载 iframe（单条阅读场景即刻可见，保留以便未来列表复用）
  useEffect(() => {
    if (!id) return
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver !== 'function') { setMounted(true); return }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setMounted(true); io.disconnect() }
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [id])

  // id / 主题 / 媒体开关 / nonce 变化 → 回到 loading，清空高度（iframe 会因 key/src 变化重建）
  useEffect(() => {
    if (!id) { setStatus('error'); return }
    setStatus(mounted ? 'loading' : 'idle')
    setHeight(MIN_HEIGHT)
  }, [id, theme, hideMedia, hideThread, nonce, mounted])

  // 监听宿主页 postMessage：高度回传 / 就绪 / 失败（sandbox iframe 为 opaque origin，按 source+id 校验）
  useEffect(() => {
    if (!id) return
    const onMsg = (e: MessageEvent<EmbedMessage>) => {
      const d = e.data
      if (!d || d.source !== MSG_SOURCE || d.id !== id) return
      if (d.type === 'resize' && typeof d.height === 'number') {
        setHeight(Math.max(MIN_HEIGHT, d.height))
        setStatus((s) => (s === 'error' ? s : 'ready'))
      } else if (d.type === 'ready') {
        setStatus((s) => (s === 'error' ? s : 'ready'))
      } else if (d.type === 'error') {
        setStatus('error')
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [id])

  // 就绪超时：挂载后 READY_TIMEOUT 内仍未 ready/error → 判定失败
  useEffect(() => {
    if (!id || !mounted || status === 'ready' || status === 'error') return
    const t = setTimeout(() => setStatus((s) => (s === 'ready' || s === 'error' ? s : 'error')), READY_TIMEOUT)
    return () => clearTimeout(t)
  }, [id, mounted, status, nonce, theme, hideMedia, hideThread])

  const reload = () => { setNonce((n) => n + 1); setStatus('loading') }
  const openExternal = () => { if (onOpenExternal) onOpenExternal(url) }

  const src = id && mounted ? buildEmbedPageUrl({ id, theme, hideThread, hideMedia, nonce }) : ''
  const iframeKey = `${id}-${nonce}-${theme}-${hideMedia ? 'nm' : 'm'}-${hideThread ? 'nt' : 't'}`
  const wrapStyle: CSSProperties = { width }

  const errorCard = (hint: string, showReload: boolean) => (
    <div className="tweet-embed-error">
      <p className="te-err-title">无法加载 X 帖子</p>
      <p className="te-err-hint">{hint}</p>
      <div className="te-err-actions">
        {showReload && (
          <button type="button" className="te-btn" onClick={reload}>
            <Icon name="refresh" size={13} /> 重新加载
          </button>
        )}
        <button type="button" className="te-btn" onClick={openExternal}>
          <Icon name="external" size={13} /> 在 X 中打开
        </button>
      </div>
    </div>
  )

  return (
    <div className="tweet-embed" ref={wrapRef} style={wrapStyle}>
      {!id ? (
        <>
          {errorCard('链接中未识别到有效的推文 ID。', false)}
          {fallback && <div className="tweet-embed-fallback">{fallback}</div>}
        </>
      ) : (
        <>
          <div className="tweet-embed-frame" style={{ height: status === 'error' ? 0 : height }}>
            {mounted && status !== 'error' && (
              <iframe
                key={iframeKey}
                className="tweet-embed-iframe"
                src={src}
                title="X 帖子"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                style={{ width: '100%', height }}
              />
            )}
            {status !== 'ready' && status !== 'error' && (
              <div className="tweet-embed-loading">
                <span className="te-spinner" />
                <span>正在加载 X 帖子…</span>
              </div>
            )}
          </div>
          {status === 'error' && errorCard('可能是网络不可用、X 服务异常，或该推文已删除 / 被保护。', true)}
          {status === 'error' && fallback && <div className="tweet-embed-fallback">{fallback}</div>}
        </>
      )}
    </div>
  )
}
