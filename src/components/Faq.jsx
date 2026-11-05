import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { FAQ, waLink } from '../config/site'

const FAQ_DOODLES = [
  { kind: 'star', top: '12%', left: '5%', size: 44, speed: 1.1, rot: -12, color: 'rgba(107,78,255,0.22)' },
  { kind: 'sparkle', bottom: '15%', right: '6%', size: 46, speed: 1.3, rot: 14, color: 'rgba(255,106,43,0.25)' },
]

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section
      id="faq"
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <Doodles items={FAQ_DOODLES} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="eyebrow mb-3 bg-purple/12 text-purple border border-purple/25">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-purple text-white text-[11px] font-bold">
              ?
            </span>
            <span>Got Questions? · We’ve Got Answers</span>
          </div>
          <SplitHeading
            as="h2"
            lines={['Frequently Asked', 'Magnet Questions']}
            highlightWord="Magnet"
            highlightClass="text-tomato"
            className="display-lg text-purple-night"
          />
        </div>

        {/* Accordion List */}
        <div className="mt-9 space-y-3">
          {FAQ.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={item.q}
                className={`rounded-3xl border-3 transition-all duration-300 ${
                  isOpen
                    ? 'bg-white border-purple shadow-[0_18px_40px_-16px_rgba(42,27,122,0.3)]'
                    : 'bg-white/85 border-purple/12 hover:border-purple/35 shadow-sm'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base sm:text-lg font-bold text-purple-night cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-lg transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-45 bg-gradient-to-b from-[#FFA43A] to-[#FF6A1F] text-purple-night shadow-[0_3px_0_#C94A0B]'
                          : 'bg-purple/10 text-purple'
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm sm:text-base font-semibold text-ink/80 leading-relaxed border-t border-purple/10">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <p className="mt-7 text-center text-sm sm:text-base font-semibold text-ink/75">
          Still wondering something?{' '}
          <a
            href={waLink('Hi Magnetics KWC! I have a quick question about your magnets.')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-tomato underline decoration-2 underline-offset-4 hover:text-purple"
          >
            Ask us on WhatsApp →
          </a>
        </p>
      </div>
    </section>
  )
}
