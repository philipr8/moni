import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
         isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useUserData } from '../../context/UserDataContext';

export default function CalendarWidget() {
  const { userData, addCalendarEvent, deleteCalendarEvent } = useUserData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const userEvents = userData?.calendarEvents || [];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad   = getDay(monthStart);

  const eventsFor = (day) => {
    const ds = format(day, 'yyyy-MM-dd');
    return userEvents.filter(e => e.date === ds);
  };

  const selStr    = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null;
  const selEvents = selectedDay ? eventsFor(selectedDay) : [];

  const handleAdd = async () => {
    if (!newTitle.trim() || !selStr) return;
    await addCalendarEvent({ date: selStr, title: newTitle.trim() });
    setNewTitle(''); setAddingEvent(false);
  };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm gradient-text-subtle">Study Calendar</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentMonth(m => subMonths(m,1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/06"
                  style={{ color:'rgba(255,255,255,0.40)' }}>
            <ChevronLeft size={14}/>
          </button>
          <span className="text-xs font-bold w-24 text-center" style={{ color:'rgba(255,255,255,0.65)' }}>
            {format(currentMonth,'MMM yyyy')}
          </span>
          <button onClick={() => setCurrentMonth(m => addMonths(m,1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/06"
                  style={{ color:'rgba(255,255,255,0.40)' }}>
            <ChevronRight size={14}/>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold py-1" style={{ color:'rgba(255,255,255,0.25)' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startPad }).map((_,i) => <div key={`p${i}`}/>)}
        {days.map(day => {
          const devs     = eventsFor(day);
          const selected = selectedDay && isSameDay(day, selectedDay);
          const today_   = isToday(day);
          const hasEvent = devs.length > 0;

          return (
            <button key={day.toISOString()} onClick={() => setSelectedDay(selected ? null : day)}
                    className="aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={
                      selected ? { background:'rgba(74,222,128,0.20)', color:'#4ade80', boxShadow:'0 0 16px rgba(74,222,128,0.25)' } :
                      today_   ? { background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.90)', outline:'1.5px solid rgba(168,197,160,0.40)', outlineOffset:'-1.5px' } :
                      hasEvent ? { color:'rgba(255,255,255,0.80)' } :
                                 { color:'rgba(255,255,255,0.35)' }
                    }>
              <span>{format(day,'d')}</span>
              {hasEvent && !selected && (
                <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background:'#4ade80', boxShadow:'0 0 4px #4ade80' }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.60)' }}>
                  {format(selectedDay,'EEE, MMM d')}
                </p>
                <button onClick={() => setAddingEvent(a => !a)}
                        className="text-xs font-semibold flex items-center gap-1 transition-colors"
                        style={{ color:'#4ade80' }}>
                  <Plus size={11}/> Add
                </button>
              </div>

              {addingEvent && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} className="flex gap-2 mb-2">
                  <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
                         onKeyDown={e => e.key==='Enter' && handleAdd()}
                         placeholder="Event title..."
                         className="field flex-1 text-xs py-1.5 px-2.5"/>
                  <button onClick={handleAdd} className="btn-primary text-xs px-2 py-1.5 rounded-xl">
                    <Check size={12}/>
                  </button>
                  <button onClick={() => { setAddingEvent(false); setNewTitle(''); }}
                          style={{ color:'rgba(255,255,255,0.35)' }}><X size={14}/></button>
                </motion.div>
              )}

              {selEvents.length === 0 ? (
                <p className="text-xs text-center py-2" style={{ color:'rgba(255,255,255,0.25)' }}>No events — tap Add!</p>
              ) : (
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {selEvents.map(ev => (
                    <div key={ev.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                         style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.18)' }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:'#4ade80' }}/>
                      <span className="flex-1 text-xs font-medium" style={{ color:'rgba(255,255,255,0.80)' }}>{ev.title}</span>
                      <button onClick={() => deleteCalendarEvent(ev.id)} style={{ color:'rgba(255,255,255,0.25)' }}>
                        <X size={11}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
