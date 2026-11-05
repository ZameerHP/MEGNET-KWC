import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import StudioEnv from './StudioEnv'
import MagnetMesh from './MagnetMesh'
import { PHOTOS } from '../config/site'
import { maxDpr } from '../lib/gpu'

const SATELLITES = [
  {
    id: 'sat-travel',
    shape: 'rounded',
    tex: PHOTOS.travel,
    basePos: [-2.05, 1.35, -0.85],
    scale: 0.34,
    rot: [0.22, 0.35, -0.28],
    speed: 0.85,
    phase: 0.4,
    orbit: 0.18,
  },
  {
    id: 'sat-pet',
    shape: 'circle',
    tex: PHOTOS.pet,
    basePos: [2.1, 1.25, -0.55],
    scale: 0.36,
    rot: [-0.18, -0.32, 0.24],
    speed: 1.05,
    phase: 1.7,
    orbit: 0.2,
  },
  {
    id: 'sat-quote',
    shape: 'square',
    tex: 'quote',
    basePos: [-2.15, -1.15, -0.45],
    scale: 0.32,
    rot: [0.14, 0.28, 0.22],
    speed: 0.92,
    phase: 3.1,
    orbit: 0.16,
  },
  {
    id: 'sat-wedding',
    shape: 'heart',
    tex: PHOTOS.wedding,
    basePos: [1.95, -1.25, -0.95],
    scale: 0.35,
    rot: [-0.15, -0.26, -0.2],
    speed: 0.78,
    phase: 4.5,
    orbit: 0.22,
  },
  {
    id: 'sat-baby',
    shape: 'rounded',
    tex: PHOTOS.baby,
    basePos: [0.25, 1.92, -1.35],
    scale: 0.27,
    rot: [0.28, -0.15, 0.16],
    speed: 0.68,
    phase: 2.3,
    orbit: 0.15,
  },
]

function SceneContent({ scrollProgressRef, pointerRef }) {
  const heroGroupRef = useRef()
  const satellitesRef = useRef([])
  const deg15 = THREE.MathUtils.degToRad(15)

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()
    const scrollP = scrollProgressRef?.current || 0
    const px = pointerRef?.current?.x || 0
    const py = pointerRef?.current?.y || 0

    if (heroGroupRef.current) {
      // Idle float + slow rotation + ±15° mouse parallax + scroll fly-out
      const idleRotY = Math.sin(t * 0.65) * 0.18 - 0.24
      const idleRotX = Math.cos(t * 0.5) * 0.1 + 0.12
      const idleRotZ = Math.sin(t * 0.45) * 0.06 - 0.08

      const targetRotY = idleRotY + px * deg15 + scrollP * Math.PI * 1.15
      const targetRotX = idleRotX - py * deg15 + scrollP * 0.45
      const targetRotZ = idleRotZ - px * 0.08 - scrollP * 0.28

      const targetY = Math.sin(t * 1.35) * 0.1 - scrollP * 1.65
      const targetX = px * 0.18 - scrollP * 0.55
      const targetScale = 1 - scrollP * 0.26

      const damp = 1 - Math.exp(-6.5 * dt)
      heroGroupRef.current.rotation.x = THREE.MathUtils.lerp(heroGroupRef.current.rotation.x, targetRotX, damp)
      heroGroupRef.current.rotation.y = THREE.MathUtils.lerp(heroGroupRef.current.rotation.y, targetRotY, damp)
      heroGroupRef.current.rotation.z = THREE.MathUtils.lerp(heroGroupRef.current.rotation.z, targetRotZ, damp)

      heroGroupRef.current.position.x = THREE.MathUtils.lerp(heroGroupRef.current.position.x, targetX, damp)
      heroGroupRef.current.position.y = THREE.MathUtils.lerp(heroGroupRef.current.position.y, targetY, damp)
      heroGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(heroGroupRef.current.scale.x, Math.max(0.55, targetScale), damp)
      )
    }

    // Orbiting satellite magnets at different depths
    SATELLITES.forEach((sat, i) => {
      const node = satellitesRef.current[i]
      if (!node) return
      const a = t * sat.speed + sat.phase
      const spread = 1 + scrollP * 0.65
      node.position.x = sat.basePos[0] * spread + Math.cos(a) * sat.orbit + px * (0.28 + i * 0.04)
      node.position.y = sat.basePos[1] * spread + Math.sin(a * 1.2) * sat.orbit - scrollP * 0.8 + py * 0.22
      node.position.z = sat.basePos[2] + Math.sin(a * 0.7) * 0.15
      node.rotation.x = sat.rot[0] + Math.sin(a) * 0.18 - py * 0.15
      node.rotation.y = sat.rot[1] + Math.cos(a * 0.8) * 0.24 + px * 0.2
      node.rotation.z = sat.rot[2] + Math.sin(a * 0.6) * 0.12
    })
  })

  return (
    <>
      <StudioEnv warmIntensity={2.8} purpleIntensity={2.3} />

      {/* Main Hero 3D Fridge Magnet */}
      <group ref={heroGroupRef} position={[0, 0.06, 0.2]}>
        <Float speed={1.6} rotationIntensity={0.14} floatIntensity={0.22}>
          <MagnetMesh
            shape="rounded"
            finish="glossy"
            textureSource={PHOTOS.family}
            scale={1.16}
            onPointerOver={() => {
              document.body.dataset.cursorHover = 'magnet'
            }}
            onPointerOut={() => {
              delete document.body.dataset.cursorHover
            }}
          />
        </Float>
      </group>

      {/* 5 Orbiting Satellite Magnets */}
      {SATELLITES.map((sat, idx) => (
        <group
          key={sat.id}
          ref={(el) => {
            satellitesRef.current[idx] = el
          }}
          position={sat.basePos}
          rotation={sat.rot}
        >
          <MagnetMesh
            shape={sat.shape}
            finish="glossy"
            textureSource={sat.tex}
            scale={sat.scale}
          />
        </group>
      ))}

      {/* Soft studio contact shadow underneath */}
      <ContactShadows
        position={[0, -1.78, 0]}
        opacity={0.42}
        scale={7.5}
        blur={2.6}
        far={4.2}
        color="#4A0E02"
      />
    </>
  )
}

export default function HeroStage({ inView = true, scrollProgressRef, pointerRef }) {
  return (
    <Canvas
      frameloop={inView ? 'always' : 'demand'}
      dpr={[1, maxDpr()]}
      camera={{ position: [0, 0, 5.1], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <SceneContent scrollProgressRef={scrollProgressRef} pointerRef={pointerRef} />
      </Suspense>
    </Canvas>
  )
}
