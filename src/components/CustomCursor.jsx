import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch, prefersReduced } from '../lib/motion'

/**
 * Custom horseshoe-magnet cursor that smoothly tracks the pointer
 * and "attracts" (scales + rotates + snaps) onto interactive elements.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [attracted, setAttracted] = useState(false)
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (isTouch() || prefersReduced()) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    return () => {
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power3.out' })
    let lastAttracted = false

    const onMove = (e) => {
      const target = e.target?.closest?.('a, button, [role="button"], [data-cursor="magnet"], input, label, select')
      const nextAttracted = Boolean(target || document.body.dataset.cursorHover)
      if (nextAttracted !== lastAttracted) {
        lastAttracted = nextAttracted
        setAttracted(nextAttracted)
      }
      xTo(e.clientX)
      yTo(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" aria-hidden="true">
      {/* Tiny crisp center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-sun shadow-[0_0_10px_rgba(255,197,49,0.9)]"
      />

      {/* Magnet badge */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center"
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 ${
            attracted
              ? 'scale-125 -rotate-12 bg-purple/90 shadow-[0_8px_20px_rgba(107,78,255,0.55)] ring-2 ring-white'
              : 'scale-90 rotate-6 bg-white/85 shadow-md ring-2 ring-orange-hot/50'
          }`}
        >
          {/* Cute horseshoe magnet icon */}
          <svg viewBox="0 0 36 36" className="h-6 w-6">
            <path
              d="M10 8v10a8 8 0 0 0 16 0V8"
              fill="none"
              stroke={attracted ? '#FFC531' : '#E8381A'}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <rect x="7.2" y="5" width="5.6" height="5" rx="1.5" fill="#7ED9BE" />
            <rect x="23.2" y="5" width="5.6" height="5" rx="1.5" fill="#7ED9BE" />
            {attracted && (
              <path
                d="M18 2l1.2 2.6L22 5.8l-2.8 1.2L18 9.6l-1.2-2.6L14 5.8l2.8-1.2L18 2Z"
                fill="#FFFFFF"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
