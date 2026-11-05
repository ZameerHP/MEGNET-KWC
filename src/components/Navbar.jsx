import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './ui/Logo'
import { NAV, SITE, waLink } from '../config/site'
import { lockScroll, scrollToTarget } from '../lib/motion'

export function InstagramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.76 14.05c-.24.68-1.4 1.3-1.95 1.38-.5.08-1.14.11-1.84-.11-.42-.14-.97-.32-1.67-.62-2.94-1.27-4.86-4.23-5.01-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.44.76-2.15 1.03-2.45.27-.29.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.59.84 2.05.91 2.2.07.15.12.32.02.52-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.26 1.64 2.04 1.13 1 2.08 1.31 2.37 1.46.29.15.46.12.64-.07.17-.2.74-.86.94-1.16.2-.29.39-.25.66-.15.27.1 1.72.81 2.01.96.29.15.49.22.56.34.08.13.08.72-.16 1.4Z" />
    </svg>
  )
}

/**
 * Sticky glossy pill navbar:
 * - Logo left
 * - Home, Shop, Customize, How It Works, Reviews, Gifts, Contact
 * - Instagram & WhatsApp round glossy candy buttons right
 * - Shrinks and blurs on scroll
 * - Mobile full-screen menu with staggered links
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Observe sections to highlight active pill
  useEffect(() => {
    const ids = NAV.map((n) => n.href.replace('#', ''))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-38% 0px -52% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    lockScroll(menuOpen)
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const handleNav = (e, href) => {
    e.preventDefault()
    setActive(href)
    setMenuOpen(false)
    scrollToTarget(href, { offset: -90 })
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'is-scrolled py-2' : 'py-2.5 sm:py-3.5'
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <nav
            aria-label="Primary"
            className={`pillbar flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'px-4 py-1.5 sm:px-5' : 'px-4 py-2 sm:px-6 sm:py-2'
            }`}
          >
            {/* Brand Logo */}
            <Logo
              size="sm"
              href="#home"
              onClick={(e) => handleNav(e, '#home')}
              className="shrink-0"
            />

            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV.map((item) => {
                const isActive = active === item.href
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className={`navlink ${isActive ? 'text-purple-night font-bold' : 'hover:text-tomato'}`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="navlink__pill"
                          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Social round candy icons + Mobile menu trigger */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Magnetics KWC on Instagram"
                className="candy candy--round candy--sm candy--purple"
                data-cursor="magnet"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={waLink('Hi Magnetics KWC! I want to order custom fridge magnets.')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on WhatsApp"
                className="candy candy--round candy--sm candy--green"
                data-cursor="magnet"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>

              {/* Mobile Hamburger Pill */}
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="candy candy--round candy--sm lg:hidden"
              >
                <div className="flex flex-col items-center justify-center gap-1 w-5">
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-purple-night transition-transform duration-300 ${
                      menuOpen ? 'translate-y-1.5 rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-purple-night transition-opacity duration-300 ${
                      menuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-purple-night transition-transform duration-300 ${
                      menuOpen ? '-translate-y-1.5 -rotate-45' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Full-Screen Menu with Staggered Links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 90% 6%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 90% 6%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 90% 6%)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-gradient-to-br from-purple-night via-purple-deep to-tomato p-6 pt-28 text-white lg:hidden overflow-y-auto"
          >
            <ul className="flex flex-col items-center gap-3 my-auto">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 28, rotate: -3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNav(e, item.href)}
                    className={`inline-block rounded-full px-6 py-2.5 font-display text-3xl sm:text-4xl font-bold transition ${
                      active === item.href
                        ? 'bg-sun text-purple-night shadow-lg'
                        : 'text-white hover:text-sun'
                    }`}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-3 pb-4 text-center">
              <p className="font-display text-sm text-white/80">
                Stick your memories. Smile every time you open the fridge.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-display text-sm font-semibold text-white border border-white/25"
                >
                  <InstagramIcon className="w-4 h-4" /> Instagram
                </a>
                <a
                  href={waLink('Hi Magnetics KWC!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-mint text-purple-night px-4 py-2 font-display text-sm font-bold"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
