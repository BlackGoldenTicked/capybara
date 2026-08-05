import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'

export interface Extracted { title: string; html: string; text: string; summary: string; byline: string; image: string }

/** 抓取并提取正文（阅读模式）。失败时返回 null，由调用方降级。 */
export async function extractArticle(url: string): Promise<Extracted | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12_000)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'ReadFlow/0.1 (+https://readflow.app)' } })
    if (!res.ok) return null
    const ctype = res.headers.get('content-type') ?? ''
    if (!/text\/html|application\/xhtml/i.test(ctype)) return null
    const html = await res.text()
    const { document } = parseHTML(html)
    // 移除脚本/样式，避免污染正文
    document.querySelectorAll('script, style, noscript').forEach((n) => n.remove())
    const reader = new Readability(document as unknown as Document)
    const article = reader.parse()
    if (!article?.content) return null
    const text = (article.textContent ?? '').trim().slice(0, 50_000)
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? ''
    let image = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)
      || pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i)
    // 兜底：取正文里第一张图，让图片板不至于全空
    if (!image) image = (article.content ?? '').match(/<img[^>]+src=["']([^"']+)/i)?.[1]?.trim() ?? ''
    // 把相对地址补成绝对地址
    if (image && !/^https?:\/\//i.test(image)) {
      try { image = new URL(image, url).href } catch { /* 忽略非法 */ }
    }
    return {
      title: article.title ?? '',
      html: article.content ?? '',
      text,
      summary: (article.excerpt ?? text.slice(0, 200)).slice(0, 300),
      byline: article.byline ?? '',
      image
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
