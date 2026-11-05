import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../../lib/motion'

/**
 * Split-line / word mask-reveal animated headline.
 * Each line or word rises smoothly from a clip mask with a subtle playful tilt when entering the viewport.
 */
export default function SplitHeading({
  as = 'h2',
  lines,
  children,
  className = '',
  highlightWord = '',
  highlightClass = 'text-sun',
  delay = 0,
  triggerOnScroll = true,
}) {
  const rootRef = useRef(null)
  const Tag = as

  const resolvedLines = Array.isArray(lines) && lines.length > 0
    ? lines
    : typeof children === 'string'
    ? [children]
    : []

  useEffect(() => {
    const el = rootRef.current
    if (!el || prefersReduced()) return
    const words = el.querySelectorAll('.split-word-inner')
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 4, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.045,
          delay,
          ease: 'expo.out',
          scrollTrigger: triggerOnScroll
            ? {
                trigger: el,
                start: 'top 86%',
                toggleActions: 'play none none none',
              }
            : undefined,
        }
      )
    }, el)

    return () => ctx.revert()
  }, [delay, triggerOnScroll, resolvedLines.join('|')])

  if (!resolvedLines.length) {
    return (
      <Tag ref={rootRef} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag ref={rootRef} className={className}>
      {resolvedLines.map((line, lineIdx) => {
        const words = line.split(' ')
        return (
          <span key={lineIdx} className="block">
            {words.map((w, wIdx) => {
              const isHi =
                highlightWord &&
                highlightWord.toLowerCase().split(' ').includes(w.toLowerCase().replace(/[^a-z]/gi, ''))
              return (
                <span
                  key={wIdx}
                  className="inline-block overflow-hidden align-bottom pb-[0.09em] -mb-[0.09em] mr-[0.24em] last:mr-0"
                >
                  <span
                    className={`split-word-inner inline-block will-change-transform ${
                      isHi ? highlightClass : ''
                    }`}
                  >
                    {w}
                  </span>
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
