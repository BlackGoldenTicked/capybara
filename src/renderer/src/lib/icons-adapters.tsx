/**
 * 第三方图标库的 props 适配器
 *
 * 各图标库的 props 约定并不一致，这里统一收敛为业务层的 IconComponent 契约
 * （size / strokeWidth / className / style），使 icons-map-* 只需声明「语义名 → 组件」：
 *
 *   strokeIcon     描边型（Solar / Tabler）：size 与 strokeWidth 均透传
 *   sizedIcon      路径型（Carbon / Pixelarticons）：图形由固定路径构成，只透传 size
 *   sketchyIcon    Sketchy（Lucide 几何派生）：size 透传，strokeWidth 以 absoluteStrokeWidth 近似
 *   scribblesIcon  Scribbles（墨迹三档权重）：size 透传，weight 默认 regular
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

/**
 * Sketchy 图标适配器。
 * Sketchy 由 Lucide 几何派生，pascal 命名与 lucide 完全一致。
 * 它不支持 numeric strokeWidth，只有 absoluteStrokeWidth: boolean（开启后线宽不随 size 缩放）。
 * 业务传入 strokeWidth !== 1.75 时开启 absoluteStrokeWidth 近似；其余 props 原样透传。
 */
export function sketchyIcon(
  C: React.ComponentType<Record<string, unknown>>,
  displayName = 'SketchyIcon'
): IconComponent {
  const Wrapped = ({ size = 16, strokeWidth = 1.75, className, style }: Props) => (
    <C size={size} absoluteStrokeWidth={strokeWidth !== 1.75} className={className} style={style} />
  )
  Wrapped.displayName = displayName
  return Wrapped as IconComponent
}

/**
 * Scribbles 图标适配器。
 * Scribbles 是 Lucide 重绘为可变宽墨迹，props 使用 weight 而非 strokeWidth。
 * 默认 'regular' 最接近界面 2px 线性风格；color 合并到 style 中由 SVG currentColor 继承。
 */
export function scribblesIcon(
  C: React.ComponentType<Record<string, unknown>>,
  weight: 'regular' | 'bold' | 'fill' = 'regular',
  displayName = 'ScribblesIcon'
): IconComponent {
  const Wrapped = ({ size = 16, style }: Props) => (
    <C size={size} weight={weight} style={style} />
  )
  Wrapped.displayName = displayName
  return Wrapped as IconComponent
}
