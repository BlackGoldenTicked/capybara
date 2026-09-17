/**
 * Lucide 图标变体主题
 *
 * 通过 HOC 派生自 LUCIDE_ICON_MAP：
 * - lucide-bold   加粗笔画（strokeWidth=2.5）—— 工程感、双态视觉重量
 * - lucide-thin   细笔画（strokeWidth=1.25）—— 精致、克制的线性
 * - lucide-filled 实心填充（fill=currentColor + strokeWidth=1.4）—— 拟物 / 复古 / 高对比
 *
 * 变体主题复用 Lucide 组件本体，零额外依赖、零体积成本。
 * 若后续接入 Phosphor / Tabler / Iconoir，可另建独立映射文件（icons-map-phosphor.tsx 等），
 * 由 lib/theme-presets.ts 集中注册。
 */

import { LUCIDE_ICON_MAP } from './icons-map-lucide'
import type { IconComponent, IconThemeMap, IconName } from './icon-themes'

type Props = React.ComponentProps<IconComponent>

function deriveMap(override: (C: IconComponent) => IconComponent): IconThemeMap {
  const out = {} as IconThemeMap
  for (const key of Object.keys(LUCIDE_ICON_MAP) as IconName[]) {
    out[key] = override(LUCIDE_ICON_MAP[key])
  }
  return out
}

/** 加粗笔画变体：所有图标 strokeWidth=2.5，视觉更硬朗 */
export const LUCIDE_BOLD_ICON_MAP: IconThemeMap = deriveMap((C) => {
  const Wrapped = (props: Props) => <C {...props} strokeWidth={2.5} />
  Wrapped.displayName = 'LucideBold'
  return Wrapped as IconComponent
})

/** 细笔画变体：strokeWidth=1.25，克制精致 */
export const LUCIDE_THIN_ICON_MAP: IconThemeMap = deriveMap((C) => {
  const Wrapped = (props: Props) => <C {...props} strokeWidth={1.25} />
  Wrapped.displayName = 'LucideThin'
  return Wrapped as IconComponent
})

/** 实心填充变体：fill=currentColor + 细描边，形成高对比色块 */
export const LUCIDE_FILLED_ICON_MAP: IconThemeMap = deriveMap((C) => {
  const Wrapped = (props: Props) => <C {...props} fill="currentColor" strokeWidth={1.4} />
  Wrapped.displayName = 'LucideFilled'
  return Wrapped as IconComponent
})
