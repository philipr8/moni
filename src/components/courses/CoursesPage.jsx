import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, Plus, Trash2, X, FileText, Image as ImageIcon } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useUserData } from '../../context/UserDataContext';
import { COURSES, STAGE_ORDER } from '../../data/courses';

const BADGE_CLASS = {
  'not-started': 'badge-not-started',
  'in-progress':  'badge-in-progress',
  'reviewed':     'badge-reviewed',
  'mastered':     'badge-mastered',
};
const BADGE_LABEL = {
  'not-started': 'Not Started',
  'in-progress':  'In Progress',
  'reviewed':     'Reviewed',
  'mastered':     'Mastered',
};

function StageBadge({ stage, onClick }) {
  return (
    <button onClick={onClick} className={`${BADGE_CLASS[stage||'not-started']} whitespace-nowrap`}>
      {BADGE_LABEL[stage||'not-started']}
    </button>
  );
}

function ChapterDetail({ course, chapterIdx, stage, onStageChange, notes, onUpload, onDeleteNote, todos, onAddTodo, onToggleTodo, onDeleteTodo }) {
  const [newTodo, setNewTodo]   = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onUpload(file); } finally { setUploading(false); e.target.value = ''; }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    onAddTodo(newTodo.trim());
    setNewTodo('');
  };

  const advance = () => {
    const idx = STAGE_ORDER.indexOf(stage || 'not-started');
    onStageChange(STAGE_ORDER[(idx + 1) % STAGE_ORDER.length]);
  };

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}>
      {/* Chapter header */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
             style={{ background: `linear-gradient(135deg, ${course.color}cc, ${course.color})` }}>
          {chapterIdx}
        </div>
        <p className="font-semibold text-sm flex-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {course.chapters[chapterIdx - 1]}
        </p>
        <StageBadge stage={stage} onClick={advance} />
      </div>

      <div className="p-4 space-y-4">
        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Notes</p>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 font-semibold transition-all"
                    style={{ background: 'rgba(74,222,128,0.10)', color: 'rgba(168,197,160,0.85)', border: '1px solid rgba(74,222,128,0.18)' }}>
              {uploading ? <div className="w-3 h-3 border border-glow-green/40 border-t-glow-green rounded-full animate-spin"/> : <Upload size={10}/>}
              Upload
            </button>
            <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleUpload}/>
          </div>
          {notes.length === 0 ? (
            <div className="text-xs text-center py-3 rounded-xl border border-dashed font-medium"
                 style={{ color: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.10)' }}>
              No notes uploaded yet
            </div>
          ) : (
            <div className="space-y-1.5">
              {notes.map(note => (
                <div key={note.id} className="flex items-center gap-2 rounded-xl px-3 py-2"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {note.type?.includes('pdf')
                    ? <FileText size={12} className="text-red-400 shrink-0"/>
                    : <ImageIcon size={12} className="text-blue-400 shrink-0"/>}
                  <a href={note.url} target="_blank" rel="noreferrer"
                     className="flex-1 text-xs font-medium truncate" style={{ color: '#60a5fa' }}>
                    {note.name}
                  </a>
                  <button onClick={() => onDeleteNote(note.id)}
                          style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <X size={11}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Todos */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Tasks</p>
          <div className="space-y-1.5 mb-2">
            <AnimatePresence>
              {todos.map(todo => (
                <motion.div key={todo.id}
                            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, height:0 }}
                            className="flex items-center gap-2 group">
                  <input type="checkbox" checked={todo.completed} onChange={() => onToggleTodo(todo.id)} className="custom-check"/>
                  <span className={`flex-1 text-xs ${todo.completed ? 'line-through' : ''}`}
                        style={{ color: todo.completed ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.75)' }}>
                    {todo.text}
                  </span>
                  <button onClick={() => onDeleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                          style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <Trash2 size={11}/>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
                   placeholder="Add task..." className="field flex-1 text-xs py-1.5 px-2.5"/>
            <button onClick={handleAddTodo} disabled={!newTodo.trim()}
                    className="btn-primary text-xs px-3 py-1.5 rounded-xl disabled:opacity-30">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const {
    userData, updateChapterStage, uploadNote, deleteNote,
    addChapterTodo, toggleChapterTodo, deleteChapterTodo,
  } = useUserData();
  const [expandedCourse,  setExpandedCourse]  = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const toggleCourse = (id) => { setExpandedCourse(e => e === id ? null : id); setExpandedChapter(null); };

  return (
    <div className="px-4 pt-6 page-content max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black gradient-text">Courses</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
          6 subjects · 72 chapters total
        </p>
      </div>

      <div className="space-y-3">
        {COURSES.map(course => {
          const progress = userData?.courseProgress?.[course.id] || {};
          const mastered = Object.values(progress).filter(s => s === 'mastered').length;
          const reviewed = Object.values(progress).filter(s => s === 'reviewed').length;
          const inProg   = Object.values(progress).filter(s => s === 'in-progress').length;
          const pct      = Math.round((mastered / 12) * 100);
          const isOpen   = expandedCourse === course.id;

          return (
            <Tilt key={course.id}
              tiltMaxAngleX={isOpen ? 0 : 4} tiltMaxAngleY={isOpen ? 0 : 4}
              glareEnable={!isOpen} glareMaxOpacity={0.05}
              tiltEnable={!isOpen}
              style={{ transformStyle: 'preserve-3d' }}>
              <div className="card overflow-hidden !p-0">
                {/* Course header */}
                <button onClick={() => toggleCourse(course.id)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:brightness-110 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                       style={{ background: `${course.color}18`, border: `1px solid ${course.color}28`,
                                boxShadow: `0 0 20px ${course.color}18` }}>
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>{course.name}</p>
                      <span className="text-sm font-black" style={{ color: course.color }}>{mastered}/12</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.9, ease: 'easeOut' }}
                                  className="h-full rounded-full"
                                  style={{ background: `linear-gradient(90deg, ${course.color}80, ${course.color})`,
                                           boxShadow: `0 0 8px ${course.color}60` }} />
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      {mastered > 0 && <span className="badge-mastered text-[10px] px-1.5 py-0">{mastered} mastered</span>}
                      {reviewed > 0 && <span className="badge-reviewed text-[10px] px-1.5 py-0">{reviewed} reviewed</span>}
                      {inProg   > 0 && <span className="badge-in-progress text-[10px] px-1.5 py-0">{inProg} in progress</span>}
                    </div>
                  </div>
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                               style={{ color: 'rgba(255,255,255,0.30)' }} />
                </button>

                {/* Chapter list */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-2 border-t pt-4"
                           style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        {course.chapters.map((chName, idx) => {
                          const ch  = idx + 1;
                          const key = `${course.id}-${ch}`;
                          const isChOpen = expandedChapter === key;

                          return (
                            <div key={ch}>
                              {/* Chapter row toggle */}
                              <button
                                onClick={() => setExpandedChapter(isChOpen ? null : key)}
                                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all border"
                                style={{ background: isChOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                                         borderColor: isChOpen ? `${course.color}40` : 'rgba(255,255,255,0.07)' }}
                              >
                                <span className="text-xs font-black w-5 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>{ch}</span>
                                <span className="flex-1 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>{chName}</span>
                                <span className={BADGE_CLASS[progress[ch] || 'not-started']}>
                                  {BADGE_LABEL[progress[ch] || 'not-started']}
                                </span>
                                <ChevronDown size={13} className={`transition-transform shrink-0 ${isChOpen ? 'rotate-180' : ''}`}
                                             style={{ color: 'rgba(255,255,255,0.25)' }} />
                              </button>

                              {/* Chapter detail */}
                              <AnimatePresence>
                                {isChOpen && (
                                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                                              exit={{ opacity:0, height:0 }} className="overflow-hidden mt-2">
                                    <ChapterDetail
                                      course={course}
                                      chapterIdx={ch}
                                      stage={progress[ch]}
                                      onStageChange={s => updateChapterStage(course.id, ch, s)}
                                      notes={userData?.uploadedNotes?.[key] || []}
                                      onUpload={file => uploadNote(course.id, ch, file)}
                                      onDeleteNote={(id, p) => deleteNote(course.id, ch, id)}
                                      todos={userData?.chapterTodos?.[key] || []}
                                      onAddTodo={text => addChapterTodo(course.id, ch, text)}
                                      onToggleTodo={id => toggleChapterTodo(course.id, ch, id)}
                                      onDeleteTodo={id => deleteChapterTodo(course.id, ch, id)}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
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
    </div>
  );
}
