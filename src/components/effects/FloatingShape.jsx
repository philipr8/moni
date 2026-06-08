/* Pure CSS floating shapes — no Three.js dependency */
export function FloatingTorus() {
  return (
    <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: '50%',
        border: '6px solid rgba(45,106,79,0.55)',
        boxShadow: '0 0 18px rgba(74,222,128,0.18), inset 0 0 12px rgba(45,106,79,0.2)',
        animation: 'torus-spin 6s linear infinite',
      }} />
    </div>
  )
}

export function FloatingGem() {
  return (
    <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: 'gem-bob 3s ease-in-out infinite' }}>
        <polygon
          points="18,2 34,12 34,24 18,34 2,24 2,12"
          fill="none"
          stroke="rgba(74,222,128,0.55)"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.35))' }}
        />
        <polygon
          points="18,2 34,12 18,18"
          fill="rgba(74,222,128,0.08)"
        />
        <polygon
          points="2,12 18,18 18,34"
          fill="rgba(45,106,79,0.10)"
        />
      </svg>
    </div>
  )
}
