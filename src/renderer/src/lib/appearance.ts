/**
 * Capybara 外观 / 配色 / 主题系统
 *
 * 自研 Design System（DS）：
 * - 主题：跟随系统 / 亮 / 暗（亮暗通过 html.dark 类切换）
 * - 颜色主题（colorTheme）：5 套实色预设色板（azure/claude/ocean/
 *   snow-cinnabar/vibrant），themes.css 中定义浅/深双态。
 * - 阅读字体：从系统已安装的全部字体中任选（通过 app:fontList IPC 动态获取），
 *   字号缩放 70%–200%，字重 细(300) / 正常(400) / 粗(700) 全局生效。
 *
 * 所有配置写进主进程通用 settings 键值表（key 见 SETTING_KEYS）。
 */

import { getReadingThemeById, FOLLOW_UI_ID, DEFAULT_READING_THEME_ID } from './reading-themes'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ColorThemeKey =
  | 'azure' | 'claude' | 'ocean' | 'snow-cinnabar' | 'vibrant'
export type FontWeight = 'thin' | 'normal' | 'bold'

/** 系统默认 UI 字体栈（全局文字兜底）。 */
export const DEFAULT_UI_STACK = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"

/** 等宽字体栈（仅代码块 `<code>` / `<pre>` 使用）。 */
export const DEFAULT_MONO_STACK = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

export interface Appearance {
  theme: ThemeMode
  /** 颜色主题（整面色板）；'none' 表示使用默认基准（深绿松石品牌）。 */
  colorTheme: ColorThemeKey | 'none'
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
  colorTheme: 'color_theme',
  fontFamily: 'font_family',
  fontScale: 'font_scale',
  fontWeight: 'font_weight',
  readingTheme: 'reading_theme'
} as const

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'system',
  colorTheme: 'none',
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

/** 实色颜色主题（5 套），对应 themes.css 中的 html[data-theme]。 */
export const COLOR_THEMES: Array<{ key: ColorThemeKey; label: string; preview: string }> = [
  { key: 'azure', label: '晴空蓝', preview: 'linear-gradient(135deg,#0a64d6,#7fc3ff)' },
  { key: 'claude', label: '陶土暖', preview: 'linear-gradient(135deg,#d97757,#faf9f5)' },
  { key: 'ocean', label: '碧海青', preview: 'linear-gradient(135deg,#0b6a9e,#7dd3fc)' },
  { key: 'snow-cinnabar', label: '朱砂赤', preview: 'linear-gradient(135deg,#984933,#c36a50)' },
  { key: 'vibrant', label: '青碧绿', preview: 'linear-gradient(135deg,#2d3436,#3aaba6)' }
]

/** 所有合法 colorTheme 取值（实色），用于持久化校验与启动兜底。 */
export const KNOWN_COLOR_THEME_KEYS = new Set<string>([
  ...COLOR_THEMES.map((s) => s.key)
])

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
  const get = (k: string) => window.capybara.invoke('settings:get', k) as Promise<string | null | undefined>
  const [theme, colorTheme, ff, fs, fw] = await Promise.all([
    get(SETTING_KEYS.theme), get(SETTING_KEYS.colorTheme),
    get(SETTING_KEYS.fontFamily), get(SETTING_KEYS.fontScale), get(SETTING_KEYS.fontWeight)
  ])
  const validTheme = (asString(colorTheme, DEFAULT_APPEARANCE.colorTheme) as ColorThemeKey | 'none')
  const scale = Number(asString(fs, String(DEFAULT_APPEARANCE.fontScale)))
  const weight = asString(fw, DEFAULT_APPEARANCE.fontWeight) as FontWeight
  const allKeys = KNOWN_COLOR_THEME_KEYS
  return {
    theme: (['system', 'light', 'dark'].includes(asString(theme, DEFAULT_APPEARANCE.theme)) ? asString(theme, DEFAULT_APPEARANCE.theme) : DEFAULT_APPEARANCE.theme) as ThemeMode,
    colorTheme: validTheme === 'none' || allKeys.has(validTheme) ? validTheme : DEFAULT_APPEARANCE.colorTheme,
    fontFamily: asString(ff, DEFAULT_APPEARANCE.fontFamily),
    fontScale: Number.isFinite(scale) ? Math.min(2, Math.max(0.7, scale)) : DEFAULT_APPEARANCE.fontScale,
    fontWeight: (['thin', 'normal', 'bold'].includes(weight) ? weight : DEFAULT_APPEARANCE.fontWeight) as FontWeight,
    readingTheme: asString(undefined, FOLLOW_UI_ID)
  }
}

export function persistAppearance(patch: Partial<Appearance>): void {
  for (const [key, value] of Object.entries(patch)) {
    const settingKey = (SETTING_KEYS as Record<string, string>)[key]
    if (settingKey && value !== undefined) {
      void window.capybara.invoke('settings:set', settingKey, String(value))
    }
  }
}

const APPEARANCE_CACHE_KEY = 'capybara:appearance'

/** 把当前外观镜像到 localStorage，供下次启动在首帧前同步应用，消除「默认主题→切换」闪烁。 */
export function cacheAppearance(a: Appearance): void {
  try { localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify(a)) } catch { /* 配额/隐私模式忽略 */ }
}

/** 依据主题模式解析当前是否应为深色（system 模式读取系统偏好）。 */
export function resolveDark(theme: ThemeMode): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}


/** 将外观配置应用到 document，立即生效。 */
export function applyAppearance(a: Appearance): void {
  const root = document.documentElement

  // 主题模式：亮暗通过 html.dark 类切换
  root.classList.toggle('dark', resolveDark(a.theme))
  root.style.colorScheme = resolveDark(a.theme) ? 'dark' : 'light'

  // 颜色主题：
  //   - 'none'   → 使用默认基准（themes.css :root）
  //   - 其他     → themes.css 中对应 data-theme 块（5 套实色预设）
  if (a.colorTheme === 'none') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', a.colorTheme)
  }

  // 字号缩放 + 字体族 + 字重（全局生效）
  root.style.setProperty('--font-scale', String(a.fontScale))
  const stack = uiFontStack(a.fontFamily)
  root.style.setProperty('--font-reading', stack)
  root.style.setProperty('--font-ui', stack)
  // 同时直接设置 body 元素的 font-family，确保字体立即生效（双保险：CSS 变量 + inline style）
  if (document.body) document.body.style.fontFamily = stack
  root.style.setProperty('--font-weight', String(FONT_WEIGHT_VALUE(a.fontWeight)))

  // 镜像到 localStorage，下次启动首帧前由 bootAppearance 同步应用
  cacheAppearance(a)

  // 阅读正文配色：独立于 UI 颜色主题，注入 --rt-* CSS 变量到 :root
  applyReadingTheme(a.readingTheme)
}

/** 注入阅读配色 CSS 变量到 :root，供 .reader-content 使用 */
function applyReadingTheme(themeId: string): void {
  const root = document.documentElement
  if (themeId === FOLLOW_UI_ID || !themeId) {
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
 * 在 React 首次渲染之前就把主题 / 颜色主题 / 字体变量铺好，彻底消除首屏闪烁。
 */
export function bootAppearance(): void {
  let a: Appearance | null = null
  try {
    const raw = localStorage.getItem(APPEARANCE_CACHE_KEY)
    if (raw) a = JSON.parse(raw) as Appearance
    if (a) {
      if (!a.readingTheme) a.readingTheme = FOLLOW_UI_ID
      if (!a.colorTheme || (a.colorTheme !== 'none' && !KNOWN_COLOR_THEME_KEYS.has(a.colorTheme))) a.colorTheme = DEFAULT_APPEARANCE.colorTheme
    }
  } catch { a = null }
  applyAppearance(a ?? DEFAULT_APPEARANCE)
}

/**
 * 监听系统主题变化：system 模式下跟随系统亮暗切换（重新应用 .dark 类）。
 * 由 store.initAppearance 在启动时注册一次。
 */
export function watchSystemTheme(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => onChange()
  mq.addEventListener?.('change', handler)
  return () => mq.removeEventListener?.('change', handler)
}