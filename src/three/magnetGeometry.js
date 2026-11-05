import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/*
  A fridge magnet = 
   1. base   : thin white slab with a soft beveled edge (ExtrudeGeometry)
   2. dome   : epoxy-resin dome built from offset rings (quarter-ellipse profile) + flat top cap,
               printed photo mapped with planar UVs so the image "refracts" over the curved rim
   3. back   : dark rubber magnetic sheet
  All shapes are normalised to a 2 × 2 unit footprint.
*/

const SIZE = 2
const cache = new Map()

function roundedRect(size, r) {
  const h = size / 2
  const s = new THREE.Shape()
  s.moveTo(-h + r, -h)
  s.lineTo(h - r, -h)
  s.quadraticCurveTo(h, -h, h, -h + r)
  s.lineTo(h, h - r)
  s.quadraticCurveTo(h, h, h - r, h)
  s.lineTo(-h + r, h)
  s.quadraticCurveTo(-h, h, -h, h - r)
  s.lineTo(-h, -h + r)
  s.quadraticCurveTo(-h, -h, -h + r, -h)
  return s
}

function heartShape(size) {
  const pts = []
  const n = 220
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    pts.push(new THREE.Vector2(x, y))
  }
  const box = new THREE.Box2().setFromPoints(pts)
  const w = box.max.x - box.min.x
  const hgt = box.max.y - box.min.y
  const sc = size / Math.max(w, hgt)
  const cx = (box.max.x + box.min.x) / 2
  const cy = (box.max.y + box.min.y) / 2
  return new THREE.Shape(pts.map((p) => new THREE.Vector2((p.x - cx) * sc, (p.y - cy) * sc)))
}

export function makeShape(kind, size) {
  switch (kind) {
    case 'circle': {
      const s = new THREE.Shape()
      s.absarc(0, 0, size / 2, 0, Math.PI * 2, false)
      return s
    }
    case 'heart':
      return heartShape(size)
    case 'square':
      return roundedRect(size, size * 0.07)
    case 'rounded':
    default:
      return roundedRect(size, size * 0.22)
  }
}

function planarUV(geo) {
  geo.computeBoundingBox()
  const { min, max } = geo.boundingBox
  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  const w = max.x - min.x || 1
  const h = max.y - min.y || 1
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - min.x) / w
    uv[i * 2 + 1] = (pos.getY(i) - min.y) / h
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
}

/** Resin dome: rings offset outward along the contour normal with a quarter-ellipse profile. */
function buildDome(shape, bevel, height, rings = 16, segments = 160) {
  let pts = shape.getSpacedPoints(segments)
  if (pts.length > 2 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-5) pts.pop()
  if (THREE.ShapeUtils.isClockWise(pts)) pts = pts.reverse()
  const n = pts.length
  const normals = pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n]
    const c = pts[(i + 1) % n]
    const dx = c.x - a.x
    const dy = c.y - a.y
    const l = Math.hypot(dx, dy) || 1
    return new THREE.Vector2(dy / l, -dx / l)
  })
  const positions = []
  for (let k = 0; k <= rings; k++) {
    const th = (k / rings) * (Math.PI / 2)
    // slightly "puffy" profile: steeper rim, softer shoulder
    const off = bevel * Math.pow(Math.sin(th), 0.9)
    const z = height * Math.pow(Math.cos(th), 0.8)
    for (let i = 0; i < n; i++) positions.push(pts[i].x + normals[i].x * off, pts[i].y + normals[i].y * off, z)
  }
  const index = []
  for (let k = 0; k < rings; k++) {
    for (let i = 0; i < n; i++) {
      const a = k * n + i
      const b = k * n + ((i + 1) % n)
      const c = (k + 1) * n + i
      const d = (k + 1) * n + ((i + 1) % n)
      index.push(a, c, b, b, c, d)
    }
  }
  const tris = THREE.ShapeUtils.triangulateShape(pts, [])
  for (const t of tris) index.push(t[0], t[1], t[2])

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(index)
  geo.computeVertexNormals()
  planarUV(geo)
  return geo
}

export function getMagnetGeometry(kind = 'rounded') {
  if (cache.has(kind)) return cache.get(kind)

  const baseBevel = 0.035
  const baseDepth = 0.11
  let base = new THREE.ExtrudeGeometry(makeShape(kind, SIZE - baseBevel * 2), {
    depth: baseDepth,
    bevelEnabled: true,
    bevelThickness: baseBevel,
    bevelSize: baseBevel,
    bevelSegments: 5,
    curveSegments: kind === 'heart' ? 40 : 28,
  })
  base.deleteAttribute('normal')
  base.deleteAttribute('uv')
  base = mergeVertices(base, 1e-4)
  base.computeVertexNormals()
  const top = baseDepth + baseBevel
  base.translate(0, 0, -top)

  const domeOuter = SIZE - 0.1
  const domeBevel = kind === 'heart' ? 0.1 : 0.15
  const dome = buildDome(makeShape(kind, domeOuter - domeBevel * 2), domeBevel, 0.1)

  const back = new THREE.ShapeGeometry(makeShape(kind, SIZE - 0.02), 32)
  back.rotateY(Math.PI)
  back.translate(0, 0, -top - baseBevel - 0.002)

  const g = { base, dome, back }
  cache.set(kind, g)
  return g
}

export const SHAPES = ['square', 'rounded', 'circle', 'heart']
