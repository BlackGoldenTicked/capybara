import { upsertItem, markFeedFetched, getSetting, storeCover } from '../db'
import type { Feed } from '../db'

/** 通过 GitHub REST API 同步 starred repos（需在设置中填入 personal access token）。 */
export async function fetchGithubStars(feed: Feed): Promise<number> {
  const token = getSetting('github_token')
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Capybara/0.1'
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch('https://api.github.com/user/starred?per_page=100', { headers })
  if (!res.ok) { markFeedFetched(feed.id, true); throw new Error(`github ${res.status}`) }
  const repos = await res.json() as Array<{
    full_name: string; html_url: string; description: string | null; owner: { login: string; avatar_url: string }
    pushed_at: string
  }>
  let added = 0
  for (const r of repos) {
    const { id, changed } = upsertItem({
      source_type: 'github',
      source_name: 'GitHub Star',
      url: r.html_url,
      title: r.full_name,
      author: r.owner?.login ?? '',
      summary: r.description ?? '',
      content_text: r.description ?? '',
      cover_url: r.owner?.avatar_url ?? '',
      published_at: r.pushed_at
    })
    if (changed) { added++; if (r.owner?.avatar_url) void storeCover(id, r.owner.avatar_url) }
  }
  markFeedFetched(feed.id, false)
  return added
}
