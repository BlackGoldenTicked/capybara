import RssParser from 'rss-parser'
import type { Feed } from '../db'
import { upsertItem, markFeedFetched, storeCover, fillCoverIfEmpty } from '../db'
import { decodeHtmlEntities, htmlToSnippet } from '../lib/html'
import { extractArticle } from './readability'
import { netLog, extractError } from '../netlog'

// 抓取 RSS 自带的媒体缩略图（podcast / 新闻配图），优先级低于全文提取的 og:image
const parser = new RssParser({
  timeout: 15_000,
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail', { keepArray: true }],
      ['itunes:image', 'itunes:image']
    ]
  }
})
const MAX_EXTRACT_PER_FEED = 5 // 每个源每次最多抓 5 篇全文，避免首跑洪泛（性能优化 #6）

/** 归一化后的条目，XML(RSS/Atom) 与 JSON Feed 共用同一结构 */
interface NormEntry {
  link?: string
  guid?: string
  title?: string
  creator?: string
  content?: string
  contentSnippet?: string
  isoDate?: string
  mediaCover?: string
}

/** 从 RSS 媒体标签里取封面 URL（media:content / media:thumbnail / itunes:image） */
function rssMediaCover(entry: Record<string, unknown>): string {
  const firstAttr = (v: unknown, attr: string): string => {
    const arr = Array.isArray(v) ? (v[0] as Record<string, unknown>) : (v as Record<string, unknown>)
    return (arr?.$?.[attr] as string) ?? ''
  }
  return (
    firstAttr(entry['media:content'], 'url') ||
    firstAttr(entry['media:thumbnail'], 'url') ||
    firstAttr(entry['itunes:image'], 'href') ||
    ''
  )
}

/**
 * 统一解析入口：JSON Feed（content-type 含 json，或正文以 { 开头）走 JSON 分支，
 * 其余走 rss-parser 的 XML(RSS/Atom) 解析。两者归一为 NormEntry[]，主流程无需区分。
 */
async function parseFeed(body: string, contentType: string): Promise<{ items: NormEntry[]; title?: string }> {
  const trimmed = body.trim()
  const isJson = /json/i.test(contentType) || trimmed.startsWith('{') || trimmed.startsWith('[')
  if (isJson) {
    const jf = JSON.parse(trimmed) as Record<string, unknown>
    const items = ((jf.items as Record<string, unknown>[]) ?? []).map((it) => {
      const author = typeof it.author === 'string' ? it.author : ((it.author as Record<string, unknown>)?.name as string) ?? ''
      const content = (it.content_html as string) ?? (it.content_text as string) ?? ''
      const snippet = (it.content_text as string) ?? (it.summary as string) ?? ''
      return {
        link: (it.url as string) ?? (it.external_url as string) ?? '',
        guid: (it.id as string) ?? (it.url as string) ?? '',
        title: (it.title as string) ?? '',
        creator: author,
        content,
        contentSnippet: snippet,
        isoDate: (it.date_published as string) ?? (it.date_modified as string) ?? '',
        mediaCover: (it.image as string) ?? ''
      } satisfies NormEntry
    })
    return { items, title: jf.title as string | undefined }
  }
  const parsed = await parser.parseString(body)
  const items = (parsed.items ?? []).map((it) => {
    const e = it as Record<string, unknown>
    return {
      link: it.link,
      guid: it.guid,
      title: it.title,
      creator: it.creator,
      content: it.content,
      contentSnippet: it.contentSnippet,
      isoDate: it.isoDate,
      mediaCover: rssMediaCover(e)
    } satisfies NormEntry
  })
  return { items, title: parsed.title }
}

/** 浏览器化 UA + Accept，规避部分源对 rss-parser 默认 UA 的 403 */
const FETCH_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache'
}

export async function fetchRssFeed(feed: Feed): Promise<number> {
  // 用自带 fetch 取代 rss-parser 的内部请求，拿到完整 HTTP 状态 / 耗时 / 字节并上报诊断面板
  const start = Date.now()
  // 条件请求：带上次缓存头，源未变时服务端回 304，省去整文件下载
  const headers: Record<string, string> = { ...FETCH_HEADERS }
  if (feed.etag) headers['If-None-Match'] = feed.etag
  if (feed.last_modified) headers['If-Modified-Since'] = feed.last_modified
  let res: Response
  try {
    res = await fetch(feed.url, { headers, redirect: 'follow', signal: AbortSignal.timeout(15_000) })
  } catch (e) {
    netLog({ url: feed.url, method: 'GET', status: 0, ms: Date.now() - start, bytes: 0, ok: false, error: extractError(e, feed.url), source: 'rss' })
    throw e
  }
  const status = res.status
  netLog({ url: feed.url, method: 'GET', status, ms: Date.now() - start, bytes: 0, ok: status === 304 || res.ok, error: status === 304 ? '' : (res.ok ? '' : `HTTP ${status} ${res.statusText}`), source: 'rss' })
  // 304 Not Modified：源未变化，跳过下载与解析，直接记一次抓取
  if (status === 304) {
    markFeedFetched(feed.id, false, undefined, feed.etag, feed.last_modified)
    return 0
  }
  const xml = await res.text()
  netLog({ url: feed.url, method: 'GET', status, ms: Date.now() - start, bytes: Buffer.byteLength(xml), ok: res.ok, error: res.ok ? '' : `HTTP ${status} ${res.statusText}`, source: 'rss' })
  if (!res.ok) {
    const err = new Error(`HTTP ${status} ${res.statusText} @ ${feed.url}`) as Error & { code?: string }
    err.code = 'HTTP_' + status
    throw err
  }
  let parsed
  try {
    parsed = await parseFeed(xml, res.headers.get('content-type') ?? '')
  } catch (e) {
    // 个别源（如虎嗅）rss-parser 解析会抛 p.slice is not a function 等内部错误；
    // JSON Feed 解析失败也会走这里。捕获并记录到 last_error，让 UI 显示「无法获取数据：解析失败…」，
    // 而不是整源/进程崩
    const msg = '解析失败: ' + (e instanceof Error ? e.message : String(e))
    netLog({ url: feed.url, method: 'PARSE', status: 0, ms: Date.now() - start, bytes: Buffer.byteLength(xml), ok: false, error: msg, source: 'rss' })
    markFeedFetched(feed.id, true, msg)
    throw new Error(msg)
  }
  const { items, title: feedTitle } = parsed
  let added = 0
  let extractBudget = MAX_EXTRACT_PER_FEED
  for (const entry of items.slice(0, 40)) {
    const url = entry.link ?? entry.guid ?? ''
    if (!url) continue
    const rawContent = entry.content ?? entry.contentSnippet ?? ''
    const { id, changed } = upsertItem({
      source_type: 'rss',
      source_name: feed.name,
      url,
      title: entry.title ?? url,
      author: entry.creator ?? feedTitle ?? '',
      summary: htmlToSnippet(rawContent),
      content_text: htmlToSnippet(rawContent),
      content_html: decodeHtmlEntities(rawContent),
      published_at: entry.isoDate ?? new Date().toISOString()
    })
    if (changed && id) {
      added++
      // 仅对预算内的新条目抓全文；其余保留摘要即可
      if (extractBudget > 0) {
        extractBudget--
        void extractArticle(url).then((art) => {
          if (art) {
            const cover = art.image || entry.mediaCover || undefined
            upsertItem({
              source_type: 'rss', source_name: feed.name, url,
              title: art.title || entry.title || url, author: art.byline || entry.creator || '',
              summary: art.summary, content_text: art.text, content_html: art.html, cover_url: cover,
              published_at: entry.isoDate ?? new Date().toISOString()
            })
            if (cover) void storeCover(id, cover) // 封面本地化（修复 #8）
          } else if (entry.mediaCover) {
            // 全文提取失败，回退到 RSS 自带缩略图（仅填空，不降级已有 og 封面）
            if (fillCoverIfEmpty(id, entry.mediaCover)) void storeCover(id, entry.mediaCover)
          }
        }).catch(() => {})
      } else if (entry.mediaCover) {
        // 预算外条目不抓全文，但若有 RSS 自带缩略图，仍给它一个封面（仅填空，不降级已有 og 封面）
        if (fillCoverIfEmpty(id, entry.mediaCover)) void storeCover(id, entry.mediaCover)
      }
    }
  }
  // 回存缓存头（响应未给则保留旧值），供下次条件请求
  const respEtag = res.headers.get('etag') ?? feed.etag
  const respLm = res.headers.get('last-modified') ?? feed.last_modified
  markFeedFetched(feed.id, false, undefined, respEtag, respLm)
  return added
}
