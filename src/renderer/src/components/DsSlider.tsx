import React, { useRef, useState, useEffect, useCallback } from 'react'

const THUMB_WIDTH = 22
const THUMB_HEIGHT = 12
const TRACK_HEIGHT = 16
const TRACK_INSET = (TRACK_HEIGHT - THUMB_HEIGHT) / 2 // 2px

export interface DsSliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  formatValue?: (value: number) => string
  showTicks?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
}

export const DsSlider: React.FC<DsSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatValue,
  showTicks = false,
  disabled = false,
  className = '',
  style,
  'aria-label': ariaLabel
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const pendingClientXRef = useRef<number | null>(null)
  const dragCleanupRef = useRef<(() => void) | null>(null)
  const onChangeRef = useRef(onChange)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      pendingClientXRef.current = null
      dragCleanupRef.current?.()
    }
  }, [])

  const clampedValue = Math.max(min, Math.min(max, value))
  const pct = max > min ? Math.max(0, Math.min(100, ((clampedValue - min) / (max - min)) * 100)) : 0
  const insetTravelWidth = THUMB_WIDTH + TRACK_INSET * 2 // 26px

  const positionAt = useCallback(
    (positionPct: number) => {
      const insetOffset = (0.5 - positionPct / 100) * insetTravelWidth
      return `calc(${positionPct}% ${insetOffset < 0 ? '-' : '+'} ${Math.abs(insetOffset)}px)`
    },
    [insetTravelWidth]
  )

  const thumbLeft = positionAt(pct)
  const activeTrackInsetOffset = (1 - pct / 100) * insetTravelWidth
  const activeTrackWidth = `calc(${pct}% + ${activeTrackInsetOffset}px)`

  const intervalCount = step > 0 ? Math.floor((max - min) / step) : 0
  const tickStride = Math.max(1, Math.ceil(intervalCount / 20))
  const tickValues =
    showTicks && intervalCount > 1
      ? Array.from({ length: Math.floor((intervalCount - 1) / tickStride) }, (_, index) => {
          const tickIndex = (index + 1) * tickStride
          return parseFloat((min + tickIndex * step).toPrecision(10))
        }).filter((tickValue) => tickValue < max)
      : []

  const snap = useCallback(
    (raw: number) => {
      const stepped = Math.round((raw - min) / step) * step + min
      return Math.max(min, Math.min(max, parseFloat(stepped.toPrecision(10))))
    },
    [min, max, step]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const container = containerRef.current
    if (!container) return

    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    dragCleanupRef.current?.()

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    pendingClientXRef.current = null

    const rect = container.getBoundingClientRect()
    const travelWidth = rect.width - THUMB_WIDTH - TRACK_INSET * 2
    let lastEmittedValue: number | null = null

    const emit = (clientX: number) => {
      const ratio =
        travelWidth <= 0
          ? 0
          : Math.max(0, Math.min(1, (clientX - rect.left - THUMB_WIDTH / 2 - TRACK_INSET) / travelWidth))
      const nextValue = snap(min + ratio * (max - min))
      if (nextValue === lastEmittedValue) return
      lastEmittedValue = nextValue
      onChangeRef.current(nextValue)
    }

    const flushPending = () => {
      const pendingClientX = pendingClientXRef.current
      pendingClientXRef.current = null
      if (pendingClientX !== null) emit(pendingClientX)
    }

    const onMove = (ev: PointerEvent) => {
      pendingClientXRef.current = ev.clientX
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        flushPending()
      })
    }

    const cleanup = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      if (dragCleanupRef.current === cleanup) dragCleanupRef.current = null
    }

    const onUp = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      flushPending()
      cleanup()
      setDragging(false)
    }

    dragCleanupRef.current = cleanup
    emit(e.clientX)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    let nextValue = clampedValue
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextValue = snap(clampedValue - step)
      e.preventDefault()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextValue = snap(clampedValue + step)
      e.preventDefault()
    } else if (e.key === 'PageDown') {
      nextValue = snap(clampedValue - step * 2)
      e.preventDefault()
    } else if (e.key === 'PageUp') {
      nextValue = snap(clampedValue + step * 2)
      e.preventDefault()
    } else if (e.key === 'Home') {
      nextValue = min
      e.preventDefault()
    } else if (e.key === 'End') {
      nextValue = max
      e.preventDefault()
    }

    if (nextValue !== clampedValue) {
      onChangeRef.current(nextValue)
    }
  }

  const tooltipText = formatValue ? formatValue(clampedValue) : String(clampedValue)
  const isTooltipVisible = dragging || hovering

  return (
    <div
      className={`ds-slider-wrapper ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style
      }}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--ds-text-secondary, #666)'
          }}
        >
          <span>{label}</span>
          {formatValue && <span>{formatValue(clampedValue)}</span>}
        </div>
      )}

      <div
        ref={containerRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel || label || '滑块'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        aria-disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="ds-slider-container"
        style={{
          position: 'relative',
          width: '100%',
          height: 24,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          userSelect: 'none',
          touchAction: 'none',
          outline: 'none'
        }}
      >
        {/* 底层轨道 */}
        <div
          data-slot="slider-track"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: TRACK_HEIGHT,
            borderRadius: 9999,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundColor: 'var(--ds-on-surface, rgba(127, 127, 127, 0.12))',
            boxShadow: focused ? '0 0 0 2px var(--ds-brand-primary, #0a84ff)' : 'none',
            transition: 'box-shadow var(--ds-motion-swift, 180ms ease)'
          }}
        >
          {/* 激活的高亮轨道 */}
          <div
            data-slot="slider-track-active"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              borderRadius: 9999,
              width: activeTrackWidth,
              backgroundColor: 'var(--ds-brand-primary, var(--card-accent, #0a84ff))',
              transition: dragging ? 'none' : 'width var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))'
            }}
          />

          {/* 刻度线 */}
          {tickValues.map((tickValue) => {
            const tickPct = ((tickValue - min) / (max - min)) * 100
            const active = tickValue <= clampedValue
            return (
              <span
                key={tickValue}
                data-slot="slider-tick"
                data-value={tickValue}
                data-active={active}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: positionAt(tickPct),
                  transform: 'translate(-50%, -50%)',
                  width: 2,
                  height: 6,
                  borderRadius: 9999,
                  zIndex: 1,
                  pointerEvents: 'none',
                  backgroundColor: active
                    ? 'color-mix(in srgb, var(--ds-brand-primary-text, #ffffff) 52%, transparent)'
                    : 'color-mix(in srgb, var(--ds-text-primary, #000000) 18%, transparent)'
                }}
              />
            )
          })}
        </div>

        {/* 滑块手柄定位容器 */}
        <div
          data-slot="slider-thumb-positioner"
          style={{
            position: 'absolute',
            top: '50%',
            left: thumbLeft,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 2,
            transition: dragging ? 'none' : 'left var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))'
          }}
        >
          {/* 悬浮提示气泡 (Tooltip) */}
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: `translateX(-50%) scale(${isTooltipVisible ? 1 : 0.8})`,
              opacity: isTooltipVisible ? 1 : 0,
              pointerEvents: 'none',
              transition: 'opacity var(--ds-motion-swift, 180ms ease), transform var(--ds-motion-swift, 180ms ease)',
              backgroundColor: 'var(--ds-surface-100, #ffffff)',
              color: 'var(--ds-text-primary, #181b19)',
              padding: '2px 7px',
              borderRadius: 'var(--ds-radius-sm, 6px)',
              fontSize: '11px',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              boxShadow: 'var(--ds-elevation-200, 0 3px 10px rgba(0, 0, 0, 0.15))',
              border: '0.5px solid var(--ds-divider, rgba(0,0,0,0.08))',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            {tooltipText}
            {/* Tooltip 小三角 */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid var(--ds-surface-100, #ffffff)'
              }}
            />
          </div>

          {/* 胶囊手柄 (Pill Thumb) */}
          <div
            data-slot="slider-thumb"
            style={{
              width: THUMB_WIDTH,
              height: THUMB_HEIGHT,
              boxSizing: 'border-box',
              borderRadius: 9999,
              backgroundColor: 'var(--ds-surface-100, #ffffff)',
              boxShadow: dragging
                ? 'var(--ds-elevation-200, 0 4px 12px rgba(0,0,0,0.25))'
                : '0 0.5px 2px rgba(0, 0, 0, 0.2), inset 0 0.5px 0.5px #ffffff',
              transform: dragging ? 'scale(1.5)' : 'scale(1)',
              transition:
                'transform var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1)), box-shadow var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))'
            }}
          />
        </div>
      </div>
    </div>
  )
}
