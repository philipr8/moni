import { useRef, useMemo, Suspense, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const isLowEnd = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4

/* ── Ground ── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color="#061409" />
    </mesh>
  )
}

/* ── Trees — batched sway in one useFrame ── */
function Trees({ count }) {
  const groupRef = useRef()

  const treeData = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const angle = t * Math.PI * 1.4 - Math.PI * 0.7
      const radius = 8 + (i % 3) * 3.5 + Math.sin(i * 7.3) * 2
      data.push({
        x: Math.sin(angle) * radius,
        z: -(Math.cos(angle) * radius + 3),
        height: 2.5 + Math.sin(i * 3.7) * 2.5 + 1,
        canopyR: 1.0 + Math.sin(i * 2.1) * 0.4,
        canopyColor: i % 3 === 0 ? '#0f3020' : i % 3 === 1 ? '#1B4332' : '#0a2416',
      })
    }
    return data
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 0.4 + i * 0.8) * 0.018
    })
  })

  return (
    <group ref={groupRef}>
      {treeData.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]}>
          <mesh position={[0, tree.height / 2, 0]}>
            <cylinderGeometry args={[0.1, 0.22, tree.height, 5]} />
            <meshStandardMaterial color="#071510" />
          </mesh>
          <mesh position={[0, tree.height + tree.canopyR * 0.7, 0]}>
            <sphereGeometry args={[tree.canopyR, 7, 6]} />
            <meshStandardMaterial color={tree.canopyColor} />
          </mesh>
          <mesh position={[0, tree.height - 0.3, 0]}>
            <sphereGeometry args={[tree.canopyR * 0.7, 6, 5]} />
            <meshStandardMaterial color="#071510" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ── Water plane ── */
function WaterPlane() {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.001
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 1]}>
      <circleGeometry args={[4, 48]} />
      <meshStandardMaterial color="#1a4a3a" metalness={0.9} roughness={0.1} transparent opacity={0.85} />
    </mesh>
  )
}

/* ── Firefly particles ── */
function Fireflies({ count }) {
  const pointsRef = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds    = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = Math.random() * 11
      positions[i * 3 + 2] = (Math.random() - 0.5) * 32
      speeds[i] = 0.008 + Math.random() * 0.014
    }
    return { positions, speeds }
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds[i]
      if (pos.array[i * 3 + 1] > 11) {
        pos.array[i * 3 + 1] = 0
        pos.array[i * 3]     = (Math.random() - 0.5) * 32
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * 32
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#90EE90" size={0.05} transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

/* ── Full scene ── */
function Scene() {
  return (
    <>
      <fogExp2 attach="fog" color="#0D2B1F" density={0.032} />
      <ambientLight color="#1a4a2e" intensity={0.4} />
      <pointLight color="#52B788" position={[0, 5, 0]} intensity={1.2} />
      <pointLight color="#2D6A4F" position={[-6, 3, -5]} intensity={0.5} />
      <Ground />
      <Trees count={isLowEnd ? 12 : 26} />
      {!isLowEnd && <WaterPlane />}
      <Fireflies count={isLowEnd ? 20 : 200} />
    </>
  )
}

export default function Forest3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 1.8, 7], fov: 65, near: 0.1, far: 120 }}
        frameloop="always"
        gl={{ antialias: !isLowEnd, alpha: true }}
        dpr={isLowEnd ? 1 : [1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
