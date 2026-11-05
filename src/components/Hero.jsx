import { lazy, Suspense, useEffect, useRef } from 'react'
import CandyButton from './ui/CandyButton'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import CssMagnet from './ui/CssMagnet'
import { HERO, IMAGES, PHOTOS_SM } from '../config/site'
import { useInView, useTilt } from '../lib/hooks'
import { gsap, prefersReduced } from '../lib/motion'
import { useStore } from '../lib/store'

const HeroStage = lazy(() => import('../three/HeroStage'))

const HERO_DOODLES = [
  { kind: 'orbit', top: '14%', left: '4%', size: 84, speed: 1.2, rot: -15, color: 'rgba(255,255,255,0.26)' },
  { kind: 'star', top: '18%', right: '7%', size: 48, speed: 1.5, rot: 12, color: 'rgba(255,197,49,0.55)' },
  { kind: 'heart', bottom: '18%', left: '44%', size: 44, speed: 0.9, rot: -10, color: 'rgba(255,255,255,0.32)' },
  { kind: 'sparkle', top: '52%', right: '4%', size: 42, speed: 1.3, rot: 8, color: 'rgba(126,217,190,0.55)' },
  { kind: 'ring', bottom: '12%', right: '14%', size: 64, speed: 1.1, rot: 22, color: 'rgba(255,255,255,0.24)' },
  { kind: 'heart', top: '30%', left: '48%', size: 36, speed: 1.4, rot: 14, color: 'rgba(255,197,49,0.45)' },
]

const CHIP_COLORS = ['var(--mint)', 'var(--sun)', 'var(--purple)']

function FallbackHeroMagnet() {
  const tiltRef = useRef(null)
  useTilt(tiltRef, 15)

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
      {/* Orbiting mini CSS magnets for fallback */}
      <div className="pointer-events-none absolute top-4 left-3 sm:top-8 sm:left-8 -rotate-12 opacity-90">
        <CssMagnet src={PHOTOS_SM.travel} shape="rounded" size="clamp(52px, 13vw, 76px)" alt="Travel magnet" />
      </div>
      <div className="pointer-events-none absolute top-5 right-3 sm:top-10 sm:right-8 rotate-12 opacity-90">
        <CssMagnet src={PHOTOS_SM.pet} shape="circle" size="clamp(54px, 13.5vw, 80px)" alt="Pet magnet" />
      </div>
      <div className="pointer-events-none absolute bottom-5 left-4 sm:bottom-10 sm:left-8 rotate-6 opacity-90">
        <CssMagnet src="quote" shape="square" size="clamp(50px, 12.5vw, 72px)" alt="Quote magnet" />
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-8 sm:right-8 -rotate-6 opacity-90">
        <CssMagnet src={PHOTOS_SM.wedding} shape="heart" size="clamp(52px, 13vw, 78px)" alt="Wedding magnet" />
      </div>

      {/* Pre-rendered transparent WebP with CSS 3D tilt */}
      <div
        ref={tiltRef}
        className="tilt relative z-10 w-[min(64vw,360px)] sm:w-[min(72vw,400px)] aspect-square flex items-center justify-center"
      >
        <img
          src={IMAGES.heroFallback}
          alt="Glossy 3D custom family photo fridge magnet"
          className="w-full h-full object-contain drop-shadow-[0_28px_40px_rgba(60,10,0,0.55)] select-none"
          draggable="false"
        />
        <div className="tilt__glare rounded-[22%]" />
      </div>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const stageWrapRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const inView = useInView(sectionRef, '200px')
  const tier = useStore((s) => s.tier)
  const useWebGL = tier === 'high'

  // Mouse parallax tracking (±1 normalized across hero)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || prefersReduced()) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      pointerRef.current.x = Math.max(-1, Math.min(1, nx))
      pointerRef.current.y = Math.max(-1, Math.min(1, ny))
    }
    const onLeave = () => {
      pointerRef.current.x = 0
      pointerRef.current.y = 0
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // On scroll: the hero magnet rotates, scales and flies toward the next section (#shop)
  useEffect(() => {
    const el = sectionRef.current
    const stage = stageWrapRef.current
    if (!el || !stage || prefersReduced()) return

    const ctx = gsap.context(() => {
      gsap.to(stage, {
        yPercent: 28,
        xPercent: -6,
        scale: 0.84,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress
          },
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{ background: 'var(--hero-bg)' }}
      className="relative min-h-[100svh] overflow-hidden pt-20 pb-8 sm:pt-22 sm:pb-10 lg:pt-20 lg:pb-8 text-white flex items-center"
    >
      {/* Floating background doodles with parallax */}
      <Doodles items={HERO_DOODLES} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-6">
          {/* LEFT COLUMN: Copy, CTAs, Trust Chips */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Playful Eyebrow Pill */}
            <div className="eyebrow mb-3 bg-white/16 border border-white/35 text-white backdrop-blur-md shadow-sm">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sun text-purple-night text-[11px] font-bold shadow-inner">
                ★
              </span>
              <span className="truncate">{HERO.eyebrow}</span>
            </div>

            {/* Split-Text Reveal Headline */}
            <SplitHeading
              as="h1"
              lines={HERO.titleLines}
              highlightWord="Magnets"
              highlightClass="text-sun drop-shadow-[0_5px_0_rgba(184,38,15,0.85)]"
              triggerOnScroll={false}
              delay={0.15}
              className="display-xl text-white drop-shadow-[0_5px_0_rgba(140,22,5,0.65)]"
            />

            {/* Friendly Subline */}
            <p className="mt-3 max-w-lg text-sm sm:text-base lg:text-lg font-semibold leading-relaxed text-cream/95">
              {HERO.subline}
            </p>

            {/* Two Glossy 3D Candy CTAs */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <CandyButton href={HERO.primaryCta.href} size="md" ring>
                {HERO.primaryCta.label}
              </CandyButton>
              <CandyButton href={HERO.secondaryCta.href} variant="cream" size="md">
                {HERO.secondaryCta.label}
              </CandyButton>
            </div>

            {/* 3 Trust Chips */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {HERO.chips.map((label, i) => (
                <div key={label} className="chip">
                  <span
                    className="chip__dot text-purple-night font-bold text-[11px]"
                    style={{ background: CHIP_COLORS[i % CHIP_COLORS.length] }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Mini Social Proof */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold text-cream/90">
              <div className="flex -space-x-2">
                {[PHOTOS_SM.family, PHOTOS_SM.pet, PHOTOS_SM.wedding, PHOTOS_SM.friends].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-7 w-7 rounded-full border-2 border-white object-cover shadow"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sun tracking-tight">★★★★★</span>
                <span>
                  <strong>{HERO.proof.rating}/5</strong> {HERO.proof.text}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT/CENTER COLUMN: Real 3D Hero Fridge Magnet */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              ref={stageWrapRef}
              className="relative w-full h-[250px] sm:h-[330px] lg:h-[410px] flex items-center justify-center"
            >
              {/* Soft warm + purple light bloom behind the 3D magnet */}
              <div
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,197,49,0.42) 0%, rgba(255,106,43,0.25) 42%, rgba(107,78,255,0.18) 65%, transparent 78%)',
                }}
                className="pointer-events-none absolute inset-2 rounded-full"
              />

              {useWebGL ? (
                <Suspense fallback={<FallbackHeroMagnet />}>
                  <HeroStage
                    inView={inView}
                    scrollProgressRef={scrollProgressRef}
                    pointerRef={pointerRef}
                  />
                </Suspense>
              ) : (
                <FallbackHeroMagnet />
              )}

              {/* Floating sticker badge */}
              <div className="pointer-events-none absolute -bottom-1 right-2 sm:right-6 rotate-[-6deg] rounded-2xl bg-purple-night/90 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-display font-bold text-white shadow-xl border-2 border-white/40 backdrop-blur-md">
                <span className="text-sun">✦ Interactive 3D</span> · Tilt &amp; explore!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
