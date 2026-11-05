import { useEffect, useRef, useState } from 'react'
import { generatedDataURL } from '../../lib/designs'
import { useTilt } from '../../lib/hooks'

/**
 * 2D / CSS-3D Glossy Epoxy Fridge Magnet.
 * Used in the Marquee, the ScrollStory fridge door, and as the automatic fallback when WebGL is weak.
 */
export default function CssMagnet({
  src,
  alt = 'Custom fridge magnet',
  shape = 'rounded', // 'square' | 'rounded' | 'circle' | 'heart'
  finish = 'glossy', // 'glossy' | 'matte'
  caption = '',
  size = 160,
  tilt = false,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  useTilt(ref, tilt ? 14 : 0)
  const [resolvedSrc, setResolvedSrc] = useState(() =>
    src === 'quote' || src === 'promo' ? '' : src
  )

  useEffect(() => {
    let cancelled = false
    if (src === 'quote' || src === 'promo') {
      generatedDataURL(src).then((url) => {
        if (!cancelled) setResolvedSrc(url)
      })
    } else {
      setResolvedSrc(src)
    }
    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <div
      ref={ref}
      className={`cssmag cssmag--${shape} ${finish === 'matte' ? 'cssmag--matte' : ''} ${
        tilt ? 'tilt' : ''
      } ${className}`}
      style={{ '--size': typeof size === 'number' ? `${size}px` : size, ...style }}
    >
      <div className="cssmag__body">
        {resolvedSrc && (
          <img
            src={resolvedSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        )}
        {caption?.trim() && (
          <div
            className="pointer-events-none absolute inset-x-2 bottom-2.5 flex items-center justify-center text-center font-display font-bold text-white drop-shadow-[0_2px_4px_rgba(30,18,64,0.85)]"
            style={{
              fontSize: 'clamp(0.75rem, 1.4vw, 1.05rem)',
              WebkitTextStroke: '3px #2A1B7A',
              paintOrder: 'stroke fill',
            }}
          >
            {caption}
          </div>
        )}
        <div className="cssmag__gloss" />
        {tilt && <div className="tilt__glare" />}
      </div>
    </div>
  )
}
