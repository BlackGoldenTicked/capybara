/**
 * Lucide 线性图标集 —— 默认内置图标主题
 *
 * 所有图标取自 lucide-react（线性 / MIT），是 Capybara 的默认图标主题。
 * 此文件仅做 IconName → lucide 组件的静态映射，不含运行时逻辑。
 *
 * 新增图标主题时，创建类似文件，用不同的图标库（或自绘 SVG）映射同样的 IconName 即可。
 */

import {
  Inbox, Clock, Star, Archive, Library, Rss, MailOpen,
  Settings, Search, Image, LayoutGrid, FileText,
  Plus, RefreshCw, Type, Link2, Video, Paperclip, Quote,
  Minus, X, Pencil, EyeOff, Eye, Bookmark, Send, Maximize,
  Tag, Trash2, Check, ExternalLink, ChevronDown, ChevronRight,
  Upload, BookOpen, Palette, Music, Keyboard, Undo2, Info, Activity,
  List, Rows3, Podcast, Film, PanelLeftClose, PanelLeftOpen, Heart, Sparkles,
  type LucideProps
} from 'lucide-react'
import type { IconThemeMap } from './icon-themes'

// Brand icons (GitHub / X) were dropped from lucide-react; defined inline as
// filled marks so the sidebar stays recognizable. Same shape as lucide's API.
function BrandGithub({ size = 24, color = 'currentColor', className, style, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={color} className={className} style={style} aria-hidden="true" {...rest}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function BrandTwitter({ size = 24, color = 'currentColor', className, style, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={color} className={className} style={style} aria-hidden="true" {...rest}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Lucide 线性集映射（默认内置图标主题） */
export const LUCIDE_ICON_MAP: IconThemeMap = {
  rss: Rss, read: MailOpen, inbox: Inbox, later: Clock, favorite: Star, archived: Archive, all: Library,
  podcast: Podcast, video: Video,
  settings: Settings, search: Search, gallery: Image, board: LayoutGrid, writer: FileText, plus: Plus, refresh: RefreshCw,
  type: Type, link: Link2, image: Image, file: Paperclip, ref: Quote,
  minus: Minus, close: X, edit: Pencil, eyeOff: EyeOff, eye: Eye, bookmark: Bookmark, send: Send,
  tag: Tag, trash: Trash2, check: Check, external: ExternalLink, chevronDown: ChevronDown, chevronRight: ChevronRight,
  upload: Upload, book: BookOpen, github: BrandGithub, twitter: BrandTwitter,
  palette: Palette, music: Music, keyboard: Keyboard, undo: Undo2, info: Info, activity: Activity, maximize: Maximize,
  list: List, rows: Rows3, panelLeftClose: PanelLeftClose, panelLeftOpen: PanelLeftOpen,
  heart: Heart, sparkles: Sparkles
}
