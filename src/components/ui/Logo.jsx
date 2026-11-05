import { forwardRef } from 'react'

/**
 * Chunky 3D rounded, puffy, multi-colour "MAGNETICS KWC" logo.
 * Supports `letterRefs` so the cinematic loader can drop each letter in like a magnet snapping onto a fridge.
 */
const TOP_LETTERS = [
  { ch: 'M', c: '#FF6A2B', d: '#B8260F', rot: '-4deg', y: '0.02em' },
  { ch: 'A', c: '#FFC531', d: '#C98A00', rot: '2deg', y: '-0.03em' },
  { ch: 'G', c: '#7ED9BE', d: '#2E8F75', rot: '-2deg', y: '0.01em' },
  { ch: 'N', c: '#FF7A6E', d: '#BD392F', rot: '3deg', y: '-0.02em' },
  { ch: 'E', c: '#6B4EFF', d: '#3B23B8', rot: '-3deg', y: '0.02em' },
  { ch: 'T', c: '#17A9B8', d: '#0B6973', rot: '2deg', y: '-0.03em' },
  { ch: 'I', c: '#FFC531', d: '#C98A00', rot: '-2deg', y: '0.01em' },
  { ch: 'C', c: '#FF6A2B', d: '#B8260F', rot: '3deg', y: '-0.02em' },
  { ch: 'S', c: '#7ED9BE', d: '#2E8F75', rot: '-3deg', y: '0.02em' },
]

const SUB_LETTERS = [
  { ch: 'K', c: '#FFC531', d: '#C98A00', rot: '-3deg', y: '0em' },
  { ch: 'W', c: '#FF7A6E', d: '#BD392F', rot: '2deg', y: '-0.02em' },
  { ch: 'C', c: '#6B4EFF', d: '#3B23B8', rot: '-2deg', y: '0.01em' },
]

const Logo = forwardRef(function Logo(
  { size = 'md', as = 'a', href = '#home', onClick, letterRefs, className = '' },
  ref
) {
  const Tag = as
  const sizeClasses = {
    sm: 'text-[1.35rem] sm:text-[1.5rem]',
    md: 'text-[1.55rem] sm:text-[1.8rem]',
    lg: 'text-[2.2rem] sm:text-[2.8rem]',
    xl: 'text-[2.8rem] sm:text-[4.2rem] md:text-[5.2rem]',
  }[size] || 'text-[1.65rem]'

  let idx = 0

  return (
    <Tag
      ref={ref}
      href={as === 'a' ? href : undefined}
      onClick={onClick}
      aria-label="Magnetics KWC"
      className={`logo ${sizeClasses} ${className}`}
      data-cursor="magnet"
    >
      <span className="logo__row" aria-hidden="true">
        {TOP_LETTERS.map((item, i) => {
          const refIndex = idx++
          return (
            <span
              key={`t-${i}`}
              ref={(el) => {
                if (letterRefs) letterRefs.current[refIndex] = el
              }}
              className="logo__l"
              style={{
                '--c': item.c,
                '--d': item.d,
                '--rot': item.rot,
                '--y': item.y,
              }}
            >
              {item.ch}
            </span>
          )
        })}
      </span>
      <span className="logo__row logo__row--sub" aria-hidden="true">
        {SUB_LETTERS.map((item, i) => {
          const refIndex = idx++
          return (
            <span
              key={`s-${i}`}
              ref={(el) => {
                if (letterRefs) letterRefs.current[refIndex] = el
              }}
              className="logo__l"
              style={{
                '--c': item.c,
                '--d': item.d,
                '--rot': item.rot,
                '--y': item.y,
              }}
            >
              {item.ch}
            </span>
          )
        })}
      </span>
    </Tag>
  )
})

export default Logo
export const TOTAL_LOGO_LETTERS = TOP_LETTERS.length + SUB_LETTERS.length
