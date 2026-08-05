/**
 * 订阅源配色：把不同的 RSS 订阅源映射为稳定、易区分的颜色。
 * 用 source_name 做确定性哈希取色，保证同一源每次颜色一致（无需存储）。
 */

export const FEED_PALETTE: string[] = [
  '#378add', // 蓝
  '#1f9e8f', // 青
  '#7f77dd', // 紫
  '#d85a30', // 橙
  '#d4537e', // 粉
  '#1d9e75', // 绿
  '#c9a227', // 金
  '#2b8a9e', // 蓝绿
  '#9b5de5', // 亮紫
  '#e07a3f', // 暖橙
  '#3a86c8', // 海蓝
  '#cf5b7e', // 玫红
  '#5a8f3c', // 橄榄绿
  '#b5651d'  // 赭石
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

/** 给定订阅源名称，返回稳定的配色（用于卡片彩色标签与订阅源栏圆点）。 */
export function feedColor(name: string): string {
  const key = (name || '').trim()
  if (!key) return FEED_PALETTE[0]
  return FEED_PALETTE[hashString(key) % FEED_PALETTE.length]
}
