import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSignIn = async () => {
    setLoading(true); setError('');
    try { await signInWithGoogle(); }
    catch { setError('Sign-in failed. Please try again.'); setLoading(false); }
  };

  return (
    <div className="app-bg min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Mesh orbs */}
      <div className="mesh-orb mesh-orb-1"/>
      <div className="mesh-orb mesh-orb-2"/>
      <div className="mesh-orb mesh-orb-3"/>

      {/* Fireflies (mini) */}
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
             style={{
               width: Math.random()*3+1+'px', height: Math.random()*3+1+'px',
               left: Math.random()*100+'%', top: Math.random()*100+'%',
               background: ['#4ade80','#A8C5A0','#86efac'][i%3],
               boxShadow: `0 0 6px ${'#4ade80'}`,
               animation: `firefly-rise-${['a','b','c','d','e','f'][i%6]} ${10+Math.random()*15}s ${-Math.random()*20}s ease-in-out infinite`,
               opacity: 0.7,
             }} />
      ))}

      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.6, ease:'easeOut' }}
                  className="relative z-10 w-full max-w-md mx-4">
        <div className="card"
             style={{ boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(74,222,128,0.08), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

          {/* Logo */}
          <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      transition={{ delay:0.2, type:'spring', stiffness:200 }}
                      className="text-center mb-7">
            {/* Pond mini */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full relative flex items-center justify-center"
                 style={{ background:'radial-gradient(ellipse, rgba(14,80,120,0.9) 0%, rgba(4,22,40,1) 100%)',
                          boxShadow:'0 0 40px rgba(74,222,128,0.22), 0 0 80px rgba(74,222,128,0.08), inset 0 0 30px rgba(0,100,150,0.5)',
                          border:'1px solid rgba(74,222,128,0.20)' }}>
              <span className="text-5xl animate-duck-bob">🦆</span>
            </div>
            <h1 className="font-display text-5xl font-black logo-shimmer">MONI</h1>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
            <p className="text-center font-semibold mb-1" style={{ color:'rgba(168,197,160,0.80)' }}>
              Your MCAT Study Sanctuary
            </p>
            <p className="text-center text-sm mb-7" style={{ color:'rgba(255,255,255,0.35)' }}>
              A personal duckling companion, smart planning & daily streaks 🌿
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {['📅 Smart Calendar','🦆 Pet Duckling','📊 Progress Tracking','🔥 Streaks'].map(f => (
                <span key={f} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background:'rgba(74,222,128,0.10)', color:'rgba(168,197,160,0.90)', border:'1px solid rgba(74,222,128,0.18)' }}>
                  {f}
                </span>
              ))}
            </div>

            {error && (
              <motion.p initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                        className="text-sm mb-4 rounded-xl px-4 py-2 text-center"
                        style={{ background:'rgba(239,68,68,0.12)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.25)' }}>
                {error}
              </motion.p>
            )}

            <motion.button whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
                           onClick={handleSignIn} disabled={loading}
                           className="w-full flex items-center justify-center gap-3 font-semibold rounded-2xl px-6 py-4 transition-all duration-200 disabled:opacity-60"
                           style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.85)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </motion.button>

            <p className="text-center text-xs mt-5" style={{ color:'rgba(255,255,255,0.22)' }}>
              By signing in you agree to achieve your MCAT goals 🎓
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
