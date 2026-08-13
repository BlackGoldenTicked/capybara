/**
 * 视频站 embed 地址提取：把条目 link（网页地址）转成可直接 iframe 嵌入的播放地址。
 * 无法识别的站点返回空串，由上层降级为「用系统浏览器打开」。
 */

/** 从链接提取 YouTube / Bilibili 的 embed 地址；其它站点或直链视频返回空串 */
export function extractEmbedUrl(link: string): string {
  if (!link) return ''
  // YouTube：watch?v= / shorts/ / embed/ / youtu.be/
  const yt = link.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  // Bilibili：video/BVxxx 或 video/av123
  const bili = link.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+|av\d+)/)
  if (bili) return `https://player.bilibili.com/player.html?${bili[1].startsWith('BV') ? 'bvid' : 'aid'}=${bili[1]}&autoplay=0&danmaku=0`
  return ''
}

/** 判断 enclosure 的 MIME 类型是否属于音频 */
export function isAudioMime(mime?: string): boolean {
  return !!mime && /^audio\//.test(mime)
}

/** 判断 enclosure 的 MIME 类型是否属于视频 */
export function isVideoMime(mime?: string): boolean {
  return !!mime && /^video\//.test(mime)
}

/** 解析 itunes:duration（"HH:MM:SS" / "MM:SS" / 纯秒）为秒数；失败返回 0 */
export function parseDuration(d: string | undefined): number {
  if (!d) return 0
  const parts = d.trim().split(':').map((s) => Number(s))
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 1) return Math.round(parts[0])
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}
