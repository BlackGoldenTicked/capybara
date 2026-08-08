import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store'
import type { Item } from '../env'
import { Icon } from './icons'
import { cleanArticleHtml, plainTextFromHtml } from '../lib/reader'
import { buildArticlePage } from '../lib/article-frame'

// iframe 内注入的点击劫持脚本（轻量，仅转发 click 事件到父窗口）
const IFRAME_SCRIPT = `
<script>
document.addEventListener('click',function(e){
  var img=e.target.closest('img[data-zoom]');
  if(img&&img.src){parent.postMessage({t:'zoom',s:img.src},'*');e.preventDefault();return}
  var a=e.target.closest('a');
  if(a&&a.href&&a.href.startsWith('http')){parent.postMessage({t:'link',h:a.href},'*');e.preventDefault();return}
})
</script>`

export function ReaderPane() {
  const { selectedId, setStatus, addRefCard, activeBoardId, createBoard, showToast, openInBrowser } = useStore()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
  const [noImg, setNoImg] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [frameHtml, setFrameHtml] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 按需取单条完整数据（含正文），列表不再全量传正文（性能优化 #1）
  useEffect(() => {
    if (selectedId == null) { setItem(null); setFrameHtml(''); return }
    let alive = true
    setLoading(true)
    window.readflow.invoke('items:get', selectedId).then((r) => {
      if (alive) { setItem((r as Item) ?? null); setLoading(false) }
    }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [selectedId])

  // 正文异步清洗（Web Worker）+ 构建 iframe 页面
  useEffect(() => {
    if (!item) { setFrameHtml(''); return }
    let alive = true
    const html = item.content_html
    if (!html) { setFrameHtml(''); return }

    void (async () => {
      const clean = await cleanArticleHtml(html)
      if (!alive) return
      const page = buildArticlePage({
        title: item.title,
        author: item.author,
        sourceName: item.source_name,
        url: item.url,
        bodyHtml: clean,
        noImg,
      })
      if (alive) setFrameHtml(page)
    })()
    return () => { alive = false }
  }, [item, noImg])

  // 监听 iframe 内的 click 事件（通过 postMessage 转发）
  const onFrameMessage = useCallback((e: MessageEvent) => {
    const d = e.data as { t: string; s?: string; h?: string }
    if (!d || typeof d.t !== 'string') return
    if (d.t === 'zoom' && d.s) {
      setLightbox(d.s)
    } else if (d.t === 'link' && d.h) {
      openInBrowser(d.h, { x: 0, y: 0 })
    }
  }, [openInBrowser])

  useEffect(() => {
    window.addEventListener('message', onFrameMessage)
    return () => window.removeEventListener('message', onFrameMessage)
  }, [onFrameMessage])

  useEffect(() => {
    void (window.readflow.invoke('settings:get', 'reader_noimg') as Promise<string>).then((r) => setNoImg(r === '1'))
  }, [selectedId])

  if (selectedId == null || !item) {
    return (<section className="reader"><div className="reader-empty">选择左侧条目开始阅读 · J/K 快速浏览{loading ? ' · 加载中…' : ''}</div></section>)
  }

  const toggleNoImg = () => { const v = !noImg; setNoImg(v); void window.readflow.invoke('settings:set', 'reader_noimg', v ? '1' : '0') }

  const sendToBoard = async () => {
    if (!activeBoardId) {
      await createBoard()
      addRefCard(item.id, 120, 120)
      showToast('已新建白板并放入')
    } else {
      addRefCard(item.id, 80 + Math.random() * 200, 80 + Math.random() * 200)
      showToast('已放入白板')
    }
  }

  // 构建带点击劫持脚本的完整 srcdoc
  const srcdoc = frameHtml
    ? frameHtml.replace('</head>', IFRAME_SCRIPT + '</head>')
    : ''

  return (
    <section className="reader">
      <div className="reader-bar">
        <button className={`rb-toggle ${noImg ? 'on' : ''}`} onClick={toggleNoImg} title="隐藏正文中的图片 / 视频，纯文字阅读"><Icon name={noImg ? 'eye' : 'eyeOff'} size={14} /> 无图模式</button>
      </div>
      <div className="reader-body">
        {srcdoc
          ? <iframe
              ref={iframeRef}
              className="reader-frame"
              sandbox="allow-scripts"
              srcDoc={srcdoc}
              title={item.title}
            />
          : <div className="reader-fallback">
              <p className="reader-title">{item.title}</p>
              <p className="reader-meta">{item.author || item.source_name} · <a href={item.url} onClick={(e) => { e.preventDefault(); openInBrowser(item.url, { x: e.clientX, y: e.clientY }) }}>{item.url}</a></p>
              <div className="reader-content plain">{plainTextFromHtml(item.content_text || item.summary) || '（无正文快照，等待采集器抓取全文）'}</div>
            </div>}

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
            <span className="lightbox-hint">点击任意处关闭</span>
          </div>
        )}
      </div>
      <div className="reader-actions">
        <button onClick={() => void setStatus(item.id, 'favorite')}><Icon name="favorite" size={14} /> 收藏 (F)</button>
        <button onClick={() => void setStatus(item.id, 'later')}><Icon name="later" size={14} /> 稍后读 (L)</button>
        <button onClick={() => void setStatus(item.id, 'archived')}><Icon name="archived" size={14} /> 归档 (E)</button>
        <button onClick={() => void sendToBoard()}><Icon name="send" size={14} /> 送到白板</button>
      </div>
    </section>
  )
}
