/**
 * ZzFX 微合成引擎（内联实现）
 *
 * 为什么不直接依赖 npm 包 zzfx：上游实现的 AudioContext 与主音量是模块级全局，
 * 挂不到本应用的 audio graph 上 —— 会绕过 master GainNode，使音量控制与「静音降级」失效。
 * 此处仅把这两处改为调用方注入，波形算法与上游保持一致。
 *
 * 来源：ZzFXMicro v1.3.2 —— Zuper Zmall Zound Zynth，作者 Frank Force，MIT 许可。
 *      https://github.com/KilledByAPixel/ZzFX
 *
 * 与 tone/noise 合成器的分工：ZzFX 是 21 参数的波形生成器，支持噪声混合、滑音、音高跳变、
 * 频率调制、位压缩、内建双二阶滤波，可产出 tone/noise 表达不了的音色（激光、金属、气泡），
 * 用于扩展音效库的风格维度。
 */

/**
 * ZzFX 参数表（顺序与上游一致；尾部可省略，缺省值同上游）：
 *
 *  [0] volume         音量
 *  [1] randomness     每次播放的频率随机抖动（0–1）
 *  [2] frequency      基频（Hz）
 *  [3] attack         起音时长（秒）
 *  [4] sustain        保持时长（秒）
 *  [5] release        释放时长（秒）
 *  [6] shape          波形 0 正弦 / 1 三角 / 2 锯齿 / 3 正切 / 4 噪声 / 5 方波占空比
 *  [7] shapeCurve     波形曲线（1 为线性）
 *  [8] slide          滑音
 *  [9] deltaSlide     滑音加速度
 *  [10] pitchJump     音高跳变增量
 *  [11] pitchJumpTime 跳变时刻（秒）
 *  [12] repeatTime    重复周期（秒）
 *  [13] noise         噪声混合量（0–1）
 *  [14] modulation    频率调制
 *  [15] bitCrush      位压缩（0–1）
 *  [16] delay         延迟（秒）
 *  [17] sustainVolume 保持段音量
 *  [18] decay         衰减时长（秒）
 *  [19] tremolo       颤音深度
 *  [20] filter        滤波（正值高通 / 负值低通，绝对值即截止频率）
 */
export type ZzfxParams = number[]

/** 在 destination 上合成并播放一段 ZzFX 音效；at 为相对当前时刻的延迟（秒） */
export function playZzfx(
  ctx: AudioContext,
  destination: AudioNode,
  volumeScale: number,
  params: ZzfxParams,
  at = 0
): void {
  const [
    volume = 1, randomness = 0.05, frequency = 220, attack = 0, sustain = 0, release = 0.1,
    shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0, pitchJump = 0, pitchJumpTime = 0,
    repeatTime = 0, noise = 0, modulation = 0, bitCrush = 0, delay = 0, sustainVolume = 1,
    decay = 0, tremolo = 0, filter = 0
  ] = params

  const RATE = ctx.sampleRate
  const TWO_PI = 2 * Math.PI
  const M = Math

  // 秒 → 样本数；attack 至少 9 个样本，避免起音爆音
  const attackLen = attack * RATE + 9
  const decayLen = decay * RATE
  const sustainLen = sustain * RATE
  const releaseLen = release * RATE
  const delayLen = delay * RATE
  const repeatLen = (repeatTime * RATE) | 0
  const jumpTime = pitchJumpTime * RATE

  const slideStep = slide * 500 * TWO_PI / RATE / RATE
  const slideAccel = deltaSlide * 500 * TWO_PI / RATE ** 3
  const modStep = modulation * TWO_PI / RATE
  const jumpStep = pitchJump * TWO_PI / RATE
  const amp = volume * volumeScale

  let freq = frequency * (1 + randomness * 2 * M.random() - randomness) * TWO_PI / RATE
  let initialFreq = freq
  let slope = slideStep
  let initialSlope = slideStep

  // 双二阶滤波系数（filter 为 0 时整段跳过）
  const fSign = filter < 0 ? -1 : 1
  const w = TWO_PI * M.abs(filter) * 2 / RATE
  const cosW = M.cos(w)
  const alpha = M.sin(w) / 4
  const a0 = 1 + alpha
  const fa1 = -2 * cosW / a0
  const fa2 = (1 - alpha) / a0
  const fb0 = (1 + fSign * cosW) / 2 / a0
  const fb1 = -(fSign + cosW) / a0
  const fb2 = fb0
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0

  const length = (attackLen + decayLen + sustainLen + releaseLen + delayLen) | 0
  const samples = new Float32Array(Math.max(1, length))
  let sample = 0
  let sampleTime = 0
  let modOffset = 0
  let jump = 1
  let repeat = 0
  let crush = 0

  for (let i = 0; i < length; i++) {
    if (!(++crush % ((bitCrush * 100) | 0))) {
      // 波形
      sample = shape
        ? shape > 1
          ? shape > 2
            ? shape > 3
              ? shape > 4
                ? (sampleTime / TWO_PI % 1 < shapeCurve / 2 ? 1 : 0) * 2 - 1 // 方波占空比
                : M.sin(sampleTime ** 3) // 噪声
              : M.max(M.min(M.tan(sampleTime), 1), -1) // 正切
            : 1 - (2 * sampleTime / TWO_PI % 2 + 2) % 2 // 锯齿
          : 1 - 4 * M.abs(M.round(sampleTime / TWO_PI) - sampleTime / TWO_PI) // 三角
        : M.sin(sampleTime) // 正弦

      // 包络 + 曲线 + 颤音
      sample =
        (repeatLen ? 1 - tremolo + tremolo * M.sin(TWO_PI * i / repeatLen) : 1) *
        (shape > 4 ? sample : M.sign(sample) * M.abs(sample) ** shapeCurve) *
        (i < attackLen
          ? i / attackLen
          : i < attackLen + decayLen
            ? 1 - ((i - attackLen) / decayLen) * (1 - sustainVolume)
            : i < attackLen + decayLen + sustainLen
              ? sustainVolume
              : i < length - delayLen
                ? ((length - i - delayLen) / releaseLen) * sustainVolume
                : 0)

      // 延迟（回授半个周期，形成短混响）
      if (delayLen) {
        sample =
          sample / 2 +
          (delayLen > i
            ? 0
            : (i < length - delayLen ? 1 : (length - i) / delayLen) * samples[(i - delayLen) | 0] / 2 / amp)
      }

      if (filter) {
        sample = y1 = fb2 * x2 + fb1 * (x2 = x1) + fb0 * (x1 = sample) - fa2 * y2 - fa1 * (y2 = y1)
      }
    }

    samples[i] = sample * amp

    const f = (freq += slope += slideAccel) * M.cos(modStep * modOffset++)
    sampleTime += f + f * noise * M.sin(i ** 5)

    if (jump && ++jump > jumpTime) {
      freq += jumpStep
      initialFreq += jumpStep
      jump = 0
    }
    if (repeatLen && !(++repeat % repeatLen)) {
      freq = initialFreq
      slope = initialSlope
      jump = jump || 1
    }
  }

  // 交由共享 AudioContext 播放，音量已由 amp 控制，故不再额外缩放
  const buffer = ctx.createBuffer(1, samples.length, RATE)
  buffer.getChannelData(0).set(samples)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(destination)
  source.onended = () => source.disconnect()
  source.start(ctx.currentTime + at)
}
