/**
 * X / Twitter 推文工具（纯前端）
 *
 * 只负责两件事：
 *   1) 从任意形态的推文 URL 中提取核心标识 Tweet ID（用户名不可靠，ID 才是关键）；
 *   2) 生成指向本地 embed 宿主页（public/tweet-embed.html）的相对 URL。
 *
 * 宿主页内部再用 X 官方 widgets.js 渲染 Embedded Post，业务层不直接操作 widgets.js。
 */

/** 匹配 twitter.com / x.com（含 mobile.* 等子域）的 /status/ 或 /statuses/ 后的数字 ID。 */
const TWEET_URL_RE = /(?:twitter\.com|x\.com)\/(?:[^/]+)\/status(?:es)?\/(\d+)/i

/**
 * 从推文 URL 提取 Tweet ID。
 * 覆盖：x.com / twitter.com / mobile.twitter.com / ?s=20 / /photo/1 等形态。
 * 无法识别时返回 null（调用方据此进入错误态）。
 */
export function extractTweetId(url: string): string | null {
  if (!url) return null
  const m = url.match(TWEET_URL_RE)
  return m?.[1] ?? null
}

/** 构造 embed 宿主页 URL 所需参数。 */
export interface TweetEmbedParams {
  id: string
  theme?: 'light' | 'dark'
  hideThread?: boolean
  hideMedia?: boolean
  /** Do Not Track；默认开启（true）。仅当显式传 false 时关闭。 */
  dnt?: boolean
  lang?: string
  /** 重新加载用的自增值，拼进 query 强制 iframe 换 src 重取。 */
  nonce?: number
}

/**
 * 生成指向本地宿主页的绝对 URL。
 * 用 window.location.href 作 base，兼容 dev（http://localhost:5173/tweet-embed.html）
 * 与 prod（file://.../renderer/tweet-embed.html）两种加载方式。
 */
export function buildEmbedPageUrl(p: TweetEmbedParams): string {
  const q = new URLSearchParams({
    id: p.id,
    theme: p.theme ?? 'light',
    hideThread: p.hideThread ? '1' : '0',
    hideMedia: p.hideMedia ? '1' : '0',
    dnt: p.dnt === false ? '0' : '1',
    lang: p.lang ?? 'zh-cn',
  })
  if (p.nonce) q.set('_r', String(p.nonce))
  return new URL(`tweet-embed.html?${q.toString()}`, window.location.href).href
}
