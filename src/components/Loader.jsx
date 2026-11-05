import { useEffect, useRef, useState } from 'react'
import Logo, { TOTAL_LOGO_LETTERS } from './ui/Logo'
import { gsap, prefersReduced } from '../lib/motion'
import { store } from '../lib/store'

/**
 * Cinematic Intro Loader (1.8–2.2s max, skippable):
 * The letters of "MAGNETICS KWC" drop in one by one like magnets snapping onto a fridge
 * with a small bounce and a satisfying "click" scale pulse, then the curtain splits open to reveal the hero.
 */
export default function Loader() {
  const [visible, setVisible] = useState(true)
  const rootRef = useRef(null)
  const topCurtainRef = useRef(null)
  const bottomCurtainRef = useRef(null)
  const logoWrapRef = useRef(null)
  const ringRef = useRef(null)
  const letterRefs = useRef(new Array(TOTAL_LOGO_LETTERS))
  const tlRef = useRef(null)

  const finish = () => {
    store.set({ loaderDone: true })
    setVisible(false)
  }

  const handleSkip = () => {
    if (tlRef.current) tlRef.current.kill()
    gsap.to([topCurtainRef.current, bottomCurtainRef.current], {
      yPercent: (i) => (i === 0 ? -102 : 102),
      duration: 0.35,
      ease: 'power3.inOut',
      onComplete: finish,
    })
    gsap.to(logoWrapRef.current, { scale: 0.85, opacity: 0, duration: 0.25 })
  }

  useEffect(() => {
    if (prefersReduced()) {
      finish()
      return
    }

    const letters = letterRefs.current.filter(Boolean)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finish,
      })
      tlRef.current = tl

      gsap.set(letters, {
        y: -140,
        z: 160,
        scale: 1.55,
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -18 : 18),
      })
      gsap.set(ringRef.current, { scale: 0.4, opacity: 0 })

      // Letters drop in and SNAP onto the surface one by one
      tl.to(letters, {
        y: 0,
        z: 0,
        scale: 1,
        opacity: 1,
        rotation: (i) => (i % 2 === 0 ? -3 : 3),
        duration: 0.48,
        stagger: 0.055,
        ease: 'back.out(2.4)',
      })

      // Satisfying "CLICK!" magnetic snap pulse across the whole logo + shockwave ring
      tl.to(
        logoWrapRef.current,
        {
          scaleX: 1.12,
          scaleY: 0.88,
          duration: 0.11,
          ease: 'power2.in',
        },
        '-=0.06'
      )
        .to(logoWrapRef.current, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.32,
          ease: 'elastic.out(1.2, 0.4)',
        })
        .fromTo(
          ringRef.current,
          { scale: 0.6, opacity: 0.85 },
          { scale: 2.1, opacity: 0, duration: 0.55, ease: 'expo.out' },
          '<0.02'
        )

      // Curtain splits open top & bottom to reveal the hero
      tl.to(
        logoWrapRef.current,
        {
          scale: 0.88,
          opacity: 0,
          duration: 0.36,
          ease: 'power3.in',
        },
        '+=0.08'
      )
        .to(
          topCurtainRef.current,
          {
            yPercent: -102,
            duration: 0.62,
            ease: 'expo.inOut',
          },
          '<0.06'
        )
        .to(
          bottomCurtainRef.current,
          {
            yPercent: 102,
            duration: 0.62,
            ease: 'expo.inOut',
          },
          '<'
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="loader"
      role="status"
      aria-label="Loading Magnetics KWC"
      onClick={handleSkip}
    >
      <div ref={topCurtainRef} className="loader__half top-0" />
      <div ref={bottomCurtainRef} className="loader__half bottom-0" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center select-none">
        {/* Magnetic snap pulse ring */}
        <div
          ref={ringRef}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-4 border-white/60"
        />

        <div ref={logoWrapRef} className="relative flex flex-col items-center">
          <Logo as="div" size="xl" letterRefs={letterRefs} />
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/18 px-4 py-1.5 font-display text-sm font-semibold text-white backdrop-blur-md border border-white/30">
            <span className="h-2.5 w-2.5 rounded-full bg-sun animate-ping" />
            Snapping your memories onto the fridge…
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleSkip()
        }}
        className="fixed bottom-6 right-6 z-20 rounded-full bg-white/20 px-4 py-2 font-display text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md border border-white/35 hover:bg-white/30 transition"
      >
        Skip Intro ✦
      </button>
    </div>
  )
}
