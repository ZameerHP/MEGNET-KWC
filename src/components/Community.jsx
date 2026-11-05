import { useState } from 'react'
import CandyButton from './ui/CandyButton'
import Doodles from './ui/Doodles'
import { InstagramIcon, WhatsAppIcon } from './Navbar'
import { COMMUNITY, SITE, waLink } from '../config/site'

const COMMUNITY_DOODLES = [
  { kind: 'star', top: '12%', left: '6%', size: 48, speed: 1.2, rot: -14, color: 'rgba(255,197,49,0.55)' },
  { kind: 'heart', top: '18%', right: '8%', size: 46, speed: 1.1, rot: 12, color: 'rgba(255,255,255,0.35)' },
  { kind: 'sparkle', bottom: '16%', left: '10%', size: 42, speed: 1.3, rot: 8, color: 'rgba(126,217,190,0.6)' },
]

/**
 * Cute floating mascot-style 3D fridge magnet SVG character with a big happy grin and waving arms.
 */
function MascotMagnet() {
  return (
    <div className="relative w-40 h-40 sm:w-48 sm:h-48 animate-[doodle-bob_4s_ease-in-out_infinite_alternate] select-none">
      <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-[0_24px_30px_rgba(30,18,64,0.45)]">
        <defs>
          <linearGradient id="mascotBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA43A" />
            <stop offset="55%" stopColor="#FF6A2B" />
            <stop offset="100%" stopColor="#E8381A" />
          </linearGradient>
          <linearGradient id="mascotGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Waving arms */}
        <path
          d="M 28 115 Q 6 90 18 68"
          fill="none"
          stroke="#2A1B7A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="18" cy="65" r="10" fill="#FFC531" stroke="#2A1B7A" strokeWidth="4" />

        <path
          d="M 192 115 Q 214 90 202 68"
          fill="none"
          stroke="#2A1B7A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="202" cy="65" r="10" fill="#7ED9BE" stroke="#2A1B7A" strokeWidth="4" />

        {/* 3D Magnet backing shadow */}
        <rect
          x="38"
          y="38"
          width="148"
          height="148"
          rx="38"
          fill="#2A1B7A"
          transform="rotate(-5 110 110)"
        />
        {/* White beveled frame */}
        <rect
          x="32"
          y="30"
          width="148"
          height="148"
          rx="38"
          fill="#FFFFFF"
          transform="rotate(-5 110 110)"
        />
        {/* Glossy epoxy candy dome */}
        <rect
          x="40"
          y="38"
          width="132"
          height="132"
          rx="32"
          fill="url(#mascotBody)"
          transform="rotate(-5 110 110)"
        />
        {/* Top dome specular highlight */}
        <ellipse
          cx="104"
          cy="58"
          rx="48"
          ry="16"
          fill="url(#mascotGloss)"
          transform="rotate(-5 104 58)"
        />

        {/* Cute eyes */}
        <g transform="rotate(-5 110 110)">
          <circle cx="84" cy="96" r="11" fill="#2A1B7A" />
          <circle cx="80" cy="92" r="4" fill="#FFFFFF" />
          <circle cx="132" cy="96" r="11" fill="#2A1B7A" />
          <circle cx="128" cy="92" r="4" fill="#FFFFFF" />

          {/* Rosy cheeks */}
          <ellipse cx="66" cy="110" rx="9" ry="5.5" fill="#FF9E9E" />
          <ellipse cx="150" cy="110" rx="9" ry="5.5" fill="#FF9E9E" />

          {/* Happy big smile */}
          <path
            d="M 88 112 Q 108 134 128 112"
            fill="#2A1B7A"
            stroke="#2A1B7A"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M 98 120 Q 108 128 118 120" fill="#FF7A6E" />
        </g>

        {/* Floating little heart */}
        <path
          d="M180 28c-3-5-10-5-13 0-3-5-10-5-13 0-3 6 3 13 13 20 10-7 16-14 13-20Z"
          fill="#FFC531"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      </svg>
    </div>
  )
}

/**
 * Community banner (inspired by Bomcom's Discord + Newsletter block):
 * - "Join the Magnet Club" banner with WhatsApp/Instagram CTAs and a floating mascot-style magnet
 * - White "Get Offers In Your Inbox" newsletter card with a round orange paper-plane submit button
 */
export default function Community() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'done'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    if (SITE.newsletterEndpoint) {
      try {
        await fetch(SITE.newsletterEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        })
      } catch {
        // fallback to friendly confirmation
      }
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <section
      id="contact"
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* TOP: Join the Magnet Club Banner */}
        <div
          className="card-stack rounded-[2.25rem]"
          style={{ '--stack-bg': 'var(--purple-night)', '--stack-rot': '1.6deg', '--stack-x': '12px', '--stack-y': '16px' }}
        >
          <div
            style={{ background: 'var(--hero-bg)' }}
            className="relative overflow-hidden rounded-[2.25rem] p-6 sm:p-9 lg:p-11 text-white shadow-2xl border-4 border-white"
          >
            <Doodles items={COMMUNITY_DOODLES} />

            <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 font-display text-xs font-bold text-white border border-white/35">
                  🧲 VIP Fridge Fam
                </span>
                <h2 className="mt-2.5 display-lg text-white drop-shadow-[0_5px_0_rgba(140,22,5,0.65)]">
                  {COMMUNITY.title}
                </h2>
                <p className="mt-3 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg font-semibold text-cream/95 leading-relaxed">
                  {COMMUNITY.text}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                  <CandyButton
                    href={waLink('Hi Magnetics KWC! Add me to the Magnet Club updates!')}
                    external
                    variant="green"
                    size="md"
                    ring
                    icon={<WhatsAppIcon className="w-5 h-5" />}
                  >
                    Chat on WhatsApp
                  </CandyButton>
                  <CandyButton
                    href={SITE.instagram}
                    external
                    variant="purple"
                    size="md"
                    icon={<InstagramIcon className="w-5 h-5" />}
                  >
                    Follow {SITE.instagramHandle}
                  </CandyButton>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-center">
                <MascotMagnet />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: White "Get Offers In Your Inbox" Newsletter Card with Round Orange Paper-Plane Button */}
        <div
          className="card-stack mx-auto max-w-3xl rounded-[2.25rem] -rotate-1"
          style={{ '--stack-bg': 'var(--purple)', '--stack-rot': '2deg', '--stack-x': '10px', '--stack-y': '12px' }}
        >
          <div className="glossy-card p-6 sm:p-8 border-4 border-white flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-purple-night">
                {COMMUNITY.newsletterTitle}
              </h3>
              <p className="mt-1 text-sm sm:text-base font-semibold text-ink/75">
                {COMMUNITY.newsletterText}
              </p>
            </div>

            {status === 'done' ? (
              <div className="rounded-2xl bg-mint/30 px-5 py-3.5 font-display text-base font-bold text-purple-night border-2 border-mint">
                🎉 Yay! You’re in the Magnet Club!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full md:w-auto items-center gap-3"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="field min-w-0 sm:w-72"
                />
                {/* Round Orange Paper-Plane Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  aria-label="Subscribe to newsletter"
                  className="candy candy--round shrink-0"
                  data-cursor="magnet"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6 text-purple-night"
                    aria-hidden="true"
                  >
                    <path d="M3.4 20.4 20.85 12 3.4 3.6c-.66-.32-1.4.28-1.24 1l1.8 6.4 9.04 1-9.04 1-1.8 6.4c-.16.72.58 1.32 1.24 1Z" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
