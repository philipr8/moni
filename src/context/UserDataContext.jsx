import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';

const UserDataContext = createContext(null);

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const todayStr = () => new Date().toISOString().split('T')[0];
const yesterdayStr = () => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const BOND_THRESHOLDS = [0, 10, 25, 50, 100];
export const getBondLevel = (totalDropsFed = 0) => {
  let level = 1;
  BOND_THRESHOLDS.forEach((t, i) => { if (totalDropsFed >= t) level = i + 1; });
  return Math.min(level, 5);
};

const STREAK_ACCESSORIES = { 7: 'hat', 14: 'bowtie', 30: 'graduation-cap', 60: 'sunglasses', 100: 'crown' };

const DEFAULT_DATA = {
  mcatDate: null, ducklingName: null,
  bondLevel: 1, streakCount: 0, lastLoginDate: null,
  waterDrops: 0, totalDropsFed: 0, unlockedAccessories: [],
  courseProgress: {}, calendarEvents: [],
  globalTodos: [], chapterTodos: {}, uploadedNotes: {},
  layoutMode: 'desktop',
};


export function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAccessoryUnlocked, setNewAccessoryUnlocked] = useState(null);
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) { setIsLoading(false); return; }
    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setUserData(snap.exists() ? { ...DEFAULT_DATA, ...snap.data() } : null);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore error:', error.code, error.message);
        setIsLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  // Streak check on login
  useEffect(() => {
    if (!uid || !userData || !userData.mcatDate) return;
    const today = todayStr();
    if (userData.lastLoginDate === today) return;
    const yesterday = yesterdayStr();
    const newStreak = userData.lastLoginDate === yesterday ? (userData.streakCount || 0) + 1 : 1;
    const newWaterDrops = (userData.waterDrops || 0) + 1;
    const newAccessories = [...(userData.unlockedAccessories || [])];
    Object.entries(STREAK_ACCESSORIES).forEach(([days, acc]) => {
      if (newStreak >= Number(days) && !newAccessories.includes(acc)) {
        newAccessories.push(acc);
        setNewAccessoryUnlocked(acc);
        setTimeout(() => setNewAccessoryUnlocked(null), 4000);
      }
    });
    updateDoc(doc(db, 'users', uid), {
      streakCount: newStreak, lastLoginDate: today,
      waterDrops: newWaterDrops, unlockedAccessories: newAccessories,
    }).catch(console.error);
  }, [uid, userData?.lastLoginDate, userData?.mcatDate]);

  const initUser = useCallback(async (mcatDate, ducklingName) => {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), {
      ...DEFAULT_DATA, mcatDate, ducklingName,
      streakCount: 1, lastLoginDate: todayStr(), waterDrops: 1,
    });
  }, [uid]);

  const updateField = useCallback(async (fields) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), fields);
  }, [uid]);

  const feedDuck = useCallback(async (drops = 1) => {
    if (!uid || !userData) return;
    const actual = Math.min(drops, userData.waterDrops);
    if (actual <= 0) return;
    const newTotal = (userData.totalDropsFed || 0) + actual;
    await updateDoc(doc(db, 'users', uid), {
      waterDrops: (userData.waterDrops || 0) - actual,
      totalDropsFed: newTotal, bondLevel: getBondLevel(newTotal),
    });
  }, [uid, userData]);

  const updateChapterStage = useCallback(async (courseId, chapter, stage) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), { [`courseProgress.${courseId}.${chapter}`]: stage });
  }, [uid]);

  // Calendar
  const addCalendarEvent = useCallback(async (event) => {
    if (!uid || !userData) return;
    const events = [...(userData.calendarEvents || []), { ...event, id: genId(), type: 'user' }];
    await updateDoc(doc(db, 'users', uid), { calendarEvents: events });
  }, [uid, userData]);

  const updateCalendarEvent = useCallback(async (id, updates) => {
    if (!uid || !userData) return;
    const events = (userData.calendarEvents || []).map(e => e.id === id ? { ...e, ...updates } : e);
    await updateDoc(doc(db, 'users', uid), { calendarEvents: events });
  }, [uid, userData]);

  const deleteCalendarEvent = useCallback(async (id) => {
    if (!uid || !userData) return;
    await updateDoc(doc(db, 'users', uid), {
      calendarEvents: (userData.calendarEvents || []).filter(e => e.id !== id),
    });
  }, [uid, userData]);

  // Global todos
  const addGlobalTodo = useCallback(async (text) => {
    if (!uid || !userData) return;
    const todos = [...(userData.globalTodos || []), { id: genId(), text, completed: false, createdAt: Date.now() }];
    await updateDoc(doc(db, 'users', uid), { globalTodos: todos });
  }, [uid, userData]);

  const toggleGlobalTodo = useCallback(async (id) => {
    if (!uid || !userData) return;
    const todos = (userData.globalTodos || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await updateDoc(doc(db, 'users', uid), { globalTodos: todos });
  }, [uid, userData]);

  const deleteGlobalTodo = useCallback(async (id) => {
    if (!uid || !userData) return;
    await updateDoc(doc(db, 'users', uid), {
      globalTodos: (userData.globalTodos || []).filter(t => t.id !== id),
    });
  }, [uid, userData]);

  // Chapter todos
  const addChapterTodo = useCallback(async (courseId, chapter, text) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    const updated = [...(userData.chapterTodos?.[key] || []), { id: genId(), text, completed: false, createdAt: Date.now() }];
    await updateDoc(doc(db, 'users', uid), { [`chapterTodos.${key}`]: updated });
  }, [uid, userData]);

  const toggleChapterTodo = useCallback(async (courseId, chapter, id) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    const todos = (userData.chapterTodos?.[key] || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await updateDoc(doc(db, 'users', uid), { [`chapterTodos.${key}`]: todos });
  }, [uid, userData]);

  const deleteChapterTodo = useCallback(async (courseId, chapter, id) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    await updateDoc(doc(db, 'users', uid), {
      [`chapterTodos.${key}`]: (userData.chapterTodos?.[key] || []).filter(t => t.id !== id),
    });
  }, [uid, userData]);

  const uploadNote = useCallback(async (courseId, chapter, file) => {
    if (!uid || !userData) return null;
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    const path = `notes/${uid}/${courseId}/${chapter}/${Date.now()}-${file.name}`;
    const snapshot = await uploadBytes(ref(storage, path), file);
    const url = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', url);
    const note = {
      id: genId(),
      name: file.name,
      url,
      type: file.type,
      uploadedAt: Date.now(),
    };
    const key = `${courseId}-${chapter}`;
    const existing = userData.uploadedNotes?.[key] || [];
    await updateDoc(doc(db, 'users', uid), { [`uploadedNotes.${key}`]: [...existing, note] });
    return note;
  }, [uid, userData]);

  const deleteNote = useCallback(async (courseId, chapter, noteId) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    await updateDoc(doc(db, 'users', uid), {
      [`uploadedNotes.${key}`]: (userData.uploadedNotes?.[key] || []).filter(n => n.id !== noteId),
    });
  }, [uid, userData]);

  const value = {
    userData, isLoading, newAccessoryUnlocked,
    initUser, updateField, feedDuck, updateChapterStage,
    addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
    addGlobalTodo, toggleGlobalTodo, deleteGlobalTodo,
    addChapterTodo, toggleChapterTodo, deleteChapterTodo,
    uploadNote, deleteNote,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
