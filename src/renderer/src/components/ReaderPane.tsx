import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Item } from '../env'
import { Icon } from './icons'
import { renderArticleHtml } from '../lib/reader'

export function ReaderPane() {
  const { selectedId, setStatus, addRefCard, activeBoardId, createBoard, showToast, openInBrowser } = useStore()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
const [noImg, setNoImg] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  // 按需取单条完整数据（含正文），列表不再全量传正文（性能优化 #1）
  useEffect(() => {
    if (selectedId == null) { setItem(null); return }
    let alive = true
    setLoading(true)
    window.readflow.invoke('items:get', selectedId).then((r) => {
      if (alive) { setItem((r as Item) ?? null); setLoading(false) }
    }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [selectedId])

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

  // 正文内点击：图片 → 灯箱；链接 → 系统默认浏览器打开（不在应用内跳转）
  const onContentClick = (e: React.MouseEvent) => {
    const img = (e.target as HTMLElement).closest('img[data-zoom]') as HTMLImageElement | null
    if (img && img.getAttribute('src')) {
      e.preventDefault()
      setLightbox(img.getAttribute('src'))
      return
    }
    const a = (e.target as HTMLElement).closest('a')
    if (a && a.getAttribute('href')) {
      e.preventDefault()
      openInBrowser(a.getAttribute('href')!, { x: e.clientX, y: e.clientY })
    }
  }

  const contentClass = `reader-content ${noImg ? 'no-img' : ''}`
  const cleanHtml = item.content_html ? renderArticleHtml(item.content_html) : ''

  return (
    <section className="reader">
      <div className="reader-bar">
        <button className={`rb-toggle ${noImg ? 'on' : ''}`} onClick={toggleNoImg} title="隐藏正文中的图片 / 视频，纯文字阅读"><Icon name={noImg ? 'eye' : 'eyeOff'} size={14} /> 无图模式</button>
      </div>
      <div className="reader-body">
        <p className="reader-title">{item.title}</p>
        <p className="reader-meta">{item.author || item.source_name} · <a href={item.url} onClick={(e) => { e.preventDefault(); openInBrowser(item.url, { x: e.clientX, y: e.clientY }) }} title="用系统默认浏览器打开">{item.url}</a></p>
        {cleanHtml
          ? <div className={contentClass} onClick={onContentClick} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
          : <div className={`${contentClass} plain`} onClick={onContentClick}>{item.content_text || item.summary || '（无正文快照，等待采集器抓取全文）'}</div>}

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