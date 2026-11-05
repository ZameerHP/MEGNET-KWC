import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { store } from './store'

gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText }

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger & Lenis share one clock. */
export function initSmoothScroll() {
  if (prefersReduced()) return () => {}
  const lenis = new Lenis({
    lerp: 0.085,
    duration: 1.15, // used for programmatic scrollTo
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  store.set({ lenis })

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })
  }

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    store.set({ lenis: null })
  }
}

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  const lenis = store.get().lenis
  if (lenis) lenis.scrollTo(el, { offset: opts.offset ?? 0, duration: 1.4, easing: easeOutQuart, ...opts })
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
}

export function lockScroll(lock) {
  const lenis = store.get().lenis
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
