/**
 * 音效主题抽象层
 *
 * 设计目标：
 * - 把 SoundCue → 具体合成参数的映射从硬编码改为可插拔的「音效主题」
 * - 每个音效主题（SoundTheme）定义一组合成参数或音频资源路径
 * - 通过 setSoundTheme() 切换主题后，所有 playSound() 调用自动使用新参数
 * - 内置默认主题（Crystal 合成集），后续可注册新主题（如木质音、机械音、素材包）
 *
 * 扩展方式：
 * 1. 定义新主题：创建一组 SoundCue → SynthConfig 映射
 * 2. 注册：registerSoundTheme('wooden', configs, { label: '木质音' })
 * 3. 切换：setSoundTheme('wooden')
 * 4. 业务代码无感知：始终用 playSound('tap') 调用
 */

/** 音效语义名（所有主题必须覆盖这些 cue） */
export type SoundCue =
  | 'tap'        // 常规点击
  | 'toggle'     // 开关 / 分段切换
  | 'open'       // 打开外链 / 展开
  | 'delete'     // 删除
  | 'lift'       // 抓取 / 提起
  | 'drop'       // 放下
  | 'complete'   // 完成 / 收藏成功
  | 'style'      // 外观 / 配色变更
  | 'hover'      // 悬停（默认关闭，避免噪声洪泛）
  | 'mark'       // 状态变更（已读 / 归档 / 稍后读）

/** 单个音效的合成参数（与 sound.ts 的 tone/noise 函数参数对齐） */
export interface ToneConfig {
  type: 'tone'
  frequency: number
  endFrequency?: number
  duration: number
  gain?: number
  oscillator?: OscillatorType
  at?: number
}

export interface NoiseConfig {
  type: 'noise'
  duration: number
  gain: number
  frequency: number
  filter?: BiquadFilterType
  at?: number
}

/**
 * ZzFX 参数化音效（见 lib/zzfx.ts）。
 * 与 tone/noise 并列的第三种合成方式，用于表达滑音、噪声混合、位压缩等音色。
 */
export interface ZzfxConfig {
  type: 'zzfx'
  /** ZzFX 参数表（顺序见 zzfx.ts 的注释） */
  params: number[]
  /** 起始时刻（秒），用于把单音串成短琶音 */
  at?: number
}

export type SynthConfig = ToneConfig | NoiseConfig | ZzfxConfig

/** 一个音效主题 = SoundCue → 合成参数序列 的映射 */
export type SoundThemeMap = Record<SoundCue, SynthConfig[]>

/** 音效主题元信息（供设置页展示） */
export interface SoundThemeMeta {
  id: string
  label: string
  /** 卡片说明（设置页展示音色特征） */
  description?: string
  /** 预览音效序列（用于设置页试听） */
  preview: SoundCue[]
  builtIn: boolean
}

/** 注册表 */
const registry = new Map<string, { map: SoundThemeMap; meta: SoundThemeMeta }>()

/** 当前激活的音效主题 ID */
let activeId = 'crystal'

/** 当前激活的音效映射 */
let activeMap: SoundThemeMap | null = null

/** 内置主题元信息 */
const BUILTIN_META: SoundThemeMeta[] = [
  {
    id: 'crystal',
    label: 'Crystal 水晶',
    description: '高频泛音颗粒，清脆不抢戏',
    preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
    builtIn: true
  }
]

/**
 * 内置默认音效主题：Crystal 水晶
 * 从原 sound.ts 的硬编码参数提取，保持完全向后兼容
 */
const CRYSTAL_MAP: SoundThemeMap = {
  tap: [
    { type: 'noise', duration: 0.008, gain: 0.04, frequency: 3600, filter: 'highpass' }
  ],
  toggle: [
    { type: 'noise', duration: 0.009, gain: 0.026, frequency: 2800 },
    { type: 'tone', frequency: 680, endFrequency: 510, duration: 0.07, gain: 0.024 }
  ],
  open: [
    { type: 'tone', frequency: 360, endFrequency: 580, duration: 0.12, gain: 0.034, oscillator: 'triangle' },
    { type: 'tone', at: 0.045, frequency: 720, duration: 0.1, gain: 0.016 }
  ],
  delete: [
    { type: 'tone', frequency: 310, endFrequency: 175, duration: 0.1, gain: 0.03, oscillator: 'triangle' },
    { type: 'noise', duration: 0.016, gain: 0.018, frequency: 1200 }
  ],
  lift: [
    { type: 'tone', frequency: 440, endFrequency: 560, duration: 0.075, gain: 0.022, oscillator: 'triangle' }
  ],
  drop: [
    { type: 'tone', frequency: 300, endFrequency: 235, duration: 0.085, gain: 0.03, oscillator: 'triangle' },
    { type: 'noise', duration: 0.01, gain: 0.018, frequency: 1900 }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 523.25, duration: 0.16, gain: 0.024, oscillator: 'triangle' },
    { type: 'tone', at: 0.07, frequency: 659.25, duration: 0.16, gain: 0.024, oscillator: 'triangle' },
    { type: 'tone', at: 0.14, frequency: 783.99, duration: 0.34, gain: 0.032, oscillator: 'triangle' }
  ],
  style: [
    { type: 'tone', frequency: 620, endFrequency: 820, duration: 0.13, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.025, frequency: 1240, endFrequency: 1320, duration: 0.16, gain: 0.009 }
  ],
  hover: [
    { type: 'tone', frequency: 1800, endFrequency: 2400, duration: 0.04, gain: 0.012, oscillator: 'sine' },
    { type: 'noise', duration: 0.006, gain: 0.008, frequency: 4800, filter: 'highpass' }
  ],
  mark: [
    { type: 'tone', frequency: 520, endFrequency: 660, duration: 0.1, gain: 0.026, oscillator: 'triangle' },
    { type: 'tone', at: 0.04, frequency: 880, duration: 0.08, gain: 0.014, oscillator: 'triangle' }
  ]
}

// 注册内置主题
registry.set('crystal', { map: CRYSTAL_MAP, meta: BUILTIN_META[0] })

/** 注册一个音效主题 */
export function registerSoundTheme(id: string, map: SoundThemeMap, meta?: Partial<SoundThemeMeta>): void {
  const fullMeta: SoundThemeMeta = {
    id,
    label: meta?.label ?? id,
    description: meta?.description,
    preview: meta?.preview ?? ['tap', 'toggle', 'complete'],
    builtIn: meta?.builtIn ?? false
  }
  registry.set(id, { map, meta: fullMeta })
}

/** 设置当前音效主题 */
export function setSoundTheme(id: string): void {
  const entry = registry.get(id)
  if (!entry) return
  activeId = id
  activeMap = entry.map
}

/** 获取当前音效主题 ID */
export function getSoundThemeId(): string {
  return activeId
}

/** 获取当前音效主题映射（可能为 null，表示用默认） */
export function getSoundThemeMap(): SoundThemeMap | null {
  return activeMap
}

/** 获取所有已注册音效主题的元信息 */
export function listSoundThemes(): SoundThemeMeta[] {
  return [...registry.values()].map((e) => e.meta)
}

/** 按名称获取当前主题下的合成参数序列 */
export function resolveSoundCue(cue: SoundCue): SynthConfig[] {
  if (activeMap && activeMap[cue]) return activeMap[cue]
  // 回退到 Crystal 默认
  return CRYSTAL_MAP[cue] ?? []
}

/** 按主题 ID 获取合成参数序列（不改变当前主题），供设置页试听 */
export function resolveSoundCueFrom(themeId: string, cue: SoundCue): SynthConfig[] {
  const m = registry.get(themeId)?.map
  if (m && m[cue]) return m[cue]
  return CRYSTAL_MAP[cue] ?? []
}
