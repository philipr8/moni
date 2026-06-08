import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, ExternalLink, Trash2, Search, FolderOpen } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';
import { COURSES } from '../../data/courses';

function NoteCard({ note, showContext, onDelete }) {
  const isPdf = note.type?.includes('pdf') || note.name?.toLowerCase().endsWith('.pdf');
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 group transition-all border"
         style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isPdf?'bg-red-500/15':'bg-blue-500/15'}`}>
        {isPdf ? <FileText size={14} className="text-red-400"/> : <ImageIcon size={14} className="text-blue-400"/>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate" style={{ color:'rgba(255,255,255,0.80)' }}>{note.name}</p>
        {showContext && <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.35)' }}>{note.courseName} · Ch. {note.chapter}</p>}
        <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.25)' }}>
          {note.uploadedAt ? new Date(note.uploadedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''}
        </p>
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={note.url} target="_blank" rel="noreferrer noopener"
           className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
           style={{ background:'rgba(96,165,250,0.15)', color:'#60a5fa' }}>
          <ExternalLink size={11}/>
        </a>
        <button onClick={onDelete}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ background:'rgba(239,68,68,0.12)', color:'#f87171' }}>
          <Trash2 size={11}/>
        </button>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const { userData, uploadNote, deleteNote } = useUserData();
  const [search, setSearch] = useState('');
  const [uploadingKey, setUploadingKey] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const fileRefs = useRef({});

  const uploadedNotes = userData?.uploadedNotes || {};
  const allNotes = [];
  COURSES.forEach(c => {
    for (let ch = 1; ch <= 12; ch++) {
      const key = `${c.id}-${ch}`;
      (uploadedNotes[key]||[]).forEach(note => {
        allNotes.push({ ...note, courseId:c.id, courseName:c.name, chapter:ch, chapterName:c.chapters[ch-1], key });
      });
    }
  });

  const filtered = search.trim()
    ? allNotes.filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.courseName.toLowerCase().includes(search.toLowerCase()) || n.chapterName.toLowerCase().includes(search.toLowerCase()))
    : null;

  const handleUpload = async (courseId, ch, file) => {
    const key = `${courseId}-${ch}`;
    setUploadingKey(key);
    try { await uploadNote(courseId, ch, file); } finally { setUploadingKey(null); }
  };

  return (
    <div className="px-4 pt-6 page-content max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black gradient-text">Notes</h1>
        <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.40)' }}>{allNotes.length} file{allNotes.length!==1?'s':''} uploaded</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'rgba(255,255,255,0.30)' }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes..."
               className="field pl-11"/>
      </div>

      {/* Search results */}
      {search.trim() && (
        <AnimatePresence>
          <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} className="card mb-4">
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color:'rgba(255,255,255,0.35)' }}>
              {filtered.length} result{filtered.length!==1?'s':''} for "{search}"
            </p>
            {filtered.length===0 ? (
              <p className="text-sm text-center py-4" style={{ color:'rgba(255,255,255,0.25)' }}>No notes found</p>
            ) : (
              <div className="space-y-2">
                {filtered.map(note => (
                  <NoteCard key={note.id} note={note} showContext
                            onDelete={() => deleteNote(note.courseId, note.chapter, note.id)}/>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {!search.trim() && (
        <div className="space-y-3">
          {COURSES.map(course => {
            const courseNotes = [];
            for (let ch = 1; ch <= 12; ch++) {
              const key = `${course.id}-${ch}`;
              (uploadedNotes[key]||[]).forEach(n => courseNotes.push({...n,chapter:ch,chapterName:course.chapters[ch-1],key}));
            }
            const isOpen = expandedCourse === course.id;
            return (
              <div key={course.id} className="card !p-0 overflow-hidden">
                <button onClick={() => setExpandedCourse(isOpen?null:course.id)}
                        className="w-full flex items-center gap-4 p-4 text-left transition-all hover:brightness-110">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                       style={{ background:`${course.color}15`, border:`1px solid ${course.color}25` }}>
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color:'rgba(255,255,255,0.85)' }}>{course.name}</p>
                    <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>{courseNotes.length} file{courseNotes.length!==1?'s':''}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       className={`transition-transform ${isOpen?'rotate-180':''}`} style={{ color:'rgba(255,255,255,0.25)' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3 space-y-3 border-t" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                        {course.chapters.map((chName,idx) => {
                          const ch = idx+1;
                          const key = `${course.id}-${ch}`;
                          const chNotes = uploadedNotes[key]||[];
                          const isUp = uploadingKey===key;
                          return (
                            <div key={ch} className="rounded-xl overflow-hidden border" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                              <div className="flex items-center gap-3 px-3.5 py-3">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                                     style={{ background:course.color }}>{ch}</div>
                                <span className="flex-1 text-sm font-medium" style={{ color:'rgba(255,255,255,0.70)' }}>{chName}</span>
                                <button onClick={() => {
                                  if (!fileRefs.current[key]) fileRefs.current[key] = document.createElement('input');
                                  const inp = fileRefs.current[key];
                                  inp.type='file'; inp.accept='.pdf,image/*';
                                  inp.onchange=e=>{ const f=e.target.files?.[0]; if(!f) return; if(f.size===0){alert('File appears empty — try selecting it again');inp.value='';return;} handleUpload(course.id,ch,f); inp.value=''; };
                                  inp.click();
                                }} disabled={isUp}
                                   className="flex items-center gap-1 text-xs rounded-lg px-2.5 py-1.5 font-semibold transition-all"
                                   style={{ background:'rgba(74,222,128,0.10)', color:'rgba(168,197,160,0.80)', border:'1px solid rgba(74,222,128,0.18)' }}>
                                  {isUp ? <div className="w-3 h-3 border border-glow-sage/50 border-t-glow-sage rounded-full animate-spin"/> : <Upload size={10}/>}
                                  Upload
                                </button>
                              </div>
                              {chNotes.length>0 && (
                                <div className="px-3.5 pb-3 space-y-1.5">
                                  {chNotes.map(note => (
                                    <NoteCard key={note.id} note={note}
                                              onDelete={() => deleteNote(course.id,ch,note.id)}/>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {allNotes.length===0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="card text-center py-12">
              <FolderOpen size={48} className="mx-auto mb-4" style={{ color:'rgba(255,255,255,0.15)' }}/>
              <p className="font-bold text-lg mb-1" style={{ color:'rgba(255,255,255,0.50)' }}>No notes yet</p>
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.25)' }}>Upload PDFs or images to any chapter above</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
