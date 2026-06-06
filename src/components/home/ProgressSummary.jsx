import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Trophy, Flame, Star, BookOpen } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';
import { COURSES } from '../../data/courses';

const STAT_CONFIGS = [
  {
    key: 'mastered', icon: Trophy, label: 'Mastered',
    color: '#4ade80', glow: 'rgba(74,222,128,0.20)',
    border: 'rgba(74,222,128,0.22)',
  },
  {
    key: 'inProgress', icon: BookOpen, label: 'In Progress',
    color: '#60a5fa', glow: 'rgba(96,165,250,0.20)',
    border: 'rgba(96,165,250,0.22)',
  },
  {
    key: 'streak', icon: Flame, label: 'Day Streak',
    color: '#fb923c', glow: 'rgba(251,146,60,0.20)',
    border: 'rgba(251,146,60,0.22)',
  },
  {
    key: 'bond', icon: Star, label: 'Bond Level',
    color: '#facc15', glow: 'rgba(250,204,21,0.20)',
    border: 'rgba(250,204,21,0.22)',
  },
];

export default function ProgressSummary() {
  const { userData } = useUserData();
  let total = 0, mastered = 0, inProg = 0;
  COURSES.forEach(c => {
    for (let ch = 1; ch <= 12; ch++) {
      total++;
      const s = userData?.courseProgress?.[c.id]?.[ch];
      if (s === 'mastered') mastered++;
      else if (s === 'in-progress') inProg++;
    }
  });
  const pct = Math.round((mastered / total) * 100);
  const bondLevel = userData?.bondLevel || 1;
  const streakCount = userData?.streakCount || 0;

  const vals = { mastered, inProgress: inProg, streak: streakCount, bond: bondLevel };
  const subs = {
    mastered: `of ${total} chapters`,
    inProgress: 'chapters active',
    streak: 'days running',
    bond: ['—','Friend','Buddy','BFFs','Soulmates'][bondLevel-1] || '★',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="grid grid-cols-2 gap-3">
        {STAT_CONFIGS.map(({ key, icon: Icon, label, color, glow, border }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            className="card card-hover rounded-2xl p-4"
            style={{ borderColor: border, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.3), 0 0 20px ${glow}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                   style={{ background: `${color}18` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
            </div>
            <p className="text-2xl font-black tabular-nums" style={{ color }}>
              <CountUp end={vals[key]} duration={1.4} delay={0.2 + i * 0.08} enableScrollSpy scrollSpyOnce />
              {key === 'mastered' && <span className="text-sm font-semibold opacity-60">/{total}</span>}
            </p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{subs[key]}</p>
          </motion.div>
        ))}

        {/* Overall progress bar */}
        <div className="col-span-2 card rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>Overall MCAT Progress</span>
            <span className="text-xs font-black tabular-nums" style={{ color: '#4ade80' }}>{pct}%</span>
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill" initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }} transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }} />
          </div>
          <p className="text-[10px] mt-2 font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>
            {mastered === 0 ? 'Begin your first chapter!'
              : mastered === total ? '🎉 All 72 chapters mastered!'
              : `${total - mastered} chapters remaining`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
