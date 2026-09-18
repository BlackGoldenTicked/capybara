/**
 * 菜单配色方案 —— 侧边栏菜单图标的多彩着色预设
 *
 * 设计目标：
 * - 在「默认（跟随界面配色）」之外，提供若干套多彩方案，为侧边栏各菜单项
 *   图标按语义名分配独立颜色，提升辨识度与个性化。
 * - 纯数据模块：不含任何副作用。由 store 持久化当前方案 ID，Sidebar 读取
 *   颜色映射后以内联样式着色，切换即时生效。
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
      bookmark: '#ec4899', board: '#22c55e', settings: '#8b5cf6'
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
      bookmark: '#d97706', board: '#15803d', settings: '#84cc16'
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
      bookmark: '#7c3aed', board: '#0e7490', settings: '#6366f1'
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
      bookmark: '#c026d3', board: '#d946ef', settings: '#9333ea'
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
 * Sidebar 据此为各菜单图标着色，未命中的图标保持继承色。
 */
export function getMenuPaletteColors(id: MenuPaletteId): Partial<Record<IconName, string>> {
  return registry.get(id)?.colors ?? {}
}

/** 校验 ID 是否为已知方案，供启动兜底与持久化过滤 */
export function isKnownMenuPalette(id: string): boolean {
  return registry.has(id)
}
