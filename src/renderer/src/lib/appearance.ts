/**
 * ReadFlow 外观 / 配色 / 主题系统
 *
 * 受 shiye-tabs 的整面配色体系启发，提供：
 * - 主题：跟随系统 / 亮 / 暗
 * - 卡片风格：paper / glass / noir / aurora / ocean / sunset / lavender /
 *   forest / rose / slate / amber +「默认」（共 12 种整面配色）
 *   每个风格在 tokens.css 中定义表面 / 文字 / 边框的「基调」，并定义 --card-accent
 *   作为自身签名色；应用的主强调色（按钮 / 开关 / 链接 / 聚焦环 / 选中态）直接
 *   从 --card-accent 派生，因此不再需要独立的「强调色」控件——选了某个卡片风格，
 *   整站配色即随之确定。
 * - 阅读字体：从系统探测到的等宽字体中任选其一（见 lib/monospace.ts），
 *   字号缩放 70%–200%，字重 细 / 正常 / 粗。
 *
 * 所有配置写进主进程通用 settings 键值表（key 见 SETTING_KEYS）。
 */

export type ThemeMode = 'system' | 'light' | 'dark'
export type CardStyleKey =
  | 'paper' | 'glass' | 'noir' | 'aurora' | 'ocean'
  | 'sunset' | 'lavender' | 'forest' | 'rose' | 'slate' | 'amber'
export type FontWeight = 'thin' | 'normal' | 'bold'

/** 系统默认等宽字体栈：未显式选择具体字体时使用，跨平台兜底。 */
export const DEFAULT_MONO_STACK = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

export interface Appearance {
  theme: ThemeMode
  cardStyle: CardStyleKey | 'none'
  /** 阅读等宽字体族名；空字符串表示使用系统默认等宽栈（DEFAULT_MONO_STACK）。 */
  fontFamily: string
  /** 字号缩放 0.7–2.0（即 70%–200%）。 */
  fontScale: number
  /** 字重：细(300) / 正常(400) / 粗(700)。 */
  fontWeight: FontWeight
}

export const SETTING_KEYS = {
  theme: 'theme',
  cardStyle: 'card_style',
  fontFamily: 'font_family',
  fontScale: 'font_scale',
  fontWeight: 'font_weight'
} as const

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'system',
  cardStyle: 'none',
  fontFamily: '',
  fontScale: 1,
  fontWeight: 'normal'
}

export const THEME_OPTIONS: Array<{ key: ThemeMode; label: string }> = [
  { key: 'system', label: '跟随系统' },
  { key: 'light', label: '亮色' },
  { key: 'dark', label: '暗色' }
]

/** 卡片风格（整面配色）：每个风格对应 tokens.css 中的 [data-card-style]，
 *  定义表面 / 文字 / 边框基调，并自带 --card-accent 签名色作为全局主强调色来源。 */
export const CARD_STYLES: Array<{ key: CardStyleKey; label: string; preview: string }> = [
  { key: 'paper', label: '纸感', preview: 'linear-gradient(135deg,#fff8e9,#dec59d)' },
  { key: 'glass', label: '玻璃', preview: 'linear-gradient(135deg,#9fdde2,#d1bfe9)' },
  { key: 'noir', label: '暗夜', preview: 'radial-gradient(circle at 80% 0,#695636,#17181b 60%)' },
  { key: 'aurora', label: '极光', preview: 'linear-gradient(135deg,#76d7ad,#b4a5ec 52%,#f1b274)' },
  { key: 'ocean', label: '海洋', preview: 'linear-gradient(135deg,#0a2342,#126e82 55%,#51c4d3)' },
  { key: 'sunset', label: '落日', preview: 'linear-gradient(135deg,#2d1b3d,#c4426e 48%,#f5a623)' },
  { key: 'lavender', label: '薰衣草', preview: 'linear-gradient(135deg,#e8dff5,#c3aed6 52%,#957dad)' },
  { key: 'forest', label: '森林', preview: 'linear-gradient(135deg,#0b2a1a,#1a5c32 55%,#4caf50)' },
  { key: 'rose', label: '玫瑰', preview: 'linear-gradient(135deg,#1a1017,#6b2c4e 50%,#e8859f)' },
  { key: 'slate', label: '石板', preview: 'linear-gradient(135deg,#1e2a38,#3d5a73 55%,#8ab4c8)' },
  { key: 'amber', label: '琥珀', preview: 'linear-gradient(135deg,#2a1e0a,#8b6914 52%,#f0c040)' }
]

const FONT_WEIGHTS: Record<FontWeight, number> = { thin: 300, normal: 400, bold: 700 }
export const FONT_WEIGHT_VALUE = (w: FontWeight): number => FONT_WEIGHTS[w] ?? 400

/** 阅读正文使用的字体族：显式选择某字体时以其优先，否则用系统默认等宽栈。 */
export function readingFontStack(family: string): string {
  const f = family.trim()
  if (!f) return DEFAULT_MONO_STACK
  return `"${f}", ${DEFAULT_MONO_STACK}`
}

const asString = (v: unknown, fallback: string): string => (typeof v === 'string' && v ? v : fallback)

export async function loadAppearance(): Promise<Appearance> {
  const get = (k: string) => window.readflow.invoke('settings:get', k) as Promise<string | null | undefined>
  const [theme, cardStyle, ff, fs, fw] = await Promise.all([
    get(SETTING_KEYS.theme), get(SETTING_KEYS.cardStyle),
    get(SETTING_KEYS.fontFamily), get(SETTING_KEYS.fontScale), get(SETTING_KEYS.fontWeight)
  ])
  const validStyle = (asString(cardStyle, DEFAULT_APPEARANCE.cardStyle) as CardStyleKey | 'none')
  const scale = Number(asString(fs, String(DEFAULT_APPEARANCE.fontScale)))
  const weight = asString(fw, DEFAULT_APPEARANCE.fontWeight) as FontWeight
  return {
    theme: (['system', 'light', 'dark'].includes(asString(theme, DEFAULT_APPEARANCE.theme)) ? asString(theme, DEFAULT_APPEARANCE.theme) : DEFAULT_APPEARANCE.theme) as ThemeMode,
    cardStyle: validStyle in Object.fromEntries(CARD_STYLES.map((s) => [s.key, 1])) || validStyle === 'none' ? validStyle : DEFAULT_APPEARANCE.cardStyle,
    fontFamily: asString(ff, DEFAULT_APPEARANCE.fontFamily),
    fontScale: Number.isFinite(scale) ? Math.min(2, Math.max(0.7, scale)) : DEFAULT_APPEARANCE.fontScale,
    fontWeight: (['thin', 'normal', 'bold'].includes(weight) ? weight : DEFAULT_APPEARANCE.fontWeight) as FontWeight
  }
}

export function persistAppearance(patch: Partial<Appearance>): void {
  for (const [key, value] of Object.entries(patch)) {
    const settingKey = (SETTING_KEYS as Record<string, string>)[key]
    if (settingKey && value !== undefined) {
      void window.readflow.invoke('settings:set', settingKey, String(value))
    }
  }
}

const APPEARANCE_CACHE_KEY = 'readflow:appearance'

/** 把当前外观镜像到 localStorage，供下次启动在首帧前同步应用，消除「默认主题→切换」闪烁。 */
export function cacheAppearance(a: Appearance): void {
  try { localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify(a)) } catch { /* 配额/隐私模式忽略 */ }
}

/** 将外观配置应用到 document，立即生效。 */
export function applyAppearance(a: Appearance): void {
  const root = document.documentElement

  // 主题
  if (a.theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', a.theme)

  // 卡片风格（整面基调 + 主强调色 --card-accent，由 tokens.css 的 [data-card-style] 决定）
  if (a.cardStyle === 'none') root.removeAttribute('data-card-style')
  else root.setAttribute('data-card-style', a.cardStyle)

  // 字号缩放 + 阅读字体族 + 字重
  root.style.setProperty('--font-scale', String(a.fontScale))
  // 阅读字体族
  root.style.setProperty('--font-reading', readingFontStack(a.fontFamily))
  // 全局 UI 字体族：与「阅读字体」保持同一选择（系统配置里选的字体同步到菜单 / 设置等界面）
  root.style.setProperty('--font-ui', readingFontStack(a.fontFamily))
  root.style.setProperty('--reader-weight', String(FONT_WEIGHT_VALUE(a.fontWeight)))

  // 镜像到 localStorage，下次启动首帧前由 bootAppearance 同步应用
  cacheAppearance(a)
}

/**
 * 启动早期同步应用：优先用上次持久化到 localStorage 的外观（与 DB 权威值一致），
 * 在 React 首次渲染之前就把主题 / 卡片风格 / 字体变量铺好，彻底消除首屏闪烁。
 * DB 的权威值仍会由 initAppearance 异步加载并再次覆盖（同时刷新缓存）。
 */
export function bootAppearance(): void {
  let a: Appearance | null = null
  try {
    const raw = localStorage.getItem(APPEARANCE_CACHE_KEY)
    if (raw) a = JSON.parse(raw) as Appearance
  } catch { a = null }
  applyAppearance(a ?? DEFAULT_APPEARANCE)
}
