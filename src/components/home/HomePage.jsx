import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Edit3, X, Check } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useUserData } from '../../context/UserDataContext';
import { useAuth } from '../../context/AuthContext';
import DucklingPond from './DucklingPond';
import CourseProgress from './CourseProgress';
import CARSBanner from './CARSBanner';
import CalendarWidget from './CalendarWidget';
import TodoList from './TodoList';
import ProgressSummary from './ProgressSummary';
import { FloatingTorus, FloatingGem } from '../effects/FloatingShape';

/* ── Scroll reveal wrapper ── */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 56, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Card tilt wrapper ── */
function TiltCard({ children, className = '', maxAngle = 8 }) {
  return (
    <Tilt
      tiltMaxAngleX={maxAngle}
      tiltMaxAngleY={maxAngle}
      glareEnable
      glareMaxOpacity={0.08}
      glareColor="#A8C5A0"
      glarePosition="all"
      glareBorderRadius="20px"
      transitionSpeed={1500}
      className={className}
    >
      {children}
    </Tilt>
  );
}

/* ── Floating shape divider ── */
function ShapeDivider({ shape = 'torus' }) {
  return (
    <div className="flex justify-center items-center py-1 opacity-70" style={{ pointerEvents: 'none' }}>
      {shape === 'torus' ? <FloatingTorus /> : <FloatingGem />}
    </div>
  );
}

/* ── Countdown display ── */
function pad(n) { return String(n).padStart(2, '0'); }

function HeroCountdown() {
  const { userData, updateField } = useUserData();
  const [time, setTime] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const calc = () => {
      if (!userData?.mcatDate) return null;
      const target = new Date(userData.mcatDate + 'T08:00:00');
      const diff = target - new Date();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [userData?.mcatDate]);

  const handleSave = async () => {
    if (!newDate) return;
    await updateField({ mcatDate: newDate });
    setEditing(false);
  };

  if (!time) return null;

  const units = [
    { label: 'DAYS', v: time.days },
    { label: 'HRS',  v: time.hours },
    { label: 'MIN',  v: time.minutes },
    { label: 'SEC',  v: time.seconds },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-2 mb-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em]"
           style={{ color: 'rgba(168,197,160,0.7)' }}>MCAT Countdown</p>
        <button onClick={() => { setEditing(e => !e); setNewDate(userData?.mcatDate || ''); }}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)' }}>
          <Edit3 size={11} />
        </button>
      </div>

      <div className="flex items-end justify-center gap-4">
        {units.map(({ label, v }, i) => (
          <div key={label} className="text-center">
            <AnimatePresence mode="wait">
              <motion.div key={v}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.18 }}
                className="font-display font-black leading-none tabular-nums"
                style={{ fontSize: label === 'DAYS' ? '4.5rem' : '3rem',
                         background: 'linear-gradient(180deg, #ffffff 0%, rgba(168,197,160,0.85) 100%)',
                         WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                         textShadow: 'none' }}>
                {label === 'DAYS' ? time.days : pad(v)}
              </motion.div>
            </AnimatePresence>
            <p className="text-[9px] font-black tracking-[0.2em] mt-1"
               style={{ color: 'rgba(168,197,160,0.55)' }}>{label}</p>
          </div>
        ))}
      </div>

      {userData?.mcatDate && (
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {new Date(userData.mcatDate + 'T12:00:00').toLocaleDateString('en-US',
            { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute inset-x-0 top-full mt-3 rounded-2xl p-4 z-10"
                      style={{ background: 'rgba(13,43,31,0.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(168,197,160,0.20)' }}>
            <div className="flex gap-2">
              <input type="date" min={new Date().toISOString().split('T')[0]}
                     value={newDate} onChange={e => setNewDate(e.target.value)}
                     className="field flex-1 text-sm" />
              <button onClick={handleSave}
                      className="btn-primary px-3 py-2 text-sm rounded-xl"><Check size={14}/></button>
              <button onClick={() => setEditing(false)}
                      className="px-3 py-2 rounded-xl text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                <X size={14}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main page ── */
export default function HomePage() {
  const { user } = useAuth();
  const { userData } = useUserData();
  const isMobile = userData?.layoutMode === 'mobile';
  const firstName = user?.displayName?.split(' ')[0] || 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  /* Parallax depth layers */
  const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const midY  = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fgY   = useTransform(scrollYProgress, [0, 1], ['0%', '48%']);

  /* Hero entrance scale (cinematic push-through) */
  const heroScale   = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0]);

  return (
    <div ref={containerRef}>
      {/* ══════════════════════════════
          HERO — 3D cinematic entrance
          ══════════════════════════════ */}
      <motion.div
        className="relative pt-12 pb-10 px-5 overflow-hidden"
        style={{ perspective: '1000px', perspectiveOrigin: '50% 50%', scale: heroScale, opacity: heroOpacity }}
      >
        {/* Hero glass background — deepest layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(13,43,31,0.0) 0%, rgba(13,43,31,0.5) 100%)',
            y: bgY,
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Greeting — drops from above */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'rgba(168,197,160,0.65)' }}>
              {greeting},
            </p>
            <h1 className="font-display text-3xl font-black gradient-text">{firstName} 👋</h1>
          </motion.div>

          {/* Countdown — rises from below, mid layer */}
          <motion.div
            className="card mb-8 relative"
            style={{ y: midY }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard maxAngle={5}>
              <HeroCountdown />
            </TiltCard>
          </motion.div>

          {/* Duck pond — scales up from centre, foreground layer */}
          <motion.div
            className="max-w-sm mx-auto"
            style={{ y: fgY }}
            initial={{ opacity: 0, scale: 0.80 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard maxAngle={12}>
              <DucklingPond />
            </TiltCard>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════
          DASHBOARD CONTENT
          ══════════════════════════════ */}
      <div className="px-4 max-w-2xl mx-auto">

        {/* Floating shape divider */}
        <ShapeDivider shape="torus" />

        {/* CARS banner */}
        <Reveal delay={0}>
          <div className="mb-4">
            <TiltCard maxAngle={6}>
              <CARSBanner />
            </TiltCard>
          </div>
        </Reveal>

        {/* Floating shape divider */}
        <ShapeDivider shape="gem" />

        {/* Grid */}
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4 desktop-grid'}`}>
          <div className="space-y-4">
            <Reveal delay={0}>
              <TiltCard>
                <ProgressSummary />
              </TiltCard>
            </Reveal>
          </div>
          <div className="space-y-4">
            <Reveal delay={0.08}>
              <TiltCard>
                <CalendarWidget />
              </TiltCard>
            </Reveal>
            <Reveal delay={0.14}>
              <TiltCard>
                <TodoList />
              </TiltCard>
            </Reveal>
          </div>
        </div>

        {/* Floating shape divider */}
        <ShapeDivider shape="torus" />

        {/* Course progress */}
        <Reveal delay={0} className="mt-4">
          <CourseProgress />
        </Reveal>
      </div>
    </div>
  );
}
