export function FloatingTorus() {
  return (
    <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: 64, height: 64,
        borderRadius: '50%',
        border: '5px solid rgba(74,222,128,0.45)',
        boxShadow: '0 0 28px rgba(74,222,128,0.25), inset 0 0 20px rgba(45,106,79,0.25), 0 0 60px rgba(74,222,128,0.08)',
        animation: 'torus-spin 7s linear infinite',
      }} />
    </div>
  );
}

export function FloatingGem() {
  return (
    <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg width="52" height="52" viewBox="0 0 36 36" style={{ animation: 'gem-bob 4s ease-in-out infinite', filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.4))' }}>
        <polygon
          points="18,2 34,12 34,24 18,34 2,24 2,12"
          fill="none"
          stroke="rgba(74,222,128,0.65)"
          strokeWidth="1.5"
        />
        <polygon points="18,2 34,12 18,18" fill="rgba(74,222,128,0.10)" />
        <polygon points="2,12 18,18 18,34"  fill="rgba(45,106,79,0.12)" />
        <polygon points="34,12 18,18 34,24" fill="rgba(74,222,128,0.06)" />
      </svg>
    </div>
  );
}
