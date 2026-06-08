import { useMemo } from 'react';

function rng(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function PineTree({ x, groundY, height, width, color, swayDur, swayDelay, swayVariant }) {
  const trunkH = height * 0.22;
  const cH = height - trunkH;
  const w = width;
  return (
    <g
      style={{
        transformOrigin: `${x}px ${groundY}px`,
        animation: `forest-sway-${swayVariant} ${swayDur}s ${swayDelay}s ease-in-out infinite`,
      }}
    >
      <rect x={x - 3} y={groundY - trunkH} width={6} height={trunkH + 1} fill={color} />
      <polygon points={`${x - w},${groundY - trunkH} ${x + w},${groundY - trunkH} ${x},${groundY - trunkH - cH * 0.52}`} fill={color} />
      <polygon points={`${x - w * .70},${groundY - trunkH - cH * .30} ${x + w * .70},${groundY - trunkH - cH * .30} ${x},${groundY - trunkH - cH * .75}`} fill={color} />
      <polygon points={`${x - w * .42},${groundY - trunkH - cH * .62} ${x + w * .42},${groundY - trunkH - cH * .62} ${x},${groundY - trunkH - cH}`} fill={color} />
    </g>
  );
}

export default function ForestBG() {
  const W = 400, H = 800;

  const trees = useMemo(() => {
    const rows = [
      { count: 22, groundY: H * .82, minH: 48, maxH: 82, minW: 9,  maxW: 16, color: '#071510' },
      { count: 15, groundY: H * .89, minH: 80, maxH: 135, minW: 13, maxW: 22, color: '#050e08' },
      { count:  9, groundY: H * .97, minH: 150, maxH: 240, minW: 24, maxW: 44, color: '#030a05' },
    ];
    return rows.flatMap((row, ri) =>
      Array.from({ length: row.count }, (_, i) => ({
        id: `${ri}-${i}`,
        x: (i / (row.count - 1)) * (W + 40) - 20 + (rng(ri * 100 + i * 7) - .5) * 28,
        groundY: row.groundY + (rng(ri * 200 + i * 13) - .5) * 12,
        height: row.minH + rng(ri * 300 + i * 17) * (row.maxH - row.minH),
        width:  row.minW + rng(ri * 400 + i * 19) * (row.maxW - row.minW),
        color: row.color,
        swayDur:     6 + rng(ri * 500 + i * 23) * 4,
        swayDelay:   rng(ri * 600 + i * 29) * 5,
        swayVariant: ['a', 'b', 'c'][Math.floor(rng(ri * 700 + i * 31) * 3)],
        layer: ri,
      }))
    );
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      cx: rng(i * 3) * W,
      cy: rng(i * 7) * H * .58,
      r:  rng(i * 11) * 1.4 + .3,
      anim: ['star-twinkle-a', 'star-twinkle-b', 'star-twinkle-c'][i % 3],
      dur:   2.5 + rng(i * 13) * 3,
      delay: rng(i * 17) * 5,
    })),
  []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice"
           style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="fbg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010503" />
            <stop offset="50%"  stopColor="#061009" />
            <stop offset="100%" stopColor="#0d2b1f" />
          </linearGradient>
          <radialGradient id="fbg-moon-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#bbf7d0" stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fbg-horizon-glow" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="#1B4332" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fbg-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0D2B1F" stopOpacity="0" />
            <stop offset="100%" stopColor="#060f09" stopOpacity="1" />
          </linearGradient>
          <filter id="fbg-moon-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width={W} height={H} fill="url(#fbg-sky)" />

        {/* Aurora / horizon atmospheric glow */}
        <ellipse cx={W * .5} cy={H * .78} rx={W * .9} ry={H * .28}
                 fill="url(#fbg-horizon-glow)"
                 style={{ animation: 'aurora-drift 22s ease-in-out infinite' }} />

        {/* Stars */}
        {stars.map(s => (
          <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="white"
                  style={{ animation: `${s.anim} ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
        ))}

        {/* Moon halo (blurred) */}
        <circle cx={W * .78} cy={H * .11} r={48} fill="#bbf7d0" opacity={0.07}
                filter="url(#fbg-moon-blur)" />
        {/* Moon disc */}
        <circle cx={W * .78} cy={H * .11} r={16} fill="#c8e6c9" opacity={0.5} />
        <circle cx={W * .78} cy={H * .11} r={12} fill="#f1f8e9" opacity={0.65} />

        {/* Trees: back → front */}
        {[0, 1, 2].map(layer =>
          trees.filter(t => t.layer === layer).map(t => <PineTree key={t.id} {...t} />)
        )}

        {/* Ground fog */}
        <rect x={0} y={H * .73} width={W} height={H * .27} fill="url(#fbg-fog)" />
      </svg>
    </div>
  );
}
