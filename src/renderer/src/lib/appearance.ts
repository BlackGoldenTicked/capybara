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
 * - 阅读字体：从系统已安装的全部字体中任选（通过 app:fontList IPC 动态获取），
 *   字号缩放 70%–200%，字重 细(300) / 正常(400) / 粗(700) 全局生效。
 *
 * 所有配置写进主进程通用 settings 键值表（key 见 SETTING_KEYS）。
 */

import { getReadingThemeById, FOLLOW_UI_ID, DEFAULT_READING_THEME_ID } from './reading-themes'

export type ThemeMode = 'system' | 'light' | 'dark'
export type CardStyleKey =
  | 'paper' | 'glass' | 'noir' | 'aurora' | 'ocean'
  | 'sunset' | 'lavender' | 'forest' | 'rose' | 'slate' | 'amber'
export type FontWeight = 'thin' | 'normal' | 'bold'

/** 系统默认 UI 字体栈（全局文字兜底）。 */
export const DEFAULT_UI_STACK = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"

/** 等宽字体栈（仅代码块 `<code>` / `<pre>` 使用）。 */
export const DEFAULT_MONO_STACK = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

export interface Appearance {
  theme: ThemeMode
  cardStyle: CardStyleKey | 'none'
  /** UI 全文字体族名；空字符串表示使用系统默认（DEFAULT_UI_STACK）。 */
  fontFamily: string
  /** 字号缩放 0.7–2.0（即 70%–200%）。 */
  fontScale: number
  /** 字重：细(300) / 正常(400) / 粗(700)，全局生效。 */
  fontWeight: FontWeight
  /** 阅读正文配色主题 ID；`__follow_ui__` 表示跟随 UI 界面配色。 */
  readingTheme: string
}

export const SETTING_KEYS = {
  theme: 'theme',
  cardStyle: 'card_style',
  fontFamily: 'font_family',
  fontScale: 'font_scale',
  fontWeight: 'font_weight',
  readingTheme: 'reading_theme'
} as const

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'system',
  cardStyle: 'none',
  fontFamily: '',
  fontScale: 1,
  fontWeight: 'normal',
  readingTheme: FOLLOW_UI_ID
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

/** 全局 UI 字体栈：用户选择的字体优先，系统字体兜底（全软件文字统一）。 */
export function uiFontStack(family: string): string {
  const f = family.trim()
  if (!f) return DEFAULT_UI_STACK
  return `"${f}", ${DEFAULT_UI_STACK}`
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
    fontWeight: (['thin', 'normal', 'bold'].includes(weight) ? weight : DEFAULT_APPEARANCE.fontWeight) as FontWeight,
    readingTheme: asString(undefined, FOLLOW_UI_ID) // 兼容旧缓存：缺失时跟随界面
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

  // 字号缩放 + 字体族 + 字重（全局生效）
  root.style.setProperty('--font-scale', String(a.fontScale))
  const stack = uiFontStack(a.fontFamily)
  root.style.setProperty('--font-reading', stack)
  root.style.setProperty('--font-ui', stack)
  root.style.setProperty('--font-weight', String(FONT_WEIGHT_VALUE(a.fontWeight)))

  // 镜像到 localStorage，下次启动首帧前由 bootAppearance 同步应用
  cacheAppearance(a)

  // 阅读正文配色：独立于 UI 卡片风格，注入 --rt-* CSS 变量到 :root
  applyReadingTheme(a.readingTheme)
}

/** 注入阅读配色 CSS 变量到 :root，供 .reader-content 使用 */
function applyReadingTheme(themeId: string): void {
  const root = document.documentElement
  if (themeId === FOLLOW_UI_ID || !themeId) {
    // 跟随界面：移除阅读配色变量，让 reader-content 回退到 UI 的 CSS 变量
    root.removeAttribute('data-reading-theme')
    return
  }
  const theme = getReadingThemeById(themeId)
  if (!theme) return
  root.setAttribute('data-reading-theme', themeId)
  root.setAttribute('data-reading-mode', theme.mode)
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(key, value)
  }
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
    // 兼容旧缓存：缺失 readingTheme 字段时补默认值
    if (a && !a.readingTheme) a.readingTheme = FOLLOW_UI_ID
  } catch { a = null }
  applyAppearance(a ?? DEFAULT_APPEARANCE)
}
