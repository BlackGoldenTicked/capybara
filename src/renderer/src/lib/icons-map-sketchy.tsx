/**
 * Sketchy 手绘图标集 —— 「Sketchy 手绘」图标主题
 *
 * 设计语言：Lucide 几何轮廓派生的手绘风，线条略带抖动感，俏皮松弛。
 * 来源：@sketchyicons/react 0.5.0（PascalCase 导出 1,756 个，命名与 Lucide 完全一致，MIT）。
 * 覆盖：60/62 语义名；github / twitter 在 Sketchy 中无对应品牌图形，由 withLucideFallback 回退 Lucide。
 *
 * Props 适配：见 icons-adapters 的 sketchyIcon（size 透传 + absoluteStrokeWidth 近似 strokeWidth）。
 */

import {
  Rss, Inbox, Clock, Star, Archive, Library,
  Podcast, Video, Settings, Search, Image, LayoutGrid, FileText,
  Plus, RefreshCw, Type, Link2, Paperclip, Quote,
  Minus, X, Pencil, EyeOff, Eye, Bookmark, Send, Maximize,
  Tag, Trash2, Check, ExternalLink, ChevronDown, ChevronRight,
  Upload, BookOpen, Palette, Music, Keyboard, Undo2, Info, Activity,
  List, Rows3, PanelLeftClose, PanelLeftOpen, Heart, Sparkles,
  AlignStartVertical, AlignEndVertical, AlignStartHorizontal, AlignEndHorizontal, AlignHorizontalSpaceAround, AlignVerticalSpaceAround,
  Star as Star2, Frame, Folder, Shuffle, ArrowLeft
} from '@sketchyicons/react'
import { sketchyIcon } from './icons-adapters'
import { withLucideFallback, type IconThemeMap } from './icon-themes'

const PARTIAL: Partial<IconThemeMap> = {
  rss: sketchyIcon(Rss),
  inbox: sketchyIcon(Inbox),
  later: sketchyIcon(Clock),
  favorite: sketchyIcon(Star),
  archived: sketchyIcon(Archive),
  all: sketchyIcon(Library),
  podcast: sketchyIcon(Podcast),
  video: sketchyIcon(Video),
  settings: sketchyIcon(Settings),
  search: sketchyIcon(Search),
  gallery: sketchyIcon(Image),
  board: sketchyIcon(LayoutGrid),
  writer: sketchyIcon(FileText),
  plus: sketchyIcon(Plus),
  refresh: sketchyIcon(RefreshCw),
  type: sketchyIcon(Type),
  link: sketchyIcon(Link2),
  file: sketchyIcon(Paperclip),
  ref: sketchyIcon(Quote),
  minus: sketchyIcon(Minus),
  close: sketchyIcon(X),
  edit: sketchyIcon(Pencil),
  eyeOff: sketchyIcon(EyeOff),
  eye: sketchyIcon(Eye),
  bookmark: sketchyIcon(Bookmark),
  send: sketchyIcon(Send),
  tag: sketchyIcon(Tag),
  trash: sketchyIcon(Trash2),
  check: sketchyIcon(Check),
  external: sketchyIcon(ExternalLink),
  chevronDown: sketchyIcon(ChevronDown),
  chevronRight: sketchyIcon(ChevronRight),
  upload: sketchyIcon(Upload),
  book: sketchyIcon(BookOpen),
  palette: sketchyIcon(Palette),
  music: sketchyIcon(Music),
  keyboard: sketchyIcon(Keyboard),
  undo: sketchyIcon(Undo2),
  info: sketchyIcon(Info),
  activity: sketchyIcon(Activity),
  list: sketchyIcon(List),
  rows: sketchyIcon(Rows3),
  panelLeftClose: sketchyIcon(PanelLeftClose),
  panelLeftOpen: sketchyIcon(PanelLeftOpen),
  heart: sketchyIcon(Heart),
  sparkles: sketchyIcon(Sparkles),
  alignLeft: sketchyIcon(AlignStartVertical),
  alignRight: sketchyIcon(AlignEndVertical),
  alignTop: sketchyIcon(AlignStartHorizontal),
  alignBottom: sketchyIcon(AlignEndHorizontal),
  distributeH: sketchyIcon(AlignHorizontalSpaceAround),
  distributeV: sketchyIcon(AlignVerticalSpaceAround),
  star: sketchyIcon(Star2),
  maximize: sketchyIcon(Maximize),
  frame: sketchyIcon(Frame),
  folder: sketchyIcon(Folder),
  shuffle: sketchyIcon(Shuffle),
  arrowLeft: sketchyIcon(ArrowLeft)
}

export const SKETCHY_ICON_MAP: IconThemeMap = withLucideFallback(PARTIAL)
