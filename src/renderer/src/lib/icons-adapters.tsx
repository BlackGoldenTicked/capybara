/**
 * 第三方图标库的 props 适配器
 *
 * 各图标库的 props 约定并不一致，这里统一收敛为业务层的 IconComponent 契约
 * （size / strokeWidth / className / style），使 icons-map-* 只需声明「语义名 → 组件」：
 *
 *   strokeIcon  描边型（Solar / Tabler）：size 与 strokeWidth 均透传
 *   sizedIcon   路径型（Carbon / Pixelarticons）：图形由固定路径构成，只透传 size
 *
 * 颜色一律继承 currentColor，与主题色随动，无需在此处理。
 */

import type { IconComponent } from './icon-themes'

type Props = React.ComponentProps<IconComponent>

/** 描边型图标：size 与 strokeWidth 均有效 */
export function strokeIcon(
  C: React.ComponentType<Record<string, unknown>>,
  displayName = 'StrokeIcon'
): IconComponent {
  const Wrapped = ({ size = 16, strokeWidth = 1.75, className, style }: Props) => (
    <C size={size} strokeWidth={strokeWidth} className={className} style={style} />
  )
  Wrapped.displayName = displayName
  return Wrapped as IconComponent
}

/** 路径型图标：无描边宽度概念，忽略 strokeWidth */
export function sizedIcon(
  C: React.ComponentType<Record<string, unknown>>,
  displayName = 'SizedIcon'
): IconComponent {
  const Wrapped = ({ size = 16, className, style }: Props) => (
    <C size={size} className={className} style={style} />
  )
  Wrapped.displayName = displayName
  return Wrapped as IconComponent
}
