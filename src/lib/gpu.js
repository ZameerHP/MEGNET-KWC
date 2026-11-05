/**
 * Decide how much 3D the device can handle.
 *  - 'high' : full WebGL scenes
 *  - 'low'  : WebGL is weak / low-end mobile / reduced motion  -> pre-rendered images + CSS 3D tilt
 *  - 'none' : no WebGL at all                                   -> same fallback
 * Override for testing with ?gl=high or ?gl=low in the URL.
 */
let cached = null

export function detectTier() {
  if (cached) return cached
  if (typeof window === 'undefined') return 'low'
  const force = new URLSearchParams(window.location.search).get('gl')
  if (force === 'high' || force === 'low') return (cached = force)

  let gl = null
  let renderer = ''
  try {
    const c = document.createElement('canvas')
    gl = c.getContext('webgl2') || c.getContext('webgl')
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '')
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    gl = null
  }
  if (!gl) return (cached = 'none')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return (cached = 'low')
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return (cached = 'low')

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = Math.min(window.screen.width, window.screen.height) < 820
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const saveData = navigator.connection?.saveData
  if (saveData) return (cached = 'low')
  if (coarse && smallScreen && (cores <= 4 || mem <= 3)) return (cached = 'low')
  if (/mali-4|adreno \(tm\) [23]\d\d|powervr sgx/i.test(renderer)) return (cached = 'low')

  return (cached = 'high')
}

export const maxDpr = () => {
  if (typeof window === 'undefined') return 1.5
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2)
}
