/**
 * 统一图标层 —— 语义图标入口
 *
 * 业务组件一律从这里取 <Icon name="rss" />，不直接引用 lucide-react。
 * 具体渲染哪个图标集取决于当前激活的图标主题（见 lib/icon-themes.ts）。
 *
 * 切换图标主题后，useSyncExternalStore 通知所有 <Icon> 组件重新渲染，
 * 全局即时生效，无卡顿。
 */

import { useSyncExternalStore } from 'react'
import { resolveIcon, onIconThemeChange, getIconThemeMap, type IconName } from '../lib/icon-themes'

export type { IconName }

/** 语义图标组件：从当前主题解析并渲染 */
export function Icon({ name, size = 16, strokeWidth = 1.75, className, style, ...rest }: {
  name: IconName; size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties
} & Omit<Record<string, unknown>, 'name' | 'size' | 'strokeWidth' | 'className' | 'style'>) {
  // 订阅主题变化：切换图标主题时，所有 Icon 组件自动重新渲染
  useSyncExternalStore(onIconThemeChange, getIconThemeMap, getIconThemeMap)
  const C = resolveIcon(name)
  return <C size={size} strokeWidth={strokeWidth} className={className} style={style} {...rest} />
}
