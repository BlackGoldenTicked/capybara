import DOMPurify from 'dompurify'

/** 把可能带 HTML 实体/标签的字符串转成纯文本（用于列表卡片摘要等兜底场景）。 */
export function plainTextFromHtml(raw: string): string {
  if (!raw) return ''
  const div = document.createElement('div')
  div.innerHTML = raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
  return (div.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 300)
}

// ---- Worker 初始化 ----

let workerPromise: Promise<Worker | null> | undefined

function getWorker(): Promise<Worker | null> {
  if (workerPromise === undefined) {
    workerPromise = new Promise((resolve) => {
      try {
        const w = new Worker(
          new URL('../workers/article-cleaner.worker.ts', import.meta.url),
          { type: 'module' }
        )
        resolve(w)
      } catch {
        console.warn('[reader] Web Worker 不可用，回退到主线程清洗')
        resolve(null)
      }
    })
  }
  return workerPromise
}

/**
 * 通过 Web Worker 异步清洗正文 HTML。
 * 成功时返回干净 HTML，失败或 Worker 不可用时回退到同步清洗。
 */
export async function cleanArticleHtml(raw: string): Promise<string> {
  if (!raw || !raw.trim()) return ''

  const worker = await getWorker()
  if (!worker) return renderArticleHtml(raw)

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      // 3 秒超时，回退到同步清洗
      resolve(renderArticleHtml(raw))
    }, 3000)

    worker.onmessage = (e: MessageEvent<string>) => {
      clearTimeout(timer)
      resolve(e.data || '')
    }
    worker.onerror = () => {
      clearTimeout(timer)
      resolve(renderArticleHtml(raw))
    }
    worker.postMessage({ html: raw })
  })
}

/**
 * 把 Readability 抽出的原始正文 HTML 规整为「统一、适配暗色主题」的干净排版。
 *
 * 采集侧（main / readability.ts）用 linkedom 抽取，会保留源站内联 style/class
 * （只删了 <style>/<script> 标签）。若直接渲染：
 *   - 内联 style（颜色/边距/宽度）会破坏暗色主题与对比度；
 *   - 懒加载图（data-src / data-original）src 为空导致图片不显示；
 *   - 相对地址、防盗链导致死图。
 * 这里在渲染端统一清洗 + 规整，让 CSS 完全掌控排版。
 */

// 懒加载图常见的真实地址承载属性（按优先级）
const LAZY_SRC_ATTRS = ['data-src', 'data-original', 'data-lazy-src', 'data-true-src', 'data-srcset', 'data-lazy-srcset']
// 1px 占位 gif / svg 占位（懒加载图常见的空 src）
const PLACEHOLDER_RE = /^(data:image\/(gif|png|svg\+xml);base64,)/i

function isPlaceholder(src: string | null): boolean {
  if (!src) return true
  return PLACEHOLDER_RE.test(src) || src.trim() === ''
}

/** 清洗并规整一段正文 HTML，返回可直接 dangerouslySetInnerHTML 的安全字符串。 */
export function renderArticleHtml(raw: string): string {
  if (!raw || !raw.trim()) return ''

  let doc: Document
  try {
    doc = new DOMParser().parseFromString(raw, 'text/html')
  } catch {
    return DOMPurify.sanitize(raw)
  }

  // 1) 剥离所有内联 style / class / 无用 data-*（保留 data-zoom 供点击放大）
  doc.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style')
    el.removeAttribute('class')
    Array.from(el.attributes).forEach((attr) => {
      const n = attr.name.toLowerCase()
      if (n.startsWith('data-') && n !== 'data-zoom') el.removeAttribute(attr.name)
    })
  })

  // 2) 图片：懒加载回填 + 清除尺寸属性（交给 CSS 自适应）+ 懒加载 / 防盗链属性
  doc.querySelectorAll('img').forEach((img) => {
    if (isPlaceholder(img.getAttribute('src'))) {
      for (const a of LAZY_SRC_ATTRS) {
        const v = img.getAttribute(a)?.trim()
        if (v && !v.startsWith('data:')) { img.setAttribute('src', v); break }
      }
    }
    img.removeAttribute('width')
    img.removeAttribute('height')
    img.setAttribute('loading', 'lazy')
    img.setAttribute('decoding', 'async')
    img.setAttribute('referrerpolicy', 'no-referrer')
    img.setAttribute('data-zoom', '1')
  })

  // 3) 链接：加安全属性（点击在渲染端统一用系统浏览器打开）
  doc.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('rel', 'noopener noreferrer')
    a.setAttribute('target', '_blank')
  })

  // 4) iframe（嵌入视频 / 外链）：有安全风险且易破坏布局，移除并替换为可点链接
  doc.querySelectorAll('iframe').forEach((f) => {
    const src = f.getAttribute('src')?.trim() ?? ''
    const p = doc.createElement('p')
    p.className = 'embed-fallback'
    if (src && /^https?:/i.test(src)) {
      const a = doc.createElement('a')
      a.href = src
      a.textContent = '查看嵌入内容（视频 / 外链）'
      p.appendChild(a)
    } else {
      p.textContent = '（已省略嵌入内容）'
    }
    f.replaceWith(p)
  })

  // 5) 删除空段落 / 纯空白容器（Readability 常残留空 <p><div>）
  doc.querySelectorAll('p, div, section, article, span').forEach((el) => {
    const hasMedia = el.querySelector('img, video, picture, figure, blockquote, pre, table, a, iframe')
    if (!hasMedia && !(el.textContent ?? '').trim()) el.remove()
  })

  const body = doc.body?.innerHTML ?? ''
  return DOMPurify.sanitize(body, {
    FORBID_TAGS: ['style', 'script', 'noscript', 'iframe', 'form', 'input', 'button', 'textarea', 'select', 'canvas'],
    FORBID_ATTR: ['style', 'class', 'id', 'onerror', 'onload', 'onclick', 'onmouseover', 'onerror'],
    ADD_ATTR: ['target', 'rel', 'loading', 'decoding', 'referrerpolicy', 'data-zoom'],
  })
}

// ---- 正文目录（TOC）抽取 ----

export interface TocHeading {
  id: string
  text: string
  level: number
}

/**
 * 从正文 HTML 抽取标题目录（h2–h6），为每个标题注入唯一 id，
 * 并返回注入 id 后的 HTML（可直接 dangerouslySetInnerHTML）。
 *
 * 用于正文阅读左侧的「目录 / 快速定位」导航：点击目录项即可平滑滚动到对应章节，
 * 滚动时高亮当前所在章节（scroll-spy）。
 *
 * 只取 h2–h6：h1 通常是文章主标题，而正文顶部已用 .reader-title 单独展示，
 * 再纳入目录会造成重复。
 */
export function buildToc(rawHtml: string): { html: string; toc: TocHeading[] } {
  if (!rawHtml || !rawHtml.trim()) return { html: rawHtml, toc: [] }
  let doc: Document
  try {
    doc = new DOMParser().parseFromString(rawHtml, 'text/html')
  } catch {
    return { html: rawHtml, toc: [] }
  }
  const heads = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const toc: TocHeading[] = []
  const seen = new Map<string, number>()
  heads.forEach((h, i) => {
    const text = (h.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!text) return
    const level = Number(h.tagName[1]) || 1
    if (level < 2) return // 跳过 h1（文章主标题）
    let base = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')
    if (!base) base = `h${i}`
    const used = seen.get(base) ?? 0
    const slug = used > 0 ? `${base}-${used}` : base
    seen.set(base, used + 1)
    const id = `toc-${slug}`
    h.setAttribute('id', id)
    toc.push({ id, text, level })
  })
  const html = doc.body?.innerHTML ?? rawHtml
  return { html, toc }
}
