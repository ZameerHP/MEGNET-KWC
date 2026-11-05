import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CandyButton from './ui/CandyButton'
import CssMagnet from './ui/CssMagnet'
import Doodles from './ui/Doodles'
import SplitHeading from './ui/SplitHeading'
import { WhatsAppIcon } from './Navbar'
import { PHOTOS, PHOTOS_SM, PRICING, waLink } from '../config/site'
import { useInView, useNearViewport } from '../lib/hooks'
import { useStore } from '../lib/store'

const SingleMagnetStage = lazy(() => import('../three/SingleMagnetStage'))

const SAMPLE_PRESETS = [
  { id: 'family', label: 'Family', tex: PHOTOS.family, thumb: PHOTOS_SM.family },
  { id: 'pet', label: 'Puppy', tex: PHOTOS.pet, thumb: PHOTOS_SM.pet },
  { id: 'travel', label: 'Travel', tex: PHOTOS.travel, thumb: PHOTOS_SM.travel },
  { id: 'wedding', label: 'Wedding', tex: PHOTOS.wedding, thumb: PHOTOS_SM.wedding },
  { id: 'baby', label: 'Baby', tex: PHOTOS.baby, thumb: PHOTOS_SM.baby },
  { id: 'quote', label: 'Quote', tex: 'quote', thumb: null },
]

const CUSTOMIZER_DOODLES = [
  { kind: 'orbit', top: '8%', left: '4%', size: 76, speed: 1.2, rot: -16, color: 'rgba(107,78,255,0.2)' },
  { kind: 'star', top: '12%', right: '5%', size: 46, speed: 1.4, rot: 14, color: 'rgba(255,106,43,0.28)' },
  { kind: 'heart', bottom: '10%', left: '6%', size: 44, speed: 1.0, rot: -10, color: 'rgba(255,122,110,0.3)' },
]

function ShapeSvg({ id }) {
  switch (id) {
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 20.5C6 16 2.5 12.6 2.5 8.2 2.5 5.2 4.8 3 7.6 3c1.8 0 3.3.9 4.4 2.4C13.1 3.9 14.6 3 16.4 3c2.8 0 5.1 2.2 5.1 5.2 0 4.4-3.5 7.8-9.5 12.3Z" />
        </svg>
      )
    case 'rounded':
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="6" />
        </svg>
      )
  }
}

export default function Customizer({ presetSelection }) {
  const sectionRef = useRef(null)
  const fileInputRef = useRef(null)
  const near = useNearViewport(sectionRef, '500px')
  const inView = useInView(sectionRef, '150px')
  const tier = useStore((s) => s.tier)

  const [photoSrc, setPhotoSrc] = useState(PHOTOS.family)
  const [uploadedName, setUploadedName] = useState('')
  const [shape, setShape] = useState('rounded')
  const [sizeId, setSizeId] = useState('m')
  const [finish, setFinish] = useState('glossy')
  const [caption, setCaption] = useState('')
  const [packId, setPackId] = useState('p4')
  const [dragActive, setDragActive] = useState(false)
  const [spinBump, setSpinBump] = useState(1)

  // Sync when user clicks "Customize Now" from MagnetTypes showcase
  useEffect(() => {
    if (!presetSelection) return
    if (presetSelection.shape) setShape(presetSelection.shape)
    if (presetSelection.texture) {
      setPhotoSrc(presetSelection.texture)
      setUploadedName('')
    }
    setSpinBump((n) => n + 1)
  }, [presetSelection])

  // Clean up object URL if user uploads multiple files
  useEffect(() => {
    return () => {
      if (photoSrc && photoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(photoSrc)
      }
    }
  }, [photoSrc])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPhotoSrc(url)
    setUploadedName(file.name)
    setSpinBump((n) => n + 1)
  }

  const sizeObj = PRICING.sizes.find((s) => s.id === sizeId) || PRICING.sizes[1]
  const shapeObj = PRICING.shapes.find((s) => s.id === shape) || PRICING.shapes[1]
  const finishObj = PRICING.finishes.find((f) => f.id === finish) || PRICING.finishes[0]
  const packObj = PRICING.packs.find((p) => p.id === packId) || PRICING.packs[1]

  const hasCaption = caption.trim().length > 0
  const unitPrice =
    sizeObj.price +
    shapeObj.extra +
    finishObj.extra +
    (hasCaption ? PRICING.textExtra : 0)

  const rawTotal = unitPrice * packObj.qty
  const finalTotal = Math.round(rawTotal * (1 - packObj.discount))
  const savedAmount = rawTotal - finalTotal

  const whatsappMessage = [
    `Hi Magnetics KWC! 🧲 I'd love to order custom magnets:`,
    `• Shape: ${shapeObj.label}`,
    `• Size: ${sizeObj.label} (${sizeObj.dims})`,
    `• Finish: ${finishObj.label}`,
    `• Pack: ${packObj.label} (${packObj.qty} magnet${packObj.qty > 1 ? 's' : ''})`,
    hasCaption ? `• Text on magnet: "${caption.trim()}"` : `• Text on magnet: None`,
    `• Estimated Total: ${PRICING.currency}${finalTotal}`,
    uploadedName
      ? `I have my photo (${uploadedName}) ready to send here in chat!`
      : `I'll send my photo(s) right here in chat!`,
  ].join('\n')

  return (
    <section
      id="customize"
      ref={sectionRef}
      className="relative bg-cream py-16 sm:py-20 overflow-hidden"
    >
      <Doodles items={CUSTOMIZER_DOODLES} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-3 bg-orange-hot/15 text-tomato border border-orange-hot/30">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-tomato text-white text-[11px]">
              🎨
            </span>
            <span>Live 3D Magnet Studio · Try Your Photo</span>
          </div>
          <SplitHeading
            as="h2"
            lines={['Build Your Custom', 'Fridge Magnet Live']}
            highlightWord="Live"
            highlightClass="text-purple"
            className="display-lg text-purple-night"
          />
          <p className="mt-3 text-base sm:text-lg font-semibold text-ink/75">
            Upload a photo, pick your shape and finish, add a cute note, and see it shine in real 3D.
          </p>
        </div>

        {/* Customizer Grid */}
        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT: Sticky 3D Live Preview Card */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div
              className="card-stack rounded-[2.25rem]"
              style={{ '--stack-bg': 'var(--purple)', '--stack-rot': '-2deg', '--stack-x': '-10px', '--stack-y': '12px' }}
            >
              <div
                style={{ background: 'var(--hero-bg)' }}
                className="relative overflow-hidden rounded-[2.25rem] p-5 sm:p-6 text-white shadow-2xl border-4 border-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 font-display text-xs font-bold backdrop-blur-md border border-white/30">
                    <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
                    Live 3D Preview
                  </span>
                  <span className="rounded-full bg-purple-night/75 px-3 py-1 font-display text-xs font-semibold text-sun border border-white/20">
                    {shapeObj.label} · {sizeObj.dims} · {finishObj.label}
                  </span>
                </div>

                {/* 3D Canvas Stage */}
                <div className="relative my-3 h-[280px] sm:h-[330px] w-full flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-8 rounded-full bg-sun/30 blur-3xl"
                  />
                  {near && tier === 'high' ? (
                    <Suspense
                      fallback={
                        <CssMagnet
                          src={photoSrc}
                          shape={shape}
                          finish={finish}
                          caption={caption}
                          size={195}
                          tilt
                        />
                      }
                    >
                      <SingleMagnetStage
                        inView={inView}
                        shape={shape}
                        finish={finish}
                        textureSource={photoSrc}
                        caption={caption}
                        sizeScale={sizeObj.scale}
                        spinKey={spinBump}
                      />
                    </Suspense>
                  ) : (
                    <CssMagnet
                      src={photoSrc}
                      shape={shape}
                      finish={finish}
                      caption={caption}
                      size={Math.round(190 * sizeObj.scale)}
                      tilt
                    />
                  )}
                </div>

                {/* Quick Sample Photo Switcher */}
                <div className="mt-2 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2.5">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-white/85">
                    Try sample photos:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {SAMPLE_PRESETS.map((p) => {
                      const active = photoSrc === p.tex
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPhotoSrc(p.tex)
                            setUploadedName('')
                            setSpinBump((n) => n + 1)
                          }}
                          className={`group relative h-9 w-9 overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                            active
                              ? 'border-sun scale-110 shadow-lg'
                              : 'border-white/50 opacity-80 hover:opacity-100'
                          }`}
                          title={`Preview ${p.label}`}
                        >
                          {p.thumb ? (
                            <img src={p.thumb} alt={p.label} className="h-full w-full object-cover" />
                          ) : (
                            <span className="grid h-full w-full place-items-center bg-sun font-display text-[9px] font-bold text-purple-night">
                              QUOTE
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Step-by-Step Controls */}
          <div className="lg:col-span-6">
            <div
              className="card-stack rounded-[2.25rem]"
              style={{ '--stack-bg': 'var(--orange-hot)', '--stack-rot': '2deg', '--stack-x': '10px', '--stack-y': '12px' }}
            >
              <div className="glossy-card p-5 sm:p-7 border-4 border-white space-y-5">
                {/* 1. Upload Photo */}
                <div>
                  <label className="block font-display text-base font-bold text-purple-night">
                    1. Upload Your Photo
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragActive(true)
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragActive(false)
                      handleFile(e.dataTransfer.files?.[0])
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        fileInputRef.current?.click()
                      }
                    }}
                    className={`mt-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-3.5 transition cursor-pointer ${
                      dragActive
                        ? 'border-purple bg-purple/10'
                        : 'border-purple/30 bg-cream/65 hover:border-purple hover:bg-purple/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-purple text-white text-lg shadow">
                        📷
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-sm sm:text-base font-bold text-purple-night truncate">
                          {uploadedName ? uploadedName : 'Drop your photo here or tap to browse'}
                        </div>
                        <div className="text-xs font-semibold text-ink/60">
                          JPG, PNG, WebP or HEIC · Instant 3D preview
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-xl bg-white px-3 py-1.5 font-display text-xs font-bold text-purple shadow-sm border border-purple/15">
                      Choose File
                    </span>
                  </div>
                </div>

                {/* 2. Choose Shape */}
                <div>
                  <span className="block font-display text-base font-bold text-purple-night">
                    2. Choose Shape
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Magnet shape">
                    {PRICING.shapes.map((s) => {
                      const active = shape === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setShape(s.id)
                            setSpinBump((n) => n + 1)
                          }}
                          className="opt flex-col py-2.5"
                        >
                          <span className={active ? 'text-purple' : 'text-ink/55'}>
                            <ShapeSvg id={s.id} />
                          </span>
                          <span className="text-sm">{s.label}</span>
                          {s.extra > 0 && (
                            <span className="text-[11px] font-body font-bold text-tomato">
                              +{PRICING.currency}
                              {s.extra}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Choose Size */}
                <div>
                  <span className="block font-display text-base font-bold text-purple-night">
                    3. Choose Size
                  </span>
                  <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Magnet size">
                    {PRICING.sizes.map((s) => {
                      const active = sizeId === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSizeId(s.id)}
                          className="opt flex-col py-2.5"
                        >
                          <span className="text-sm sm:text-base font-bold">{s.label}</span>
                          <span className="text-xs font-body font-bold text-ink/60">{s.dims}</span>
                          <span className="mt-0.5 rounded-full bg-sun/35 px-2.5 py-0.5 text-xs font-bold text-purple-night">
                            {PRICING.currency}
                            {s.price}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 4. Choose Finish */}
                <div>
                  <span className="block font-display text-base font-bold text-purple-night">
                    4. Choose Finish
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Surface finish">
                    {PRICING.finishes.map((f) => {
                      const active = finish === f.id
                      return (
                        <button
                          key={f.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setFinish(f.id)
                            setSpinBump((n) => n + 1)
                          }}
                          className="opt justify-start px-3.5 py-2.5 text-left"
                        >
                          <span className="text-xl">{f.id === 'glossy' ? '✨' : '☁️'}</span>
                          <div>
                            <div className="text-sm font-bold leading-tight">
                              {f.label}
                            </div>
                            <div className="text-xs font-body font-bold text-ink/60">{f.note}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 5. Optional Text / Caption */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="magnet-caption"
                      className="font-display text-base font-bold text-purple-night"
                    >
                      5. Optional Caption / Date
                    </label>
                    <span className="font-display text-xs font-bold text-purple">
                      +{PRICING.currency}
                      {PRICING.textExtra} when added
                    </span>
                  </div>
                  <div className="mt-1.5 relative">
                    <input
                      id="magnet-caption"
                      type="text"
                      maxLength={28}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Summer ’26 ♥ or Best Mum Ever"
                      className="field pr-16"
                    />
                    {caption && (
                      <button
                        type="button"
                        onClick={() => setCaption('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-ink/10 px-2 py-1 text-xs font-bold text-ink/70 hover:bg-ink/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* 6. Pack Selector */}
                <div>
                  <span className="block font-display text-base font-bold text-purple-night">
                    6. Choose Pack &amp; Save
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Magnet pack">
                    {PRICING.packs.map((p) => {
                      const active = packId === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setPackId(p.id)}
                          className="opt flex-col py-2.5 relative"
                        >
                          {p.badge && (
                            <span className="absolute -top-2.5 right-2 rounded-full bg-tomato px-2 py-0.5 font-display text-[10px] font-bold text-white shadow">
                              {p.badge}
                            </span>
                          )}
                          <span className="text-lg font-bold">{p.qty}×</span>
                          <span className="text-xs font-bold">{p.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Summary Bar + Order on WhatsApp CTA */}
                <div className="rounded-3xl bg-gradient-to-r from-purple-night to-purple-deep p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/75">
                      Estimated Total ({packObj.qty} magnet{packObj.qty > 1 ? 's' : ''})
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-center sm:justify-start gap-2">
                      <span className="font-display text-2xl sm:text-3xl font-bold text-sun">
                        {PRICING.currency}
                        {finalTotal}
                      </span>
                      {savedAmount > 0 && (
                        <span className="rounded-full bg-mint/25 px-2.5 py-0.5 font-display text-xs font-bold text-mint">
                          Save {PRICING.currency}
                          {savedAmount}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-white/75">
                      {PRICING.currency}
                      {unitPrice} per magnet · Send photo in WhatsApp chat
                    </div>
                  </div>

                  <CandyButton
                    href={waLink(whatsappMessage)}
                    external
                    variant="green"
                    size="md"
                    ring
                    icon={<WhatsAppIcon className="w-5 h-5" />}
                  >
                    Order on WhatsApp
                  </CandyButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
