import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export default function CARSBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                className="relative overflow-hidden rounded-2xl"
                style={{ background:'linear-gradient(135deg,rgba(21,101,192,0.70),rgba(30,136,229,0.60))', backdropFilter:'blur(20px)', border:'1px solid rgba(96,165,250,0.30)', boxShadow:'0 0 30px rgba(59,130,246,0.25),inset 0 1px 0 rgba(255,255,255,0.10)' }}>
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-400/10"/>
      <div className="relative flex items-center gap-4 px-5 py-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background:'rgba(255,255,255,0.12)' }}>
          <BookOpen size={18} className="text-white"/>
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">📖 Daily CARS Practice</p>
          <p className="text-blue-100/70 text-xs mt-0.5">Reading comprehension is the most trainable MCAT skill.</p>
        </div>
        <a href="#cars-practice"
           className="shrink-0 flex items-center gap-1.5 font-bold text-xs rounded-xl px-3.5 py-2 whitespace-nowrap transition-all"
           style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'1px solid rgba(255,255,255,0.20)' }}>
          Practice <ArrowRight size={11}/>
        </a>
        <button onClick={() => setDismissed(true)} style={{ color:'rgba(255,255,255,0.40)' }}>
          <X size={14}/>
        </button>
      </div>
    </motion.div>
  );
}
