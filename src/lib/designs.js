import { GENERATED_DESIGNS } from '../config/site'

/* Canvas-drawn magnet faces shared by the 3D scenes and the 2D fallbacks. */

export const TEX_SIZE = 1024

const fontReady = (() => {
  let p = null
  return () => {
    if (!p) {
      p = typeof document !== 'undefined' && document.fonts
        ? Promise.all([document.fonts.load('700 120px Fredoka'), document.fonts.load('600 60px Fredoka')]).catch(() => null)
        : Promise.resolve()
    }
    return p
  }
})()
export { fontReady }

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function makeCanvas(size = TEX_SIZE) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return c
}

function star(ctx, x, y, r, points = 5, inset = 0.45) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * inset
    const a = (Math.PI / points) * i - Math.PI / 2
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
  }
  ctx.closePath()
}

function heart(ctx, x, y, s) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.35)
  ctx.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.45, y - s * 1.05, x, y - s * 0.45)
  ctx.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s, y - s * 0.4, x, y + s * 0.35)
  ctx.closePath()
}

function outlinedText(ctx, text, x, y, size, fill, stroke, strokeW) {
  ctx.font = `700 ${size}px Fredoka, "Baloo 2", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  if (stroke) {
    ctx.lineWidth = strokeW
    ctx.strokeStyle = stroke
    ctx.strokeText(text, x, y)
  }
  ctx.fillStyle = fill
  ctx.fillText(text, x, y)
}

/** Quote / promo designs drawn from GENERATED_DESIGNS. */
export function drawGenerated(kind, canvas = makeCanvas()) {
  const d = GENERATED_DESIGNS[kind] || GENERATED_DESIGNS.quote
  const S = canvas.width
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, S, S)
  g.addColorStop(0, d.from)
  g.addColorStop(1, d.to)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)

  if (kind === 'promo') {
    ctx.strokeStyle = 'rgba(255,255,255,.18)'
    ctx.lineWidth = 10
    for (let r = 120; r < S; r += 110) { ctx.beginPath(); ctx.arc(S * 0.5, S * 0.5, r, 0, Math.PI * 2); ctx.stroke() }
    ctx.fillStyle = '#FFC531'
    star(ctx, S * 0.8, S * 0.2, 90, 8, 0.6); ctx.fill()
    outlinedText(ctx, '★', S * 0.8, S * 0.205, 70, '#2A1B7A')
    const sizes = [200, 250, 200]
    d.lines.forEach((l, i) => outlinedText(ctx, l, S / 2, S * (0.32 + i * 0.2), sizes[i], i === 1 ? '#FFC531' : d.ink, '#1E1240', 22))
    ctx.fillStyle = '#7ED9BE'
    ctx.beginPath(); ctx.arc(S * 0.18, S * 0.84, 34, 0, Math.PI * 2); ctx.fill()
  } else {
    // confetti
    const cols = ['#ffffff', '#7ED9BE', '#6B4EFF', '#17A9B8']
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = cols[i % cols.length]
      ctx.globalAlpha = 0.85
      const x = ((i * 397) % 1000) / 1000 * S
      const y = ((i * 211 + 90) % 1000) / 1000 * S
      if (i % 3 === 0) { star(ctx, x, y, 22); ctx.fill() } else { ctx.beginPath(); ctx.arc(x, y, 9 + (i % 4) * 3, 0, Math.PI * 2); ctx.fill() }
    }
    ctx.globalAlpha = 1
    d.lines.forEach((l, i) => outlinedText(ctx, l, S / 2, S * (0.3 + i * 0.19), 170, d.ink, '#ffffff', 26))
    ctx.fillStyle = '#E8381A'
    heart(ctx, S / 2, S * 0.88, 70); ctx.fill()
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.stroke()
  }
  return canvas
}

/** Photo (cover-cropped to square) + optional caption. */
export function drawPhoto(img, { text = '', shape = 'rounded' } = {}, canvas = makeCanvas()) {
  const S = canvas.width
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, S, S)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, S, S)
  if (img) {
    const iw = img.naturalWidth || img.width
    const ih = img.naturalHeight || img.height
    const sc = Math.max(S / iw, S / ih)
    const w = iw * sc, h = ih * sc
    ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h)
  }
  const t = text.trim()
  if (t) {
    const y = shape === 'heart' ? S * 0.66 : shape === 'circle' ? S * 0.8 : S * 0.84
    const grad = ctx.createLinearGradient(0, y - S * 0.25, 0, S)
    grad.addColorStop(0, 'rgba(30,18,64,0)')
    grad.addColorStop(1, 'rgba(30,18,64,.55)')
    ctx.fillStyle = grad
    ctx.fillRect(0, y - S * 0.25, S, S)
    let size = 120
    ctx.font = `700 ${size}px Fredoka, system-ui, sans-serif`
    const maxW = shape === 'heart' ? S * 0.5 : shape === 'circle' ? S * 0.66 : S * 0.84
    while (ctx.measureText(t).width > maxW && size > 40) { size -= 4; ctx.font = `700 ${size}px Fredoka, system-ui, sans-serif` }
    outlinedText(ctx, t, S / 2, y, size, '#ffffff', '#2A1B7A', Math.max(10, size * 0.16))
  }
  return canvas
}

const urlCache = new Map()
/** data-URL version of a generated design (for <img> fallbacks). */
export async function generatedDataURL(kind) {
  if (urlCache.has(kind)) return urlCache.get(kind)
  await fontReady()
  const url = drawGenerated(kind, makeCanvas(512)).toDataURL('image/webp', 0.9)
  urlCache.set(kind, url)
  return url
}
