import { upsertItem, markFeedFetched, getSetting, storeCover } from '../db'
import type { Feed } from '../db'

/**
 * 通过 GitHub REST API 同步 starred repos（需在设置中填入 personal access token）。
 * 全量分页拉取，sort=created 按 star 时间从新到旧排序，无上限。
 */
export async function fetchGithubStars(feed: Feed): Promise<number> {
  const token = getSetting('github_token')
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.star+json',
    'User-Agent': 'Capybara/0.1'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let page = 1
  let added = 0
  // 全量分页拉取，无上限
  while (true) {
    const res = await fetch(
      `https://api.github.com/user/starred?per_page=100&page=${page}&sort=created&direction=desc`,
      { headers, signal: AbortSignal.timeout(30000) }
    )
    if (!res.ok) { markFeedFetched(feed.id, true); throw new Error(`github ${res.status}`) }

    const data = await res.json() as Array<{
      starred_at?: string
      repo?: {
        full_name: string; html_url: string; description: string | null
        owner: { login: string; avatar_url: string }
        pushed_at: string
      }
    }>

    if (!data.length) break

    for (const entry of data) {
      // 兼容两种返回格式：star+json（有 repo 包装）或普通 JSON（直接是 repo）
      const r = entry.repo ?? entry as unknown as {
        full_name: string; html_url: string; description: string | null
        owner: { login: string; avatar_url: string }
        pushed_at: string
      }
      if (!r.html_url) continue

      const { id, changed } = upsertItem({
        source_type: 'github',
        source_name: 'GitHub Star',
        url: r.html_url,
        title: r.full_name,
        author: r.owner?.login ?? '',
        summary: r.description ?? '',
        content_text: r.description ?? '',
        cover_url: r.owner?.avatar_url ?? '',
        // 优先用 starred_at（用户 star 的时间），fallback 到 pushed_at
        published_at: entry.starred_at || r.pushed_at
      })
      if (changed) { added++; if (r.owner?.avatar_url) void storeCover(id, r.owner.avatar_url) }
    }

    // 不足一页说明已到末尾
    if (data.length < 100) break
    page++
  }

  markFeedFetched(feed.id, false)
  return added
}
