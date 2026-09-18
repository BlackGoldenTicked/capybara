/**
 * Scribbles 墨迹图标集（regular）—— 「Scribbles 墨迹」图标主题
 *
 * 设计语言：Lucide 重绘为可变宽墨迹，笔画末端与拐角处略粗，像手绘墨迹；
 * 默认取 regular 权重（最接近界面 2px 线性视觉），bold / fill 可通过改适配器参数获得。
 * 来源：scribbles-icons 1.0.1（PascalCase 导出 1,744 × 3 权重，ISC）。
 * 覆盖：60/62 语义名；github / twitter 在 Scribbles 中无对应品牌图形，由 withLucideFallback 回退 Lucide。
 *
 * Props 适配：见 icons-adapters 的 scribblesIcon（size 透传，weight 默认 'regular'）。
 */

import {
  Rss, Inbox, Clock, Star, Archive, Library,
  Podcast, Video, Settings, Search, Image, LayoutGrid, FileText,
  Plus, RefreshCw, Type, Link2, Paperclip, Quote,
  Minus, X, Pencil, EyeOff, Eye, Bookmark, Send, Maximize,
  Tag, Trash2, Check, ExternalLink, ChevronDown, ChevronRight,
  Upload, BookOpen, Palette, Music, Keyboard, Undo2, Info, Activity,
  List, Rows3, PanelLeftClose, PanelLeftOpen, Heart, Sparkles,
  AlignEndHorizontal, AlignStartHorizontal, AlignEndVertical, AlignStartVertical,
  AlignHorizontalSpaceAround, AlignVerticalSpaceAround,
  Frame, Folder, Shuffle, ArrowLeft
} from 'scribbles-icons'
import { scribblesIcon } from './icons-adapters'
import { withLucideFallback, type IconThemeMap } from './icon-themes'

const PARTIAL: Partial<IconThemeMap> = {
  rss: scribblesIcon(Rss),
  inbox: scribblesIcon(Inbox),
  later: scribblesIcon(Clock),
  favorite: scribblesIcon(Star),
  archived: scribblesIcon(Archive),
  all: scribblesIcon(Library),
  podcast: scribblesIcon(Podcast),
  video: scribblesIcon(Video),
  settings: scribblesIcon(Settings),
  search: scribblesIcon(Search),
  gallery: scribblesIcon(Image),
  board: scribblesIcon(LayoutGrid),
  writer: scribblesIcon(FileText),
  plus: scribblesIcon(Plus),
  refresh: scribblesIcon(RefreshCw),
  type: scribblesIcon(Type),
  link: scribblesIcon(Link2),
  file: scribblesIcon(Paperclip),
  ref: scribblesIcon(Quote),
  minus: scribblesIcon(Minus),
  close: scribblesIcon(X),
  edit: scribblesIcon(Pencil),
  eyeOff: scribblesIcon(EyeOff),
  eye: scribblesIcon(Eye),
  bookmark: scribblesIcon(Bookmark),
  send: scribblesIcon(Send),
  tag: scribblesIcon(Tag),
  trash: scribblesIcon(Trash2),
  check: scribblesIcon(Check),
  external: scribblesIcon(ExternalLink),
  chevronDown: scribblesIcon(ChevronDown),
  chevronRight: scribblesIcon(ChevronRight),
  upload: scribblesIcon(Upload),
  book: scribblesIcon(BookOpen),
  palette: scribblesIcon(Palette),
  music: scribblesIcon(Music),
  keyboard: scribblesIcon(Keyboard),
  undo: scribblesIcon(Undo2),
  info: scribblesIcon(Info),
  activity: scribblesIcon(Activity),
  list: scribblesIcon(List),
  rows: scribblesIcon(Rows3),
  panelLeftClose: scribblesIcon(PanelLeftClose),
  panelLeftOpen: scribblesIcon(PanelLeftOpen),
  heart: scribblesIcon(Heart),
  sparkles: scribblesIcon(Sparkles),
  alignLeft: scribblesIcon(AlignStartVertical),
  alignRight: scribblesIcon(AlignEndVertical),
  alignTop: scribblesIcon(AlignStartHorizontal),
  alignBottom: scribblesIcon(AlignEndHorizontal),
  distributeH: scribblesIcon(AlignHorizontalSpaceAround),
  distributeV: scribblesIcon(AlignVerticalSpaceAround),
  star: scribblesIcon(Star),
  maximize: scribblesIcon(Maximize),
  frame: scribblesIcon(Frame),
  folder: scribblesIcon(Folder),
  shuffle: scribblesIcon(Shuffle),
  arrowLeft: scribblesIcon(ArrowLeft)
}

export const SCRIBBLES_ICON_MAP: IconThemeMap = withLucideFallback(PARTIAL)
