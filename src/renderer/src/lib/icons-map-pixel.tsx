/**
 * Pixelarticons 图标集 —— 「像素方块」图标主题
 *
 * 设计语言：严格 24×24 网格、无抗锯齿、纯色块拼合，与其余线性/实心图标集形成极端差异。
 * shapeRendering="crispEdges" 保证缩放到 16px 时像素边缘锐利、不发虚。
 *
 * Props 适配：业务层统一传 size，此处映射为 width/height（像素图无描边概念）。
 * panelLeftClose / panelLeftOpen 在像素集中无对应图形，由 withLucideFallback 回退 Lucide。
 */

import {
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalSpaceAround,
  Archive,
  ArrowLeft,
  Attachment,
  BookOpen,
  Bookmark,
  Brush,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Expand,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Frame,
  Gear,
  Heart,
  Image,
  Inbox,
  InfoBox,
  Keyboard,
  Label,
  Layout,
  Library,
  Link,
  ListBox,
  MailOpen,
  Menu,
  Minus,
  Music,
  Pencil,
  Plus,
  QuoteTextInline,
  Radio,
  Refresh,
  Rss,
  Search,
  Send,
  Shuffle,
  Sparkles,
  Star,
  TextStartA,
  Trash,
  Undo,
  Upload,
  Video,
  Waves,
  X
} from 'pixelarticons/react'
import { withLucideFallback, type IconComponent, type IconThemeMap } from './icon-themes'

type Props = React.ComponentProps<IconComponent>

function Px(C: React.ComponentType<Record<string, unknown>>): IconComponent {
  const Wrapped = ({ size = 24, className, style, ...rest }: Props) => (
    <C width={size} height={size} shapeRendering="crispEdges" className={className} style={style} {...rest} />
  )
  Wrapped.displayName = 'PixelArtIcon'
  return Wrapped as IconComponent
}

/** Pixelarticons 语义映射；未列出的语义自动回退 Lucide */
const PIXEL_PARTIAL: Partial<IconThemeMap> = {
  rss: Px(Rss),
  read: Px(MailOpen),
  inbox: Px(Inbox),
  later: Px(Clock),
  favorite: Px(Star),
  archived: Px(Archive),
  all: Px(Library),
  podcast: Px(Radio),
  video: Px(Video),
  settings: Px(Gear),
  search: Px(Search),
  gallery: Px(Image),
  board: Px(Layout),
  writer: Px(FileText),
  plus: Px(Plus),
  refresh: Px(Refresh),
  type: Px(TextStartA),
  link: Px(Link),
  image: Px(Image),
  file: Px(Attachment),
  ref: Px(QuoteTextInline),
  minus: Px(Minus),
  close: Px(X),
  edit: Px(Pencil),
  eyeOff: Px(EyeOff),
  eye: Px(Eye),
  bookmark: Px(Bookmark),
  send: Px(Send),
  tag: Px(Label),
  trash: Px(Trash),
  check: Px(Check),
  external: Px(ExternalLink),
  chevronDown: Px(ChevronDown),
  chevronRight: Px(ChevronRight),
  upload: Px(Upload),
  book: Px(BookOpen),
  palette: Px(Brush),
  music: Px(Music),
  keyboard: Px(Keyboard),
  undo: Px(Undo),
  info: Px(InfoBox),
  activity: Px(Waves),
  list: Px(Menu),
  rows: Px(ListBox),
  heart: Px(Heart),
  sparkles: Px(Sparkles),
  alignLeft: Px(AlignStartVertical),
  alignRight: Px(AlignEndVertical),
  alignTop: Px(AlignStartHorizontal),
  alignBottom: Px(AlignEndHorizontal),
  distributeH: Px(AlignHorizontalSpaceAround),
  distributeV: Px(AlignVerticalSpaceAround),
  star: Px(Star),
  maximize: Px(Expand),
  frame: Px(Frame),
  folder: Px(Folder),
  shuffle: Px(Shuffle),
  arrowLeft: Px(ArrowLeft)
}

export const PIXEL_ICON_MAP: IconThemeMap = withLucideFallback(PIXEL_PARTIAL)
