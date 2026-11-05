import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../../lib/hooks'
import { scrollToTarget } from '../../lib/motion'

export function PlayTriangle({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.5 2.75a1 1 0 0 1 1.52-.85l8 5.25a1 1 0 0 1 0 1.7l-8 5.25a1 1 0 0 1-1.52-.85V2.75Z" />
    </svg>
  )
}

/**
 * Glossy 3D "candy" pill button with:
 * - Orange / cream / purple / green gradient variants
 * - Inner top highlight + thick bottom 3D edge
 * - Tiny play-triangle icon badge (or custom icon)
 * - Magnetic cursor pull + springy jelly squish on press
 */
export default function CandyButton({
  children,
  href,
  onClick,
  variant = 'orange', // 'orange' | 'cream' | 'purple' | 'green'
  size = 'md', // 'sm' | 'md' | 'lg'
  ring = false,
  icon = 'play', // 'play' | 'none' | ReactNode
  external = false,
  type = 'button',
  className = '',
  ariaLabel,
  ...rest
}) {
  const wrapRef = useRef(null)
  useMagnetic(wrapRef, 0.32)

  const variantCls = {
    orange: '',
    cream: 'candy--cream',
    purple: 'candy--purple',
    green: 'candy--green',
  }[variant] || ''

  const sizeCls = {
    sm: 'candy--sm',
    md: '',
    lg: 'candy--lg',
  }[size] || ''

  const ringCls = ring ? 'candy--ring' : ''
  const noIconCls = icon === 'none' ? 'candy--noicon' : ''

  const handleClick = (e) => {
    if (onClick) onClick(e)
    if (href && href.startsWith('#')) {
      e.preventDefault()
      scrollToTarget(href)
    }
  }

  const content = (
    <>
      <span>{children}</span>
      {icon !== 'none' && (
        <span className="candy__icon" aria-hidden="true">
          {icon === 'play' ? <PlayTriangle /> : icon}
        </span>
      )}
    </>
  )

  const commonProps = {
    className: `candy ${variantCls} ${sizeCls} ${ringCls} ${noIconCls} ${className}`,
    'aria-label': ariaLabel,
    'data-cursor': 'magnet',
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scaleX: 1.06, scaleY: 0.92, y: 3 },
    transition: { type: 'spring', stiffness: 520, damping: 22, mass: 0.7 },
    onClick: handleClick,
    ...rest,
  }

  return (
    <span ref={wrapRef} className="magnetic">
      {href ? (
        <motion.a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          {...commonProps}
        >
          {content}
        </motion.a>
      ) : (
        <motion.button type={type} {...commonProps}>
          {content}
        </motion.button>
      )}
    </span>
  )
}
