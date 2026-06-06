import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Droplets, Flame, Star, ChevronDown } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */
const BOND_LABELS     = ['Stranger','Acquaintance','Friend','Best Friends','Soulmates'];
const BOND_THRESHOLDS = [0, 10, 25, 50, 100];
const ACCESSORY_NAMES = {
  hat: 'Little Hat 🎩',  bowtie: 'Bow Tie 🎀',
  'graduation-cap': 'Grad Cap 🎓', sunglasses: 'Cool Shades 😎', crown: 'Crown 👑',
};
const REACTIONS = [
  { msg: 'Quack! 🎵',            state: 'happy'     },
  { msg: "Let's study! 📚",      state: 'wink'      },
  { msg: 'You got this! 💪',     state: 'happy'     },
  { msg: 'I love you! ❤️',       state: 'love'      },
  { msg: 'Feed me drops! 💧',    state: 'surprised' },
  { msg: 'MCAT gang! 🎓',        state: 'happy'     },
  { msg: 'One more chapter! 📖', state: 'wink'      },
  { msg: 'Quack quack! 🦆',      state: 'surprised' },
];

/* ═══════════════════════════════════════════════
   DUCK SVG — front-facing, animated wings + expressions
   ═══════════════════════════════════════════════ */
function DuckSVG({ state = 'idle', bondLevel = 1, accessories = [] }) {
  const leftWing  = useAnimationControls();
  const rightWing = useAnimationControls();
  const body      = useAnimationControls();

  /* Wing + body reaction to state changes */
  useEffect(() => {
    const excited = ['happy','love','wink'].includes(state);
    const calm    = state === 'sleeping';

    if (excited) {
      leftWing.start({
        rotate: [0, -38, 8, -28, 4, 0],
        transition: { duration: 0.75, ease: 'easeInOut' }
      });
      rightWing.start({
        rotate: [0,  38, -8,  28, -4, 0],
        transition: { duration: 0.75, ease: 'easeInOut' }
      });
      body.start({
        y: [0, -6, 2, -4, 0],
        transition: { duration: 0.6, ease: 'easeOut' }
      });
    } else if (state === 'surprised') {
      leftWing.start({
        rotate: [0, -20, 0],
        transition: { duration: 0.35, ease: 'easeOut' }
      });
      rightWing.start({
        rotate: [0,  20, 0],
        transition: { duration: 0.35, ease: 'easeOut' }
      });
      body.start({
        y: [0, -10, 3, 0],
        transition: { duration: 0.4, ease: 'easeOut' }
      });
    } else if (calm) {
      leftWing.start({
        rotate: 6,
        transition: { duration: 1, ease: 'easeInOut' }
      });
      rightWing.start({
        rotate: -6,
        transition: { duration: 1, ease: 'easeInOut' }
      });
    } else {
      /* idle gentle flutter */
      leftWing.start({
        rotate: [0, -5, 0, -3, 0],
        transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
      });
      rightWing.start({
        rotate: [0,  5, 0,  3, 0],
        transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
      });
      body.start({ y: 0, transition: { duration: 0.4 } });
    }
  }, [state]);

  /* Derived state booleans */
  const isHappy     = state === 'happy' || state === 'wink';
  const isLove      = state === 'love';
  const isSurprised = state === 'surprised';
  const isSleeping  = state === 'sleeping';
  const isQuacking  = state === 'happy' || state === 'surprised';

  /* Scale duck slightly with bond level */
  const scale = 1 + (bondLevel - 1) * 0.045;

  return (
    <motion.svg
      viewBox="0 0 200 220"
      className="w-full h-full"
      animate={body}
      style={{ overflow: 'visible', transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
    >
      <defs>
        <radialGradient id="dkBodyG" cx="40%" cy="35%" r="62%">
          <stop offset="0%"   stopColor="#FFF0A0" />
          <stop offset="55%"  stopColor="#FFD700" />
          <stop offset="100%" stopColor="#CC9000" />
        </radialGradient>
        <radialGradient id="dkHeadG" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#FFFAC0" />
          <stop offset="60%"  stopColor="#FFE566" />
          <stop offset="100%" stopColor="#D4B000" />
        </radialGradient>
        <radialGradient id="dkWingG" cx="45%" cy="28%" r="60%">
          <stop offset="0%"   stopColor="#FFDC40" />
          <stop offset="100%" stopColor="#B87800" />
        </radialGradient>
        <filter id="dkGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.35" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ─── Ground shadow ─── */}
      <ellipse cx="100" cy="216" rx="44" ry="6" fill="rgba(0,0,0,0.22)" />

      {/* ─── LEFT WING ─── */}
      <motion.g animate={leftWing} style={{ transformOrigin: '64px 122px' }}>
        <path
          d="M 64 122 C 30 108 8 132 14 162 C 20 186 50 178 64 158"
          fill="url(#dkWingG)" stroke="#A06800" strokeWidth="1.5"
        />
        {/* Wing feather lines */}
        <path d="M 64 125 C 36 116 18 136 16 155" fill="none" stroke="#CC9000" strokeWidth="1" opacity="0.5"/>
        <path d="M 62 133 C 38 126 24 144 24 160" fill="none" stroke="#CC9000" strokeWidth="0.8" opacity="0.35"/>
        {/* Wing tip highlight */}
        <path d="M 14 158 C 20 172 40 175 56 165"
              fill="none" stroke="rgba(255,220,100,0.4)" strokeWidth="2" strokeLinecap="round"/>
      </motion.g>

      {/* ─── RIGHT WING ─── */}
      <motion.g animate={rightWing} style={{ transformOrigin: '136px 122px' }}>
        <path
          d="M 136 122 C 170 108 192 132 186 162 C 180 186 150 178 136 158"
          fill="url(#dkWingG)" stroke="#A06800" strokeWidth="1.5"
        />
        <path d="M 136 125 C 164 116 182 136 184 155" fill="none" stroke="#CC9000" strokeWidth="1" opacity="0.5"/>
        <path d="M 138 133 C 162 126 176 144 176 160" fill="none" stroke="#CC9000" strokeWidth="0.8" opacity="0.35"/>
        <path d="M 186 158 C 180 172 160 175 144 165"
              fill="none" stroke="rgba(255,220,100,0.4)" strokeWidth="2" strokeLinecap="round"/>
      </motion.g>

      {/* ─── BODY ─── */}
      <ellipse cx="100" cy="152" rx="50" ry="54" fill="url(#dkBodyG)" filter="url(#dkGlow)" />
      {/* Body underbelly shading */}
      <ellipse cx="100" cy="175" rx="34" ry="22" fill="rgba(150,90,0,0.14)" />
      {/* Body top highlight */}
      <ellipse cx="86" cy="122" rx="16" ry="9" fill="rgba(255,255,255,0.17)"
               transform="rotate(-18 86 122)" />

      {/* ─── HEAD ─── */}
      <circle cx="100" cy="74" r="38" fill="url(#dkHeadG)" filter="url(#dkGlow)" />
      {/* Head highlight */}
      <ellipse cx="86" cy="60" rx="11" ry="7" fill="rgba(255,255,255,0.20)"
               transform="rotate(-22 86 60)" />

      {/* ─── BEAK ─── */}
      {isQuacking ? (
        /* Open beak — quacking */
        <g>
          <path d="M 87 87 Q 100 96 113 87 Q 109 98 100 96 Q 91 98 87 87 Z"
                fill="#FF8C00" />
          <path d="M 89 96 Q 100 103 111 96 Q 108 112 100 114 Q 92 112 89 96 Z"
                fill="#FF6B00" />
          <path d="M 91 95 Q 100 100 109 95" stroke="#CC4400" strokeWidth="1.5" fill="none" />
          <ellipse cx="100" cy="106" rx="7" ry="4" fill="#BB2200" opacity="0.35" />
        </g>
      ) : (
        /* Closed beak */
        <g>
          <path d="M 87 86 Q 100 97 113 86 Q 110 101 100 104 Q 90 101 87 86 Z"
                fill="#FF8C00" />
          <path d="M 90 93 Q 100 90 110 93" stroke="#D06000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* Beak nostril dots */}
      <circle cx="94" cy="89" r="1.8" fill="rgba(170,70,0,0.45)" />
      <circle cx="106" cy="89" r="1.8" fill="rgba(170,70,0,0.45)" />

      {/* ─── EYES ─── */}
      {/* Left eye */}
      {isSleeping ? (
        <path d="M 72 65 Q 82 73 92 65" stroke="#1a1a2e" strokeWidth="3"
              fill="none" strokeLinecap="round" />
      ) : isHappy ? (
        <path d="M 72 68 Q 82 59 92 68" stroke="#1a1a2e" strokeWidth="3.5"
              fill="none" strokeLinecap="round" />
      ) : isLove ? (
        /* Heart eye left */
        <path d="M 82 65 C 77 59 70 64 73 71 C 75 77 82 80 82 80 C 82 80 89 77 91 71 C 94 64 87 59 82 65 Z"
              fill="#1a1a2e" />
      ) : (
        /* Normal/surprised eye left */
        <g>
          <circle cx="82" cy="65" r={isSurprised ? 12 : 10} fill="white" />
          <circle cx={isSurprised ? 83 : 84} cy="66" r={isSurprised ? 7.5 : 6} fill="#1a1a2e" />
          <circle cx={isSurprised ? 85 : 86.5} cy={isSurprised ? 62 : 63} r={isSurprised ? 2.8 : 2.2} fill="white" />
          <circle cx={isSurprised ? 83 : 84} cy="66" r={isSurprised ? 4 : 3.2} fill="#182035" />
        </g>
      )}

      {/* Right eye */}
      {isSleeping ? (
        <path d="M 108 65 Q 118 73 128 65" stroke="#1a1a2e" strokeWidth="3"
              fill="none" strokeLinecap="round" />
      ) : isHappy ? (
        <path d="M 108 68 Q 118 59 128 68" stroke="#1a1a2e" strokeWidth="3.5"
              fill="none" strokeLinecap="round" />
      ) : isLove ? (
        <path d="M 118 65 C 113 59 106 64 109 71 C 111 77 118 80 118 80 C 118 80 125 77 127 71 C 130 64 123 59 118 65 Z"
              fill="#1a1a2e" />
      ) : (
        <g>
          <circle cx="118" cy="65" r={isSurprised ? 12 : 10} fill="white" />
          <circle cx={isSurprised ? 117 : 116} cy="66" r={isSurprised ? 7.5 : 6} fill="#1a1a2e" />
          <circle cx={isSurprised ? 119 : 118} cy={isSurprised ? 62 : 63} r={isSurprised ? 2.8 : 2.2} fill="white" />
          <circle cx={isSurprised ? 117 : 116} cy="66" r={isSurprised ? 4 : 3.2} fill="#182035" />
        </g>
      )}

      {/* ─── EYEBROWS ─── */}
      {isSurprised && (
        <>
          <path d="M 74 51 Q 82 45 90 51" stroke="#C09000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 110 51 Q 118 45 126 51" stroke="#C09000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {isSleeping && (
        <>
          <path d="M 74 56 Q 82 53 90 56" stroke="#C09000" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M 110 56 Q 118 53 126 56" stroke="#C09000" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
        </>
      )}
      {/* Happy raised-cheek brows */}
      {(isHappy || isLove) && (
        <>
          <path d="M 74 55 Q 82 50 90 55" stroke="#C09000" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 110 55 Q 118 50 126 55" stroke="#C09000" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* ─── CHEEK BLUSH ─── */}
      {(isHappy || isLove) && (
        <>
          <ellipse cx="66" cy="76" rx="9" ry="5.5" fill="#FFB3CC" opacity="0.55" />
          <ellipse cx="134" cy="76" rx="9" ry="5.5" fill="#FFB3CC" opacity="0.55" />
        </>
      )}
      {isSurprised && (
        <>
          <ellipse cx="66" cy="76" rx="7" ry="4" fill="#FFB3CC" opacity="0.38" />
          <ellipse cx="134" cy="76" rx="7" ry="4" fill="#FFB3CC" opacity="0.38" />
        </>
      )}

      {/* ─── SLEEPING ZZZ ─── */}
      {isSleeping && (
        <>
          <text x="138" y="50" fontSize="15" fill="rgba(255,255,255,0.80)"
                fontFamily="Nunito, sans-serif" fontWeight="800">Z</text>
          <text x="152" y="35" fontSize="11" fill="rgba(255,255,255,0.55)"
                fontFamily="Nunito, sans-serif" fontWeight="700">z</text>
          <text x="162" y="22" fontSize="7.5" fill="rgba(255,255,255,0.32)"
                fontFamily="Nunito, sans-serif">z</text>
        </>
      )}

      {/* ─── LOVE HEARTS ─── */}
      {isLove && (
        <>
          <motion.text x="48" y="44" fontSize="18"
            initial={{ opacity:0, y:10 }} animate={{ opacity:[0,1,1,0], y:[10,0,-8,-16] }}
            transition={{ duration:2, repeat:Infinity }}>❤️</motion.text>
          <motion.text x="144" y="36" fontSize="13"
            initial={{ opacity:0, y:8 }} animate={{ opacity:[0,1,1,0], y:[8,0,-6,-14] }}
            transition={{ duration:2, delay:0.4, repeat:Infinity }}>❤️</motion.text>
        </>
      )}

      {/* ─── ACCESSORIES ─── */}
      {accessories.includes('hat') && (
        <g>
          <rect x="65" y="29" width="70" height="7" rx="3.5" fill="#3D2000" />
          <rect x="73" y="10" width="54" height="21" rx="6" fill="#5D3A1A" />
          <rect x="73" y="27" width="54" height="5" rx="2" fill="#FFD700" opacity="0.55" />
          {/* Hat shine */}
          <ellipse cx="88" cy="17" rx="8" ry="4" fill="rgba(255,255,255,0.10)" transform="rotate(-15 88 17)" />
        </g>
      )}
      {accessories.includes('bowtie') && (
        <g transform="translate(100,110)">
          <path d="M 0 0 L -16 -9 L -16 9 Z" fill="#CC1144" />
          <path d="M 0 0 L  16 -9 L  16 9 Z" fill="#CC1144" />
          <circle cx="0" cy="0" r="5" fill="#FF1A55" />
          <circle cx="0" cy="0" r="2" fill="#FFE0E8" />
        </g>
      )}
      {accessories.includes('graduation-cap') && (
        <g>
          <rect x="62" y="30" width="76" height="7" rx="2.5" fill="#1a1a2e" />
          <path d="M 66 30 L 100 12 L 134 30 Z" fill="#1a1a2e" />
          {/* Cap highlight */}
          <path d="M 68 30 L 100 14 L 126 28" stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none" />
          <line x1="134" y1="30" x2="142" y2="52" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          <circle cx="142" cy="56" r="5.5" fill="#FFD700" />
          <circle cx="142" cy="56" r="2.5" fill="#FFF9C4" />
        </g>
      )}
      {accessories.includes('sunglasses') && (
        <g>
          <rect x="68" y="57" width="26" height="17" rx="7" fill="#0a0a1a" />
          <rect x="106" y="57" width="26" height="17" rx="7" fill="#0a0a1a" />
          <rect x="69" y="58" width="24" height="15" rx="6" fill="#1a3a9a" opacity="0.78" />
          <rect x="107" y="58" width="24" height="15" rx="6" fill="#1a3a9a" opacity="0.78" />
          <path d="M 71 63 Q 77 61 87 63" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
          <path d="M 109 63 Q 115 61 125 63" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
          <rect x="94" y="61" width="12" height="4" rx="2" fill="#0a0a1a" />
          <line x1="63" y1="65" x2="68" y2="66" stroke="#0a0a1a" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="132" y1="65" x2="137" y2="66" stroke="#0a0a1a" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      )}
      {accessories.includes('crown') && (
        <g>
          <path d="M 63 33 L 69 14 L 83 31 L 100 10 L 117 31 L 131 14 L 137 33 Z" fill="#FFD700" />
          <rect x="63" y="31" width="74" height="11" rx="3.5" fill="#FFD700" />
          <circle cx="83" cy="33" r="4.5" fill="#FF4444" />
          <circle cx="100" cy="32" r="4.5" fill="#4488FF" />
          <circle cx="117" cy="33" r="4.5" fill="#44DD88" />
          <rect x="64" y="31" width="72" height="4" rx="2" fill="#FFE566" opacity="0.5" />
        </g>
      )}

      {/* ─── FEET ─── */}
      <path d="M 80 198 L 64 210 L 88 210 L 85 198 Z" fill="#FF8C00" />
      <path d="M 120 198 L 112 210 L 136 210 L 132 198 Z" fill="#FF8C00" />
      <line x1="65" y1="210" x2="69" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
      <line x1="76" y1="210" x2="76" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
      <line x1="87" y1="210" x2="83" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
      <line x1="113" y1="210" x2="117" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
      <line x1="123" y1="210" x2="123" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
      <line x1="134" y1="210" x2="130" y2="205" stroke="#C05500" strokeWidth="0.9" opacity="0.45" />
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════
   BOND ARC
   ═══════════════════════════════════════════════ */
function BondArc({ level, totalFed }) {
  const r    = 48;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(totalFed / 100, 1) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
      <svg className="absolute inset-0" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="arcGrd" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <motion.circle cx="55" cy="55" r={r} fill="none" stroke="url(#arcGrd)" strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 8px #4ade80)' }} />
      </svg>
      <div className="text-center z-10">
        <p className="text-2xl font-black"
           style={{ color: '#4ade80', textShadow: '0 0 14px rgba(74,222,128,0.55)', fontFamily: 'Nunito' }}>
          {level}
        </p>
        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>BOND</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPEECH BUBBLE
   ═══════════════════════════════════════════════ */
function SpeechBubble({ message, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.65, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: -6 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          className="absolute z-20 pointer-events-none"
          style={{ top: 8, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="relative px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap"
               style={{
                 background: 'rgba(20,40,30,0.85)',
                 backdropFilter: 'blur(20px)',
                 border: '1.5px solid rgba(74,222,128,0.35)',
                 color: '#E8F5E9',
                 boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(74,222,128,0.15)',
                 fontFamily: 'Nunito, sans-serif',
                 fontWeight: 700,
               }}>
            {message}
            {/* Triangle pointer */}
            <div className="absolute left-1/2 -bottom-[10px] -translate-x-1/2 w-0 h-0"
                 style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                          borderTop: '11px solid rgba(74,222,128,0.35)' }} />
            <div className="absolute left-1/2 -bottom-[8px] -translate-x-1/2 w-0 h-0"
                 style={{ borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
                          borderTop: '10px solid rgba(20,40,30,0.85)' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   POND CONTAINER
   ═══════════════════════════════════════════════ */
function Pond({ duckState, onDuckClick, bondLevel, accessories, ripples, drops }) {
  const xRef    = useRef(null);
  const yRef    = useRef(null);
  const tiltRef = useRef(null); // lean left/right while swimming
  const wakeRef = useRef(null);
  const animRef = useRef(null);
  const t0Ref   = useRef(null);

  useEffect(() => {
    const RX = 62, RY = 28, PERIOD = 11000;
    let lastFacing = null;
    const frame = (ts) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const angle = ((ts - t0Ref.current) % PERIOD) / PERIOD * Math.PI * 2;
      const x = RX * Math.cos(angle);
      const y = RY * Math.sin(angle);
      const facingRight = Math.sin(angle) < 0;
      const wx = (RX - 10) * Math.cos(angle - 0.3);
      const wy = (RY - 5) * Math.sin(angle - 0.3);

      if (xRef.current)    xRef.current.style.transform   = `translateX(${x}px)`;
      if (yRef.current)    yRef.current.style.transform   = `translateY(${y}px)`;
      if (tiltRef.current && facingRight !== lastFacing) {
        tiltRef.current.style.transform = `rotate(${facingRight ? 8 : -8}deg)`;
        lastFacing = facingRight;
      }
      if (wakeRef.current)
        wakeRef.current.style.transform = `translate(calc(-50% + ${wx}px), calc(-50% + ${wy}px))`;
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative flex justify-center">
      <div className="relative" style={{ width: 264, height: 264 }}>

        {/* Outer glow */}
        <div className="absolute inset-[-10px] rounded-full pointer-events-none"
             style={{ boxShadow: '0 0 50px rgba(74,222,128,0.13), 0 0 100px rgba(74,222,128,0.05)' }} />

        {/* ── Water base ── */}
        <div className="absolute inset-0 rounded-full"
             style={{
               background: `
                 radial-gradient(ellipse at 38% 35%,
                   rgba(12,55,100,1) 0%,
                   rgba(6,32,65,1) 38%,
                   rgba(3,16,38,1) 68%,
                   rgba(1,7,18,1) 100%
                 )`,
               boxShadow: `
                 inset 0 8px 36px rgba(0,80,180,0.28),
                 inset 0 -8px 28px rgba(0,0,0,0.55),
                 0 16px 56px rgba(0,0,0,0.65)
               `,
             }} />

        {/* ── Caustic light patterns ── */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 rounded-full"
               style={{
                 background: `
                   radial-gradient(ellipse at 32% 35%, rgba(80,160,255,0.18) 0%, transparent 48%),
                   radial-gradient(ellipse at 65% 60%, rgba(50,130,220,0.12) 0%, transparent 40%)
                 `,
                 animation: 'caustic-shift 12s ease-in-out infinite',
               }} />
          <div className="absolute inset-0 rounded-full"
               style={{
                 background: `
                   radial-gradient(circle at 62% 28%, rgba(120,200,255,0.13) 0%, transparent 32%),
                   radial-gradient(circle at 28% 68%, rgba(60,140,230,0.09) 0%, transparent 28%)
                 `,
                 animation: 'caustic-shift 16s ease-in-out infinite 3s reverse',
               }} />
        </div>

        {/* ── Shimmer sweeps ── */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] w-full h-[9%]"
               style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.20),transparent)',
                        transform: 'rotate(18deg)', animation: 'water-glint 8s ease-in-out infinite' }} />
          <div className="absolute top-[56%] w-full h-[5.5%]"
               style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
                        transform: 'rotate(14deg)', animation: 'water-glint 8s ease-in-out infinite 4s' }} />
        </div>

        {/* ── Expanding ring pulses ── */}
        {[0, 1.9].map((delay, i) => (
          <div key={i} className="absolute pointer-events-none"
               style={{ inset: '36%', borderRadius: '50%',
                        border: `1.5px solid rgba(100,180,255,${i === 0 ? '0.28' : '0.16'})`,
                        animation: `pond-ring-pulse 3.8s ease-out infinite ${delay}s` }} />
        ))}

        {/* ── SVG: lily pads + star reflections ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 264 264">
          <defs>
            <radialGradient id="lilyG1" cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="#1B5E35" />
              <stop offset="100%" stopColor="#0A2E1A" />
            </radialGradient>
            <radialGradient id="lilyG2" cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="#1A5030" />
              <stop offset="100%" stopColor="#092518" />
            </radialGradient>
          </defs>

          {/* ── Lily pad 1 (top-left) + pink flower ── */}
          <g transform="translate(50,54)"
             style={{ animation: 'lily-sway 5.5s ease-in-out infinite', transformOrigin: '26px 12px' }}>
            <ellipse cx="26" cy="13" rx="26" ry="12" fill="url(#lilyG1)" opacity="0.90" />
            <path d="M 0 13 Q 26 7 52 13" fill="none" stroke="#0A2E1A" strokeWidth="0.8" opacity="0.5" />
            <path d="M 26 1 L 26 13" stroke="#0A2E1A" strokeWidth="0.8" opacity="0.4" />
            {/* Flower */}
            <circle cx="26" cy="6" r="5.5" fill="#FF6BAD" opacity="0.92" />
            <circle cx="26" cy="6" r="2.5" fill="#FFE0EF" opacity="0.8" />
            {/* Petals */}
            <ellipse cx="26" cy="1"  rx="2.5" ry="3.5" fill="#FF8CC8" opacity="0.7" />
            <ellipse cx="31" cy="4"  rx="3.5" ry="2.5" fill="#FF8CC8" opacity="0.7" transform="rotate(30 31 4)" />
            <ellipse cx="21" cy="4"  rx="3.5" ry="2.5" fill="#FF8CC8" opacity="0.7" transform="rotate(-30 21 4)" />
          </g>

          {/* ── Lily pad 2 (top-right, smaller) ── */}
          <g transform="translate(190,48)"
             style={{ animation: 'lily-sway 6.8s ease-in-out infinite 1s', transformOrigin: '18px 9px' }}>
            <ellipse cx="18" cy="9" rx="19" ry="9" fill="url(#lilyG2)" opacity="0.82" />
            <path d="M 18 0 L 18 9" stroke="#092518" strokeWidth="0.7" opacity="0.4" />
            <circle cx="18" cy="3" r="3.5" fill="#FF8C69" opacity="0.86" />
            <circle cx="18" cy="3" r="1.5" fill="#FFE4D6" opacity="0.7" />
          </g>

          {/* ── Lily pad 3 (bottom-right) + flower ── */}
          <g transform="translate(180,194)"
             style={{ animation: 'lily-sway 7.2s ease-in-out infinite 2.2s', transformOrigin: '24px 11px' }}>
            <ellipse cx="24" cy="11" rx="24" ry="11" fill="url(#lilyG1)" opacity="0.86" />
            <path d="M 0 11 Q 24 5 48 11" fill="none" stroke="#0A2E1A" strokeWidth="0.8" opacity="0.4" />
            <path d="M 24 0 L 24 11" stroke="#0A2E1A" strokeWidth="0.7" opacity="0.35" />
            <circle cx="24" cy="4" r="5" fill="#FF6B9D" opacity="0.90" />
            <circle cx="24" cy="4" r="2.2" fill="#FFE0EF" opacity="0.75" />
          </g>

          {/* ── Lily pad 4 (bottom-left, small) ── */}
          <g transform="translate(32,196)"
             style={{ animation: 'lily-sway 5.2s ease-in-out infinite 0.7s', transformOrigin: '16px 8px' }}>
            <ellipse cx="16" cy="8" rx="17" ry="8" fill="url(#lilyG2)" opacity="0.76" />
          </g>

          {/* ── Star / light reflections ── */}
          {[
            [88,78,1.4],[170,62,1.0],[205,145,1.6],[62,172,1.1],
            [132,52,0.9],[198,180,1.2],[110,195,0.8],[60,108,1.0],
          ].map(([cx,cy,r],i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity="0.40"
                    style={{ animation: `firefly-pulse ${2+i*0.35}s ease-in-out infinite ${i*0.28}s` }} />
          ))}
        </svg>

        {/* ── Wake / ripple trail ── */}
        <div ref={wakeRef} className="absolute pointer-events-none"
             style={{ left: '50%', top: '50%', width: 60, height: 22 }}>
          <div className="w-full h-full rounded-full"
               style={{ background: 'radial-gradient(ellipse, rgba(140,210,255,0.45) 0%, rgba(100,180,240,0.12) 55%, transparent 75%)' }} />
        </div>

        {/* ── Duck orbital position ── */}
        <div ref={xRef} className="absolute" style={{ left: '50%', top: '50%' }}>
          <div ref={yRef}>
            <div ref={tiltRef} style={{ width: 108, height: 118, marginLeft: -54, marginTop: -59,
                                        transformOrigin: 'center bottom', transition: 'transform 0.6s ease' }}>
              <motion.div className="w-full h-full cursor-pointer select-none"
                          onClick={onDuckClick} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
                          title="Click me!">
                <DuckSVG state={duckState} bondLevel={bondLevel} accessories={accessories} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Feed ripples ── */}
        <AnimatePresence>
          {ripples.map((r, i) => (
            <motion.div key={r.id}
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 4.8, opacity: 0 }}
              transition={{ duration: 1.7, delay: i * 0.22, ease: 'easeOut' }}
              className="absolute pointer-events-none rounded-full"
              style={{ inset: '34%', border: '2px solid rgba(100,210,255,0.55)' }} />
          ))}
        </AnimatePresence>

        {/* ── Arc-trajectory feed drops ── */}
        <AnimatePresence>
          {drops.map(d => (
            <motion.div key={d.id}
              initial={{ x: 0, y: -42, opacity: 1, scale: 1 }}
              animate={{ x: Math.sin(d.angle) * 95, y: 80, opacity: 0, scale: 0.35 }}
              transition={{ duration: 0.66, delay: d.delay, ease: [0.25,0.46,0.45,0.94] }}
              className="absolute top-0 left-1/2 text-xl pointer-events-none select-none"
              style={{ marginLeft: -10 }}>
              💧
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Deep inner shadow (pond depth) ── */}
        <div className="absolute inset-0 rounded-full pointer-events-none"
             style={{ boxShadow: 'inset 0 12px 40px rgba(0,40,120,0.45), inset 0 -10px 30px rgba(0,0,0,0.42)' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function DucklingPond() {
  const { userData, feedDuck, newAccessoryUnlocked } = useUserData();

  const [duckState,   setDuckState]   = useState('idle');
  const [reaction,    setReaction]    = useState(null);
  const [reactionIdx, setReactionIdx] = useState(0);
  const [ripples,     setRipples]     = useState([]);
  const [drops,       setDrops]       = useState([]);
  const [feeding,     setFeeding]     = useState(false);
  const [showAcc,     setShowAcc]     = useState(false);

  const sleepTimer  = useRef(null);
  const reactTimer  = useRef(null);

  const bondLevel    = userData?.bondLevel    || 1;
  const waterDrops   = userData?.waterDrops   || 0;
  const totalDropsFed= userData?.totalDropsFed|| 0;
  const streakCount  = userData?.streakCount  || 0;
  const accessories  = userData?.unlockedAccessories || [];
  const ducklingName = userData?.ducklingName || 'Duck';

  const prevThr = BOND_THRESHOLDS[bondLevel - 1] ?? 0;
  const nextThr = BOND_THRESHOLDS[Math.min(bondLevel, 4)];
  const progress = bondLevel >= 5 ? 100
    : Math.min(100, ((totalDropsFed - prevThr) / (nextThr - prevThr)) * 100);

  /* Sleep timer */
  const resetSleep = useCallback(() => {
    clearTimeout(sleepTimer.current);
    setDuckState(s => s === 'sleeping' ? 'idle' : s);
    sleepTimer.current = setTimeout(() => setDuckState('sleeping'), 45000);
  }, []);

  useEffect(() => { resetSleep(); return () => clearTimeout(sleepTimer.current); }, []);

  /* Click interaction */
  const handleDuckClick = useCallback(() => {
    clearTimeout(reactTimer.current);
    if (duckState === 'sleeping') {
      setDuckState('surprised');
      setReaction({ msg: 'Yawn… 😴', id: Date.now() });
      reactTimer.current = setTimeout(() => { setDuckState('idle'); setReaction(null); }, 2000);
      resetSleep(); return;
    }
    const r = REACTIONS[reactionIdx % REACTIONS.length];
    setReactionIdx(i => i + 1);
    setDuckState(r.state);
    setReaction({ msg: r.msg, id: Date.now() });
    resetSleep();
    reactTimer.current = setTimeout(() => { setDuckState('idle'); setReaction(null); }, 2500);
  }, [duckState, reactionIdx, resetSleep]);

  useEffect(() => () => clearTimeout(reactTimer.current), []);

  /* Feed handler */
  const handleFeed = async () => {
    if (waterDrops === 0 || feeding) return;
    setFeeding(true);
    const count = Math.min(waterDrops, 6);
    setDrops(Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i, angle: (i / count) * Math.PI * 0.8 - 0.4, delay: i * 0.07,
    })));
    setRipples([{ id: Date.now() }, { id: Date.now() + 1 }, { id: Date.now() + 2 }]);
    setDuckState('happy');
    setReaction({ msg: 'Yum yum! 💧', id: Date.now() });
    await feedDuck(count);
    setTimeout(() => {
      setDrops([]); setRipples([]); setDuckState('idle'); setReaction(null); setFeeding(false);
    }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card card-hover">
      {/* New accessory banner */}
      <AnimatePresence>
        {newAccessoryUnlocked && (
          <motion.div initial={{ opacity:0, y:-40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-40 }}
                      className="absolute top-0 inset-x-0 z-20 rounded-t-2xl text-center py-3 text-sm font-bold"
                      style={{ background: 'linear-gradient(90deg,#1B4332,#2D6A4F,#1B4332)', color: '#4ade80' }}>
            ✨ New: {ACCESSORY_NAMES[newAccessoryUnlocked]} unlocked!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black gradient-text-subtle">{ducklingName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.50)' }}>
              {BOND_LABELS[bondLevel - 1]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 animate-streak-pulse"
               style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}>
            <Flame size={14} className="text-orange-400" />
            <span className="text-sm font-black text-orange-400">{streakCount}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl px-3 py-2"
               style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)' }}>
            <Droplets size={14} className="text-blue-400" />
            <span className="text-sm font-black text-blue-400">{waterDrops}</span>
          </div>
        </div>
      </div>

      {/* Pond + speech bubble wrapper */}
      <div className="relative mb-5">
        <SpeechBubble message={reaction?.msg} show={!!reaction} />
        <Pond duckState={duckState} onDuckClick={handleDuckClick}
              bondLevel={bondLevel} accessories={accessories}
              ripples={ripples} drops={drops} />
        {duckState === 'idle' && !reaction && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="text-center text-xs mt-2 font-semibold"
                    style={{ color: 'rgba(255,255,255,0.22)' }}>
            tap {ducklingName} to interact ✨
          </motion.p>
        )}
      </div>

      {/* Bond arc + progress */}
      <div className="flex items-center gap-4 mb-4">
        <BondArc level={bondLevel} totalFed={totalDropsFed} />
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.50)' }}>Bond progress</span>
              <span className="font-bold" style={{ color: '#4ade80' }}>
                {bondLevel < 5 ? `${totalDropsFed}/${nextThr}` : '✨ MAX'}
              </span>
            </div>
            <div className="progress-track">
              <motion.div className="progress-fill" initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
            </div>
          </div>
          <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.32)' }}>
            {streakCount < 7   ? `🔥 ${7  - streakCount}d → hat 🎩`      :
             streakCount < 14  ? `🔥 ${14 - streakCount}d → bowtie 🎀`   :
             streakCount < 30  ? `🔥 ${30 - streakCount}d → grad cap 🎓` :
             streakCount < 60  ? `🔥 ${60 - streakCount}d → shades 😎`   :
             streakCount < 100 ? `🔥 ${100- streakCount}d → crown 👑`    :
                                 '👑 All accessories unlocked!'}
          </div>
        </div>
      </div>

      {/* Feed button */}
      <motion.button
        whileHover={waterDrops > 0 ? { scale: 1.02, y: -1 } : {}}
        whileTap={waterDrops > 0 ? { scale: 0.96 } : {}}
        onClick={handleFeed}
        disabled={waterDrops === 0 || feeding}
        className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ripple-btn"
        style={waterDrops > 0 ? {
          background: 'linear-gradient(135deg,#1565c0,#1976d2,#42a5f5)',
          boxShadow: feeding ? 'none' : '0 0 28px rgba(66,165,245,0.35)',
          color: 'white',
        } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.22)', cursor: 'not-allowed' }}
      >
        <span className="text-xl">{feeding ? '💦' : '💧'}</span>
        {feeding ? 'Feeding...'
          : waterDrops > 0 ? `Feed ${ducklingName} (${waterDrops} drop${waterDrops !== 1 ? 's' : ''})`
          : 'Log in daily to earn drops!'}
      </motion.button>

      {/* Accessories list */}
      {accessories.length > 0 && (
        <div className="mt-3">
          <button onClick={() => setShowAcc(s => !s)}
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: 'rgba(255,255,255,0.30)' }}>
            <ChevronDown size={12} className={`transition-transform ${showAcc ? 'rotate-180' : ''}`} />
            {accessories.length} accessor{accessories.length > 1 ? 'ies' : 'y'} earned
          </button>
          <AnimatePresence>
            {showAcc && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                <div className="flex flex-wrap gap-2">
                  {accessories.map(a => (
                    <span key={a} className="badge-mastered text-xs px-2.5 py-1 rounded-full font-bold">
                      {ACCESSORY_NAMES[a] || a}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
