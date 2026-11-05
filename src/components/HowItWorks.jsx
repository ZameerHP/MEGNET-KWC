import { useEffect, useRef } from 'react'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { HOW_IT_WORKS } from '../config/site'
import { gsap, prefersReduced } from '../lib/motion'

const HOW_DOODLES = [
  { kind: 'star', top: '14%', left: '5%', size: 46, speed: 1.1, rot: -12, color: 'rgba(255,197,49,0.5)' },
  { kind: 'sparkle', top: '18%', right: '6%', size: 44, speed: 1.3, rot: 14, color: 'rgba(126,217,190,0.5)' },
  { kind: 'ring', bottom: '12%', left: '8%', size: 58, speed: 0.9, rot: 16, color: 'rgba(255,255,255,0.22)' },
]

function Step3DIcon({ kind, bg }) {
  return (
    <div
      style={{ background: bg }}
      className="relative grid h-16 w-16 place-items-center rounded-2xl shadow-[inset_0_3px_0_rgba(255,255,255,0.7),0_6px_0_rgba(30,18,64,0.35),0_16px_24px_-8px_rgba(0,0,0,0.35)] border-2 border-white"
    >
      {/* Top glossy candy highlight */}
      <div className="pointer-events-none absolute inset-x-2.5 top-1.5 h-4 rounded-full bg-gradient-to-b from-white/65 to-transparent" />
      {kind === 'upload' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-purple-night" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 27V11m0 0-6 6m6-6 6 6" />
          <path d="M8 26v4a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3v-4" />
        </svg>
      )}
      {kind === 'design' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-purple-night" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 28 28 12l4 4-16 16-6 2 2-6Z" />
          <path d="m24 16 4 4" />
        </svg>
      )}
      {kind === 'craft' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-purple-night" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m20 6 3.5 8.5L32 18l-8.5 3.5L20 30l-3.5-8.5L8 18l8.5-3.5L20 6Z" />
        </svg>
      )}
      {kind === 'deliver' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-purple-night" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 12h18v14H6zM24 17h6l4 5v4h-10z" />
          <circle cx="13" cy="29" r="3.2" />
          <circle cx="29" cy="29" r="3.2" />
        </svg>
      )}
    </div>
  )
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el || prefersReduced()) return

    const ctx = gsap.context(() => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength?.() || 900
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'bottom 65%',
            scrub: true,
          },
        })
      }

      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 50, opacity: 0, rotate: (i) => (i % 2 === 0 ? -5 : 5) },
        {
          y: 0,
          opacity: 1,
          rotate: (i) => (i % 2 === 0 ? -1.8 : 1.8),
          duration: 0.75,
          stagger: 0.14,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: el,
            start: 'top 74%',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how"
      ref={sectionRef}
      className="band-angle-top relative bg-gradient-to-b from-purple via-purple-deep to-purple-night pb-18 pt-16 sm:pb-24 sm:pt-20 text-white overflow-hidden"
    >
      <Doodles items={HOW_DOODLES} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3 bg-white/15 text-sun border border-white/25">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-sun text-purple-night text-[11px] font-bold">
              ⚡
            </span>
            <span>Super Simple · 4 Happy Steps</span>
          </div>
          <SplitHeading
            as="h2"
            lines={['From Your Camera Roll', 'To Your Fridge Door']}
            highlightWord="Fridge"
            highlightClass="text-sun"
            className="display-lg text-white"
          />
          <p className="mt-3 text-base sm:text-lg font-semibold text-cream/85">
            No complicated apps. Just pick your favourite photos and we handcraft the rest.
          </p>
        </div>

        {/* 4 Steps with Animated Connecting SVG Path */}
        <div className="relative mt-11">
          {/* Desktop curved dashed path */}
          <svg
            viewBox="0 0 1100 180"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute top-10 left-0 w-full h-36 z-0"
          >
            {/* Background faint track */}
            <path
              d="M 90 90 C 260 10, 340 170, 440 90 C 560 10, 660 170, 770 90 C 880 10, 950 150, 1020 90"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 12"
            />
            {/* Animated glowing progress path */}
            <path
              ref={pathRef}
              d="M 90 90 C 260 10, 340 170, 440 90 C 560 10, 660 170, 770 90 C 880 10, 950 150, 1020 90"
              stroke="#FFC531"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                className="group relative rounded-[2rem] bg-white p-5 sm:p-6 text-ink shadow-[0_24px_50px_-18px_rgba(12,6,40,0.65)] border-4 border-white transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center justify-between">
                  <Step3DIcon kind={step.icon} bg={step.color} />
                  <span className="font-display text-3xl font-bold text-purple/20">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-purple-night">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base font-semibold text-ink/75 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
