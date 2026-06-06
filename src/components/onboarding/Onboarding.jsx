import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../context/UserDataContext';

const steps = [
  { key:'mcat', emoji:'📅', title:'When is your MCAT?', sub:"We'll build a smart study plan around your exam date." },
  { key:'duck', emoji:'🦆', title:"Name your duckling!", sub:'Your study companion will cheer you on every single day.' },
  { key:'done', emoji:'🎉', title:"You're all set!", sub:null },
];

export default function Onboarding() {
  const { initUser } = useUserData();
  const [step, setStep] = useState(0);
  const [mcatDate, setMcatDate] = useState('');
  const [duckName, setDuckName] = useState('');
  const [loading, setLoading] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];
  const canNext = (step===0&&mcatDate)||(step===1&&duckName.trim())||step===2;

  const handleNext = async () => {
    if (step===0&&mcatDate) { setStep(1); return; }
    if (step===1&&duckName.trim()) { setStep(2); return; }
    if (step===2) { setLoading(true); await initUser(mcatDate, duckName.trim()); }
  };

  return (
    <div className="app-bg min-h-screen flex items-center justify-center p-4">
      <div className="mesh-orb mesh-orb-1"/> <div className="mesh-orb mesh-orb-2"/>

      {/* Progress */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i===step?'w-8':'w-2'}`}
               style={{ background: i<=step ? '#4ade80' : 'rgba(255,255,255,0.15)' }}/>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity:0,x:40 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-40 }}
                    transition={{ duration:0.32, ease:'easeInOut' }} className="w-full max-w-md">
          <div className="card" style={{ boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(74,222,128,0.07)' }}>
            {step < 2 ? (
              <>
                <div className="text-center mb-7">
                  <div className="text-6xl mb-4">{steps[step].emoji}</div>
                  <h2 className="font-display text-2xl font-black gradient-text mb-2">{steps[step].title}</h2>
                  <p className="text-sm" style={{ color:'rgba(255,255,255,0.45)' }}>{steps[step].sub}</p>
                </div>

                {step===0 && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color:'rgba(168,197,160,0.60)' }}>Exam Date</span>
                      <input type="date" min={minDate} value={mcatDate} onChange={e=>setMcatDate(e.target.value)} className="field text-base"/>
                    </label>
                    {mcatDate && (
                      <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
                                  className="rounded-xl p-3 text-center border"
                                  style={{ background:'rgba(74,222,128,0.08)', borderColor:'rgba(74,222,128,0.20)' }}>
                        <p className="text-sm font-semibold" style={{ color:'rgba(168,197,160,0.90)' }}>
                          🗓️ {Math.max(0,Math.ceil((new Date(mcatDate)-new Date())/86400000))} days — you've got this!
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {step===1 && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl animate-duck-bob relative"
                           style={{ background:'radial-gradient(ellipse, rgba(14,80,120,0.9) 0%, rgba(4,22,40,1) 100%)',
                                    boxShadow:'0 0 40px rgba(74,222,128,0.20), inset 0 0 24px rgba(0,100,150,0.5)',
                                    border:'1px solid rgba(74,222,128,0.18)' }}>
                        🦆
                      </div>
                    </div>
                    {duckName && (
                      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center font-bold text-lg" style={{ color:'#4ade80' }}>
                        Hi, I'm <span>{duckName}</span>! 🌟
                      </motion.p>
                    )}
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color:'rgba(168,197,160,0.60)' }}>Name</span>
                      <input type="text" maxLength={24} placeholder="e.g. Quackers, Pebble, Scout..."
                             value={duckName} onChange={e=>setDuckName(e.target.value)}
                             onKeyDown={e=>e.key==='Enter'&&canNext&&handleNext()}
                             autoFocus className="field text-base"/>
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring',stiffness:200,delay:0.1 }}
                            className="text-7xl">🎉</motion.div>
                <h2 className="font-display text-2xl font-black gradient-text">Ready to go!</h2>
                <div className="rounded-2xl p-4 text-left space-y-3 border"
                     style={{ background:'rgba(74,222,128,0.06)', borderColor:'rgba(74,222,128,0.18)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.35)' }}>MCAT Date</p>
                      <p className="font-semibold" style={{ color:'rgba(255,255,255,0.85)' }}>
                        {mcatDate ? new Date(mcatDate+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🦆</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.35)' }}>Your Duckling</p>
                      <p className="font-semibold" style={{ color:'rgba(255,255,255,0.85)' }}>{duckName}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.40)' }}>
                  You've earned your first water drop! Feed {duckName} to build your bond 💧
                </p>
              </div>
            )}

            <motion.button whileHover={{ scale:1.01,y:-1 }} whileTap={{ scale:0.97 }}
                           onClick={handleNext} disabled={!canNext||loading}
                           className="w-full mt-8 py-4 rounded-2xl font-bold text-base ripple-btn transition-all disabled:opacity-40"
                           style={canNext&&!loading ? {
                             background:'linear-gradient(135deg,#2D6A4F,#1B4332)',
                             boxShadow:'0 0 30px rgba(74,222,128,0.35), 0 4px 20px rgba(0,0,0,0.3)',
                             color:'white',
                           } : { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.30)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Setting up MONI...
                </span>
              ) : step===2 ? "Let's go! 🚀" : step===1 ? 'Meet my duckling →' : 'Continue →'}
            </motion.button>

            {step>0&&step<2 && (
              <button onClick={()=>setStep(s=>s-1)} className="w-full mt-3 text-sm transition-colors"
                      style={{ color:'rgba(255,255,255,0.30)' }}>← Back</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
