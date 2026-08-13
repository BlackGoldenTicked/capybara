import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Item } from '../env'
import { Icon } from './icons'
import { cleanArticleHtml, renderArticleHtml, plainTextFromHtml } from '../lib/reader'
import { getAllReadingThemes, FOLLOW_UI_ID } from '../lib/reading-themes'

export function ReaderPane() {
  const { selectedId, openInBrowser, appearance, updateAppearance, toggleZenMode } = useStore()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
  const [noImg, setNoImg] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [cleanHtml, setCleanHtml] = useState('')

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

  // 异步清洗正文 HTML（Web Worker），避免大文章卡顿渲染线程
  useEffect(() => {
    if (!item) { setCleanHtml(''); return }
    const html = item.content_html
    if (!html) { setCleanHtml(''); return }
    let alive = true
    void cleanArticleHtml(html).then((clean) => { if (alive) setCleanHtml(clean) })
    return () => { alive = false }
  }, [item])

  useEffect(() => {
    void (window.readflow.invoke('settings:get', 'reader_noimg') as Promise<string>).then((r) => setNoImg(r === '1'))
  }, [selectedId])

  if (selectedId == null || !item) {
    return (<section className="reader"><div className="reader-empty">选择左侧条目开始阅读 · J/K 快速浏览{loading ? ' · 加载中…' : ''}</div></section>)
  }

  const toggleNoImg = () => { const v = !noImg; setNoImg(v); void window.readflow.invoke('settings:set', 'reader_noimg', v ? '1' : '0') }

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
  const html = cleanHtml || (item.content_html ? renderArticleHtml(item.content_html) : '')

  const allThemes = getAllReadingThemes()
  const darkThemes = allThemes.filter((t) => t.mode === 'dark')
  const lightThemes = allThemes.filter((t) => t.mode === 'light')

  return (
    <section className="reader">
      <div className="reader-bar">
        <button className="rb-toggle" onClick={toggleZenMode} title="专注模式：隐藏侧栏与列表，全屏阅读"><Icon name="maximize" size={14} /> 专注</button>
        <button className={`rb-toggle ${noImg ? 'on' : ''}`} onClick={toggleNoImg} title="隐藏正文中的图片 / 视频，纯文字阅读"><Icon name={noImg ? 'eye' : 'eyeOff'} size={14} /> 无图模式</button>
        <div className="rb-spacer" />
        <select
          className="rb-theme-select"
          value={appearance.readingTheme || FOLLOW_UI_ID}
          onChange={(e) => updateAppearance({ readingTheme: e.target.value })}
        >
          <option value={FOLLOW_UI_ID}>🎨 跟随界面</option>
          <optgroup label="── 暗色主题 ──">
            {darkThemes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </optgroup>
          <optgroup label="── 亮色主题 ──">
            {lightThemes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="reader-body">
        <a className="reader-title-link" href={item.url} onClick={(e) => { e.preventDefault(); openInBrowser(item.url, { x: e.clientX, y: e.clientY }) }} title="用系统默认浏览器打开"><h2 className="reader-title">{item.title}</h2></a>
        <p className="reader-meta">{item.author || item.source_name}</p>
        {html
          ? <div className={contentClass} onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />
          : <div className={`${contentClass} plain`} onClick={onContentClick}>{plainTextFromHtml(item.content_text || item.summary) || '（无正文快照，等待采集器抓取全文）'}</div>}

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
            <span className="lightbox-hint">点击任意处关闭</span>
          </div>
        )}
      </div>
    </section>
  )
}
