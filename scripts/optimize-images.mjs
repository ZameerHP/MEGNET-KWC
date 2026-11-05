/**
 * Image pipeline — run with `npm run images`.
 * Reads /public/images/raw/* and writes optimised WebP/JPG/PNG assets used by the site.
 * Drop your own photos / mockups into /public/images/raw with the same names and re-run.
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.cwd(), 'public')
const raw = path.join(root, 'images', 'raw')
const out = path.join(root, 'images')

const exists = async (p) => !!(await fs.stat(p).catch(() => null))
const find = async (base) => {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const p = path.join(raw, base + ext)
    if (await exists(p)) return p
  }
  return null
}

const photos = ['photo-family', 'photo-travel', 'photo-pet', 'photo-wedding', 'photo-baby', 'photo-birthday', 'photo-friends', 'photo-grandparents']

async function run() {
  await fs.mkdir(path.join(out, 'photos'), { recursive: true })

  // 1. Square photos — 1024 (3D textures) + 480 (cards / marquee)
  for (const name of photos) {
    const src = await find(name)
    if (!src) { console.warn('skip (missing):', name); continue }
    await sharp(src).resize(1024, 1024, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(out, 'photos', `${name}.webp`))
    await sharp(src).resize(480, 480, { fit: 'cover' }).webp({ quality: 78 }).toFile(path.join(out, 'photos', `${name}-sm.webp`))
    console.log('photo', name)
  }

  // 2. Mockups
  for (const name of ['mockup-white-fridge', 'mockup-steel-fridge']) {
    const src = await find(name)
    if (!src) continue
    await sharp(src).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, `${name}.webp`))
    await sharp(src).resize({ width: 700 }).webp({ quality: 76 }).toFile(path.join(out, `${name}-sm.webp`))
    console.log('mockup', name)
  }

  // 3. Hero render (orange background) — poster image
  const hero = await find('hero-magnet')
  if (hero) {
    await sharp(hero).resize(1200, 1200, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(out, 'hero-magnet.webp'))
  }

  // 4. Transparent fallback magnet: flood-fill the near-white background from the edges
  const cut = await find('hero-magnet-cutout')
  if (cut) {
    const { data, info } = await sharp(cut).resize(1000, 1000, { fit: 'cover' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const { width: W, height: H } = info
    const isBg = (i) => data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232
    const seen = new Uint8Array(W * H)
    const stack = []
    for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x) }
    for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1) }
    while (stack.length) {
      const p = stack.pop()
      if (seen[p]) continue
      seen[p] = 1
      const i = p * 4
      if (!isBg(i)) continue
      data[i + 3] = 0
      const x = p % W, y = (p / W) | 0
      if (x > 0) stack.push(p - 1)
      if (x < W - 1) stack.push(p + 1)
      if (y > 0) stack.push(p - W)
      if (y < H - 1) stack.push(p + W)
    }
    // feather: semi-transparent for light pixels touching the cleared area
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const p = y * W + x, i = p * 4
      if (data[i + 3] === 0) continue
      const n = [p - 1, p + 1, p - W, p + W].some((q) => data[q * 4 + 3] === 0)
      if (n) {
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i + 3] = Math.max(60, Math.min(255, 255 - (lum - 180) * 3))
      }
    }
    await sharp(data, { raw: { width: W, height: H, channels: 4 } }).trim().webp({ quality: 85, alphaQuality: 90 }).toFile(path.join(out, 'hero-magnet-fallback.webp'))
    console.log('fallback magnet')
  }

  // 5. OG image (1200x630)
  const og = await find('og-cover')
  if (og) {
    await sharp(og).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, 'og-image.jpg'))
    console.log('og image')
  }

  // 6. Favicons from the SVG mark
  const fav = path.join(root, 'favicon.svg')
  if (await exists(fav)) {
    await sharp(fav).resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png'))
    await sharp(fav).resize(32, 32).png().toFile(path.join(root, 'favicon-32.png'))
    await sharp(fav).resize(512, 512).png().toFile(path.join(root, 'icon-512.png'))
    console.log('favicons')
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
