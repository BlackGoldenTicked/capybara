import * as cheerio from 'cheerio'
import { upsertItem, markFeedFetched } from '../db'
import type { Feed } from '../db'

/** 抓取 tophub.today 首页多个榜单，聚合成条目。 */
export async function fetchTopHub(feed: Feed): Promise<number> {
  const res = await fetch('https://tophub.today/', { headers: { 'User-Agent': 'ReadFlow/0.1' } })
  const $ = cheerio.load(await res.text())
  let added = 0
  $('.cc-cd').slice(0, 6).each((_, card) => {
    const boardName = $(card).find('.cc-cd-lb').text().trim() || '热榜'
    $(card).find('.tcm a').slice(0, 8).each((_, a) => {
      const el = $(a)
      const title = el.text().trim()
      let href = el.attr('href') ?? ''
      if (href.startsWith('//')) href = 'https:' + href
      if (!href || !title) return
      const { changed } = upsertItem({
        source_type: 'tophub',
        source_name: `热榜 · ${boardName}`,
        url: href,
        title,
        summary: `${boardName} 热榜条目 · tophub.today 聚合`,
        published_at: new Date().toISOString()
      })
      if (changed) added++
    })
  })
  markFeedFetched(feed.id, false)
  return added
}
