/**
 * Capybara 语义化 UI 音效引擎
 *
 * 核心职责：
 * - 管理 AudioContext 生命周期（创建 / resume / 降级）
 * - 接收 SoundCue 语义名 → 从当前音效主题解析合成参数 → 用 Web Audio 合成
 * - 全局 enabled / volume 控制
 *
 * 音效参数不再硬编码在此文件中，而是从 lib/sound-themes.ts 的主题系统获取。
 * 切换音效主题后，所有 playSound() 调用自动使用新参数，无需改动业务代码。
 */

import type { SoundCue, ToneConfig, NoiseConfig } from './sound-themes'
import { resolveSoundCue } from './sound-themes'

export type { SoundCue } from './sound-themes'

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
      context = new Ctor({ latencyHint: 'balanced' })
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
  options: ToneConfig
) {
  const start = ctx.currentTime + (options.at ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = options.oscillator ?? 'sine'
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
  options: NoiseConfig
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
    const configs = resolveSoundCue(cue)
    for (const cfg of configs) {
      if (cfg.type === 'tone') {
        tone(ctx, destination, cfg)
      } else {
        noise(ctx, destination, cfg)
      }
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
      oscillator: 'triangle'
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
