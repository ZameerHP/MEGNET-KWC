import { useEffect, useRef } from 'react'
import CandyButton from './ui/CandyButton'
import CssMagnet from './ui/CssMagnet'
import Doodles from './ui/Doodles'
import { STORY } from '../config/site'
import { gsap, prefersReduced } from '../lib/motion'

const STORY_DOODLES = [
  { kind: 'star', top: '12%', left: '6%', size: 46, speed: 1, rot: -12, color: 'rgba(255,197,49,0.5)' },
  { kind: 'heart', top: '20%', right: '6%', size: 44, speed: 1.3, rot: 14, color: 'rgba(255,122,110,0.45)' },
  { kind: 'sparkle', bottom: '18%', left: '7%', size: 42, speed: 1.1, rot: 8, color: 'rgba(126,217,190,0.5)' },
  { kind: 'orbit', bottom: '14%', right: '6%', size: 74, speed: 1.2, rot: -18, color: 'rgba(255,255,255,0.22)' },
]

function offscreenOffset(from) {
  switch (from) {
    case 'left':
      return { x: -480, y: -60, r: -42 }
    case 'right':
      return { x: 480, y: -40, r: 42 }
    case 'top':
      return { x: 40, y: -420, r: 28 }
    case 'bottom':
    default:
      return { x: -40, y: 420, r: -28 }
  }
}

export default function ScrollStory() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const magnetRefs = useRef([])
  const badgeRefs = useRef([])
  const finaleRef = useRef(null)
  const progressBarRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin || prefersReduced()) return

    const ctx = gsap.context(() => {
      const items = magnetRefs.current.filter(Boolean)
      const badges = badgeRefs.current.filter(Boolean)

      items.forEach((el, i) => {
        const off = offscreenOffset(STORY.magnets[i].from)
        gsap.set(el, {
          x: off.x,
          y: off.y,
          rotation: off.r,
          scale: 1.45,
          opacity: 0,
        })
      })
      gsap.set(badges, { scale: 0, opacity: 0 })
      gsap.set(finaleRef.current, { y: 40, opacity: 0, scale: 0.92 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=240%',
          pin: pin,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      items.forEach((el, i) => {
        const targetRot = STORY.magnets[i].r
        const pos = i * 0.42

        // Fly in from edge toward fridge spot
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            rotation: targetRot,
            scale: 1,
            opacity: 1,
            duration: 0.36,
            ease: 'power3.out',
          },
          pos
        )
          // Squish bounce SNAP onto the fridge door
          .to(
            el,
            {
              scaleX: 1.16,
              scaleY: 0.84,
              duration: 0.08,
              ease: 'power2.in',
            },
            pos + 0.34
          )
          .to(
            el,
            {
              scaleX: 1,
              scaleY: 1,
              duration: 0.18,
              ease: 'back.out(3)',
            },
            pos + 0.42
          )

        // Pop little "SNAP!" badge briefly
        if (badges[i]) {
          tl.fromTo(
            badges[i],
            { scale: 0, opacity: 1 },
            { scale: 1.1, opacity: 0, duration: 0.32, ease: 'expo.out' },
            pos + 0.35
          )
        }
      })

      // Finale copy + CTA card pops in at the end of the story
      tl.to(
        finaleRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.7)',
        },
        '+=0.08'
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Stick It. Smile. Scroll story"
      className="relative bg-gradient-to-b from-purple-night via-purple-deep to-purple-night text-white overflow-hidden"
    >
      <div
        ref={pinRef}
        className="relative min-h-[100svh] w-full flex flex-col items-center justify-center py-10 px-4 sm:px-6 overflow-hidden"
      >
        <Doodles items={STORY_DOODLES} />

        {/* Header above Fridge Door */}
        <div className="relative z-20 text-center mb-3.5 sm:mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3.5 py-1 font-display text-xs font-semibold text-sun border border-white/25">
            ★ {STORY.kicker} · Scroll to snap!
          </span>
          <h2 className="mt-1.5 display-md text-white drop-shadow-[0_4px_0_rgba(20,10,55,0.8)]">
            {STORY.title}
          </h2>
        </div>

        {/* THE GLOSSY FRIDGE DOOR */}
        <div className="fridge relative z-10 w-full max-w-3xl h-[52svh] sm:h-[56svh] min-h-[310px] sm:min-h-[350px] max-h-[500px]">
          {/* Freezer / Fridge horizontal seam */}
          <div className="fridge__seam top-[24%]" />

          {/* Chrome Handles */}
          <div className="fridge__handle right-4 sm:right-8 top-[6%] h-[14%]" />
          <div className="fridge__handle right-4 sm:right-8 top-[30%] h-[32%]" />

          {/* Subtle brand badge on the freezer door */}
          <div className="pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 rounded-full border border-ink/10 bg-white/75 px-3 sm:px-4 py-1 font-display text-[10px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.2em] text-ink/40 uppercase shadow-sm whitespace-nowrap">
            MAGNETICS KWC · FRIDGE WALL
          </div>

          {/* Flying Magnets that SNAP onto the door */}
          {STORY.magnets.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                magnetRefs.current[i] = el
              }}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
            >
              <div className="relative">
                <CssMagnet
                  src={m.src}
                  alt={m.alt}
                  shape={m.shape}
                  size="clamp(60px, 11.5vw, 114px)"
                />
                <span
                  ref={(el) => {
                    badgeRefs.current[i] = el
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3.5 -right-3.5 rounded-full bg-sun px-2 py-0.5 font-display text-[10px] sm:text-xs font-bold text-purple-night shadow-md border-2 border-white"
                >
                  SNAP!
                </span>
              </div>
            </div>
          ))}

          {/* Finale Copy + CTA Card at bottom of Fridge Door */}
          <div
            ref={finaleRef}
            className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-5 z-30 rounded-2xl sm:rounded-3xl bg-purple-night/95 px-4 py-3 sm:px-7 sm:py-4 text-center text-white shadow-2xl border-2 border-white/35 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4"
          >
            <p className="font-display text-sm sm:text-lg font-bold text-cream whitespace-normal sm:whitespace-nowrap">
              “{STORY.endLine}”
            </p>
            <CandyButton href={STORY.cta.href} size="sm" ring>
              {STORY.cta.label}
            </CandyButton>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="relative z-20 mt-5 h-2 w-48 overflow-hidden rounded-full bg-white/15">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-sun to-orange-hot"
          />
        </div>
      </div>
    </section>
  )
}
