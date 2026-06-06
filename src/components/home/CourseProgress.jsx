import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, Plus, Trash2, X, FileText, Image } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useUserData } from '../../context/UserDataContext';
import { COURSES, STAGE_ORDER } from '../../data/courses';

const BADGE_CLASS = {
  'not-started': 'badge-not-started',
  'in-progress': 'badge-in-progress',
  'reviewed': 'badge-reviewed',
  'mastered': 'badge-mastered',
};
const BADGE_SHORT = { 'not-started':'NS','in-progress':'IP','reviewed':'RV','mastered':'MA' };

function StageBadge({ stage, onClick }) {
  return (
    <button onClick={onClick} className={BADGE_CLASS[stage || 'not-started']} title="Click to advance stage">
      {BADGE_SHORT[stage || 'not-started']}
    </button>
  );
}

function ChapterRow({ course, chapterIdx, chapterName, stage, onStageChange, onNoteUpload, notes, onDeleteNote, todos, onAddTodo, onToggleTodo, onDeleteTodo }) {
  const [showTodos, setShowTodos] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const advance = () => {
    const idx = STAGE_ORDER.indexOf(stage || 'not-started');
    onStageChange(STAGE_ORDER[(idx + 1) % STAGE_ORDER.length]);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onNoteUpload(file); } finally { setUploading(false); e.target.value = ''; }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    onAddTodo(newTodo.trim());
    setNewTodo('');
  };

  return (
    <div className="rounded-xl overflow-hidden"
         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="text-xs font-black w-5 text-center" style={{ color: 'rgba(255,255,255,0.30)' }}>{chapterIdx}</span>
        <span className="flex-1 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>{chapterName}</span>
        <div className="flex items-center gap-2 shrink-0">
          <StageBadge stage={stage} onClick={advance} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
            {uploading ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> : <Upload size={11}/>}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleUpload}/>
          <button onClick={() => setShowTodos(s => !s)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
            <Plus size={12} className={`transition-transform ${showTodos ? 'rotate-45' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Notes */}
      {notes?.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {notes.map(note => (
            <div key={note.id} className="flex items-center gap-1 rounded-lg px-2 py-1"
                 style={{ background: 'rgba(255,255,255,0.05)' }}>
              {note.type?.includes('pdf') ? <FileText size={10} className="text-red-400"/> : <Image size={10} className="text-blue-400"/>}
              <a href={note.url} target="_blank" rel="noreferrer"
                 className="text-[10px] font-medium max-w-[100px] truncate" style={{ color: '#60a5fa' }}>{note.name}</a>
              <button onClick={() => onDeleteNote(note.id, note.path)}
                      className="transition-colors" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <X size={10}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Todos */}
      <AnimatePresence>
        {showTodos && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-2 space-y-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.10)' }}>
              {(todos||[]).map(todo => (
                <div key={todo.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={todo.completed} onChange={() => onToggleTodo(todo.id)} className="custom-check"/>
                  <span className={`flex-1 text-xs ${todo.completed ? 'line-through opacity-40' : 'opacity-75'}`}
                        style={{ color: '#E8F5E9' }}>{todo.text}</span>
                  <button onClick={() => onDeleteTodo(todo.id)} style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <Trash2 size={11}/>
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-1">
                <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                       onKeyDown={e => e.key==='Enter' && handleAddTodo()}
                       placeholder="Add task..." className="field flex-1 text-xs py-1.5 px-2.5"/>
                <button onClick={handleAddTodo} disabled={!newTodo.trim()}
                        className="btn-primary text-xs px-2 py-1.5 rounded-lg disabled:opacity-30">Add</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CourseProgress() {
  const { userData, updateChapterStage, uploadNote, deleteNote, addChapterTodo, toggleChapterTodo, deleteChapterTodo } = useUserData();
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
      <h2 className="font-display font-bold text-base mb-3 px-1 gradient-text-subtle">Course Progress</h2>
      <div className="space-y-3">
        {COURSES.map((course, ci) => {
          const progress = userData?.courseProgress?.[course.id] || {};
          const mastered = Object.values(progress).filter(s => s==='mastered').length;
          const inProg   = Object.values(progress).filter(s => s==='in-progress').length;
          const reviewed = Object.values(progress).filter(s => s==='reviewed').length;
          const pct      = Math.round((mastered/12)*100);
          const isOpen   = expanded === course.id;

          return (
            <Tilt
              key={course.id}
              tiltMaxAngleX={isOpen ? 0 : 5}
              tiltMaxAngleY={isOpen ? 0 : 5}
              glareEnable={!isOpen}
              glareMaxOpacity={0.06}
              glareColor="rgba(168,197,160,0.5)"
              tiltEnable={!isOpen}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="card overflow-hidden !p-0 cursor-default"
                   style={{
                     background: `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(${course.id==='biology'?'29,78,50':''}255,255,255,0.02))`,
                     border: `1px solid rgba(255,255,255,0.09)`,
                   }}>
                <button onClick={() => setExpanded(isOpen ? null : course.id)}
                        className="w-full flex items-center gap-3 p-4 text-left transition-all hover:brightness-110">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                       style={{ background: `${course.color}15`, border: `1px solid ${course.color}25`, boxShadow: `0 0 18px ${course.color}18` }}>
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.90)' }}>{course.name}</p>
                      <span className="text-xs font-black" style={{ color: course.color }}>{mastered}/12</span>
                    </div>
                    {/* Gradient progress bar */}
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
                                  transition={{ duration:0.9, ease:'easeOut' }}
                                  className="h-full rounded-full"
                                  style={{ background:`linear-gradient(90deg, ${course.color}80, ${course.color})`,
                                           boxShadow:`0 0 8px ${course.color}60` }} />
                    </div>
                    <div className="flex gap-3 mt-1.5">
                      {mastered > 0 && <span className="text-[10px] badge-mastered px-1.5 py-0">{mastered} mastered</span>}
                      {reviewed > 0 && <span className="text-[10px] badge-reviewed px-1.5 py-0">{reviewed} reviewed</span>}
                      {inProg   > 0 && <span className="text-[10px] badge-in-progress px-1.5 py-0">{inProg} in progress</span>}
                    </div>
                  </div>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen?'rotate-180':''}`}
                               style={{ color:'rgba(255,255,255,0.30)' }}/>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3 space-y-2 border-t" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                        {course.chapters.map((chName, idx) => {
                          const ch  = idx + 1;
                          const key = `${course.id}-${ch}`;
                          return (
                            <ChapterRow key={ch}
                              course={course} chapterIdx={ch} chapterName={chName}
                              stage={progress[ch]}
                              onStageChange={s => updateChapterStage(course.id, ch, s)}
                              onNoteUpload={file => uploadNote(course.id, ch, file)}
                              notes={userData?.uploadedNotes?.[key] || []}
                              onDeleteNote={(id, p) => deleteNote(course.id, ch, id, p)}
                              todos={userData?.chapterTodos?.[key] || []}
                              onAddTodo={text => addChapterTodo(course.id, ch, text)}
                              onToggleTodo={id => toggleChapterTodo(course.id, ch, id)}
                              onDeleteTodo={id => deleteChapterTodo(course.id, ch, id)}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tilt>
          );
        })}
      </div>
    </motion.div>
  );
}
