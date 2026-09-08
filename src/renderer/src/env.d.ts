export type MediaKind = 'article' | 'podcast' | 'video'

export interface Item {
  id: number
  source_type: 'rss' | 'x' | 'wechat' | 'tophub' | 'github' | 'x_bookmark' | 'manual'
  source_name: string
  url: string
  title: string
  author: string
  summary: string
  content_text: string
  content_html: string
  cover_path: string
  status: 'inbox' | 'later' | 'favorite' | 'archived'
  is_read: number
  published_at: string
  fetched_at: string
  kind: MediaKind
  media_url: string
  media_type: '' | 'audio' | 'video'
  duration: number
  transcript: string
}

/** 列表投影行：列表/卡片只用到这些列（不含 content_text / content_html，按需通过 items:get 取详情） */
export interface ItemRow {
  id: number
  source_type: 'rss' | 'x' | 'wechat' | 'tophub' | 'github' | 'x_bookmark' | 'manual'
  source_name: string
  url: string
  title: string
  author: string
  summary: string
  cover_url: string
  cover_path: string
  status: 'inbox' | 'later' | 'favorite' | 'archived'
  is_read: number
  published_at: string
  fetched_at: string
  kind: MediaKind
  media_url: string
  media_type: '' | 'audio' | 'video'
  duration: number
}

export type View = 'rss' | 'podcast' | 'video' | 'later' | 'favorite' | 'archived' | 'all'
export type Screen = 'library' | 'board'

export interface Feed { id: number; type: string; name: string; url: string; schedule_min: number; last_fetched_at: string; error_count: number; last_error: string; enabled: number; etag: string; last_modified: string; kind: MediaKind }
export interface Board { id: number; name: string; updated_at: string }

/** 信源发现：角色（用户特点筛选维度，feeds 工作空间迁移） */
export interface DiscoverRole { id: number; name: string; domain: string; description: string }
/** 信源发现：候选源（feeds 工作空间迁移的 2242 条库） */
export interface DiscoverFeed {
  id: number
  title: string
  xml_url: string
  html_url: string
  source_type: string
  tier: string
  stars: number
  tags: string[]
  language: string
  description: string
  subscribed: number
}

/** 白板卡片：独立持久化，按 board_id 归属。kind 决定内容与可承载的附件类型。 */
export type CardKind = 'ref' | 'text' | 'link' | 'image' | 'file' | 'video'
export interface Card {
  id: number
  board_id: number
  kind: CardKind
  item_id: number | null
  x: number; y: number; w: number; h: number
  title: string; body: string; payload: string
  created_at: string
}
export interface CardPayload {
  file?: string   // 本地附件在 board-assets 内的文件名（board-asset://file 访问）
  name?: string   // 原始文件名
  size?: number
  mime?: string
  url?: string    // 链接 / 远程图片视频地址
  note?: string
  localPath?: string  // 视频/大文件的本地绝对路径（local-path:// 引用，不拷贝）
  // 链接卡片富预览（OG meta 抓取）
  previewTitle?: string
  previewDesc?: string
  previewImage?: string
  previewSite?: string
}

/** 白板卡片之间的连线关系 */
export interface BoardLink { id: number; board_id: number; from_id: number; to_id: number; label: string }

/** 网络诊断日志条目（开发者模式面板用） */
export interface NetLogEntry {
  time: number
  url: string
  method?: string
  status: number
  ms: number
  bytes: number
  ok: boolean
  error: string
  source?: string
}

interface CapybaraBridge {
  invoke(channel: string, ...args: unknown[]): Promise<unknown>
  onSourcesUpdated(cb: () => void): void
  onGithubProgress(cb: (progress: { fetched: number; page: number }) => void): void
  onNetLog(cb: (entry: NetLogEntry) => void): void
  getPathForFile(file: File): string
}

declare global {
  interface Window { capybara: CapybaraBridge }
}
