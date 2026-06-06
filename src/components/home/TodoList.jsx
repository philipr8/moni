import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

export default function TodoList() {
  const { userData, addGlobalTodo, toggleGlobalTodo, deleteGlobalTodo } = useUserData();
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const todos    = userData?.globalTodos || [];
  const filtered = filter==='all' ? todos : filter==='active' ? todos.filter(t=>!t.completed) : todos.filter(t=>t.completed);
  const done     = todos.filter(t=>t.completed).length;

  const handleAdd = async () => {
    if (!input.trim()) return;
    await addGlobalTodo(input.trim());
    setInput('');
  };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }} className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.20)' }}>
            <ClipboardList size={14} style={{ color:'#4ade80' }}/>
          </div>
          <div>
            <h2 className="font-bold text-sm gradient-text-subtle">Study To-Do</h2>
            <p className="text-[10px] font-medium" style={{ color:'rgba(255,255,255,0.30)' }}>{done}/{todos.length} done</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ background:'rgba(255,255,255,0.05)' }}>
          {['all','active','done'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                      filter===f ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/50'
                    }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input value={input} onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key==='Enter' && handleAdd()}
               placeholder="Add a study task..."
               className="field flex-1"/>
        <motion.button whileTap={{ scale:0.9 }} onClick={handleAdd} disabled={!input.trim()}
                       className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 text-white ripple-btn"
                       style={input.trim() ? {
                         background:'linear-gradient(135deg,#2D6A4F,#1B4332)',
                         boxShadow:'0 0 20px rgba(74,222,128,0.30)',
                       } : { background:'rgba(255,255,255,0.06)' }}>
          <Plus size={18}/>
        </motion.button>
      </div>

      <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                      className="text-center text-sm py-4 font-medium" style={{ color:'rgba(255,255,255,0.25)' }}>
              {filter==='done' ? 'No completed tasks' : '✨ All clear!'}
            </motion.p>
          ) : (
            filtered.map(todo => (
              <motion.div key={todo.id}
                initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, height:0 }} layout
                className="flex items-center gap-3 group rounded-xl px-3 py-2.5 transition-all"
                style={{
                  background: todo.completed ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${todo.completed ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                <input type="checkbox" checked={todo.completed} onChange={() => toggleGlobalTodo(todo.id)} className="custom-check"/>
                <span className={`flex-1 text-sm leading-snug ${todo.completed ? 'line-through' : ''}`}
                      style={{ color: todo.completed ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.80)' }}>
                  {todo.text}
                </span>
                <button onClick={() => deleteGlobalTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color:'rgba(255,255,255,0.25)' }}>
                  <Trash2 size={13}/>
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {todos.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
          <div className="progress-track" style={{ height:6 }}>
            <motion.div className="progress-fill" animate={{ width:`${(done/todos.length)*100}%` }} transition={{ duration:0.5 }} style={{ height:'100%' }}/>
          </div>
        </div>
      )}
    </motion.div>
  );
}
