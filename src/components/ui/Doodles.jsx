import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../../lib/motion'

export function DoodleIcon({ kind = 'star', stroke = 'currentColor' }) {
  switch (kind) {
    case 'heart':
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M24 41s-16-9.8-16-21.5C8 13.2 13 8.5 18.8 8.5c3.4 0 6.5 1.8 8.2 4.6 1.7-2.8 4.8-4.6 8.2-4.6 5.8 0 10.8 4.7 10.8 11 0 11.7-16 21.5-16 21.5Z"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'orbit':
      return (
        <svg viewBox="0 0 64 64" fill="none">
          <ellipse
            cx="32"
            cy="32"
            rx="27"
            ry="11"
            transform="rotate(-24 32 32)"
            stroke={stroke}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle cx="32" cy="32" r="7" stroke={stroke} strokeWidth="2.2" />
          <circle cx="52" cy="23" r="3" fill={stroke} />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4c1.8 11.5 8.5 18.2 20 20-11.5 1.8-18.2 8.5-20 20-1.8-11.5-8.5-18.2-20-20 11.5-1.8 18.2-8.5 20-20Z"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'ring':
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="17" stroke={stroke} strokeWidth="2.4" strokeDasharray="6 5" />
          <circle cx="24" cy="24" r="8" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'magnet':
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M14 10v14a10 10 0 0 0 20 0V10M9 10h10v6H9v-6Zm20 0h10v6H29v-6Z"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'star':
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="m24 5 5.3 11.4L41.8 18l-9.2 8.7 2.4 12.4L24 33l-11 6.1 2.4-12.4L6.2 18l12.5-1.6L24 5Z"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

/**
 * Floating outline doodles with subtle scroll parallax.
 */
export default function Doodles({ items = [], color = 'rgba(255,255,255,0.28)' }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || prefersReduced()) return
    const nodes = el.querySelectorAll('[data-speed]')
    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const sp = parseFloat(node.getAttribute('data-speed') || '1')
        gsap.to(node, {
          y: () => -70 * sp,
          rotation: () => 22 * sp,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((d, i) => (
        <div
          key={i}
          data-speed={d.speed ?? 1}
          className="doodle"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            width: d.size || 46,
            height: d.size || 46,
            color: d.color || color,
            '--dur': `${6 + (i % 4) * 1.4}s`,
            '--r': `${d.rot || 0}deg`,
          }}
        >
          <DoodleIcon kind={d.kind} />
        </div>
      ))}
    </div>
  )
}
