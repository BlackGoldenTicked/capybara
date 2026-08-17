/**
 * ReadFlow 外观 / 配色 / 主题系统
 *
 * 对齐 NewMax 自研 Design System（DS）：
 * - 主题：跟随系统 / 亮 / 暗（亮暗通过 html.dark 类切换，NewMax 约定）
 * - 颜色主题（colorTheme）：
 *   - 11 套 NewMax 实色预设色板（azure/claude/dusk/elegant/luxury/nature/ocean/
 *     professional/retro/snow-cinnabar/vibrant），themes.css 中定义浅/深双态；
 *   - 3 套 NewMax 图片壁纸主题（image-aqua/image-petal/image-snow），从
 *     /Users/zhangyu/Desktop/NewMax.app 提取 aqua-curves/petal-haze/snow-cinnabar
 *     三张壁纸作为 body 主区域背景，不重定义 ds-* 令牌（沿用默认深色基准）；
 *   - 1 套随机主题（random），每次选中随机生成 HSL 色 + WCAG 对比度校正得到
 *     完整的 --ds-* 令牌集，通过 inline style 注入。
 * - 阅读字体：从系统已安装的全部字体中任选（通过 app:fontList IPC 动态获取），
 *   字号缩放 70%–200%，字重 细(300) / 正常(400) / 粗(700) 全局生效。
 *
 * 所有配置写进主进程通用 settings 键值表（key 见 SETTING_KEYS）。
 */

import { getReadingThemeById, FOLLOW_UI_ID, DEFAULT_READING_THEME_ID } from './reading-themes'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ColorThemeKey =
  | 'azure' | 'claude' | 'dusk' | 'elegant' | 'luxury' | 'nature'
  | 'ocean' | 'professional' | 'retro' | 'snow-cinnabar' | 'vibrant'
  | 'image-aqua' | 'image-petal' | 'image-snow'
  | 'random'
export type FontWeight = 'thin' | 'normal' | 'bold'

/** 系统默认 UI 字体栈（全局文字兜底）。 */
export const DEFAULT_UI_STACK = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"

/** 等宽字体栈（仅代码块 `<code>` / `<pre>` 使用）。 */
export const DEFAULT_MONO_STACK = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

export interface Appearance {
  theme: ThemeMode
  /** NewMax 颜色主题（整面色板）；'none' 表示使用默认基准（深绿松石品牌）。 */
  colorTheme: ColorThemeKey | 'none'
  /** UI 全文字体族名；空字符串表示使用系统默认（DEFAULT_UI_STACK）。 */
  fontFamily: string
  /** 字号缩放 0.7–2.0（即 70%–200%）。 */
  fontScale: number
  /** 字重：细(300) / 正常(400) / 粗(700)，全局生效。 */
  fontWeight: FontWeight
  /** 阅读正文配色主题 ID；`__follow_ui__` 表示跟随 UI 界面配色。 */
  readingTheme: string
  /** 图片壁纸主题时是否对背景壁纸应用模糊。 */
  wallpaperBlur: boolean
}

export const SETTING_KEYS = {
  theme: 'theme',
  colorTheme: 'color_theme',
  fontFamily: 'font_family',
  fontScale: 'font_scale',
  fontWeight: 'font_weight',
  readingTheme: 'reading_theme',
  wallpaperBlur: 'wallpaper_blur'
} as const

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'system',
  colorTheme: 'none',
  fontFamily: '',
  fontScale: 1,
  fontWeight: 'normal',
  readingTheme: FOLLOW_UI_ID,
  wallpaperBlur: false
}

export const THEME_OPTIONS: Array<{ key: ThemeMode; label: string }> = [
  { key: 'system', label: '跟随系统' },
  { key: 'light', label: '亮色' },
  { key: 'dark', label: '暗色' }
]

/** NewMax 实色颜色主题（11 套 + 随机），对应 themes.css 中的 html[data-theme]。 */
export const COLOR_THEMES: Array<{ key: ColorThemeKey; label: string; preview: string }> = [
  { key: 'azure', label: '天蓝', preview: 'linear-gradient(135deg,#0a64d6,#7fc3ff)' },
  { key: 'claude', label: 'Claude', preview: 'linear-gradient(135deg,#d97757,#faf9f5)' },
  { key: 'dusk', label: '暮色', preview: 'linear-gradient(135deg,#706b3a,#cfd0a0)' },
  { key: 'elegant', label: '雅致', preview: 'linear-gradient(135deg,#57606f,#d4a64d)' },
  { key: 'luxury', label: '奢华', preview: 'linear-gradient(135deg,#1e1e1e,#b8993a)' },
  { key: 'nature', label: '自然', preview: 'linear-gradient(135deg,#2d5a27,#c05850)' },
  { key: 'ocean', label: '海洋', preview: 'linear-gradient(135deg,#0b6a9e,#7dd3fc)' },
  { key: 'professional', label: '商务', preview: 'linear-gradient(135deg,#0056b3,#3d9e8e)' },
  { key: 'retro', label: '复古', preview: 'linear-gradient(135deg,#b45309,#e4bf6a)' },
  { key: 'snow-cinnabar', label: '雪映朱砂', preview: 'linear-gradient(135deg,#984933,#c36a50)' },
  { key: 'vibrant', label: '活力', preview: 'linear-gradient(135deg,#2d3436,#3aaba6)' },
  // 随机：preview 用一个动态问号图标，由 SettingsView 在点击时刷新
  { key: 'random', label: '随机', preview: 'linear-gradient(135deg,#888,#bbb)' }
]

/** NewMax 图片壁纸主题（image-*），对应 app.css 中 body::before 壁纸图层。 */
export const IMAGE_WALLPAPERS: Array<{ key: ColorThemeKey; label: string; thumb: string }> = [
  { key: 'image-aqua', label: '晴空蓝构', thumb: new URL('../assets/wallpapers/aqua-curves.jpg', import.meta.url).href },
  { key: 'image-petal', label: '雾花柔光', thumb: new URL('../assets/wallpapers/petal-haze.jpg', import.meta.url).href },
  { key: 'image-snow', label: '雪映朱砂', thumb: new URL('../assets/wallpapers/snow-cinnabar-wallpaper.jpg', import.meta.url).href }
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
const asBool = (v: unknown, fallback: boolean): boolean => (typeof v === 'string' ? v === '1' : typeof v === 'boolean' ? v : fallback)

export async function loadAppearance(): Promise<Appearance> {
  const get = (k: string) => window.readflow.invoke('settings:get', k) as Promise<string | null | undefined>
  const [theme, colorTheme, ff, fs, fw, wb] = await Promise.all([
    get(SETTING_KEYS.theme), get(SETTING_KEYS.colorTheme),
    get(SETTING_KEYS.fontFamily), get(SETTING_KEYS.fontScale), get(SETTING_KEYS.fontWeight),
    get(SETTING_KEYS.wallpaperBlur)
  ])
  const validTheme = (asString(colorTheme, DEFAULT_APPEARANCE.colorTheme) as ColorThemeKey | 'none')
  const scale = Number(asString(fs, String(DEFAULT_APPEARANCE.fontScale)))
  const weight = asString(fw, DEFAULT_APPEARANCE.fontWeight) as FontWeight
  const allKeys = new Set([...COLOR_THEMES.map((s) => s.key), ...IMAGE_WALLPAPERS.map((s) => s.key)])
  return {
    theme: (['system', 'light', 'dark'].includes(asString(theme, DEFAULT_APPEARANCE.theme)) ? asString(theme, DEFAULT_APPEARANCE.theme) : DEFAULT_APPEARANCE.theme) as ThemeMode,
    colorTheme: validTheme === 'none' || allKeys.has(validTheme) ? validTheme : DEFAULT_APPEARANCE.colorTheme,
    fontFamily: asString(ff, DEFAULT_APPEARANCE.fontFamily),
    fontScale: Number.isFinite(scale) ? Math.min(2, Math.max(0.7, scale)) : DEFAULT_APPEARANCE.fontScale,
    fontWeight: (['thin', 'normal', 'bold'].includes(weight) ? weight : DEFAULT_APPEARANCE.fontWeight) as FontWeight,
    readingTheme: asString(undefined, FOLLOW_UI_ID),
    wallpaperBlur: asBool(wb, DEFAULT_APPEARANCE.wallpaperBlur)
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
const RANDOM_PALETTE_KEY = 'readflow:random-palette'

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

// ---------- 随机主题：HSL 随机 + WCAG 4.5:1 对比度校正 ----------
// 参考 NewMax §3.6「random 由 boot 内联脚本计算 → luminance/contrast/mix/rgbToHsl/readableOn」。

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  // h: 0-360, s/l: 0-100 → r,g,b: 0-255
  const sN = s / 100, lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const hh = (h % 360) / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  let r = 0, g = 0, b = 0
  if (hh < 1) [r, g, b] = [c, x, 0]
  else if (hh < 2) [r, g, b] = [x, c, 0]
  else if (hh < 3) [r, g, b] = [0, c, x]
  else if (hh < 4) [r, g, b] = [0, x, c]
  else if (hh < 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const m = lN - c / 2
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function relLuminance(rgb: [number, number, number]): number {
  // WCAG 相对亮度
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
}

function contrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const l1 = relLuminance(rgb1), l2 = relLuminance(rgb2)
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (a + 0.05) / (b + 0.05)
}

/** 二分搜索出与 base 对比度 ≥ ratio 的最接近亮度，返回 HSL。 */
function readableHsl(h: number, s: number, base: [number, number, number], ratio: number): [number, number, number] {
  const rgbAtL = (l: number): [number, number, number] => hslToRgb(h, s, l)
  let lo = 0, hi = 100
  if (contrastRatio(rgbAtL(lo), base) >= ratio) return [h, s, lo]
  if (contrastRatio(rgbAtL(hi), base) >= ratio) return [h, s, hi]
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (contrastRatio(rgbAtL(mid), base) >= ratio) return [h, s, mid]
    const midLum = relLuminance(rgbAtL(mid))
    if (midLum > relLuminance(base)) hi = mid
    else lo = mid
  }
  return [h, s, lo]
}

interface RandomPalette {
  light: Record<string, string>
  dark: Record<string, string>
  seed: number
}

function generateRandomPalette(seed?: number): RandomPalette {
  const rand = seed ?? Math.floor(Math.random() * 360)
  const h = rand % 360
  const s = 55 + Math.floor(Math.random() * 25)
  const lightBase: [number, number, number] = [255, 253, 248]
  const darkBase: [number, number, number] = [30, 31, 31]
  const lightText = readableHsl(h, 30, lightBase, 7)
  const darkText = readableHsl(h, 20, darkBase, 7)
  const brandForLight = readableHsl(h, s, lightBase, 4.5)
  const brandForDark = readableHsl(h, s, darkBase, 4.5)
  const accentH = (h + 30) % 360
  const accentForLight = readableHsl(accentH, s, lightBase, 4.5)
  const accentForDark = readableHsl(accentH, s, darkBase, 4.5)
  const hslCss = (hsl: [number, number, number]) => `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)`
  return {
    light: {
      '--ds-text-primary': hslCss(lightText),
      '--ds-text-secondary': 'rgba(24,27,25,0.64)',
      '--ds-text-tertiary': 'rgba(24,27,25,0.48)',
      '--ds-brand-primary': hslCss(brandForLight),
      '--ds-brand-primary-text': '#ffffff',
      '--ds-accent': hslCss(accentForLight),
      '--ds-icon': 'rgba(24,27,25,0.5)'
    },
    dark: {
      '--ds-text-primary': hslCss(darkText),
      '--ds-text-secondary': 'rgba(255,255,255,0.6)',
      '--ds-text-tertiary': 'rgba(255,255,255,0.38)',
      '--ds-brand-primary': hslCss(brandForDark),
      '--ds-brand-primary-text': '#1e1f1f',
      '--ds-accent': hslCss(accentForDark),
      '--ds-icon': 'rgba(255,255,255,0.55)'
    },
    seed: rand
  }
}

function loadOrNewRandomPalette(): RandomPalette {
  try {
    const raw = localStorage.getItem(RANDOM_PALETTE_KEY)
    if (raw) {
      return JSON.parse(raw) as RandomPalette
    }
  } catch { /* 忽略 */ }
  const palette = generateRandomPalette()
  try { localStorage.setItem(RANDOM_PALETTE_KEY, JSON.stringify(palette)) } catch { /* 忽略 */ }
  return palette
}

/** 重新生成随机主题色板（用户每次点击「随机」时调用，刷新种子）。 */
export function rerollRandomPalette(): RandomPalette {
  const palette = generateRandomPalette()
  try { localStorage.setItem(RANDOM_PALETTE_KEY, JSON.stringify(palette)) } catch { /* 忽略 */ }
  return palette
}

/** 将外观配置应用到 document，立即生效。 */
export function applyAppearance(a: Appearance): void {
  const root = document.documentElement

  // 主题模式：亮暗通过 html.dark 类切换（NewMax 约定）
  root.classList.toggle('dark', resolveDark(a.theme))
  root.style.colorScheme = resolveDark(a.theme) ? 'dark' : 'light'

  // 颜色主题：
  //   - 'none'      → 使用默认基准（themes.css :root）
  //   - 'random'    → 动态 inline --ds-*（覆盖基准）
  //   - 其他        → themes.css 中对应 data-theme 块（含 11 实色 + 3 image-*）
  if (a.colorTheme === 'none') {
    root.removeAttribute('data-theme')
    clearRandomInlineTokens()
  } else if (a.colorTheme === 'random') {
    root.removeAttribute('data-theme')
    applyRandomInlineTokens()
  } else {
    root.setAttribute('data-theme', a.colorTheme)
    clearRandomInlineTokens()
  }

  // 图片壁纸主题：标记 html 属性，app.css 据此应用 body::before 壁纸图层 + 模糊
  root.toggleAttribute('data-wallpaper', a.colorTheme.startsWith('image-'))
  root.toggleAttribute('data-wallpaper-blur', a.colorTheme.startsWith('image-') && a.wallpaperBlur)

  // 字号缩放 + 字体族 + 字重（全局生效）
  root.style.setProperty('--font-scale', String(a.fontScale))
  const stack = uiFontStack(a.fontFamily)
  root.style.setProperty('--font-reading', stack)
  root.style.setProperty('--font-ui', stack)
  root.style.setProperty('--font-weight', String(FONT_WEIGHT_VALUE(a.fontWeight)))

  // 镜像到 localStorage，下次启动首帧前由 bootAppearance 同步应用
  cacheAppearance(a)

  // 阅读正文配色：独立于 UI 颜色主题，注入 --rt-* CSS 变量到 :root
  applyReadingTheme(a.readingTheme)
}

function applyRandomInlineTokens(): void {
  const root = document.documentElement
  const palette = loadOrNewRandomPalette()
  const dark = root.classList.contains('dark')
  const map = dark ? palette.dark : palette.light
  for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v)
}

function clearRandomInlineTokens(): void {
  const root = document.documentElement
  for (const k of ['--ds-text-primary', '--ds-text-secondary', '--ds-text-tertiary', '--ds-brand-primary', '--ds-brand-primary-text', '--ds-accent', '--ds-icon']) {
    root.style.removeProperty(k)
  }
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
      if (!a.colorTheme) a.colorTheme = DEFAULT_APPEARANCE.colorTheme
      if (typeof a.wallpaperBlur !== 'boolean') a.wallpaperBlur = DEFAULT_APPEARANCE.wallpaperBlur
    }
  } catch { a = null }
  applyAppearance(a ?? DEFAULT_APPEARANCE)
}

/**
 * 监听系统主题变化：system 模式下跟随系统亮暗切换（重新应用 .dark 类 + random inline 令牌）。
 * 由 store.initAppearance 在启动时注册一次。
 */
export function watchSystemTheme(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => onChange()
  mq.addEventListener?.('change', handler)
  return () => mq.removeEventListener?.('change', handler)
}