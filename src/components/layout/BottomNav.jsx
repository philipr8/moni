import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Calendar, FileText, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/courses', label: 'Courses', Icon: BookOpen },
  { path: '/calendar', label: 'Calendar', Icon: Calendar },
  { path: '/notes', label: 'Notes', Icon: FileText },
  { path: '/settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center gap-1 px-3 py-2.5 rounded-2xl"
        style={{
          background: 'rgba(13,43,31,0.80)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          border: '1px solid rgba(168,197,160,0.18)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(74,222,128,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5 relative px-3 py-2 rounded-xl transition-all duration-200"
              style={{
                minWidth: 56,
                background: active ? 'rgba(74,222,128,0.10)' : 'transparent',
              }}
            >
              {/* Active glow under icon */}
              {active && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-xl"
                  style={{ boxShadow: 'inset 0 0 12px rgba(74,222,128,0.15)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              <motion.div
                animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                style={{ color: active ? '#4ade80' : 'rgba(255,255,255,0.40)' }}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
              </motion.div>

              <span className="text-[9px] font-bold tracking-wide"
                    style={{ color: active ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>
                {label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
}
