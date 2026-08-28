/**
 * 主题套装管理系统
 *
 * 把「图标主题」和「音效主题」组合为「套装」（Bundle），用户一键切换。
 *
 * 设计：
 * - 每个套装绑定一个图标主题 ID 和一个音效主题 ID
 * - 切换套装时，同时调用 setIconTheme() + setSoundTheme()
 * - 套装配置持久化到 settings 表，应用启动时从 bootstrap 恢复
 * - 套装列表内置「默认」套装，后续可注册新套装（含图标+音效素材包组合）
 *
 * 扩展方式：
 * 1. 准备好图标主题映射和音效主题映射
 * 2. registerIconTheme('retro', iconMap) + registerSoundTheme('retro', soundMap)
 * 3. registerThemeBundle({ id: 'retro', label: '复古', iconTheme: 'retro', soundTheme: 'retro' })
 * 4. 用户在设置页「主题套装」中一键切换
 */

import { setIconTheme, getIconThemeId, listIconThemes, type IconThemeId } from './icon-themes'
import { setSoundTheme, getSoundThemeId, listSoundThemes, type SoundThemeMeta } from './sound-themes'

/** 主题套装元信息 */
export interface ThemeBundle {
  id: string
  label: string
  /** 图标主题 ID；null 表示使用当前图标主题（不随套装切换） */
  iconTheme: IconThemeId | null
  /** 音效主题 ID；null 表示使用当前音效主题（不随套装切换） */
  soundTheme: string | null
  /** 套装描述（可选） */
  description?: string
  /** 是否内置 */
  builtIn: boolean
}

/** 内置套装 */
const BUILTIN_BUNDLES: ThemeBundle[] = [
  {
    id: 'default',
    label: '默认套装',
    iconTheme: 'default',
    soundTheme: 'crystal',
    description: 'Lucide 线性图标 + Crystal 水晶音效',
    builtIn: true
  }
]

/** 注册表 */
const bundleRegistry = new Map<string, ThemeBundle>()
for (const b of BUILTIN_BUNDLES) bundleRegistry.set(b.id, b)

/** 注册一个主题套装 */
export function registerThemeBundle(bundle: Omit<ThemeBundle, 'builtIn'> & { builtIn?: boolean }): void {
  bundleRegistry.set(bundle.id, { ...bundle, builtIn: bundle.builtIn ?? false })
}

/** 获取所有已注册的套装 */
export function listThemeBundles(): ThemeBundle[] {
  return [...bundleRegistry.values()]
}

/** 获取套装元信息 */
export function getThemeBundle(id: string): ThemeBundle | undefined {
  return bundleRegistry.get(id)
}

/**
 * 应用主题套装：同时切换图标主题和音效主题
 * - iconTheme=null 时保留当前图标主题
 * - soundTheme=null 时保留当前音效主题
 */
export function applyThemeBundle(id: string): ThemeBundle | undefined {
  const bundle = bundleRegistry.get(id)
  if (!bundle) return undefined
  if (bundle.iconTheme) setIconTheme(bundle.iconTheme)
  if (bundle.soundTheme) setSoundTheme(bundle.soundTheme)
  return bundle
}

/** 获取当前激活的套装 ID（根据 iconTheme + soundTheme 推断） */
export function getCurrentBundleId(): string {
  const iconId = getIconThemeId()
  const soundId = getSoundThemeId()
  for (const b of bundleRegistry.values()) {
    if (b.iconTheme === iconId && b.soundTheme === soundId) return b.id
  }
  // 没有精确匹配，返回 'custom'
  return 'custom'
}

/** 获取所有图标主题元信息（转发） */
export function getIconThemesList() {
  return listIconThemes()
}

/** 获取所有音效主题元信息（转发） */
export function getSoundThemesList(): SoundThemeMeta[] {
  return listSoundThemes()
}
