import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Check, X, LogOut, Smartphone, Monitor, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

function Row({ icon: Icon, label, sublabel, right, onClick, danger }) {
  return (
    <button onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all text-left ${danger ? 'hover:bg-red-500/08' : 'hover:bg-white/04'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/12 border border-red-500/20' : 'bg-white/06 border border-white/10'}`}>
        <Icon size={17} style={{ color: danger ? '#f87171' : 'rgba(168,197,160,0.80)' }}/>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: danger ? '#f87171' : 'rgba(255,255,255,0.85)' }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>{sublabel}</p>}
      </div>
      {right ?? <ChevronRight size={15} style={{ color:'rgba(255,255,255,0.20)' }}/>}
    </button>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { userData, updateField } = useUserData();
  const [editDate,   setEditDate]   = useState(false);
  const [editName,   setEditName]   = useState(false);
  const [newDate,    setNewDate]    = useState(userData?.mcatDate || '');
  const [newName,    setNewName]    = useState(userData?.ducklingName || '');
  const [confirmOut, setConfirmOut] = useState(false);

  const isMobile = userData?.layoutMode === 'mobile';

  return (
    <div className="px-4 pt-6 page-content max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black gradient-text">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="card mb-4 flex items-center gap-4">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl object-cover" style={{ border:'1px solid rgba(255,255,255,0.10)' }}/>
        ) : (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:'rgba(74,222,128,0.10)', border:'1px solid rgba(74,222,128,0.20)' }}>
            <User size={28} style={{ color:'#4ade80' }}/>
          </div>
        )}
        <div>
          <p className="font-bold text-lg" style={{ color:'rgba(255,255,255,0.90)' }}>{user?.displayName || 'Student'}</p>
          <p className="text-sm" style={{ color:'rgba(255,255,255,0.40)' }}>{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full badge-in-progress">🔥 {userData?.streakCount||0} day streak</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full badge-mastered">⭐ Lv. {userData?.bondLevel||1}</span>
          </div>
        </div>
      </div>

      {/* MCAT settings */}
      <div className="card !p-0 overflow-hidden mb-4">
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color:'rgba(168,197,160,0.50)' }}>MCAT Settings</p>
        </div>

        {/* MCAT Date */}
        <div className="border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white/06 border border-white/10">
              <Calendar size={17} style={{ color:'rgba(168,197,160,0.80)' }}/>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color:'rgba(255,255,255,0.85)' }}>MCAT Exam Date</p>
              <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>
                {userData?.mcatDate ? new Date(userData.mcatDate+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : 'Not set'}
              </p>
            </div>
            <button onClick={() => { setEditDate(true); setNewDate(userData?.mcatDate||''); }}
                    className="p-2 rounded-xl transition-colors" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.50)' }}>
              <Edit3 size={14}/>
            </button>
          </div>
          <AnimatePresence>
            {editDate && (
              <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }} className="overflow-hidden">
                <div className="px-5 py-4 flex gap-3 items-center border-t" style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.15)' }}>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={newDate}
                         onChange={e=>setNewDate(e.target.value)} className="field flex-1 text-sm"/>
                  <button onClick={async()=>{ if(!newDate)return; await updateField({mcatDate:newDate}); setEditDate(false); }}
                          className="btn-primary px-4 py-2.5 text-sm rounded-xl flex items-center gap-1.5">
                    <Check size={13}/> Save
                  </button>
                  <button onClick={()=>setEditDate(false)} style={{ color:'rgba(255,255,255,0.35)' }}><X size={16}/></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duckling name */}
        <div className="border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-2xl bg-white/06 border border-white/10">🦆</div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color:'rgba(255,255,255,0.85)' }}>Duckling Name</p>
              <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>{userData?.ducklingName||'Not set'}</p>
            </div>
            <button onClick={() => { setEditName(true); setNewName(userData?.ducklingName||''); }}
                    className="p-2 rounded-xl transition-colors" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.50)' }}>
              <Edit3 size={14}/>
            </button>
          </div>
          <AnimatePresence>
            {editName && (
              <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }} className="overflow-hidden">
                <div className="px-5 py-4 flex gap-3 items-center border-t" style={{ borderColor:'rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.15)' }}>
                  <input type="text" maxLength={24} value={newName} onChange={e=>setNewName(e.target.value)}
                         onKeyDown={e=>e.key==='Enter'&&newName.trim()&&updateField({ducklingName:newName.trim()}).then(()=>setEditName(false))}
                         placeholder="New name..." autoFocus className="field flex-1 text-sm"/>
                  <button onClick={async()=>{ if(!newName.trim())return; await updateField({ducklingName:newName.trim()}); setEditName(false); }}
                          className="btn-primary px-4 py-2.5 text-sm rounded-xl flex items-center gap-1.5">
                    <Check size={13}/> Save
                  </button>
                  <button onClick={()=>setEditName(false)} style={{ color:'rgba(255,255,255,0.35)' }}><X size={16}/></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Display */}
      <div className="card !p-0 overflow-hidden mb-4">
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color:'rgba(168,197,160,0.50)' }}>Display</p>
        </div>
        <div className="border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white/06 border border-white/10">
              {isMobile ? <Smartphone size={17} style={{ color:'rgba(168,197,160,0.80)' }}/> : <Monitor size={17} style={{ color:'rgba(168,197,160,0.80)' }}/>}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color:'rgba(255,255,255,0.85)' }}>Layout Mode</p>
              <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>
                {isMobile ? 'Mobile (single column)' : 'Desktop (full grid)'}
              </p>
            </div>
            <button onClick={() => updateField({ layoutMode: isMobile ? 'desktop' : 'mobile' })}
                    className="relative w-14 h-7 rounded-full transition-all duration-300"
                    style={{ background: isMobile ? 'linear-gradient(135deg,#2D6A4F,#4ade80)' : 'rgba(255,255,255,0.10)', boxShadow: isMobile ? '0 0 16px rgba(74,222,128,0.35)':'' }}>
              <motion.div animate={{ x: isMobile ? 28 : 2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
                          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"/>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card mb-4">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color:'rgba(168,197,160,0.50)' }}>Your Stats</p>
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Streak',value:`${userData?.streakCount||0}d`,icon:'🔥',color:'#fb923c'},
            {label:'Bond Level',value:userData?.bondLevel||1,icon:'⭐',color:'#facc15'},
            {label:'Drops Fed',value:userData?.totalDropsFed||0,icon:'💧',color:'#60a5fa'}].map(({label,value,icon,color})=>(
            <div key={label} className="rounded-2xl p-3 text-center border"
                 style={{ background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.08)' }}>
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-[10px] font-semibold" style={{ color:'rgba(255,255,255,0.30)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="card !p-0 overflow-hidden mb-8">
        {!confirmOut ? (
          <Row icon={LogOut} label="Sign Out" sublabel="You'll be returned to the sign-in screen"
               danger right={<ChevronRight size={15} style={{ color:'rgba(239,68,68,0.40)' }}/>}
               onClick={() => setConfirmOut(true)}/>
        ) : (
          <div className="p-5">
            <p className="font-bold mb-1" style={{ color:'rgba(255,255,255,0.85)' }}>Sign out of MONI?</p>
            <p className="text-sm mb-4" style={{ color:'rgba(255,255,255,0.40)' }}>Your data is safely stored in the cloud.</p>
            <div className="flex gap-3">
              <button onClick={signOut} className="flex-1 py-3 rounded-2xl font-bold text-white transition-all"
                      style={{ background:'rgba(239,68,68,0.20)', border:'1px solid rgba(239,68,68,0.30)', color:'#fca5a5' }}>
                Sign Out
              </button>
              <button onClick={() => setConfirmOut(false)} className="flex-1 py-3 rounded-2xl font-bold transition-all"
                      style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.60)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs mb-4" style={{ color:'rgba(255,255,255,0.18)' }}>MONI v0.1.0 · Built for MCAT warriors 💚</p>
    </div>
  );
}
