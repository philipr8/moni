import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';

const UserDataContext = createContext(null);

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const todayStr = () => new Date().toISOString().split('T')[0];
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
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
  mcatDate: null,
  ducklingName: null,
  bondLevel: 1,
  streakCount: 0,
  lastLoginDate: null,
  waterDrops: 0,
  totalDropsFed: 0,
  unlockedAccessories: [],
  courseProgress: {},
  calendarEvents: [],
  globalTodos: [],
  chapterTodos: {},
  uploadedNotes: {},
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

    const docRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setUserData({ ...DEFAULT_DATA, ...snap.data() });
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  // Streak check on first load when userData is ready
  useEffect(() => {
    if (!uid || !userData || !userData.mcatDate) return;
    const today = todayStr();
    if (userData.lastLoginDate === today) return;

    const yesterday = yesterdayStr();
    const prevStreak = userData.streakCount || 0;
    const newStreak = userData.lastLoginDate === yesterday ? prevStreak + 1 : 1;
    const newWaterDrops = (userData.waterDrops || 0) + 1;

    const prevAccessories = userData.unlockedAccessories || [];
    const newAccessories = [...prevAccessories];
    Object.entries(STREAK_ACCESSORIES).forEach(([days, acc]) => {
      if (newStreak >= Number(days) && !newAccessories.includes(acc)) {
        newAccessories.push(acc);
        setNewAccessoryUnlocked(acc);
        setTimeout(() => setNewAccessoryUnlocked(null), 4000);
      }
    });

    updateDoc(doc(db, 'users', uid), {
      streakCount: newStreak,
      lastLoginDate: today,
      waterDrops: newWaterDrops,
      unlockedAccessories: newAccessories,
    }).catch(console.error);
  }, [uid, userData?.lastLoginDate, userData?.mcatDate]);

  const initUser = useCallback(async (mcatDate, ducklingName) => {
    if (!uid) return;
    const today = todayStr();
    await setDoc(doc(db, 'users', uid), {
      ...DEFAULT_DATA,
      mcatDate,
      ducklingName,
      streakCount: 1,
      lastLoginDate: today,
      waterDrops: 1,
    });
  }, [uid]);

  const updateField = useCallback(async (fields) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), fields);
  }, [uid]);

  const feedDuck = useCallback(async (drops = 1) => {
    if (!uid || !userData) return;
    const actualDrops = Math.min(drops, userData.waterDrops);
    if (actualDrops <= 0) return;
    const newTotalFed = (userData.totalDropsFed || 0) + actualDrops;
    const newBondLevel = getBondLevel(newTotalFed);
    await updateDoc(doc(db, 'users', uid), {
      waterDrops: (userData.waterDrops || 0) - actualDrops,
      totalDropsFed: newTotalFed,
      bondLevel: newBondLevel,
    });
  }, [uid, userData]);

  const updateChapterStage = useCallback(async (courseId, chapter, stage) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), {
      [`courseProgress.${courseId}.${chapter}`]: stage,
    });
  }, [uid]);

  // Calendar events
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
    const events = (userData.calendarEvents || []).filter(e => e.id !== id);
    await updateDoc(doc(db, 'users', uid), { calendarEvents: events });
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
    const todos = (userData.globalTodos || []).filter(t => t.id !== id);
    await updateDoc(doc(db, 'users', uid), { globalTodos: todos });
  }, [uid, userData]);

  // Chapter todos
  const addChapterTodo = useCallback(async (courseId, chapter, text) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    const existing = userData.chapterTodos?.[key] || [];
    const updated = [...existing, { id: genId(), text, completed: false, createdAt: Date.now() }];
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
    const todos = (userData.chapterTodos?.[key] || []).filter(t => t.id !== id);
    await updateDoc(doc(db, 'users', uid), { [`chapterTodos.${key}`]: todos });
  }, [uid, userData]);

  // Notes upload
  const uploadNote = useCallback(async (courseId, chapter, file) => {
    if (!uid) return null;
    const path = `notes/${uid}/${courseId}/${chapter}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const note = { id: genId(), name: file.name, url, path, type: file.type, uploadedAt: Date.now() };
    const key = `${courseId}-${chapter}`;
    const existing = userData?.uploadedNotes?.[key] || [];
    await updateDoc(doc(db, 'users', uid), { [`uploadedNotes.${key}`]: [...existing, note] });
    return note;
  }, [uid, userData]);

  const deleteNote = useCallback(async (courseId, chapter, noteId, path) => {
    if (!uid || !userData) return;
    const key = `${courseId}-${chapter}`;
    const notes = (userData.uploadedNotes?.[key] || []).filter(n => n.id !== noteId);
    await updateDoc(doc(db, 'users', uid), { [`uploadedNotes.${key}`]: notes });
    if (path) {
      try { await deleteObject(ref(storage, path)); } catch {}
    }
  }, [uid, userData]);

  const value = {
    userData,
    isLoading,
    newAccessoryUnlocked,
    initUser,
    updateField,
    feedDuck,
    updateChapterStage,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    addGlobalTodo,
    toggleGlobalTodo,
    deleteGlobalTodo,
    addChapterTodo,
    toggleChapterTodo,
    deleteChapterTodo,
    uploadNote,
    deleteNote,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
