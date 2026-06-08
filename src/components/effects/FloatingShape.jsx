import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function RotatingTorus() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.elapsedTime * 0.3
    ref.current.rotation.y = clock.elapsedTime * 0.5
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1, 0.32, 12, 28]} />
      <meshStandardMaterial color="#2D6A4F" transparent opacity={0.70} />
    </mesh>
  )
}

function BobbingGem() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.45
    ref.current.rotation.x = clock.elapsedTime * 0.2
    ref.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.28
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#4ade80" transparent opacity={0.60} />
    </mesh>
  )
}

export function FloatingTorus() {
  return (
    <div style={{ width: 100, height: 100, pointerEvents: 'none', opacity: 0.55 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: false, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 3, 2]} intensity={1.2} color="#52B788" />
        <RotatingTorus />
      </Canvas>
    </div>
  )
}

export function FloatingGem() {
  return (
    <div style={{ width: 100, height: 100, pointerEvents: 'none', opacity: 0.50 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: false, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 3, 2]} intensity={1.2} color="#4ade80" />
        <BobbingGem />
      </Canvas>
    </div>
  )
}
