import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Check, Clock } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

function pad(n) { return String(n).padStart(2, '0'); }

function getTimeLeft(mcatDate) {
  if (!mcatDate) return null;
  const target = new Date(mcatDate + 'T08:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    total: diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer() {
  const { userData, updateField } = useUserData();
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(userData?.mcatDate));
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState(userData?.mcatDate || '');

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(userData?.mcatDate)), 1000);
    return () => clearInterval(timer);
  }, [userData?.mcatDate]);

  const handleSave = async () => {
    if (!newDate) return;
    await updateField({ mcatDate: newDate });
    setEditing(false);
  };

  const minDate = new Date().toISOString().split('T')[0];

  const units = timeLeft
    ? [
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEC', value: timeLeft.seconds },
      ]
    : [];

  const daysTotal = timeLeft?.total ? Math.ceil(timeLeft.total / 86400000) : 0;
  const urgency = daysTotal < 30 ? 'urgent' : daysTotal < 90 ? 'soon' : 'plenty';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 text-white"
      style={{
        background: urgency === 'urgent'
          ? 'linear-gradient(135deg, #b33000 0%, #e05a00 100%)'
          : urgency === 'soon'
          ? 'linear-gradient(135deg, #1a4029 0%, #2D6A4F 60%, #5a8f50 100%)'
          : 'linear-gradient(135deg, #2D6A4F 0%, #5a8f50 60%, #7daa73 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="opacity-80" />
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">MCAT Countdown</p>
            </div>
            {userData?.mcatDate && (
              <p className="text-white/60 text-xs">
                {new Date(userData.mcatDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            )}
          </div>
          <button
            onClick={() => { setEditing(true); setNewDate(userData?.mcatDate || ''); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Edit3 size={14} />
          </button>
        </div>

        {/* Countdown units */}
        {timeLeft && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {units.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="bg-white/15 rounded-xl py-3 px-1 mb-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={value}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl font-black tabular-nums block"
                    >
                      {pad(value)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-white/60 text-[9px] font-bold tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        )}

        {daysTotal > 0 && (
          <p className="text-white/70 text-xs text-center">
            {urgency === 'urgent' ? '⚡ Final sprint — focus mode!' : urgency === 'soon' ? '🔥 Building momentum!' : '🌱 Great foundation time!'}
          </p>
        )}
        {daysTotal === 0 && <p className="text-white font-bold text-center">🎓 Exam day!</p>}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl flex items-center justify-center"
            style={{ backdropFilter: 'blur(8px)', background: 'rgba(45,106,79,0.92)' }}
          >
            <div className="w-full px-6 space-y-3">
              <p className="text-white font-semibold text-center">Update MCAT Date</p>
              <input
                type="date"
                min={minDate}
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sage-800 font-semibold outline-none border-2 border-transparent focus:border-sage-300"
              />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-2.5 text-white font-semibold transition-colors">
                  <X size={15} /> Cancel
                </button>
                <button onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-white rounded-xl py-2.5 text-sage-700 font-semibold hover:bg-white/90 transition-colors">
                  <Check size={15} /> Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
