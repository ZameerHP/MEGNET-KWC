import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { REVIEWS } from '../config/site'

const REVIEW_DOODLES = [
  { kind: 'heart', top: '10%', left: '5%', size: 44, speed: 1.1, rot: -12, color: 'rgba(232,56,26,0.22)' },
  { kind: 'star', top: '14%', right: '6%', size: 48, speed: 1.3, rot: 14, color: 'rgba(107,78,255,0.22)' },
]

/**
 * Latest Reviews carousel:
 * Bold tomato-orange cards with round candy arrow buttons and star ratings, matching the Bomcom reference UI.
 * Reviews come from `REVIEWS` in `src/config/site.js` (clearly marked as editable placeholders).
 */
export default function Reviews() {
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)

  const total = REVIEWS.length
  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  // Show 3 cards on desktop, cycling smoothly from `index`
  const visible = [
    REVIEWS[index % total],
    REVIEWS[(index + 1) % total],
    REVIEWS[(index + 2) % total],
  ]

  return (
    <section
      id="reviews"
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <Doodles items={REVIEW_DOODLES} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Row + Round Arrow Buttons */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <div className="eyebrow mb-3 bg-orange-hot/15 text-tomato border border-orange-hot/30">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-tomato text-white text-[11px]">
                ♥
              </span>
              <span>Happy Fridges · Real Smiles</span>
            </div>
            <SplitHeading
              as="h2"
              lines={['Latest Reviews']}
              highlightWord="Reviews"
              highlightClass="text-tomato"
              className="display-lg text-purple-night"
            />
          </div>

          {/* Round Glossy Candy Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="candy candy--round"
              data-cursor="magnet"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="candy candy--round"
              data-cursor="magnet"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Orange Cards Grid (Bomcom Reference Style) */}
        <div ref={trackRef} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {visible.map((rev, idx) => {
            const tilts = ['-rotate-1', 'rotate-1', '-rotate-2']
            return (
              <motion.article
                key={`${rev.name}-${index}-${idx}`}
                initial={{ opacity: 0, y: 26, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`card-stack rounded-[2.25rem] ${tilts[idx % tilts.length]}`}
                style={{
                  '--stack-bg': 'var(--purple-night)',
                  '--stack-rot': idx % 2 === 0 ? '2.5deg' : '-2.5deg',
                  '--stack-x': '10px',
                  '--stack-y': '12px',
                }}
              >
                <div className="relative h-full flex flex-col justify-between rounded-[2.25rem] bg-gradient-to-b from-orange-hot via-tomato to-tomato-deep p-6 sm:p-7 text-white shadow-2xl border-4 border-white">
                  {/* Top glossy highlight */}
                  <div className="pointer-events-none absolute inset-x-8 top-2 h-7 rounded-full bg-gradient-to-b from-white/30 to-transparent" />

                  <div>
                    {/* Star rating row */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-1 text-lg text-sun drop-shadow"
                        aria-label={`${rev.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, s) => (
                          <span key={s} className={s < rev.rating ? 'opacity-100' : 'opacity-30'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rounded-full bg-white/20 px-3 py-0.5 font-display text-xs font-bold text-white">
                        Verified Order
                      </span>
                    </div>

                    {/* Quote text */}
                    <p className="mt-4 font-body text-base sm:text-lg font-bold leading-relaxed text-white">
                      “{rev.text}”
                    </p>
                  </div>

                  {/* Reviewer footer */}
                  <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center gap-3">
                    <div
                      style={{ background: rev.color }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold text-purple-night shadow-inner border-2 border-white"
                    >
                      {rev.name[0]}
                    </div>
                    <div>
                      <div className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                        {rev.name}
                      </div>
                      <div className="text-xs font-bold text-cream/80">{rev.place}</div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Dots Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-8 bg-tomato' : 'w-2.5 bg-purple/25 hover:bg-purple/45'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
