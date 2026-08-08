/**
 * Web Worker: 在独立线程中清洗正文 HTML，避免长文章卡顿渲染线程。
 */

// 清洗逻辑与 reader.ts 中的 renderArticleHtml 保持同步
const LAZY_SRC_ATTRS = ['data-src', 'data-original', 'data-lazy-src', 'data-true-src', 'data-srcset', 'data-lazy-srcset']
const PLACEHOLDER_RE = /^(data:image\/(gif|png|svg\+xml);base64,)/i

function isPlaceholder(src: string | null): boolean {
  if (!src) return true
  return PLACEHOLDER_RE.test(src) || src.trim() === ''
}

self.onmessage = (e: MessageEvent<{ html: string }>) => {
  const { html } = e.data
  if (!html || !html.trim()) {
    self.postMessage('')
    return
  }

  let doc: Document
  try {
    doc = new DOMParser().parseFromString(html, 'text/html')
  } catch {
    self.postMessage(html)
    return
  }

  // 1) 剥离所有内联 style / class / data-*
  doc.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style')
    el.removeAttribute('class')
    Array.from(el.attributes).forEach((attr) => {
      const n = attr.name.toLowerCase()
      if (n.startsWith('data-') && n !== 'data-zoom') el.removeAttribute(attr.name)
    })
  })

  // 2) 图片：懒加载回填 + 属性清理
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

  // 3) 链接：安全属性
  doc.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('rel', 'noopener noreferrer')
    a.setAttribute('target', '_blank')
  })

  // 4) iframe：移除并替换为可点击链接
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

  // 5) 删除空段落 / 空白容器
  doc.querySelectorAll('p, div, section, article, span').forEach((el) => {
    const hasMedia = el.querySelector('img, video, picture, figure, blockquote, pre, table, a, iframe')
    if (!hasMedia && !(el.textContent ?? '').trim()) el.remove()
  })

  // 返回 body 内 HTML
  self.postMessage(doc.body?.innerHTML ?? '')
}
