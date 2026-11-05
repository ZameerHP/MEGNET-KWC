import Logo from './ui/Logo'
import { InstagramIcon, WhatsAppIcon } from './Navbar'
import { FOOTER, NAV, SITE, waLink } from '../config/site'
import { scrollToTarget } from '../lib/motion'

export default function Footer() {
  const handleNav = (e, href) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault()
      scrollToTarget(href, { offset: -80 })
    }
  }

  return (
    <footer className="band-angle-top-r relative bg-gradient-to-b from-purple-night to-[#140A3C] pt-16 pb-10 text-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Brand Logo */}
          <Logo
            size="md"
            href="#home"
            onClick={(e) => handleNav(e, '#home')}
          />

          <p className="mt-3 max-w-md font-display text-base sm:text-lg font-semibold text-cream/85">
            {FOOTER.tagline}
          </p>

          {/* Glossy Pill Nav Again (Bomcom Reference Footer Style) */}
          <div className="mt-6 pillbar px-4 py-2 sm:px-6 sm:py-2.5 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="navlink hover:bg-orange-hot/20"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Social Round Candy Icons */}
          <div className="mt-6 flex items-center gap-3.5">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="candy candy--round candy--purple"
              data-cursor="magnet"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={waLink('Hi Magnetics KWC!')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="candy candy--round candy--green"
              data-cursor="magnet"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Legal / Support Links & Copyright */}
          <div className="mt-8 pt-6 border-t border-white/15 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-cream/70">
            <p>© {SITE.year} {SITE.name}. All rights reserved.</p>
            <ul className="flex flex-wrap items-center gap-6">
              {FOOTER.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className="hover:text-sun transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
