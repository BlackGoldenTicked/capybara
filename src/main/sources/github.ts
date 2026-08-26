import { upsertItem, markFeedFetched, getSetting, storeCover } from '../db'
import { getGithubToken } from './github-auth'
import type { Feed } from '../db'

/** GitHub starred API 单条返回（star+json preview 时 repo 包装 + starred_at） */
interface StarEntry {
  starred_at?: string
  repo?: RawRepo
}

interface RawRepo {
  html_url?: string
  full_name?: string
  description?: string | null
  owner?: { login?: string; avatar_url?: string }
  pushed_at?: string
  created_at?: string
  // 以下为丰富元数据（任务 #2）
  language?: string | null
  stargazers_count?: number
  forks_count?: number
  topics?: string[]
  homepage?: string | null
  archived?: boolean
}

/** 统一的 GitHub API 请求头 */
export function githubHeaders(token: string, accept = 'application/vnd.github.star+json'): Record<string, string> {
  const h: Record<string, string> = {
    Accept: accept,
    'User-Agent': 'Capybara',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

/** 用 Link header 权威判断是否还有下一页（末页响应不携带 rel="next"） */
export function hasNextPage(link: string | null): boolean {
  return Boolean(link?.split(',').some((part) => /rel="next"/.test(part)))
}

/** 数字紧凑化：1234 → 1.2k */
function fmtCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

/** 把仓库元数据（语言/star 数/fork 数/topics/归档）拼进摘要，卡片即可展示 */
export function formatRepoSummary(r: RawRepo): string {
  const parts: string[] = []
  if (r.archived) parts.push('📦 已归档')
  if (r.language) parts.push(r.language)
  if (r.stargazers_count) parts.push(`★ ${fmtCount(r.stargazers_count)}`)
  if (r.forks_count) parts.push(`fork ${fmtCount(r.forks_count)}`)
  const topics = (r.topics ?? []).slice(0, 6).map((t) => `#${t}`).join(' ')
  const meta = [parts.join(' · '), topics].filter(Boolean).join(' · ')
  const desc = (r.description ?? '').trim()
  return meta && desc ? `${meta}\n${desc}` : (meta || desc)
}

/** star 条目归一化：兼容 star+json（repo 包装）与普通 JSON（直接是 repo）两种返回 */
function normalizeEntry(entry: StarEntry): { repo: RawRepo; starredAt?: string } | null {
  const r = entry.repo ?? (entry as unknown as RawRepo)
  if (!r || !r.html_url) return null
  return { repo: r, starredAt: entry.starred_at }
}

/** 单条 star 写库 */
function writeStar(entry: { repo: RawRepo; starredAt?: string }, sourceName: string): boolean {
  const r = entry.repo
  const { id, changed } = upsertItem({
    source_type: 'github',
    source_name: sourceName,
    url: r.html_url!,
    title: r.full_name ?? r.html_url!,
    author: r.owner?.login ?? '',
    summary: formatRepoSummary(r),
    content_text: r.description ?? '',
    cover_url: r.owner?.avatar_url ?? '',
    // 优先用 starred_at（用户 star 的时间），fallback 到 pushed_at/created_at
    published_at: entry.starredAt || r.pushed_at || r.created_at || new Date().toISOString()
  })
  if (changed && r.owner?.avatar_url) void storeCover(id, r.owner.avatar_url)
  return changed
}

/**
 * 调度器入口：通过 GitHub REST API 同步当前登录用户的 starred repos（需 Token）。
 * 全量分页拉取（Link header 判断末页），sort=created 按 star 时间从新到旧，无上限。
 */
export async function fetchGithubStars(feed: Feed): Promise<number> {
  const token = getGithubToken()
  let page = 1
  let added = 0
  while (true) {
    const res = await fetch(
      `https://api.github.com/user/starred?per_page=100&page=${page}&sort=created&direction=desc`,
      { headers: githubHeaders(token), signal: AbortSignal.timeout(60000) }
    )
    if (!res.ok) { markFeedFetched(feed.id, true); throw new Error(`github ${res.status}`) }

    const data = await res.json() as StarEntry[]
    if (!data.length) break

    for (const raw of data) {
      const entry = normalizeEntry(raw)
      if (entry) { if (writeStar(entry, 'GitHub Star')) added++ }
    }

    if (!hasNextPage(res.headers.get('link'))) break
    await new Promise((r) => setTimeout(r, 500))
    page++
  }

  markFeedFetched(feed.id, false)
  return added
}

/**
 * IPC 入口：按用户名拉取 starred 仓库（无 Token 也可用公开 API，速率 60 次/小时）。
 * 返回 { added, total }。onProgress 回调在每拉完一页时触发，供 UI 实时显示进度。
 */
export async function fetchStarsByUsername(
  username: string,
  onProgress?: (fetched: number, page: number) => void
): Promise<{ added: number; total: number }> {
  const token = getGithubToken()
  let page = 1
  let added = 0
  const seen = new Set<string>()
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=100&page=${page}&sort=created&direction=desc`
    const res = await fetch(url, { headers: githubHeaders(token), signal: AbortSignal.timeout(60000) })
    if (res.status === 403) throw new Error('GitHub API 速率超限（60 次/小时），可在系统配置填入 Token 提升额度')
    if (res.status === 429) {
      const retry = res.headers.get('retry-after')
      throw new Error(`GitHub API 速率超限（429），${retry ? `请等待 ${retry} 秒后重试` : '请稍后重试'}`)
    }
    if (!res.ok) throw new Error('GitHub API 错误 ' + res.status)

    const data = await res.json() as StarEntry[]
    if (!data.length) break

    for (const raw of data) {
      const entry = normalizeEntry(raw)
      if (!entry || !entry.repo.html_url) continue
      if (seen.has(entry.repo.html_url)) continue
      seen.add(entry.repo.html_url)
      if (writeStar(entry, 'GitHub ★')) added++
    }
    // 页间暂停：避免连续请求触发 GitHub 限流，给 storeCover 并发下载留出网络带宽
    await new Promise((r) => setTimeout(r, 500))

    // 每拉完一页通知前端进度
    onProgress?.(seen.size, page)

    if (!hasNextPage(res.headers.get('link'))) break
    page++
  }
  return { added, total: seen.size }
}
