/**
 * 系统等宽字体探测
 *
 * 浏览器没有「列出已安装字体」的 API，这里用经典 canvas 宽度差法：
 * 用待测字体渲染一段同时含宽/窄字符的字符串，与「必定回退到系统等宽」的渲染对比；
 * 若宽度不同，说明该字体真实存在（否则会回退到等宽兜底，宽度一致）。
 */

/** 候选清单：覆盖 macOS 与跨平台常见等宽字体（顺序即展示顺序）。 */
export const MONO_CANDIDATES: string[] = [
  'SF Mono', 'Menlo', 'Monaco', 'JetBrains Mono', 'Fira Code', 'Source Code Pro',
  'Roboto Mono', 'IBM Plex Mono', 'Cascadia Code', 'Dank Mono', 'Operator Mono',
  'Hack', 'Inconsolata', 'Anonymous Pro', 'DejaVu Sans Mono', 'Liberation Mono',
  'Ubuntu Mono', 'PT Mono', 'Noto Sans Mono', 'Andale Mono', 'Consolas', 'Courier New'
]

const TEST_STRING = 'mmmmmmmmlliW0iI,.|'
const TEST_SIZE = 72

function measure(font: string): number {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  ctx.font = `${TEST_SIZE}px ${font}`
  return ctx.measureText(TEST_STRING).width
}

/** 探测某字体是否真实可用。 */
function isAvailable(family: string): boolean {
  const fallback = measure('monospace')
  const withCandidate = measure(`"${family}", monospace`)
  // 等宽字体之间宽度也应不同；阈值 0.5px 足以区分「存在」与「回退」。
  return Math.abs(fallback - withCandidate) > 0.5
}

let cache: string[] | null = null

/** 返回系统中真实可用的等宽字体名列表（去重、按候选顺序）。结果会被缓存。 */
export function detectMonospaceFonts(): string[] {
  if (cache) return cache
  const seen = new Set<string>()
  const out: string[] = []
  for (const f of MONO_CANDIDATES) {
    if (seen.has(f)) continue
    if (isAvailable(f)) { seen.add(f); out.push(f) }
  }
  cache = out
  return out
}
