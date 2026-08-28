/**
 * Capybara 语义化 UI 音效引擎
 *
 * 移植并适配自 shiye-tabs 的 sounds.ts（保留其 Web Audio 合成范式：用振荡器 +
 * 噪声 + 包络合成短促、克制的反馈音，零素材依赖，零网络请求）。
 *
 * 设计原则：
 * - 高频操作（点击/悬停）保持极短、极低音量；只有「重要结果」才用和声音型。
 * - 仅在用户交互触发的调用链中发声，以符合浏览器/Electron 自动播放策略。
 * - 音频设备不可用时静默降级，绝不阻塞交互。
 * - 全局 enabled / volume 由设置面板控制。
 */

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

let context: AudioContext | null = null
let master: GainNode | null = null
let lastPlayedAt = 0
let lastGearAt = 0

let enabled = false
let volume = 0.7

/** 由设置面板调用，控制总开关与音量（0–1）。 */
export function setSoundEnabled(value: boolean) {
  enabled = value
  if (value) void ensureAudio()
}
export function setSoundVolume(value: number) {
  volume = Math.min(1, Math.max(0, value))
  if (master && context) master.gain.value = volume
}
export function isSoundEnabled() {
  return enabled
}

/** AudioContext 是否已就绪（running 状态），用于判断是否需要等待 resume */
let audioReady = false

function ensureAudio(): { ctx: AudioContext; out: GainNode } | null {
  try {
    if (!context) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      // 使用 'balanced' 而非 'interactive'：interactive 在某些系统上首次初始化更慢
      context = new Ctor({ latencyHint: 'balanced' })
      // 监听状态变化，标记就绪
      context.addEventListener('statechange', () => {
        audioReady = context?.state === 'running'
      })
    }
    if (!master) {
      master = context.createGain()
      master.gain.value = volume
      master.connect(context.destination)
    }
    if (context.state === 'suspended') {
      // resume 是异步的，但不阻塞音频调度——调度会在 resume 完成后自动播放
      void context.resume().then(() => { audioReady = true })
    }
    return { ctx: context, out: master }
  } catch {
    return null
  }
}

function tone(
  ctx: AudioContext,
  destination: AudioNode,
  options: {
    at?: number
    frequency: number
    endFrequency?: number
    duration: number
    gain?: number
    type?: OscillatorType
  }
) {
  const start = ctx.currentTime + (options.at ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = options.type ?? 'sine'
  osc.frequency.setValueAtTime(options.frequency, start)
  if (options.endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(options.endFrequency, start + options.duration)
  }
  const peak = options.gain ?? 0.025
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(peak, start + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, start + options.duration)
  osc.connect(g)
  g.connect(destination)
  osc.onended = () => {
    osc.disconnect()
    g.disconnect()
  }
  osc.start(start)
  osc.stop(start + options.duration + 0.02)
}

function noise(
  ctx: AudioContext,
  destination: AudioNode,
  options: {
    at?: number
    duration: number
    gain: number
    frequency: number
    filter?: BiquadFilterType
  }
) {
  const start = ctx.currentTime + (options.at ?? 0)
  const length = Math.max(1, Math.floor(ctx.sampleRate * options.duration))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.18))
  }
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const g = ctx.createGain()
  source.buffer = buffer
  filter.type = options.filter ?? 'bandpass'
  filter.frequency.value = options.frequency
  filter.Q.value = 2.2
  g.gain.value = options.gain
  source.connect(filter)
  filter.connect(g)
  g.connect(destination)
  source.onended = () => {
    source.disconnect()
    filter.disconnect()
    g.disconnect()
  }
  source.start(start)
}

/** 播放一个语义化音效。enabled=false 时直接返回。 */
export function playSound(cue: SoundCue) {
  if (!enabled || typeof AudioContext === 'undefined') return
  const now = performance.now()
  if (now - lastPlayedAt < 28) return
  lastPlayedAt = now

  const audio = ensureAudio()
  if (!audio) return
  const { ctx, out: destination } = audio

  try {
    switch (cue) {
      case 'tap':
        noise(ctx, destination, { duration: 0.008, gain: 0.04, frequency: 3600, filter: 'highpass' })
        break
      case 'toggle':
        noise(ctx, destination, { duration: 0.009, gain: 0.026, frequency: 2800 })
        tone(ctx, destination, { frequency: 680, endFrequency: 510, duration: 0.07, gain: 0.024 })
        break
      case 'open':
        tone(ctx, destination, { frequency: 360, endFrequency: 580, duration: 0.12, gain: 0.034, type: 'triangle' })
        tone(ctx, destination, { at: 0.045, frequency: 720, duration: 0.1, gain: 0.016 })
        break
      case 'delete':
        tone(ctx, destination, { frequency: 310, endFrequency: 175, duration: 0.1, gain: 0.03, type: 'triangle' })
        noise(ctx, destination, { duration: 0.016, gain: 0.018, frequency: 1200 })
        break
      case 'lift':
        tone(ctx, destination, { frequency: 440, endFrequency: 560, duration: 0.075, gain: 0.022, type: 'triangle' })
        break
      case 'drop':
        tone(ctx, destination, { frequency: 300, endFrequency: 235, duration: 0.085, gain: 0.03, type: 'triangle' })
        noise(ctx, destination, { duration: 0.01, gain: 0.018, frequency: 1900 })
        break
      case 'complete': {
        ;[523.25, 659.25, 783.99].forEach((frequency, index) =>
          tone(ctx, destination, {
            at: index * 0.07,
            frequency,
            duration: index === 2 ? 0.34 : 0.16,
            gain: index === 2 ? 0.032 : 0.024,
            type: 'triangle'
          })
        )
        break
      }
      case 'style':
        tone(ctx, destination, { frequency: 620, endFrequency: 820, duration: 0.13, gain: 0.022, type: 'sine' })
        tone(ctx, destination, { at: 0.025, frequency: 1240, endFrequency: 1320, duration: 0.16, gain: 0.009 })
        break
      case 'hover':
        tone(ctx, destination, { frequency: 1800, endFrequency: 2400, duration: 0.04, gain: 0.012, type: 'sine' })
        noise(ctx, destination, { duration: 0.006, gain: 0.008, frequency: 4800, filter: 'highpass' })
        break
      case 'mark':
        tone(ctx, destination, { frequency: 520, endFrequency: 660, duration: 0.1, gain: 0.026, type: 'triangle' })
        tone(ctx, destination, { at: 0.04, frequency: 880, duration: 0.08, gain: 0.014, type: 'triangle' })
        break
    }
  } catch {
    /* 音频设备不可用时静默降级 */
  }
}

/** 滚动棘轮音：按滚动距离调用，内部限频，避免触控板声音洪泛。默认关闭。 */
export function playScrollGear(delta: number, allow = false) {
  if (!enabled || !allow || delta === 0 || typeof AudioContext === 'undefined') return
  const now = performance.now()
  if (now - lastGearAt < 30) return
  lastGearAt = now

  const audio = ensureAudio()
  if (!audio) return
  const { ctx, out: destination } = audio
  if (ctx.state !== 'running') return
  try {
    const force = Math.min(1, Math.max(0.25, Math.abs(delta) / 90))
    const upward = delta < 0
    noise(ctx, destination, {
      duration: 0.011,
      gain: 0.012 + force * 0.012,
      frequency: upward ? 3100 : 2600,
      filter: 'bandpass'
    })
    tone(ctx, destination, {
      frequency: upward ? 620 : 520,
      endFrequency: upward ? 520 : 420,
      duration: 0.028,
      gain: 0.006 + force * 0.006,
      type: 'triangle'
    })
  } catch {
    /* 静默降级 */
  }
}

/** 在首次用户手势时预热 AudioContext，规避自动播放限制。
 *  幂等：已就绪时直接返回，无额外开销。 */
export function primeAudio() {
  if (context && audioReady) return
  ensureAudio()
}
