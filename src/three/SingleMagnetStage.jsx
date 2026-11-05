import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import StudioEnv from './StudioEnv'
import MagnetMesh from './MagnetMesh'
import { maxDpr } from '../lib/gpu'

function StageInner({
  shape = 'rounded',
  finish = 'glossy',
  textureSource,
  caption = '',
  sizeScale = 1,
  spinKey = '',
}) {
  const groupRef = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const spinOffset = useRef(0)
  const { viewport } = useThree()
  const fitScale = Math.min(1, Math.max(0.78, viewport.width / 2.6))

  // Celebratory 360° spin impulse whenever active type / shape changes
  useEffect(() => {
    spinOffset.current = Math.PI * 2
  }, [spinKey, shape])

  useFrame((state, dt) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    spinOffset.current = THREE.MathUtils.lerp(spinOffset.current, 0, 1 - Math.exp(-5.5 * dt))

    const targetRotY = Math.sin(t * 0.8) * 0.22 - 0.18 + pointer.current.x * 0.45 + spinOffset.current
    const targetRotX = Math.cos(t * 0.65) * 0.1 + 0.1 - pointer.current.y * 0.35
    const damp = 1 - Math.exp(-7 * dt)

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, damp)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, damp)

    const currentScale = groupRef.current.scale.x
    const nextScale = THREE.MathUtils.lerp(currentScale, sizeScale * fitScale, damp)
    groupRef.current.scale.setScalar(nextScale)
  })

  return (
    <group
      onPointerMove={(e) => {
        pointer.current.x = (e.point.x / 2)
        pointer.current.y = (e.point.y / 2)
      }}
      onPointerOut={() => {
        pointer.current.x = 0
        pointer.current.y = 0
      }}
    >
      <StudioEnv warmIntensity={2.2} purpleIntensity={2.4} />
      <group ref={groupRef} position={[0, 0.08, 0]}>
        <Float speed={1.9} rotationIntensity={0.16} floatIntensity={0.22}>
          <MagnetMesh
            shape={shape}
            finish={finish}
            textureSource={textureSource}
            caption={caption}
            scale={1.08}
            glareTrigger={spinKey}
          />
        </Float>
      </group>
      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.35}
        scale={5.2}
        blur={2.4}
        far={3.5}
        color="#2A1B7A"
      />
    </group>
  )
}

export default function SingleMagnetStage({
  inView = true,
  shape = 'rounded',
  finish = 'glossy',
  textureSource = '/images/photos/photo-family.webp',
  caption = '',
  sizeScale = 1,
  spinKey = '',
}) {
  return (
    <Canvas
      frameloop={inView ? 'always' : 'demand'}
      dpr={[1, maxDpr()]}
      camera={{ position: [0, 0, 3.85], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <StageInner
          shape={shape}
          finish={finish}
          textureSource={textureSource}
          caption={caption}
          sizeScale={sizeScale}
          spinKey={spinKey}
        />
      </Suspense>
    </Canvas>
  )
}
