import { dueFeeds, listFeeds, enforceRetention, markFeedFetched } from '../db'
import { fetchRssFeed } from './rss'
import { fetchTopHub } from './tophub'
import { fetchGithubStars } from './github'
import { extractError } from '../netlog'

let timer: NodeJS.Timeout | null = null
let running = false

const CONCURRENCY = 4 // 并发抓取源数，避免首跑洪泛（性能优化 #6）
const RETENTION_MAX = 8000

/** 并发池：同一时刻最多 limit 个任务在跑 */
async function pool<T>(items: T[], limit: number, fn: (t: T) => Promise<void>) {
  let i = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const cur = items[i++]
      try { await fn(cur) } catch (e) { console.warn('[scheduler] task failed:', (e as Error).message) }
    }
  })
  await Promise.all(workers)
}

export function startScheduler(onDone?: () => void) {
  // 每 60 秒检查到期源
  timer = setInterval(() => { void runDue(onDone) }, 60_000)
  // 启动后 8 秒跑首轮，避免与窗口加载抢资源
  setTimeout(() => { void runDue(onDone) }, 8_000)
}

export async function runDue(onDone?: () => void) {
  if (running) return
  running = true
  try {
    const feeds = dueFeeds()
    await pool(feeds, CONCURRENCY, async (feed) => {
      try {
        switch (feed.type) {
          case 'rss': await fetchRssFeed(feed); break
          case 'tophub': await fetchTopHub(feed); break
          case 'github': await fetchGithubStars(feed); break
        }
      } catch (err) {
        const msg = extractError(err, feed.url)
        console.warn(`[scheduler] ${feed.type} ${feed.name} 失败:`, msg)
        // 抓取失败计入 error_count 并保留真实原因，供 UI 提示「无法获取数据：<原因>」
        markFeedFetched(feed.id, true, msg)
      }
    })
  } finally {
    running = false
    // 抓取后顺手做一次数据保留，控制体积（修复 #11）
    try { enforceRetention(RETENTION_MAX) } catch { /* */ }
    onDone?.()
  }
}

/** 强制刷新全部已启用订阅源（忽略到期判断），供「全部刷新」按钮使用。 */
export async function refreshAllFeeds(onDone?: () => void) {
  if (running) return
  running = true
  try {
    const feeds = listFeeds().filter((f) => f.enabled !== 0)
    await pool(feeds, CONCURRENCY, async (feed) => {
      try {
        switch (feed.type) {
          case 'rss': await fetchRssFeed(feed); break
          case 'tophub': await fetchTopHub(feed); break
          case 'github': await fetchGithubStars(feed); break
        }
      } catch (err) {
        const msg = extractError(err, feed.url)
        console.warn(`[refreshAllFeeds] ${feed.type} ${feed.name} 失败:`, msg)
        markFeedFetched(feed.id, true, msg)
      }
    })
  } finally {
    running = false
    try { enforceRetention(RETENTION_MAX) } catch { /* */ }
    onDone?.()
  }
}

export async function refreshFeed(id: number): Promise<number> {
  const feed = listFeeds().find((f) => f.id === id)
  if (!feed) return 0
  try {
    switch (feed.type) {
      case 'rss': return await fetchRssFeed(feed)
      case 'tophub': return await fetchTopHub(feed)
      case 'github': return await fetchGithubStars(feed)
    }
    return 0
  } catch (err) {
    const msg = extractError(err, feed.url)
    console.warn(`[refreshFeed] ${feed.type} ${feed.name} 失败:`, msg)
    // 抓取失败计入 error_count 并保留真实原因，返回 -1 让渲染层提示「无法获取数据：<原因>」
    markFeedFetched(feed.id, true, msg)
    return -1
  }
}

export function stopScheduler() {
  if (timer) { clearInterval(timer); timer = null }
}
