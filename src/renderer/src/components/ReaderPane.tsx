import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import type { Item } from '../env'
import { Icon } from './icons'
import { cleanArticleHtml, renderArticleHtml, plainTextFromHtml, buildToc, type TocHeading } from '../lib/reader'
import { getAllReadingThemes, FOLLOW_UI_ID } from '../lib/reading-themes'

/** 秒数 → "mm:ss" / "h:mm:ss" */
function fmtDuration(sec: number): string {
  if (!sec || sec < 0) return ''
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`
}

export function ReaderPane() {
  const { selectedId, openInBrowser, appearance, updateAppearance, toggleZenMode } = useStore()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
  const [noImg, setNoImg] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [cleanHtml, setCleanHtml] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState('')

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

  // 正文目录：从（清洗后的）正文 HTML 抽取 h2–h6 标题，并注入锚点 id
  const { html, toc } = useMemo(() => {
    const raw = cleanHtml || (item.content_html ? renderArticleHtml(item.content_html) : '')
    if (!raw) return { html: '', toc: [] as TocHeading[] }
    return buildToc(raw)
  }, [cleanHtml, item])

  // 点击目录项：平滑滚动到对应章节（与正文顶部留 14px 余白）
  const scrollToHeading = (id: string) => {
    const body = bodyRef.current
    if (!body) return
    const el = body.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (!el) return
    const top = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 14
    body.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setActiveId(id)
  }

  // scroll-spy：正文滚动时高亮当前所在章节
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    if (toc.length === 0) { setActiveId(''); return }
    let raf = 0
    const compute = () => {
      raf = 0
      const bTop = body.getBoundingClientRect().top
      const threshold = 96
      let cur = toc[0].id
      for (const h of toc) {
        const el = body.querySelector<HTMLElement>(`#${CSS.escape(h.id)}`)
        if (!el) continue
        const rel = el.getBoundingClientRect().top - bTop
        if (rel - threshold <= 0) cur = h.id
        else break
      }
      setActiveId((prev) => (prev === cur ? prev : cur))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute) }
    body.addEventListener('scroll', onScroll, { passive: true })
    compute()
    return () => { body.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [toc])

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
      <div className="reader-split">
        {toc.length > 0 && (
          <nav className="reader-toc" aria-label="正文目录">
            <div className="toc-head">目录 · {toc.length}</div>
            <div className="toc-list" role="listbox" aria-label="快速定位章节">
              {toc.map((h) => (
                <button key={h.id} type="button" role="option" aria-selected={activeId === h.id}
                  className={`toc-row lvl-${h.level}${activeId === h.id ? ' is-active' : ''}`}
                  style={{ '--lvl-indent': `${(h.level - 2) * 12}px` } as React.CSSProperties}
                  onClick={() => scrollToHeading(h.id)}>
                  <span className="toc-row__text">{h.text}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
        <div className="reader-body" ref={bodyRef}>
        <a className="reader-title-link" href={item.url} onClick={(e) => { e.preventDefault(); openInBrowser(item.url, { x: e.clientX, y: e.clientY }) }} title="用系统默认浏览器打开"><h2 className="reader-title">{item.title}</h2></a>
        <p className="reader-meta">{item.author || item.source_name}</p>

        {item.kind === 'podcast' ? (
          <div className="media-podcast">
            {item.media_url
              ? <audio controls src={item.media_url} className="podcast-player" preload="none" />
              : <p className="media-empty">该期暂无音频链接</p>}
            {item.duration > 0 && <div className="podcast-meta">时长 {fmtDuration(item.duration)}</div>}
            {html && <div className={contentClass} onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />}
            {item.transcript && (
              <details className="podcast-transcript">
                <summary>转录文稿（ASR）</summary>
                <div className="podcast-transcript-body">{item.transcript}</div>
              </details>
            )}
          </div>
        ) : item.kind === 'video' ? (
          <div className="media-video">
            {item.media_url ? (
              <div className="video-frame">
                <iframe src={item.media_url} title={item.title} allowFullScreen
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <a className="video-fallback" href={item.url} onClick={(e) => { e.preventDefault(); openInBrowser(item.url, { x: e.clientX, y: e.clientY }) }}>无法内嵌播放，用浏览器打开</a>
            )}
            {html && <div className={contentClass} onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />}
          </div>
        ) : (
          html
            ? <div className={contentClass} onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />
            : <div className={`${contentClass} plain`} onClick={onContentClick}>{plainTextFromHtml(item.content_text || item.summary) || '（无正文快照，等待采集器抓取全文）'}</div>
        )}

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
            <span className="lightbox-hint">点击任意处关闭</span>
          </div>
        )}
      </div>
      </div>
    </section>
  )
}
