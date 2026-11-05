import { useEffect, useRef } from 'react'
import CssMagnet from './ui/CssMagnet'
import { MARQUEE } from '../config/site'
import { gsap, prefersReduced } from '../lib/motion'

/**
 * Infinite marquee strip of glossy magnet photos between sections.
 * Speeds up smoothly when scrolling.
 */
export default function Marquee({ direction = 1, bg = 'bg-purple-night', tiltAngle = '-rotate-1' }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || prefersReduced()) return

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: direction > 0 ? -50 : 0,
        startAt: { xPercent: direction > 0 ? 0 : -50 },
        duration: 28,
        ease: 'none',
        repeat: -1,
      })
    }, track)

    return () => ctx.revert()
  }, [direction])

  const items = [...MARQUEE, ...MARQUEE]

  return (
    <div
      className={`relative z-20 ${bg} py-3.5 sm:py-4 border-y-4 border-white/15 shadow-xl ${tiltAngle} scale-[1.02] overflow-hidden select-none`}
      aria-label="Gallery of custom fridge magnets"
    >
      <div className="marquee">
        <div ref={trackRef} className="marquee__track items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 sm:gap-7">
              <div
                className={`transition-transform duration-300 hover:scale-110 ${
                  idx % 2 === 0 ? 'rotate-3' : '-rotate-3'
                }`}
              >
                <CssMagnet
                  src={item.src}
                  alt={item.alt}
                  shape={item.shape}
                  size={68}
                />
              </div>
              <div className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold text-white/90 whitespace-nowrap">
                <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-sun text-purple-night text-xs shadow">
                  ★
                </span>
                <span>{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
