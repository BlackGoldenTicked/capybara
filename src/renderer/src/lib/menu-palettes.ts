/**
 * 菜单配色方案 —— 侧边栏 + 设置页菜单图标的多彩着色预设
 *
 * 设计目标：
 * - 在「默认（跟随界面配色）」之外，提供若干套多彩方案，为侧边栏与设置页左侧导航
 *   图标按语义名分配独立颜色，提升辨识度与个性化。
 * - 纯数据模块：不含任何副作用。由 store 持久化当前方案 ID，Sidebar / SettingsView
 *   读取颜色映射后以内联样式着色，切换即时生效。
 *
 * 与图标库（icon-themes）正交：图标库决定「形状」，菜单配色决定「颜色」，
 * 两者可自由组合。所有配色取自中等饱和 / 中等亮度色阶，明暗主题下均清晰。
 */

import type { IconName } from './icon-themes'

export type MenuPaletteId = string

/** 菜单配色方案元信息 */
export interface MenuPalette {
  id: MenuPaletteId
  label: string
  /** 卡片说明（设置页展示配色风格差异） */
  description?: string
  /** 设置页卡片预览用的菜单图标语义名 */
  preview: IconName[]
  /** 各菜单图标语义名 → 颜色；留空表示跟随界面配色（默认方案） */
  colors: Partial<Record<IconName, string>>
  /** 是否内置（内置方案不可删除） */
  builtIn: boolean
}

// 预览统一用侧边栏最具代表性的一组图标，便于在设置页横向对比配色差异。
const PREVIEW: IconName[] = ['all', 'rss', 'podcast', 'video', 'favorite', 'settings']

const PALETTES: MenuPalette[] = [
  {
    id: 'default',
    label: '默认',
    description: '跟随界面配色，克制统一',
    preview: PREVIEW,
    colors: {},
    builtIn: true
  },
  {
    id: 'candy',
    label: '糖果',
    description: '高饱和明快撞色，活泼醒目',
    preview: PREVIEW,
    colors: {
      all: '#6366f1', rss: '#f97316', podcast: '#a855f7', video: '#ef4444',
      later: '#3b82f6', favorite: '#eab308', github: '#64748b', twitter: '#06b6d4',
      bookmark: '#ec4899', board: '#22c55e', settings: '#8b5cf6',
      // 设置导航
      palette: '#6366f1', archived: '#f97316', sparkles: '#a855f7',
      keyboard: '#3b82f6', book: '#eab308', activity: '#ef4444', heart: '#ec4899'
    },
    builtIn: true
  },
  {
    id: 'forest',
    label: '森林',
    description: '自然绿系为底，点缀大地暖色',
    preview: PREVIEW,
    colors: {
      all: '#16a34a', rss: '#ea580c', podcast: '#65a30d', video: '#dc2626',
      later: '#0891b2', favorite: '#ca8a04', github: '#4d7c0f', twitter: '#059669',
      bookmark: '#d97706', board: '#15803d', settings: '#84cc16',
      // 设置导航
      palette: '#16a34a', archived: '#ea580c', sparkles: '#65a30d',
      keyboard: '#0891b2', book: '#ca8a04', activity: '#dc2626', heart: '#d97706'
    },
    builtIn: true
  },
  {
    id: 'ocean',
    label: '海洋',
    description: '蓝青冷调为主，沉静清爽',
    preview: PREVIEW,
    colors: {
      all: '#0284c7', rss: '#ea580c', podcast: '#4f46e5', video: '#0891b2',
      later: '#2563eb', favorite: '#0d9488', github: '#475569', twitter: '#38bdf8',
      bookmark: '#7c3aed', board: '#0e7490', settings: '#6366f1',
      // 设置导航
      palette: '#0284c7', archived: '#ea580c', sparkles: '#4f46e5',
      keyboard: '#2563eb', book: '#0d9488', activity: '#0891b2', heart: '#7c3aed'
    },
    builtIn: true
  },
  {
    id: 'sunset',
    label: '落日',
    description: '暖橙红紫渐变，热烈浓郁',
    preview: PREVIEW,
    colors: {
      all: '#f59e0b', rss: '#ea580c', podcast: '#db2777', video: '#dc2626',
      later: '#f97316', favorite: '#eab308', github: '#b45309', twitter: '#e11d48',
      bookmark: '#c026d3', board: '#d946ef', settings: '#9333ea',
      // 设置导航
      palette: '#f59e0b', archived: '#ea580c', sparkles: '#db2777',
      keyboard: '#f97316', book: '#eab308', activity: '#dc2626', heart: '#c026d3'
    },
    builtIn: true
  },
  {
    id: 'aurora',
    label: '极光',
    description: '极地极光渐变，梦幻冷艳',
    preview: PREVIEW,
    colors: {
      all: '#06b6d4', rss: '#8b5cf6', podcast: '#ec4899', video: '#f59e0b',
      later: '#3b82f6', favorite: '#10b981', github: '#6366f1', twitter: '#14b8a6',
      bookmark: '#a855f7', board: '#0ea5e9', settings: '#8b5cf6',
      // 设置导航
      palette: '#06b6d4', archived: '#8b5cf6', sparkles: '#ec4899',
      keyboard: '#3b82f6', book: '#10b981', activity: '#f59e0b', heart: '#a855f7'
    },
    builtIn: true
  },
  {
    id: 'earth',
    label: '大地',
    description: '泥土棕色系，沉稳质朴',
    preview: PREVIEW,
    colors: {
      all: '#a16207', rss: '#9a3412', podcast: '#854d0e', video: '#7c2d12',
      later: '#92400e', favorite: '#b45309', github: '#78350f', twitter: '#a16207',
      bookmark: '#9a3412', board: '#854d0e', settings: '#a16207',
      // 设置导航
      palette: '#a16207', archived: '#9a3412', sparkles: '#854d0e',
      keyboard: '#92400e', book: '#b45309', activity: '#7c2d12', heart: '#9a3412'
    },
    builtIn: true
  },
  {
    id: 'neon',
    label: '霓虹',
    description: '赛博霓虹荧光，未来感十足',
    preview: PREVIEW,
    colors: {
      all: '#d946ef', rss: '#f43f5e', podcast: '#8b5cf6', video: '#06b6d4',
      later: '#3b82f6', favorite: '#eab308', github: '#10b981', twitter: '#ec4899',
      bookmark: '#a855f7', board: '#0ea5e9', settings: '#d946ef',
      // 设置导航
      palette: '#d946ef', archived: '#f43f5e', sparkles: '#8b5cf6',
      keyboard: '#3b82f6', book: '#eab308', activity: '#06b6d4', heart: '#ec4899'
    },
    builtIn: true
  }
]

/** 注册表：ID → 方案，供快速查找与合法性校验 */
const registry = new Map<MenuPaletteId, MenuPalette>(PALETTES.map((p) => [p.id, p]))

/** 获取全部菜单配色方案（含默认），供设置页渲染选择卡片 */
export function listMenuPalettes(): MenuPalette[] {
  return PALETTES
}

/** 按 ID 取方案（未注册时返回 undefined） */
export function getMenuPaletteById(id: MenuPaletteId): MenuPalette | undefined {
  return registry.get(id)
}

/**
 * 取指定方案的颜色映射；未知 ID 回退空映射（即跟随界面配色）。
 * Sidebar 与 SettingsView 据此为各菜单图标着色，未命中的图标保持继承色。
 */
export function getMenuPaletteColors(id: MenuPaletteId): Partial<Record<IconName, string>> {
  return registry.get(id)?.colors ?? {}
}

/** 校验 ID 是否为已知方案，供启动兜底与持久化过滤 */
export function isKnownMenuPalette(id: string): boolean {
  return registry.has(id)
}
