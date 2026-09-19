/**
 * 内置合成音效主题预设
 *
 * 全部使用 Web Audio 合成，零音频素材、零版权风险、零冷启动开销。
 * 每个主题覆盖 SoundCue 全集（tap / toggle / open / delete / lift / drop / complete / style / hover / mark），
 * 参数基于「音色性格」调校：
 *
 *   wooden      木质温润  —— 中低频三角波、柔和噪声、慢起音，拟木鱼 / 木琴
 *   mechanical  机械键盘  —— 方波主调 + 高频短噪声，模拟青轴 / 段落感
 *   retro       8-bit 复古 —— 高频方波琶音、短促干脆，红白机 / GameBoy 风
 *   glass       玻璃清亮  —— 高频正弦铃、长衰减、轻微二次泛音，拟风铃 / 玻璃杯
 *
 * 新增主题只需追加一个 SoundThemeMap，然后在 lib/theme-presets.ts 里注册即可。
 */

import type { SoundThemeMap } from './sound-themes'

/** 木质温润：中低频三角波为主，起音偏软，营造温暖手感 */
export const WOODEN_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'tone', frequency: 180, endFrequency: 140, duration: 0.055, gain: 0.028, oscillator: 'triangle' },
    { type: 'noise', duration: 0.012, gain: 0.012, frequency: 900, filter: 'lowpass' }
  ],
  toggle: [
    { type: 'tone', frequency: 220, endFrequency: 320, duration: 0.085, gain: 0.026, oscillator: 'triangle' },
    { type: 'noise', duration: 0.014, gain: 0.01, frequency: 700, filter: 'lowpass' }
  ],
  open: [
    { type: 'tone', frequency: 260, endFrequency: 420, duration: 0.14, gain: 0.03, oscillator: 'triangle' },
    { type: 'tone', at: 0.05, frequency: 520, duration: 0.11, gain: 0.014, oscillator: 'sine' }
  ],
  delete: [
    { type: 'tone', frequency: 210, endFrequency: 110, duration: 0.13, gain: 0.032, oscillator: 'triangle' },
    { type: 'noise', duration: 0.022, gain: 0.016, frequency: 500, filter: 'lowpass' }
  ],
  lift: [
    { type: 'tone', frequency: 300, endFrequency: 380, duration: 0.075, gain: 0.022, oscillator: 'triangle' }
  ],
  drop: [
    { type: 'tone', frequency: 220, endFrequency: 160, duration: 0.095, gain: 0.03, oscillator: 'triangle' },
    { type: 'noise', duration: 0.016, gain: 0.014, frequency: 600, filter: 'lowpass' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 329.63, duration: 0.18, gain: 0.026, oscillator: 'triangle' },
    { type: 'tone', at: 0.08, frequency: 415.3, duration: 0.18, gain: 0.026, oscillator: 'triangle' },
    { type: 'tone', at: 0.16, frequency: 493.88, duration: 0.36, gain: 0.032, oscillator: 'triangle' }
  ],
  style: [
    { type: 'tone', frequency: 340, endFrequency: 460, duration: 0.14, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.03, frequency: 680, duration: 0.14, gain: 0.008, oscillator: 'sine' }
  ],
  hover: [
    { type: 'tone', frequency: 900, endFrequency: 1100, duration: 0.045, gain: 0.01, oscillator: 'sine' }
  ],
  mark: [
    { type: 'tone', frequency: 280, endFrequency: 380, duration: 0.1, gain: 0.024, oscillator: 'triangle' },
    { type: 'tone', at: 0.04, frequency: 500, duration: 0.08, gain: 0.012, oscillator: 'sine' }
  ]
}

/** 机械键盘：方波主体 + 高频短噪声点击，段落感强 */
export const MECHANICAL_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'noise', duration: 0.006, gain: 0.05, frequency: 4200, filter: 'highpass' },
    { type: 'tone', frequency: 420, endFrequency: 340, duration: 0.035, gain: 0.022, oscillator: 'square' }
  ],
  toggle: [
    { type: 'noise', duration: 0.007, gain: 0.04, frequency: 3600, filter: 'highpass' },
    { type: 'tone', frequency: 700, endFrequency: 520, duration: 0.05, gain: 0.02, oscillator: 'square' },
    { type: 'tone', at: 0.055, frequency: 900, duration: 0.035, gain: 0.014, oscillator: 'square' }
  ],
  open: [
    { type: 'tone', frequency: 500, endFrequency: 820, duration: 0.08, gain: 0.026, oscillator: 'square' },
    { type: 'noise', duration: 0.008, gain: 0.02, frequency: 3200, filter: 'highpass' }
  ],
  delete: [
    { type: 'tone', frequency: 380, endFrequency: 160, duration: 0.1, gain: 0.03, oscillator: 'square' },
    { type: 'noise', duration: 0.02, gain: 0.022, frequency: 1600, filter: 'bandpass' }
  ],
  lift: [
    { type: 'tone', frequency: 560, endFrequency: 700, duration: 0.045, gain: 0.02, oscillator: 'square' },
    { type: 'noise', duration: 0.005, gain: 0.018, frequency: 4000, filter: 'highpass' }
  ],
  drop: [
    { type: 'tone', frequency: 400, endFrequency: 280, duration: 0.06, gain: 0.028, oscillator: 'square' },
    { type: 'noise', duration: 0.012, gain: 0.024, frequency: 2400, filter: 'bandpass' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 523.25, duration: 0.06, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.055, frequency: 659.25, duration: 0.06, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.11, frequency: 783.99, duration: 0.09, gain: 0.026, oscillator: 'square' },
    { type: 'tone', at: 0.19, frequency: 1046.5, duration: 0.18, gain: 0.028, oscillator: 'square' }
  ],
  style: [
    { type: 'tone', frequency: 720, endFrequency: 940, duration: 0.07, gain: 0.022, oscillator: 'square' },
    { type: 'noise', duration: 0.006, gain: 0.016, frequency: 3800, filter: 'highpass' }
  ],
  hover: [
    { type: 'noise', duration: 0.004, gain: 0.012, frequency: 4600, filter: 'highpass' }
  ],
  mark: [
    { type: 'tone', frequency: 620, endFrequency: 820, duration: 0.055, gain: 0.024, oscillator: 'square' },
    { type: 'noise', duration: 0.006, gain: 0.014, frequency: 3400, filter: 'highpass' }
  ]
}

/** 8-bit 复古：高频方波琶音、极短起音，红白机 / GameBoy 手感 */
export const RETRO_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'tone', frequency: 1200, duration: 0.03, gain: 0.022, oscillator: 'square' }
  ],
  toggle: [
    { type: 'tone', frequency: 880, duration: 0.035, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.04, frequency: 1320, duration: 0.045, gain: 0.022, oscillator: 'square' }
  ],
  open: [
    { type: 'tone', frequency: 660, duration: 0.04, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.045, frequency: 880, duration: 0.04, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.09, frequency: 1320, duration: 0.08, gain: 0.022, oscillator: 'square' }
  ],
  delete: [
    { type: 'tone', frequency: 440, endFrequency: 110, duration: 0.14, gain: 0.028, oscillator: 'square' },
    { type: 'noise', duration: 0.03, gain: 0.014, frequency: 800, filter: 'bandpass' }
  ],
  lift: [
    { type: 'tone', frequency: 880, endFrequency: 1320, duration: 0.05, gain: 0.022, oscillator: 'square' }
  ],
  drop: [
    { type: 'tone', frequency: 660, endFrequency: 330, duration: 0.07, gain: 0.026, oscillator: 'square' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 523.25, duration: 0.05, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.055, frequency: 659.25, duration: 0.05, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.11, frequency: 783.99, duration: 0.05, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.165, frequency: 1046.5, duration: 0.06, gain: 0.026, oscillator: 'square' },
    { type: 'tone', at: 0.225, frequency: 1318.5, duration: 0.22, gain: 0.028, oscillator: 'square' }
  ],
  style: [
    { type: 'tone', frequency: 990, duration: 0.04, gain: 0.022, oscillator: 'square' },
    { type: 'tone', at: 0.05, frequency: 1320, duration: 0.06, gain: 0.02, oscillator: 'square' }
  ],
  hover: [
    { type: 'tone', frequency: 1760, duration: 0.02, gain: 0.01, oscillator: 'square' }
  ],
  mark: [
    { type: 'tone', frequency: 784, duration: 0.04, gain: 0.024, oscillator: 'square' },
    { type: 'tone', at: 0.045, frequency: 1046, duration: 0.05, gain: 0.022, oscillator: 'square' }
  ]
}

/** 玻璃清亮：高频正弦铃 + 长衰减 + 轻微二次泛音，风铃质感 */
export const GLASS_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'tone', frequency: 2400, duration: 0.09, gain: 0.016, oscillator: 'sine' },
    { type: 'tone', frequency: 3600, duration: 0.06, gain: 0.006, oscillator: 'sine' }
  ],
  toggle: [
    { type: 'tone', frequency: 1800, endFrequency: 2200, duration: 0.11, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.01, frequency: 3600, duration: 0.08, gain: 0.007, oscillator: 'sine' }
  ],
  open: [
    { type: 'tone', frequency: 1200, endFrequency: 1600, duration: 0.22, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.02, frequency: 2400, duration: 0.18, gain: 0.008, oscillator: 'sine' },
    { type: 'tone', at: 0.04, frequency: 3200, duration: 0.14, gain: 0.005, oscillator: 'sine' }
  ],
  delete: [
    { type: 'tone', frequency: 1400, endFrequency: 700, duration: 0.18, gain: 0.022, oscillator: 'sine' },
    { type: 'noise', duration: 0.02, gain: 0.008, frequency: 3200, filter: 'highpass' }
  ],
  lift: [
    { type: 'tone', frequency: 2000, endFrequency: 2600, duration: 0.1, gain: 0.016, oscillator: 'sine' }
  ],
  drop: [
    { type: 'tone', frequency: 1800, endFrequency: 1200, duration: 0.14, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.01, frequency: 2600, duration: 0.1, gain: 0.008, oscillator: 'sine' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 1046.5, duration: 0.32, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.09, frequency: 1318.5, duration: 0.32, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.18, frequency: 1567.98, duration: 0.42, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.18, frequency: 2093, duration: 0.36, gain: 0.008, oscillator: 'sine' }
  ],
  style: [
    { type: 'tone', frequency: 1600, endFrequency: 2200, duration: 0.18, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.02, frequency: 3200, duration: 0.14, gain: 0.006, oscillator: 'sine' }
  ],
  hover: [
    { type: 'tone', frequency: 3200, duration: 0.04, gain: 0.008, oscillator: 'sine' }
  ],
  mark: [
    { type: 'tone', frequency: 1600, endFrequency: 2000, duration: 0.12, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.02, frequency: 2400, duration: 0.1, gain: 0.008, oscillator: 'sine' }
  ]
}

/* ===================== 柔和音效 + ZzFX 参数化音效 ===================== */

/**
 * 以下主题使用正弦波合成或 ZzFX 参数化合成引擎（见 lib/zzfx.ts），
 * 提供更柔和的提示音或 tone/noise 表达不了的滑音、噪声混合、位压缩音色。
 *
 * ZzFX 参数速查（完整说明见 lib/zzfx.ts）：
 *   [0] 音量  [1] 频率随机抖动  [2] 基频 Hz  [3] 起音  [4] 保持  [5] 释放
 *   [6] 波形（0 正弦 / 1 三角 / 2 锯齿 / 3 正切 / 4 噪声 / 5 方波占空比）  [7] 波形曲线
 *   [8] 滑音  [9] 滑音加速度  [10] 音高跳变  [11] 跳变时刻  [12] 重复周期
 *   [13] 噪声混合  [14] 频率调制  [15] 位压缩  [16] 延迟
 *   [17] 保持段音量  [18] 衰减  [19] 颤音  [20] 滤波（正高通 / 负低通）
 *
 * 频率换算（与采样率无关，便于设计音高轨迹）：
 *   滑音带来的频率变化量 ≈ slide × 时长(秒) × 500 Hz
 *   滑音加速度带来的额外变化量 ≈ (时长² / 2) × deltaSlide × 500 Hz
 *   音高跳变增量即 pitchJump Hz
 */

/** 柔风轻语：正弦波柔和滑音，低频温暖，轻柔不打扰 */
export const SOFT_BREEZE_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'tone', frequency: 440, endFrequency: 520, duration: 0.06, gain: 0.018, oscillator: 'sine' }
  ],
  toggle: [
    { type: 'tone', frequency: 392, endFrequency: 523.25, duration: 0.09, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.04, frequency: 659.25, duration: 0.08, gain: 0.01, oscillator: 'sine' }
  ],
  open: [
    { type: 'tone', frequency: 330, endFrequency: 494, duration: 0.16, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.06, frequency: 660, duration: 0.12, gain: 0.008, oscillator: 'sine' }
  ],
  delete: [
    { type: 'tone', frequency: 392, endFrequency: 247, duration: 0.14, gain: 0.022, oscillator: 'sine' },
    { type: 'noise', duration: 0.02, gain: 0.006, frequency: 400, filter: 'lowpass' }
  ],
  lift: [
    { type: 'tone', frequency: 392, endFrequency: 494, duration: 0.09, gain: 0.016, oscillator: 'sine' }
  ],
  drop: [
    { type: 'tone', frequency: 494, endFrequency: 392, duration: 0.1, gain: 0.02, oscillator: 'sine' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 523.25, duration: 0.2, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.1, frequency: 659.25, duration: 0.2, gain: 0.022, oscillator: 'sine' },
    { type: 'tone', at: 0.2, frequency: 783.99, duration: 0.36, gain: 0.024, oscillator: 'sine' }
  ],
  style: [
    { type: 'tone', frequency: 440, endFrequency: 554, duration: 0.16, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.04, frequency: 659, duration: 0.14, gain: 0.006, oscillator: 'sine' }
  ],
  hover: [
    { type: 'tone', frequency: 880, duration: 0.05, gain: 0.008, oscillator: 'sine' }
  ],
  mark: [
    { type: 'tone', frequency: 440, endFrequency: 554, duration: 0.1, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.04, frequency: 659, duration: 0.08, gain: 0.008, oscillator: 'sine' }
  ]
}

/** 雨滴柔和：短促正弦衰减，拟雨滴落水，轻柔圆润 */
export const RAINDROP_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'tone', frequency: 880, endFrequency: 660, duration: 0.05, gain: 0.016, oscillator: 'sine' },
    { type: 'tone', at: 0.01, frequency: 1320, duration: 0.03, gain: 0.004, oscillator: 'sine' }
  ],
  toggle: [
    { type: 'tone', frequency: 660, endFrequency: 880, duration: 0.08, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.03, frequency: 1100, duration: 0.06, gain: 0.006, oscillator: 'sine' }
  ],
  open: [
    { type: 'tone', frequency: 523.25, endFrequency: 784, duration: 0.14, gain: 0.02, oscillator: 'sine' },
    { type: 'tone', at: 0.05, frequency: 1046.5, duration: 0.1, gain: 0.006, oscillator: 'sine' }
  ],
  delete: [
    { type: 'tone', frequency: 660, endFrequency: 392, duration: 0.12, gain: 0.02, oscillator: 'sine' },
    { type: 'noise', duration: 0.016, gain: 0.006, frequency: 600, filter: 'lowpass' }
  ],
  lift: [
    { type: 'tone', frequency: 587.33, endFrequency: 784, duration: 0.08, gain: 0.014, oscillator: 'sine' }
  ],
  drop: [
    { type: 'tone', frequency: 784, endFrequency: 523.25, duration: 0.1, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.02, frequency: 1100, duration: 0.06, gain: 0.005, oscillator: 'sine' }
  ],
  complete: [
    { type: 'tone', at: 0, frequency: 659.25, duration: 0.18, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.08, frequency: 783.99, duration: 0.18, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.16, frequency: 1046.5, duration: 0.32, gain: 0.022, oscillator: 'sine' }
  ],
  style: [
    { type: 'tone', frequency: 523.25, endFrequency: 698.46, duration: 0.14, gain: 0.016, oscillator: 'sine' },
    { type: 'tone', at: 0.03, frequency: 880, duration: 0.12, gain: 0.005, oscillator: 'sine' }
  ],
  hover: [
    { type: 'tone', frequency: 1320, duration: 0.03, gain: 0.006, oscillator: 'sine' }
  ],
  mark: [
    { type: 'tone', frequency: 587.33, endFrequency: 784, duration: 0.09, gain: 0.018, oscillator: 'sine' },
    { type: 'tone', at: 0.03, frequency: 988, duration: 0.06, gain: 0.006, oscillator: 'sine' }
  ]
}

/** 水泡湿润：正弦上滑 + 滑音加速，柔和圆润，拟水滴与气泡 */
export const BUBBLE_SOUND_MAP: SoundThemeMap = {
  tap: [
    { type: 'zzfx', params: [0.38, 0.02, 420, 0, 0, 0.09, 0, 1, 8, 200] }
  ],
  toggle: [
    { type: 'zzfx', params: [0.38, 0.02, 380, 0, 0.02, 0.11, 0, 1, 6, 180] }
  ],
  open: [
    { type: 'zzfx', params: [0.42, 0.02, 300, 0, 0.04, 0.22, 0, 1, 7, 150] }
  ],
  delete: [
    { type: 'zzfx', params: [0.4, 0.03, 900, 0, 0, 0.16, 0, 1, -5, -60] }
  ],
  lift: [
    { type: 'zzfx', params: [0.34, 0.02, 340, 0, 0, 0.08, 0, 1, 7, 220] }
  ],
  drop: [
    { type: 'zzfx', params: [0.38, 0.02, 700, 0, 0, 0.1, 0, 1, -6, -80] }
  ],
  complete: [
    { type: 'zzfx', at: 0, params: [0.32, 0.02, 440, 0, 0, 0.12, 0, 1, 7, 180] },
    { type: 'zzfx', at: 0.08, params: [0.32, 0.02, 587, 0, 0, 0.12, 0, 1, 7, 180] },
    { type: 'zzfx', at: 0.16, params: [0.34, 0.02, 880, 0, 0.02, 0.24, 0, 1, 6, 60] }
  ],
  style: [
    { type: 'zzfx', params: [0.34, 0.02, 280, 0, 0.05, 0.26, 0, 1, 2, 60] }
  ],
  hover: [
    { type: 'zzfx', params: [0.2, 0.02, 800, 0, 0, 0.05, 0, 1, 10, 250] }
  ],
  mark: [
    { type: 'zzfx', params: [0.34, 0.02, 460, 0, 0, 0.1, 0, 1, 7, 200] }
  ]
}
