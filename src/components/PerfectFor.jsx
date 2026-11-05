import { useEffect, useRef } from 'react'
import CandyButton from './ui/CandyButton'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { BULK, OCCASIONS, waLink } from '../config/site'
import { gsap, prefersReduced, scrollToTarget } from '../lib/motion'

const PERFECT_DOODLES = [
  { kind: 'orbit', top: '8%', right: '5%', size: 80, speed: 1.2, rot: 16, color: 'rgba(107,78,255,0.2)' },
  { kind: 'heart', bottom: '15%', left: '4%', size: 46, speed: 1.1, rot: -12, color: 'rgba(255,106,43,0.28)' },
  { kind: 'star', top: '40%', left: '3%', size: 42, speed: 1.3, rot: 10, color: 'rgba(255,197,49,0.5)' },
]

export default function PerfectFor() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 45, opacity: 0, rotate: (i) => (i % 2 === 0 ? -4 : 4) },
        {
          y: 0,
          opacity: 1,
          rotate: (i) => (i % 2 === 0 ? -1.4 : 1.4),
          duration: 0.75,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: el,
            start: 'top 76%',
          },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="gifts"
      ref={sectionRef}
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <Doodles items={PERFECT_DOODLES} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3 bg-purple/12 text-purple border border-purple/25">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-purple text-white text-[11px]">
              🎁
            </span>
            <span>Tiny Gifts · Huge Smiles</span>
          </div>
          <SplitHeading
            as="h2"
            lines={['Perfect For Every', 'Celebration & Story']}
            highlightWord="Celebration"
            highlightClass="text-purple"
            className="display-lg text-purple-night"
          />
          <p className="mt-3 text-base sm:text-lg font-semibold text-ink/75">
            From single thoughtful gifts to 500-piece event favours, our magnets stick around forever.
          </p>
        </div>

        {/* 2x2 + 2 Tilted Cards Grid (Bomcom "News" Block Layout) */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {OCCASIONS.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="card-stack rounded-[2.25rem] transition-transform duration-300 hover:scale-[1.015]"
              style={{
                '--stack-bg': item.color,
                '--stack-rot': i % 2 === 0 ? '2.2deg' : '-2.2deg',
                '--stack-x': i % 2 === 0 ? '10px' : '-10px',
                '--stack-y': '12px',
              }}
            >
              <div className="glossy-card flex flex-col sm:flex-row items-center gap-5 p-4 sm:p-5 border-4 border-white">
                {/* Glossy Magnet-style Photo Thumbnail */}
                <div className="relative h-36 w-full sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-[1.5rem] shadow-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-4 ring-inset ring-white/75 bg-gradient-to-tr from-transparent via-white/10 to-white/35" />
                </div>

                {/* Copy */}
                <div className="flex-1 text-center sm:text-left">
                  <span
                    style={{ background: item.color }}
                    className="inline-block rounded-full px-3 py-0.5 font-display text-xs font-bold text-purple-night shadow-sm"
                  >
                    {item.tag}
                  </span>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-purple-night">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm sm:text-base font-semibold text-ink/75 leading-relaxed">
                    {item.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToTarget('#customize')}
                    className="mt-2.5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-tomato hover:text-purple transition cursor-pointer"
                  >
                    Create {item.title} Magnet <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Orders CTA Banner */}
        <div
          className="mt-12 card-stack rounded-[2.25rem]"
          style={{ '--stack-bg': 'var(--sun)', '--stack-rot': '-1.5deg', '--stack-x': '12px', '--stack-y': '14px' }}
        >
          <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-purple-night via-purple-deep to-purple p-6 sm:p-9 text-white shadow-2xl border-4 border-white flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3.5 py-1 font-display text-xs font-bold text-purple-night uppercase tracking-wide">
                ★ Wedding Favours · Corporate · Events
              </span>
              <h3 className="mt-2.5 display-md text-white">{BULK.title}</h3>
              <p className="mt-2 text-base sm:text-lg font-semibold text-cream/90 leading-relaxed">
                {BULK.text}
              </p>
            </div>

            <div className="shrink-0">
              <CandyButton
                href={waLink(BULK.message)}
                external
                size="md"
                ring
              >
                {BULK.cta}
              </CandyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
