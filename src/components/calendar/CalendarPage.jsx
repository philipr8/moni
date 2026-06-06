import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Check, Calendar, ListFilter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
         isSameDay, isToday, addMonths, subMonths, startOfDay } from 'date-fns';
import { useUserData } from '../../context/UserDataContext';

function AddEventForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [date,  setDate]  = useState(format(new Date(), 'yyyy-MM-dd'));
  return (
    <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}
                className="card mb-3">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:'rgba(255,255,255,0.45)' }}>New Event</p>
      <div className="space-y-2.5">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color:'rgba(255,255,255,0.55)' }}>Title</label>
          <input autoFocus value={title} onChange={e=>setTitle(e.target.value)}
                 onKeyDown={e=>e.key==='Enter'&&title.trim()&&onAdd(date,title.trim())}
                 placeholder="Study topic, exam, reminder..."
                 className="field"/>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color:'rgba(255,255,255,0.55)' }}>Date</label>
          <input type="date" min={format(new Date(),'yyyy-MM-dd')} value={date} onChange={e=>setDate(e.target.value)} className="field"/>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => title.trim() && onAdd(date,title.trim())} disabled={!title.trim()}
                  className="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-40">
            <Check size={14} className="inline mr-1.5"/>Add Event
          </button>
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.50)', border:'1px solid rgba(255,255,255,0.10)' }}>
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EventListItem({ event, isHighlighted, onClick, onDelete }) {
  const d    = new Date(event.date + 'T12:00:00');
  const past = d < new Date();
  return (
    <motion.div layout initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,height:0 }}
                onClick={onClick}
                className={`flex items-start gap-3 rounded-xl px-3.5 py-3 cursor-pointer group transition-all border ${past?'opacity-50':''} ${isHighlighted?'ring-2':'ring-0'}`}
                style={{
                  background:'rgba(74,222,128,0.06)',
                  borderColor: isHighlighted ? '#4ade80' : 'rgba(74,222,128,0.15)',
                  ringColor:'#4ade80',
                }}>
      <div className="shrink-0 text-center w-10">
        <p className="text-[9px] font-black uppercase leading-none" style={{ color:'rgba(74,222,128,0.60)' }}>
          {format(d,'MMM')}
        </p>
        <p className="text-xl font-black leading-tight" style={{ color:'#4ade80' }}>{format(d,'d')}</p>
        <p className="text-[9px] font-semibold leading-none" style={{ color:'rgba(255,255,255,0.35)' }}>{format(d,'EEE')}</p>
      </div>
      <div className="w-px self-stretch rounded-full shrink-0" style={{ background:'rgba(74,222,128,0.25)' }}/>
      <span className="flex-1 text-sm font-semibold" style={{ color:'rgba(255,255,255,0.85)' }}>{event.title}</span>
      <button onClick={e=>{ e.stopPropagation(); onDelete(event.id); }}
              className="opacity-0 group-hover:opacity-100 transition-all shrink-0 p-1"
              style={{ color:'rgba(255,255,255,0.30)' }}>
        <Trash2 size={13}/>
      </button>
    </motion.div>
  );
}

export default function CalendarPage() {
  const { userData, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useUserData();
  const [currentMonth, setCurrentMonth]  = useState(new Date());
  const [selectedDay,  setSelectedDay]   = useState(null);
  const [showAddForm,  setShowAddForm]   = useState(false);
  const [editId,       setEditId]        = useState(null);
  const [editTitle,    setEditTitle]     = useState('');

  const userEvents = userData?.calendarEvents || [];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const pad        = getDay(monthStart);

  const eventsFor = (day) => userEvents.filter(e => e.date === format(day,'yyyy-MM-dd'));

  const handleEventClick = (ev) => {
    const d = new Date(ev.date+'T12:00:00');
    setCurrentMonth(startOfMonth(d));
    setSelectedDay(d);
  };

  const handleAdd = async (date, title) => {
    await addCalendarEvent({ date, title });
    setShowAddForm(false);
    const d = new Date(date+'T12:00:00');
    setCurrentMonth(startOfMonth(d)); setSelectedDay(d);
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return;
    await updateCalendarEvent(id, { title: editTitle.trim() });
    setEditId(null); setEditTitle('');
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const upcoming = [...userEvents].filter(e => e.date >= today).sort((a,b)=>a.date.localeCompare(b.date));
  const past     = [...userEvents].filter(e => e.date < today).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div className="px-4 pt-6 page-content max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black gradient-text">Calendar</h1>
        <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.40)' }}>
          {userEvents.length} event{userEvents.length!==1?'s':''} · {upcoming.length} upcoming
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,320px] gap-4">

        {/* ── Calendar grid ── */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(m=>subMonths(m,1))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/06"
                    style={{ color:'rgba(255,255,255,0.40)' }}><ChevronLeft size={17}/></button>
            <h2 className="font-bold text-lg gradient-text-subtle">{format(currentMonth,'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(m=>addMonths(m,1))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/06"
                    style={{ color:'rgba(255,255,255,0.40)' }}><ChevronRight size={17}/></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-black py-1" style={{ color:'rgba(255,255,255,0.25)' }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: pad }).map((_,i) => <div key={`p${i}`}/>)}
            {days.map(day => {
              const devs     = eventsFor(day);
              const selected = selectedDay && isSameDay(day, selectedDay);
              const today_   = isToday(day);

              return (
                <button key={day.toISOString()} onClick={() => setSelectedDay(selected?null:day)}
                        className="aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm font-semibold transition-all"
                        style={
                          selected ? { background:'rgba(74,222,128,0.20)', color:'#4ade80', boxShadow:'0 0 18px rgba(74,222,128,0.30)' } :
                          today_   ? { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.95)', outline:'1.5px solid rgba(168,197,160,0.45)', outlineOffset:'-1.5px' } :
                          devs.length>0 ? { color:'rgba(255,255,255,0.80)' } :
                                          { color:'rgba(255,255,255,0.30)' }
                        }>
                  <span>{format(day,'d')}</span>
                  {devs.length>0 && !selected && (
                    <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background:'#4ade80', boxShadow:'0 0 4px #4ade80' }}/>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }} className="overflow-hidden">
                <div className="mt-4 pt-4 border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-bold mb-2" style={{ color:'rgba(255,255,255,0.55)' }}>
                    {format(selectedDay,'EEEE, MMMM d, yyyy')}
                  </p>
                  {eventsFor(selectedDay).length===0 ? (
                    <p className="text-xs text-center py-3" style={{ color:'rgba(255,255,255,0.25)' }}>No events — use Add Event</p>
                  ) : (
                    <div className="space-y-1.5">
                      {eventsFor(selectedDay).map(ev => (
                        <div key={ev.id} className="flex items-center gap-2 rounded-xl px-3 py-2"
                             style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.18)' }}>
                          {editId===ev.id ? (
                            <>
                              <input autoFocus value={editTitle} onChange={e=>setEditTitle(e.target.value)}
                                     onKeyDown={e=>e.key==='Enter'&&handleUpdate(ev.id)} className="field flex-1 text-xs py-1.5 px-2.5"/>
                              <button onClick={()=>handleUpdate(ev.id)} style={{ color:'#4ade80' }}><Check size={13}/></button>
                              <button onClick={()=>setEditId(null)} style={{ color:'rgba(255,255,255,0.35)' }}><X size={13}/></button>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ background:'#4ade80' }}/>
                              <span className="flex-1 text-xs font-semibold" style={{ color:'rgba(255,255,255,0.85)' }}>{ev.title}</span>
                              <button onClick={()=>{setEditId(ev.id);setEditTitle(ev.title);}}
                                      className="transition-colors" style={{ color:'rgba(255,255,255,0.30)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={()=>deleteCalendarEvent(ev.id)} style={{ color:'rgba(255,255,255,0.25)' }}><X size={11}/></button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Event list panel ── */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {showAddForm ? (
              <AddEventForm key="form" onAdd={handleAdd} onCancel={()=>setShowAddForm(false)}/>
            ) : (
              <motion.button key="btn" initial={{ opacity:0 }} animate={{ opacity:1 }}
                             onClick={()=>setShowAddForm(true)}
                             className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 ripple-btn btn-primary">
                <Plus size={16}/> Add Event
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scrollable list */}
          <div className="card !p-0 overflow-hidden flex flex-col" style={{ maxHeight:'calc(100vh - 320px)', minHeight:220 }}>
            <div className="px-4 pt-4 pb-2.5 border-b flex items-center justify-between"
                 style={{ borderColor:'rgba(255,255,255,0.07)' }}>
              <h3 className="font-bold text-sm gradient-text-subtle">Events</h3>
              <ListFilter size={13} style={{ color:'rgba(255,255,255,0.30)' }}/>
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              <AnimatePresence>
                {userEvents.length===0 ? (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-10">
                    <Calendar size={36} className="mx-auto mb-2" style={{ color:'rgba(255,255,255,0.15)' }}/>
                    <p className="text-sm font-medium" style={{ color:'rgba(255,255,255,0.30)' }}>No events yet</p>
                    <p className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.18)' }}>Add your first event above</p>
                  </motion.div>
                ) : (
                  <>
                    {upcoming.length>0 && (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-widest px-1 pb-1"
                           style={{ color:'rgba(74,222,128,0.55)' }}>Upcoming · {upcoming.length}</p>
                        {upcoming.map(ev => (
                          <EventListItem key={ev.id} event={ev}
                            isHighlighted={selectedDay && ev.date===format(selectedDay,'yyyy-MM-dd')}
                            onClick={()=>handleEventClick(ev)}
                            onDelete={deleteCalendarEvent}/>
                        ))}
                      </>
                    )}
                    {past.length>0 && (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-widest px-1 pt-2 pb-1"
                           style={{ color:'rgba(255,255,255,0.20)' }}>Past · {past.length}</p>
                        {past.slice(0,5).map(ev => (
                          <EventListItem key={ev.id} event={ev}
                            isHighlighted={false}
                            onClick={()=>handleEventClick(ev)}
                            onDelete={deleteCalendarEvent}/>
                        ))}
                      </>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
