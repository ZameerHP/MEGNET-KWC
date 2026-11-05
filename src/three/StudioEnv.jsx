import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedural studio HDRI environment + warm orange & royal purple rim lights + ACES tone mapping.
 * Zero network fetches — instant load, crisp specular softboxes across the glossy epoxy dome.
 */
export default function StudioEnv({ warmIntensity = 2.4, purpleIntensity = 2.0 }) {
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.08
  }, [gl])

  return (
    <>
      <ambientLight intensity={0.55} color="#fff6e9" />
      {/* Key softbox light (front-top-left) */}
      <directionalLight position={[-3.5, 4.8, 5.2]} intensity={2.1} color="#ffffff" />
      {/* Warm orange rim light */}
      <pointLight position={[-4.2, -2.5, 2.2]} intensity={warmIntensity} distance={14} color="#FF6A2B" />
      {/* Royal purple rim light */}
      <pointLight position={[4.4, 2.4, 2.0]} intensity={purpleIntensity} distance={14} color="#8C76FF" />
      {/* Top kicker */}
      <spotLight position={[0.8, 5.5, 3.8]} intensity={1.6} angle={0.55} penumbra={0.9} color="#FFE5C2" />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#1a0d33']} />
        {/* Main overhead studio softbox for crisp dome highlight */}
        <Lightformer
          form="rect"
          intensity={5.5}
          color="#ffffff"
          scale={[6.5, 2.2, 1]}
          position={[-1.4, 3.4, 4.2]}
          rotation={[0.35, -0.25, -0.18]}
        />
        {/* Secondary diagonal strip softbox */}
        <Lightformer
          form="rect"
          intensity={3.4}
          color="#fff4e4"
          scale={[1.4, 6.0, 1]}
          position={[3.2, 1.5, 3.8]}
          rotation={[0, 0.55, 0.35]}
        />
        {/* Warm tomato-orange bounce from below-left */}
        <Lightformer
          form="circle"
          intensity={3.2}
          color="#FF6A2B"
          scale={5}
          position={[-4, -3, 1.5]}
          target={[0, 0, 0]}
        />
        {/* Royal purple rim bounce from right */}
        <Lightformer
          form="ring"
          intensity={3.0}
          color="#7C5CFF"
          scale={4.5}
          position={[4.5, 1.5, -1]}
          target={[0, 0, 0]}
        />
        {/* Soft fill behind camera */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#ffffff"
          scale={[8, 8, 1]}
          position={[0, 0, 6]}
        />
      </Environment>
    </>
  )
}
