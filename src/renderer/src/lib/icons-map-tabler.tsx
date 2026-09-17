/**
 * Tabler 图标集 —— 「硬朗线性」图标主题
 *
 * 设计语言：1.5–2px 均匀描边、方形端点、更密的 24px 网格，比 Lucide 的中性圆角更工程化。
 * 与 Lucide / Phosphor / Pixelarticons 并列为内置图标库，覆盖 icon-themes 中的全部语义名。
 *
 * Props 适配：业务层统一传 size / strokeWidth，此处映射到 Tabler 的 size / stroke。
 */

import {
  IconActivity,
  IconArchive,
  IconArrowBackUp,
  IconArrowLeft,
  IconArrowsShuffle,
  IconBook,
  IconBookmark,
  IconBrandGithub,
  IconBrandX,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClock,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileText,
  IconFolder,
  IconFrame,
  IconHeart,
  IconInbox,
  IconInfoCircle,
  IconKeyboard,
  IconLayoutAlignBottom,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
  IconLayoutDistributeHorizontal,
  IconLayoutDistributeVertical,
  IconLayoutGrid,
  IconLayoutRows,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLibrary,
  IconLink,
  IconList,
  IconMailOpened,
  IconMaximize,
  IconMicrophone,
  IconMinus,
  IconMusic,
  IconPalette,
  IconPaperclip,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconQuote,
  IconRefresh,
  IconRss,
  IconSearch,
  IconSend,
  IconSettings,
  IconSparkles,
  IconStar,
  IconTag,
  IconTrash,
  IconTypography,
  IconUpload,
  IconVideo,
  IconX
} from '@tabler/icons-react'
import { withLucideFallback, type IconComponent, type IconThemeMap } from './icon-themes'

type Props = React.ComponentProps<IconComponent>

function T(C: React.ComponentType<Record<string, unknown>>): IconComponent {
  const Wrapped = ({ size = 24, strokeWidth = 2, className, style, ...rest }: Props) => (
    <C size={size} stroke={strokeWidth} className={className} style={style} {...rest} />
  )
  Wrapped.displayName = 'TablerIcon'
  return Wrapped as IconComponent
}

/** Tabler 语义映射；未列出的语义（如无对应图形）自动回退 Lucide */
const TABLER_PARTIAL: Partial<IconThemeMap> = {
  rss: T(IconRss),
  read: T(IconMailOpened),
  inbox: T(IconInbox),
  later: T(IconClock),
  favorite: T(IconStar),
  archived: T(IconArchive),
  all: T(IconLibrary),
  podcast: T(IconMicrophone),
  video: T(IconVideo),
  settings: T(IconSettings),
  search: T(IconSearch),
  gallery: T(IconPhoto),
  board: T(IconLayoutGrid),
  writer: T(IconFileText),
  plus: T(IconPlus),
  refresh: T(IconRefresh),
  type: T(IconTypography),
  link: T(IconLink),
  image: T(IconPhoto),
  file: T(IconPaperclip),
  ref: T(IconQuote),
  minus: T(IconMinus),
  close: T(IconX),
  edit: T(IconPencil),
  eyeOff: T(IconEyeOff),
  eye: T(IconEye),
  bookmark: T(IconBookmark),
  send: T(IconSend),
  tag: T(IconTag),
  trash: T(IconTrash),
  check: T(IconCheck),
  external: T(IconExternalLink),
  chevronDown: T(IconChevronDown),
  chevronRight: T(IconChevronRight),
  upload: T(IconUpload),
  book: T(IconBook),
  github: T(IconBrandGithub),
  twitter: T(IconBrandX),
  palette: T(IconPalette),
  music: T(IconMusic),
  keyboard: T(IconKeyboard),
  undo: T(IconArrowBackUp),
  info: T(IconInfoCircle),
  activity: T(IconActivity),
  list: T(IconList),
  rows: T(IconLayoutRows),
  panelLeftClose: T(IconLayoutSidebarLeftCollapse),
  panelLeftOpen: T(IconLayoutSidebarLeftExpand),
  heart: T(IconHeart),
  sparkles: T(IconSparkles),
  alignLeft: T(IconLayoutAlignLeft),
  alignRight: T(IconLayoutAlignRight),
  alignTop: T(IconLayoutAlignTop),
  alignBottom: T(IconLayoutAlignBottom),
  distributeH: T(IconLayoutDistributeHorizontal),
  distributeV: T(IconLayoutDistributeVertical),
  star: T(IconStar),
  maximize: T(IconMaximize),
  frame: T(IconFrame),
  folder: T(IconFolder),
  shuffle: T(IconArrowsShuffle),
  arrowLeft: T(IconArrowLeft)
}

export const TABLER_ICON_MAP: IconThemeMap = withLucideFallback(TABLER_PARTIAL)
