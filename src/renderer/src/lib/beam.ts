/**
 * 光束粒子动画
 *
 * 受 shiye-tabs beam.ts 启发：点击打开外链时，从点击位置发射一支小箭头，
 * 沿二次贝塞尔曲线飞向窗口顶部，并留下 canvas 粒子尾迹。动画与 React 渲染解耦，
 * 即使点击源随后被卸载也不会中断。尊重系统「减弱动态效果」。
 */

interface Point { x: number; y: number }

const CHARGE_MS = 420
const FLIGHT_MS = 460
const CLEANUP_MS = 1700
const OVERLAY_ID = 'capybara-beam-overlay'

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function themeColor(): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-info').trim()
    return v || '#5aa6ef'
  } catch {
    return '#5aa6ef'
  }
}

function createOverlay(): HTMLDivElement {
  document.getElementById(OVERLAY_ID)?.remove()
  const overlay = document.createElement('div')
  overlay.id = OVERLAY_ID
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646;overflow:visible;'
  document.body.appendChild(overlay)
  return overlay
}

function createArrow(overlay: HTMLElement, origin: Point, color: string): HTMLSpanElement {
  const arrow = document.createElement('span')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.innerHTML =
    '<svg width="26" height="16" viewBox="0 0 24 18"><path d="M3 6.6h10V3.75c0-1.34 1.57-2.06 2.58-1.18l6.24 5.42c.62.54.62 1.48 0 2.02l-6.24 5.42c-1.01.88-2.58.16-2.58-1.18V11.4H3a2.4 2.4 0 1 1 0-4.8Z" fill="currentColor"/></svg>'
  arrow.style.cssText =
    `position:fixed;left:${origin.x - 13}px;top:${origin.y - 8}px;display:inline-flex;color:${color};will-change:transform;`
  overlay.appendChild(arrow)
  return arrow
}

function createTrail(overlay: HTMLElement): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D | null; dpr: number } {
  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.ceil(window.innerWidth * dpr)
  canvas.height = Math.ceil(window.innerHeight * dpr)
  canvas.style.cssText = `position:fixed;inset:0;width:${window.innerWidth}px;height:${window.innerHeight}px;pointer-events:none;`
  overlay.prepend(canvas)
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { canvas, ctx, dpr }
}

function quadPoint(s: Point, c: Point, e: Point, t: number): Point {
  const r = 1 - t
  return { x: r * r * s.x + 2 * r * t * c.x + t * t * e.x, y: r * r * s.y + 2 * r * t * c.y + t * t * e.y }
}
function quadTangent(s: Point, c: Point, e: Point, t: number): Point {
  return { x: 2 * (1 - t) * (c.x - s.x) + 2 * t * (e.x - c.x), y: 2 * (1 - t) * (c.y - s.y) + 2 * t * (e.y - c.y) }
}
function curveControl(s: Point, e: Point): Point {
  const dx = e.x - s.x, dy = e.y - s.y
  const d = Math.max(1, Math.hypot(dx, dy))
  const bend = Math.min(180, Math.max(44, d * 0.22))
  return { x: (s.x + e.x) / 2 + (-dy / d) * bend, y: (s.y + e.y) / 2 + (dx / d) * bend }
}

interface Particle { x: number; y: number; vx: number; vy: number; life: number; size: number }

function fire(overlay: HTMLElement, arrow: HTMLElement, origin: Point, target: Point, color: string): void {
  const { ctx, dpr } = createTrail(overlay)
  const control = curveControl(origin, target)
  const particles: Particle[] = []
  const started = performance.now()
  let previous = started
  let emission = 0

  const draw = (now: number) => {
    if (!overlay.isConnected) return
    const delta = Math.min(0.04, (now - previous) / 1000)
    previous = now
    const raw = Math.min(1, (now - started) / FLIGHT_MS)
    const t = 1 - Math.pow(1 - raw, 2.4)
    const point = quadPoint(origin, control, target, t)
    const tangent = quadTangent(origin, control, target, t)
    const len = Math.max(1, Math.hypot(tangent.x, tangent.y))
    const dx = tangent.x / len, dy = tangent.y / len
    const tangentAngle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI
    const turn = Math.min(1, Math.max(0, (raw - 0.68) / 0.32))
    const smoothTurn = turn * turn * (3 - 2 * turn)
    const angleDelta = ((-90 - tangentAngle + 540) % 360) - 180
    const angle = tangentAngle + angleDelta * smoothTurn
    const fade = Math.min(1, Math.max(0, (raw - 0.55) / 0.45))
    const smoothFade = fade * fade * (3 - 2 * fade)

    arrow.style.transform = `translate3d(${point.x - origin.x}px,${point.y - origin.y}px,0) rotate(${angle}deg)`
    arrow.style.opacity = String(1 - smoothFade)

    if (raw < 0.9) {
      emission += 420 * delta
      while (emission >= 1) {
        emission -= 1
        const count = 2 + Math.floor(Math.random() * 3)
        for (let i = 0; i < count; i++) {
          const spread = (Math.random() - 0.5) * 90
          particles.push({
            x: point.x - dx * Math.random() * 14,
            y: point.y - dy * Math.random() * 14,
            vx: -dx * (20 + Math.random() * 160) - dy * spread,
            vy: -dy * (20 + Math.random() * 160) + dx * spread,
            life: 0.55 + Math.random() * 0.7,
            size: 0.45 + Math.random() * 0.85
          })
        }
      }
    }
    particles.forEach((p) => {
      p.vy += 1100 * delta
      p.vx *= 1 - 1.4 * delta
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.life -= 1.05 * delta
    })
    for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1)

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.fillStyle = color
      particles.forEach((p) => {
        ctx.globalAlpha = 0.5 * Math.max(0, Math.min(1, p.life))
        ctx.fillRect(p.x, p.y, p.size, p.size)
      })
      ctx.globalAlpha = 1
    }
    if (raw < 1 || particles.length) requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
  window.setTimeout(() => overlay.remove(), CLEANUP_MS)
}

/** 从 from 点向窗口顶部（to，默认右上角）发射光束。 */
export function fireBeam(from: Point, to?: Point): void {
  try {
    if (prefersReducedMotion()) return
    const target = to ?? { x: window.innerWidth * 0.82, y: 6 }
    const overlay = createOverlay()
    const color = themeColor()
    const arrow = createArrow(overlay, from, color)
    const charge = arrow.animate(
      [
        { transform: 'translate3d(0,0,0) rotate(0deg)' },
        { transform: 'translate3d(-6px,0,0) rotate(-2deg)', offset: 0.5 },
        { transform: 'translate3d(-3px,0,0) rotate(1.6deg)', offset: 0.85 },
        { transform: 'translate3d(-5px,0,0) rotate(0deg)' }
      ],
      { duration: CHARGE_MS, easing: 'ease-in-out', fill: 'forwards' }
    )
    window.setTimeout(() => {
      if (!overlay.isConnected) return
      charge.cancel()
      fire(overlay, arrow, from, target, color)
    }, CHARGE_MS)
  } catch {
    document.getElementById(OVERLAY_ID)?.remove()
  }
}
