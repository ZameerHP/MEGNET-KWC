import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CandyButton from './ui/CandyButton'
import CssMagnet from './ui/CssMagnet'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { IMAGES, MAGNET_TYPES, PRICING } from '../config/site'
import { useInView, useNearViewport, useTilt } from '../lib/hooks'
import { scrollToTarget } from '../lib/motion'
import { store, useStore } from '../lib/store'

const SingleMagnetStage = lazy(() => import('../three/SingleMagnetStage'))

const SHOP_DOODLES = [
  { kind: 'star', top: '8%', left: '5%', size: 46, speed: 1.1, rot: -14, color: 'rgba(107,78,255,0.22)' },
  { kind: 'orbit', top: '14%', right: '5%', size: 78, speed: 1.4, rot: 18, color: 'rgba(255,106,43,0.25)' },
  { kind: 'heart', bottom: '12%', left: '8%', size: 44, speed: 0.9, rot: -8, color: 'rgba(255,122,110,0.32)' },
  { kind: 'sparkle', bottom: '16%', right: '8%', size: 48, speed: 1.2, rot: 10, color: 'rgba(23,169,184,0.28)' },
]

export default function MagnetTypes({ onSelectForCustomizer }) {
  const sectionRef = useRef(null)
  const rightCardRef = useRef(null)
  const near = useNearViewport(sectionRef, '500px')
  const inView = useInView(sectionRef, '150px')
  const tier = useStore((s) => s.tier)
  const activeId = useStore((s) => s.activeType)
  const [spinCounter, setSpinCounter] = useState(1)

  useTilt(rightCardRef, 6)

  const current = MAGNET_TYPES.find((t) => t.id === activeId) || MAGNET_TYPES[0]

  const handleSelect = (id) => {
    store.set({ activeType: id })
    setSpinCounter((c) => c + 1)
  }

  const handleCustomizeNow = () => {
    onSelectForCustomizer?.(current)
    scrollToTarget('#customize', { offset: -80 })
  }

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <Doodles items={SHOP_DOODLES} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3 bg-purple/12 text-purple border border-purple/25">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-purple text-white text-[11px]">
              ✦
            </span>
            <span>Pick Your Vibe · 6 Custom Magnet Styles</span>
          </div>
          <SplitHeading
            as="h2"
            lines={['A Magnet For Every', 'Happy Little Moment']}
            highlightWord="Happy"
            highlightClass="text-tomato"
            className="display-lg text-purple-night"
          />
          <p className="mt-3 text-base sm:text-lg font-semibold text-ink/75">
            Tap a category on the left to spin the 3D magnet and see how we craft it.
          </p>
        </div>

        {/* Bomcom "Science Lab" Style Showcase Card */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT: Royal-Purple Category Selector Panel */}
          <div
            className="lg:col-span-5 card-stack rounded-[2.25rem]"
            style={{ '--stack-bg': 'var(--orange-hot)', '--stack-rot': '-2.5deg', '--stack-x': '-10px', '--stack-y': '12px' }}
          >
            <div className="h-full rounded-[2.25rem] bg-gradient-to-b from-purple via-purple-deep to-purple-night p-5 sm:p-6 text-white shadow-2xl border-2 border-white/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/15">
                  <span className="font-display text-base font-bold tracking-wide text-sun uppercase">
                    ★ Magnet Lab
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-0.5 font-display text-xs font-semibold text-white/90">
                    {MAGNET_TYPES.length} Styles
                  </span>
                </div>

                <ul className="mt-3.5 space-y-2" role="listbox" aria-label="Magnet types">
                  {MAGNET_TYPES.map((item) => {
                    const selected = item.id === current.id
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => handleSelect(item.id)}
                          className={`group relative w-full flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left font-display transition-all duration-300 cursor-pointer ${
                            selected
                              ? 'bg-gradient-to-r from-[#FFA43A] to-[#FF6A1F] text-purple-night shadow-[0_4px_0_#C94A0B,0_10px_20px_rgba(0,0,0,0.25)] -translate-y-0.5 scale-[1.01]'
                              : 'bg-white/10 text-white hover:bg-white/18 hover:translate-x-1'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-9 w-9 place-items-center rounded-xl text-lg shadow-inner transition-transform group-hover:scale-110 ${
                                selected ? 'bg-white text-purple-night' : 'bg-white/15'
                              }`}
                            >
                              {item.emoji}
                            </span>
                            <div>
                              <div className="text-sm sm:text-base font-bold leading-tight">
                                {item.name}
                              </div>
                              <div
                                className={`text-[11px] font-body font-bold ${
                                  selected ? 'text-purple-night/80' : 'text-white/65'
                                }`}
                              >
                                From {PRICING.currency}
                                {item.from} · {item.shape}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition ${
                              selected
                                ? 'bg-white text-tomato shadow'
                                : 'bg-white/12 text-white group-hover:bg-white/25'
                            }`}
                          >
                            ▶
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-3 border border-white/15 flex items-center gap-2.5">
                <span className="text-xl">🧲</span>
                <p className="text-xs font-semibold text-white/90 leading-snug">
                  Every style comes with our signature <strong>glossy epoxy dome</strong> &amp; full-back magnetic grip.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Big Tilted White Card with 3D Magnet + Rating + Description + CTA */}
          <div className="lg:col-span-7 flex items-center">
            <div
              ref={rightCardRef}
              className="tilt card-stack w-full rounded-[2.5rem] lg:rotate-[1.6deg]"
              style={{ '--stack-bg': 'var(--purple)', '--stack-rot': '-2.2deg', '--stack-x': '12px', '--stack-y': '14px' }}
            >
              <div className="glossy-card relative overflow-hidden p-5 sm:p-8 border-4 border-white">
                {/* Decorative corner tint */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-25 blur-2xl transition-colors duration-500"
                  style={{ background: current.accent }}
                />

                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                  {/* 3D Interactive Magnet Preview */}
                  <div className="md:col-span-6 relative h-[230px] sm:h-[275px] flex items-center justify-center rounded-3xl bg-gradient-to-br from-cream via-[#FFEBD2] to-[#FFD8B0] border-2 border-orange-hot/15 shadow-inner overflow-hidden">
                    {near && tier === 'high' ? (
                      <Suspense
                        fallback={
                          <CssMagnet
                            src={current.texture}
                            shape={current.shape}
                            size={165}
                            tilt
                          />
                        }
                      >
                        <SingleMagnetStage
                          inView={inView}
                          shape={current.shape}
                          finish="glossy"
                          textureSource={current.texture}
                          spinKey={spinCounter}
                        />
                      </Suspense>
                    ) : (
                      <CssMagnet
                        src={current.texture}
                        shape={current.shape}
                        size={170}
                        tilt
                        alt={current.name}
                      />
                    )}

                    <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 font-display text-[11px] font-bold text-purple-night shadow">
                      {current.emoji} {current.shape.toUpperCase()}
                    </span>
                    <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-purple-night/85 px-2.5 py-0.5 font-display text-[10px] font-semibold text-white">
                      3D Epoxy Preview
                    </span>
                  </div>

                  {/* Animated Card Details (3D flip/slide on switch) */}
                  <div className="md:col-span-6 flex flex-col items-start text-left">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current.id}
                        initial={{ opacity: 0, rotateX: -25, y: 22 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                        exit={{ opacity: 0, rotateX: 20, y: -18 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                      >
                        {/* Star Rating Pill */}
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-sun/25 px-3 py-1 font-display text-xs sm:text-sm font-bold text-purple-night">
                          <span className="text-tomato tracking-tight">★★★★★</span>
                          <span>{current.rating.toFixed(1)}</span>
                          <span className="text-ink/55 font-body text-xs">
                            ({current.reviews} happy orders)
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-purple-night">
                          {current.name}
                        </h3>

                        <p className="mt-2 text-sm sm:text-base font-semibold text-ink/80 leading-relaxed">
                          {current.blurb}
                        </p>

                        {/* Price + Feature Pills */}
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-xl bg-purple/10 px-3 py-1 font-display text-xs sm:text-sm font-bold text-purple">
                            From {PRICING.currency}
                            {current.from}
                          </span>
                          <span className="rounded-xl bg-mint/25 px-2.5 py-1 font-display text-xs font-bold text-purple-night">
                            ✓ Waterproof Dome
                          </span>
                          <span className="rounded-xl bg-coral/20 px-2.5 py-1 font-display text-xs font-bold text-purple-night">
                            ✓ Rich HD Print
                          </span>
                        </div>

                        <div className="mt-5">
                          <CandyButton onClick={handleCustomizeNow} size="md">
                            Customize Now
                          </CandyButton>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="tilt__glare" />
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Product Mockup Duo (White Fridge & Stainless Steel Fridge) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[2.25rem] bg-white p-3 shadow-xl border-2 border-purple/10 -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
              <img
                src={IMAGES.mockupWhite}
                srcSet={`${IMAGES.mockupWhiteSm} 700w, ${IMAGES.mockupWhite} 1400w`}
                sizes="(max-width: 768px) 95vw, 45vw"
                alt="Custom glossy epoxy photo magnets arranged on a clean white fridge door"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-night/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <span className="inline-block rounded-full bg-sun px-3 py-0.5 font-display text-xs font-bold text-purple-night">
                    Glossy White Fridge
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-bold">
                    Candy-Shine Epoxy Dome
                  </h3>
                </div>
                <a
                  href="#customize"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#customize')
                  }}
                  className="rounded-full bg-white/95 px-4 py-2 font-display text-xs font-bold text-purple-night shadow hover:bg-sun transition"
                >
                  Make Yours →
                </a>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2.25rem] bg-white p-3 shadow-xl border-2 border-purple/10 rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
              <img
                src={IMAGES.mockupSteel}
                srcSet={`${IMAGES.mockupSteelSm} 700w, ${IMAGES.mockupSteel} 1400w`}
                sizes="(max-width: 768px) 95vw, 45vw"
                alt="Grid of square glossy photo magnets on a brushed stainless steel fridge door"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-night/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <span className="inline-block rounded-full bg-mint px-3 py-0.5 font-display text-xs font-bold text-purple-night">
                    Brushed Steel Fridge
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-bold">
                    Strong Full-Back Grip
                  </h3>
                </div>
                <a
                  href="#customize"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#customize')
                  }}
                  className="rounded-full bg-white/95 px-4 py-2 font-display text-xs font-bold text-purple-night shadow hover:bg-mint transition"
                >
                  Build A Grid →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
