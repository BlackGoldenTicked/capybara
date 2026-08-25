import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'

export interface Extracted { title: string; html: string; text: string; summary: string; byline: string; image: string }

// ---- 全局提取队列（并发控制 + URL 缓存 + 同 URL 请求合并） ----

const MAX_CONCURRENT_EXTRACT = 3       // 全局最多同时提取 3 篇
const EXTRACTION_CACHE_TTL = 10 * 60 * 1000 // 10 分钟缓存
const EXTRACTION_CACHE_MAX = 200        // 最多缓存 200 条

interface CacheEntry { data: Extracted; ts: number }

class ExtractionQueue {
  private running = 0
  private cache = new Map<string, CacheEntry>()
  private pending = new Map<string, Promise<Extracted | null>>()

  /** 从缓存获取（自动清理过期条目） */
  private getFromCache(url: string): Extracted | null {
    const entry = this.cache.get(url)
    if (!entry) return null
    if (Date.now() - entry.ts > EXTRACTION_CACHE_TTL) { this.cache.delete(url); return null }
    return entry.data
  }

  private setCache(url: string, data: Extracted) {
    this.cache.set(url, { data, ts: Date.now() })
    // 清理超量缓存（FIFO）
    if (this.cache.size > EXTRACTION_CACHE_MAX) {
      const first = this.cache.keys().next().value
      if (first) this.cache.delete(first)
    }
  }

  async enqueue(url: string): Promise<Extracted | null> {
    // 1) 命中缓存
    const cached = this.getFromCache(url)
    if (cached) return cached

    // 2) 已有进行中的提取，共享同一 Promise（同 URL 请求合并）
    const existing = this.pending.get(url)
    if (existing) return existing

    // 3) 等待并发槽位
    const promise = new Promise<Extracted | null>((resolve) => {
      const wait = () => {
        if (this.running < MAX_CONCURRENT_EXTRACT) {
          this.running++
          void this.doExtract(url).then((r) => {
            this.running--
            if (this.running < MAX_CONCURRENT_EXTRACT && this.waiters.length > 0) {
              this.waiters.shift()!()
            }
            resolve(r)
          })
        } else {
          this.waiters.push(wait)
        }
      }
      wait()
    })

    this.pending.set(url, promise)
    promise.finally(() => this.pending.delete(url))
    return promise
  }

  private waiters: Array<() => void> = []

  private async doExtract(url: string): Promise<Extracted | null> {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 12_000)
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Capybara/0.1 (+https://capybara.app)' } })
      if (!res.ok) return null
      const ctype = res.headers.get('content-type') ?? ''
      if (!/text\/html|application\/xhtml/i.test(ctype)) return null
      const html = await res.text()
      const { document } = parseHTML(html)
      document.querySelectorAll('script, style, noscript').forEach((n) => n.remove())
      const reader = new Readability(document as unknown as Document)
      const article = reader.parse()
      if (!article?.content) return null
      const text = (article.textContent ?? '').trim().slice(0, 50_000)
      const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? ''
      let image = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)
        || pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i)
      if (!image) image = (article.content ?? '').match(/<img[^>]+src=["']([^"']+)/i)?.[1]?.trim() ?? ''
      if (image && !/^https?:\/\//i.test(image)) {
        try { image = new URL(image, url).href } catch { /* ignore */ }
      }
      const result: Extracted = {
        title: article.title ?? '',
        html: article.content ?? '',
        text,
        summary: (article.excerpt ?? text.slice(0, 200)).slice(0, 300),
        byline: article.byline ?? '',
        image
      }
      this.setCache(url, result)
      return result
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }
}

const extractionQueue = new ExtractionQueue()

/** 抓取并提取正文（阅读模式）。通过全局队列控制并发、去重缓存、合并同 URL 请求。
 *  失败时返回 null，由调用方降级。 */
export function extractArticle(url: string): Promise<Extracted | null> {
  return extractionQueue.enqueue(url)
}
