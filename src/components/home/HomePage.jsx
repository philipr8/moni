import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Check } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';
import { useAuth } from '../../context/AuthContext';
import DucklingPond from './DucklingPond';
import CourseProgress from './CourseProgress';
import CARSBanner from './CARSBanner';
import CalendarWidget from './CalendarWidget';
import TodoList from './TodoList';
import ProgressSummary from './ProgressSummary';

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

      {/* Edit overlay */}
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

  return (
    <div>
      {/* ══════════════════════════════
          HERO — countdown + pond
          ══════════════════════════════ */}
      <div className="relative pt-12 pb-10 px-5 overflow-hidden">
        {/* Hero glass background */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(180deg, rgba(13,43,31,0.0) 0%, rgba(13,43,31,0.5) 100%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="text-center mb-6">
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'rgba(168,197,160,0.65)' }}>
              {greeting},
            </p>
            <h1 className="font-display text-3xl font-black gradient-text">{firstName} 👋</h1>
          </div>

          {/* Massive countdown */}
          <div className="card mb-8 relative">
            <HeroCountdown />
          </div>

          {/* Duck pond — centrepiece */}
          <div className="max-w-sm mx-auto">
            <DucklingPond />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          DASHBOARD CONTENT
          ══════════════════════════════ */}
      <div className="px-4 max-w-2xl mx-auto">
        {/* CARS banner */}
        <div className="mb-4">
          <CARSBanner />
        </div>

        {/* Grid */}
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4 desktop-grid'}`}>
          <div className="space-y-4">
            <ProgressSummary />
          </div>
          <div className="space-y-4">
            <CalendarWidget />
            <TodoList />
          </div>
        </div>

        {/* Course progress */}
        <div className="mt-4">
          <CourseProgress />
        </div>
      </div>
    </div>
  );
}
