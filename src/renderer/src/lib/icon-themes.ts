/**
 * 图标主题抽象层
 *
 * 设计目标：
 * - 把 IconName → 具体图标组件的映射从硬编码改为可插拔的「图标主题」
 * - 每个图标主题（IconTheme）是一个 Record<IconName, ReactComponent> 映射
 * - 通过 setIconTheme() 切换主题后，所有引用 <Icon> 的组件自动更新
 * - 内置默认主题（Lucide 线性集），后续可注册新主题（如实色集、填充集、自定义素材包）
 *
 * 扩展方式：
 * 1. 定义新主题：创建一个 Record<IconName, React.ComponentType> 映射
 * 2. 注册：registerIconTheme('my-theme', map)
 * 3. 切换：setIconTheme('my-theme')
 * 4. 业务代码无感知：始终用 <Icon name="rss" /> 调用
 */

import type { IconName } from '../components/icons'
import { LUCIDE_ICON_MAP } from '../components/icons-map-lucide'

/** 图标主题 ID。'default' 为内置 Lucide 线性集。 */
export type IconThemeId = string

/** 图标组件类型（与 lucide-react 的 LucideProps 兼容） */
export type IconComponent = React.ComponentType<{
  size?: number
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
  fill?: string
}>

/** 一个图标主题 = IconName → 组件 的完整映射 */
export type IconThemeMap = Record<IconName, IconComponent>

/** 图标主题元信息（供设置页展示） */
export interface IconThemeMeta {
  id: IconThemeId
  label: string
  /** 预览图标名（用于设置页展示该主题风格） */
  preview: IconName[]
  /** 是否内置（内置主题不可删除） */
  builtIn: boolean
}

/** 注册表：所有已注册的图标主题 */
const registry = new Map<IconThemeId, { map: IconThemeMap; meta: IconThemeMeta }>()

/** 当前激活的图标主题 ID */
let activeId: IconThemeId = 'default'

/** 当前激活的图标映射（缓存，避免每次渲染都查 Map） */
let activeMap: IconThemeMap = LUCIDE_ICON_MAP

/** 订阅回调列表（主题切换时通知所有订阅者重新渲染） */
const listeners = new Set<() => void>()

/** 内置主题元信息列表 */
const BUILTIN_META: IconThemeMeta[] = [
  { id: 'default', label: 'Lucide 线性', preview: ['rss', 'star', 'settings', 'trash', 'search'], builtIn: true }
]

// 注册内置主题
registry.set('default', { map: LUCIDE_ICON_MAP, meta: BUILTIN_META[0] })

/** 注册一个图标主题 */
export function registerIconTheme(id: IconThemeId, map: IconThemeMap, meta?: Partial<IconThemeMeta>): void {
  const fullMeta: IconThemeMeta = {
    id,
    label: meta?.label ?? id,
    preview: meta?.preview ?? ['rss', 'star', 'settings', 'trash', 'search'],
    builtIn: meta?.builtIn ?? false
  }
  registry.set(id, { map, meta: fullMeta })
}

/** 设置当前图标主题，通知所有订阅者 */
export function setIconTheme(id: IconThemeId): void {
  const entry = registry.get(id)
  if (!entry) return
  activeId = id
  activeMap = entry.map
  listeners.forEach((fn) => fn())
}

/** 获取当前图标主题 ID */
export function getIconThemeId(): IconThemeId {
  return activeId
}

/** 获取当前图标主题映射 */
export function getIconThemeMap(): IconThemeMap {
  return activeMap
}

/** 获取所有已注册图标主题的元信息 */
export function listIconThemes(): IconThemeMeta[] {
  return [...registry.values()].map((e) => e.meta)
}

/** 按名称获取当前主题下的图标组件 */
export function resolveIcon(name: IconName): IconComponent {
  return activeMap[name] ?? LUCIDE_ICON_MAP[name] ?? LUCIDE_ICON_MAP['info']
}

/** 订阅图标主题变化（返回取消订阅函数） */
export function onIconThemeChange(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
