import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getMagnetGeometry } from './magnetGeometry'
import { drawGenerated, drawPhoto, fontReady, loadImage, TEX_SIZE } from '../lib/designs'

/**
 * Real 3D Fridge Magnet with:
 * - Beveled white acrylic/resin base slab
 * - Flexible dark magnetic backing sheet
 * - Printed photo + glossy domed epoxy-resin surface (MeshPhysicalMaterial:
 *   clearcoat 1, clearcoatRoughness 0.03, ior 1.5, strong specular)
 * - Glare sweep ribbon that glides across the dome on hover
 */
export default function MagnetMesh({
  shape = 'rounded',
  finish = 'glossy',
  textureSource = '/images/photos/photo-family.webp',
  caption = '',
  scale = 1,
  glareTrigger = 0,
  onPointerOver,
  onPointerOut,
  ...groupProps
}) {
  const geo = useMemo(() => getMagnetGeometry(shape), [shape])
  const glareRef = useRef()
  const glareState = useRef({ progress: 1.5, active: false })

  // Offscreen canvas & Three.js CanvasTexture
  const [canvasTex] = useState(() => {
    const c = document.createElement('canvas')
    c.width = c.height = TEX_SIZE
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#FFE6C7'
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    t.needsUpdate = true
    return t
  })

  useEffect(() => {
    let cancelled = false
    const c = canvasTex.image

    async function renderTex() {
      if (textureSource === 'quote' || textureSource === 'promo') {
        await fontReady()
        if (cancelled) return
        drawGenerated(textureSource, c)
        if (caption?.trim()) {
          // Optional custom caption overlay
          const snap = document.createElement('canvas')
          snap.width = snap.height = c.width
          snap.getContext('2d').drawImage(c, 0, 0)
          drawPhoto(snap, { text: caption, shape }, c)
        }
        canvasTex.needsUpdate = true
        return
      }
      try {
        await fontReady()
        const img = await loadImage(textureSource)
        if (cancelled) return
        drawPhoto(img, { text: caption, shape }, c)
        canvasTex.needsUpdate = true
      } catch {
        if (cancelled) return
        drawGenerated('quote', c)
        canvasTex.needsUpdate = true
      }
    }

    renderTex()
    return () => {
      cancelled = true
    }
  }, [textureSource, caption, shape, canvasTex])

  useEffect(() => () => canvasTex.dispose(), [canvasTex])

  // Trigger glare sweep when glareTrigger increments
  useEffect(() => {
    if (glareTrigger > 0) {
      glareState.current.progress = -1.35
      glareState.current.active = true
    }
  }, [glareTrigger])

  useFrame((_, dt) => {
    if (!glareRef.current) return
    if (glareState.current.active) {
      glareState.current.progress += dt * 2.8
      const p = glareState.current.progress
      glareRef.current.position.x = p * 1.4
      glareRef.current.position.y = -p * 0.45
      glareRef.current.material.opacity = Math.max(0, Math.sin(((p + 1.35) / 2.7) * Math.PI) * 0.55)
      if (p > 1.35) {
        glareState.current.active = false
        glareRef.current.material.opacity = 0
      }
    }
  })

  const isGlossy = finish !== 'matte'

  return (
    <group
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        glareState.current.progress = -1.35
        glareState.current.active = true
        onPointerOver?.(e)
      }}
      onPointerOut={(e) => {
        onPointerOut?.(e)
      }}
      {...groupProps}
    >
      {/* White beveled magnet body */}
      <mesh geometry={geo.base} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#FFFDF9"
          roughness={0.22}
          metalness={0.02}
          clearcoat={0.7}
          clearcoatRoughness={0.12}
          reflectivity={0.8}
        />
      </mesh>

      {/* Dark flexible magnetic backing */}
      <mesh geometry={geo.back}>
        <meshStandardMaterial color="#1D1726" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Printed photo + domed epoxy resin finish */}
      <mesh geometry={geo.dome} position={[0, 0, 0.002]}>
        <meshPhysicalMaterial
          map={canvasTex}
          roughness={isGlossy ? 0.05 : 0.48}
          metalness={0.0}
          ior={1.5}
          reflectivity={isGlossy ? 1.0 : 0.35}
          specularIntensity={isGlossy ? 1.25 : 0.3}
          specularColor="#ffffff"
          clearcoat={isGlossy ? 1.0 : 0.12}
          clearcoatRoughness={isGlossy ? 0.03 : 0.45}
          envMapIntensity={isGlossy ? 1.55 : 0.65}
        />
      </mesh>

      {/* Interactive glare sweep streak on hover */}
      {isGlossy && (
        <mesh ref={glareRef} position={[-1.8, 0.6, 0.112]} rotation={[0, 0, -0.55]}>
          <planeGeometry args={[0.38, 2.5]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
