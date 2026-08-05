/**
 * GitHub RSS 发现：搜罗高 star 的 RSS 订阅资源分享仓库，并解析其 README 中分享的 RSS 源。
 * 全部走 GitHub 公开 API / raw，无需 token（受未登录速率限制，足够人工浏览）。
 */

const UA = 'ReadFlow-App'
const API = 'https://api.github.com'

export interface RepoInfo {
  full_name: string
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
  default_branch: string
  owner: string
}

export interface DiscoveredFeed {
  url: string
  title: string
}

/** 预设搜索词：聚焦“分享 RSS 订阅资源”的仓库 */
export const REPO_PRESETS: Array<{ key: string; label: string; query: string }> = [
  { key: 'awesome', label: 'RSS 合集', query: 'awesome rss feed list' },
  { key: 'cn', label: '中文 RSS', query: 'RSS 订阅源 清单' },
  { key: 'all', label: 'All RSS', query: 'all rss feeds collection' },
  { key: 'topic', label: 'RSS 话题', query: 'topic:rss awesome' }
]

export async function searchRssRepos(query: string, perPage = 18): Promise<RepoInfo[]> {
  const q = encodeURIComponent(query || 'awesome rss')
  const url = `${API}/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perPage}`
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': UA },
    signal: AbortSignal.timeout(15000)
  })
  if (res.status === 403 || res.status === 429) {
    throw new Error('GitHub API 速率受限（未登录约 10 次/分钟），请稍后再试')
  }
  if (!res.ok) throw new Error(`GitHub 请求失败：${res.status}`)
  const data = await res.json() as { items?: Array<Record<string, unknown>> }
  return (data.items || []).map((it) => ({
    full_name: String(it.full_name ?? ''),
    name: String(it.name ?? ''),
    html_url: String(it.html_url ?? ''),
    description: (it.description as string | null) ?? null,
    stargazers_count: Number(it.stargazers_count ?? 0),
    language: (it.language as string | null) ?? null,
    default_branch: String(it.default_branch ?? 'main'),
    owner: String((it.owner as Record<string, unknown>)?.login ?? '')
  }))
}

const README_CANDIDATES = ['README.md', 'README.markdown', 'readme.md', 'README', 'docs/README.md']

/** 拉取仓库 README 并从中提取分享的 RSS 订阅源 */
export async function extractFeeds(fullName: string, branch: string): Promise<DiscoveredFeed[]> {
  let text: string | null = null
  for (const cand of README_CANDIDATES) {
    const u = `https://raw.githubusercontent.com/${fullName}/${branch}/${cand}`
    try {
      const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) })
      if (r.ok) {
        const t = await r.text()
        const head = t.trim().slice(0, 50).toLowerCase()
        if (!head.startsWith('<!doctype') && !head.startsWith('<html')) { text = t; break }
      }
    } catch { /* 尝试下一个候选 */ }
  }
  if (!text) return []
  return parseFeeds(text)
}

function hostOf(u: string): string {
  try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u }
}

function parseFeeds(md: string): DiscoveredFeed[] {
  // 先收集 [文本](url) 形式，用于给订阅源起可读名字
  const linkText = new Map<string, string>()
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  let lm: RegExpExecArray | null
  while ((lm = linkRe.exec(md))) {
    const txt = lm[1].trim()
    const u = lm[2].trim()
    if (!linkText.has(u) && txt && !txt.startsWith('!')) linkText.set(u, txt)
  }

  const urls = new Set<string>()
  const patterns = [
    // 以 .rss/.xml/.atom 结尾
    /https?:\/\/[^\s"'<>)\]]+\.(?:rss|xml|atom)(?:\?[^)\s"'<>]*|#[^)\s"'<>]*)*/gi,
    // 路径里含 feed/rss/atom/feedburner/feeds/
    /https?:\/\/[^\s"'<>)\]]*(?:\/feed|\/rss|\/atom|feedburner|feeds\/)[^\s"'<>)\]]*/gi
  ]
  for (const re of patterns) {
    let m: RegExpExecArray | null
    while ((m = re.exec(md))) {
      let u = m[0].replace(/[.,;:)\]]+$/, '')
      if (/github\.com|raw\.githubusercontent|gist\.github|twitter\.com|weibo\.com|zhihu\.com|x\.com|reddit\.com|\.(png|jpg|jpeg|gif|svg|css|js|md)(\?|$)/i.test(u)) continue
      urls.add(u)
    }
  }

  const out: DiscoveredFeed[] = []
  for (const u of urls) {
    if (out.length >= 80) break
    const text = linkText.get(u)
    out.push({ url: u, title: text ? text.slice(0, 60) : hostOf(u) })
  }
  return out
}
