import { Component, useEffect, useState } from 'react'
import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import MagnetTypes from './components/MagnetTypes'
import ScrollStory from './components/ScrollStory'
import Customizer from './components/Customizer'
import HowItWorks from './components/HowItWorks'
import Reviews from './components/Reviews'
import PerfectFor from './components/PerfectFor'
import Community from './components/Community'
import Faq from './components/Faq'
import Footer from './components/Footer'
import { detectTier } from './lib/gpu'
import { initSmoothScroll, ScrollTrigger } from './lib/motion'
import { store } from './lib/store'

class WebGLBoundary extends Component {
  componentDidCatch() {
    store.set({ tier: 'low' })
  }
  render() {
    return this.props.children
  }
}

export default function App() {
  const [customizerPreset, setCustomizerPreset] = useState(null)

  useEffect(() => {
    store.set({ tier: detectTier() })
    const cleanupLenis = initSmoothScroll()
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => {
      clearTimeout(timer)
      cleanupLenis()
    }
  }, [])

  return (
    <WebGLBoundary>
      {/* Subtle 3-4% film grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Custom magnet cursor (desktop fine pointer) */}
      <CustomCursor />

      {/* Cinematic Intro Loader (1.8-2.2s, skippable) */}
      <Loader />

      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-sun focus:px-5 focus:py-2.5 focus:font-display focus:font-bold focus:text-purple-night"
      >
        Skip to content
      </a>

      {/* 1. Sticky Glossy Pill Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero */}
        <Hero />

        {/* Infinite Marquee Strip of Magnet Photos */}
        <Marquee direction={1} bg="bg-purple-night" tiltAngle="-rotate-1" />

        {/* 3. Magnet Types Showcase ("Science Lab" Card + Real Fridge Mockups) */}
        <MagnetTypes onSelectForCustomizer={(item) => setCustomizerPreset({ ...item, ts: Date.now() })} />

        {/* 4. Pinned Scroll-Story: "Stick It. Smile." */}
        <ScrollStory />

        {/* 5. Live 3D Magnet Customizer */}
        <Customizer presetSelection={customizerPreset} />

        {/* 6. How It Works (4 Steps + Animated Path) */}
        <HowItWorks />

        {/* Second Marquee Strip */}
        <Marquee direction={-1} bg="bg-tomato-deep" tiltAngle="rotate-1" />

        {/* 7. Latest Reviews Carousel */}
        <Reviews />

        {/* 8. Perfect For (2x2+2 Tilted Cards + Bulk Orders CTA) */}
        <PerfectFor />

        {/* 9. Community Banner ("Join the Magnet Club" + Newsletter Card) */}
        <Community />

        {/* 10. FAQ Accordion */}
        <Faq />
      </main>

      {/* 11. Footer */}
      <Footer />
    </WebGLBoundary>
  )
}
