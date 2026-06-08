import { useMemo, lazy, Suspense, Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { UserDataProvider, useUserData } from './context/UserDataContext';
import SignIn from './components/auth/SignIn';
import Onboarding from './components/onboarding/Onboarding';
import BottomNav from './components/layout/BottomNav';
import HomePage from './components/home/HomePage';
import CoursesPage from './components/courses/CoursesPage';
import CalendarPage from './components/calendar/CalendarPage';
import NotesPage from './components/notes/NotesPage';
import SettingsPage from './components/settings/SettingsPage';

const Forest3D = lazy(() => import('./components/effects/Forest3D'));

class ForestErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ── Firefly particles (pure CSS, no library deps) ── */
const FIREFLY_ANIMS = ['firefly-rise-a','firefly-rise-b','firefly-rise-c','firefly-rise-d','firefly-rise-e','firefly-rise-f'];
const FIREFLY_COLORS = ['#4ade80','#A8C5A0','#86efac','#d4edda','#6ee7b7'];

function Fireflies() {
  const flies = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.2,
    x: Math.random() * 100,
    y: 20 + Math.random() * 80,
    duration: 9 + Math.random() * 18,
    delay: -(Math.random() * 20),
    color: FIREFLY_COLORS[i % FIREFLY_COLORS.length],
    anim: FIREFLY_ANIMS[i % FIREFLY_ANIMS.length],
    glow: Math.random() * 7 + 3,
    pulse: 2 + Math.random() * 3,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flies.map(f => (
        <div key={f.id} className="absolute rounded-full"
             style={{
               width: f.size, height: f.size,
               left: `${f.x}%`, top: `${f.y}%`,
               background: f.color,
               boxShadow: `0 0 ${f.glow}px ${f.color}, 0 0 ${f.glow * 2}px ${f.color}60`,
               animation: `${f.anim} ${f.duration}s ${f.delay}s ease-in-out infinite, firefly-pulse ${f.pulse}s ease-in-out infinite`,
             }} />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="app-bg min-h-screen flex items-center justify-center">
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center relative z-10">
        <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-5xl relative"
             style={{ background: 'radial-gradient(ellipse, rgba(14,80,120,0.9) 0%, rgba(4,22,40,1) 100%)',
                      boxShadow: '0 0 40px rgba(74,222,128,0.25), inset 0 0 30px rgba(0,100,150,0.4)' }}>
          <span className="animate-duck-bob">🦆</span>
          <div className="absolute inset-0 rounded-full border border-glow-green/20" />
        </div>
        <h1 className="font-display text-3xl font-black logo-shimmer mb-2">MONI</h1>
        <p className="text-white/50 text-sm font-medium">Loading your study sanctuary...</p>
        <div className="mt-4 flex gap-2 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-glow-green animate-bounce"
                 style={{ animationDelay: `${i*0.15}s`, opacity: 0.7 }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const { userData, isLoading } = useUserData();
  if (isLoading) return <LoadingScreen />;
  if (!userData || !userData.mcatDate || !userData.ducklingName) return <Onboarding />;
  const isMobile = userData.layoutMode === 'mobile';
  return (
    <div className={`relative z-10 ${isMobile ? 'max-w-[430px] mx-auto' : ''}`}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/courses" element={<PageWrapper><CoursesPage /></PageWrapper>} />
          <Route path="/calendar" element={<PageWrapper><CalendarPage /></PageWrapper>} />
          <Route path="/notes" element={<PageWrapper><NotesPage /></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      key={window.location.pathname}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="page-content"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <SignIn />;
  return (
    <div className="app-bg">
      {/* 3D forest background — isolated so any crash doesn't affect the app */}
      <ForestErrorBoundary>
        <Suspense fallback={null}>
          <Forest3D />
        </Suspense>
      </ForestErrorBoundary>
      {/* Mesh gradient orbs */}
      <div className="mesh-orb mesh-orb-1" />
      <div className="mesh-orb mesh-orb-2" />
      <div className="mesh-orb mesh-orb-3" />
      <div className="mesh-orb mesh-orb-4" />
      <div className="mesh-orb mesh-orb-5" />
      <Fireflies />
      {/* Depth fog */}
      <div className="depth-top" />
      <div className="depth-bottom" />
      <UserDataProvider>
        <AppContent />
      </UserDataProvider>
    </div>
  );
}
