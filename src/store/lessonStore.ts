import { create } from 'zustand';
import { collection, getDocs, doc, setDoc, onSnapshot, query } from 'firebase/firestore';
import { db, events, logEvent } from '../lib/firebase';
import { useAuthStore } from './authStore';
import { storeLessons, getStoredLessons, storeProgress, getStoredProgress } from '../utils/offlineStorage';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
}

interface LessonState {
  lessons: Lesson[];
  userProgress: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  fetchLessons: () => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  getUserProgress: (userId: string) => Promise<void>;
  subscribeToLessons: () => () => void;
  subscribeToProgress: (userId: string) => () => void;
  syncOfflineData: () => Promise<void>;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  userProgress: {},
  loading: false,
  error: null,
  isOffline: !navigator.onLine,
  
  fetchLessons: async () => {
    try {
      set({ loading: true });
      
      if (!navigator.onLine) {
        const storedLessons = await getStoredLessons();
        set({ lessons: storedLessons, loading: false, isOffline: true });
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'lessons'));
      const lessons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
      
      await storeLessons(lessons);
      set({ lessons, loading: false, isOffline: false });
    } catch (error) {
      const storedLessons = await getStoredLessons();
      set({ 
        lessons: storedLessons, 
        error: (error as Error).message, 
        loading: false,
        isOffline: true 
      });
    }
  },

  markLessonComplete: async (lessonId: string) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      const completionData = {
        completed: true,
        completedAt: new Date().toISOString()
      };

      if (navigator.onLine) {
        await setDoc(doc(db, `users/${user.uid}/progress/${lessonId}`), completionData);
      }
      
      const currentProgress = get().userProgress;
      const newProgress = { ...currentProgress, [lessonId]: true };
      
      await storeProgress(user.uid, newProgress);
      set({ userProgress: newProgress });

      logEvent(events.LESSON_COMPLETE, {
        lessonId,
        userId: user.uid,
        offline: !navigator.onLine
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getUserProgress: async (userId: string) => {
    try {
      if (!navigator.onLine) {
        const storedProgress = await getStoredProgress(userId);
        set({ userProgress: storedProgress, isOffline: true });
        return;
      }

      const progressSnapshot = await getDocs(collection(db, `users/${userId}/progress`));
      const progress: Record<string, boolean> = {};
      progressSnapshot.docs.forEach(doc => {
        progress[doc.id] = true;
      });
      
      await storeProgress(userId, progress);
      set({ userProgress: progress, isOffline: false });
    } catch (error) {
      const storedProgress = await getStoredProgress(userId);
      set({ 
        userProgress: storedProgress,
        error: (error as Error).message,
        isOffline: true 
      });
    }
  },

  subscribeToLessons: () => {
    const unsubscribe = onSnapshot(
      collection(db, 'lessons'),
      async (snapshot) => {
        const lessons = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
        
        await storeLessons(lessons);
        set({ lessons });
      },
      (error) => {
        set({ error: error.message });
      }
    );
    return unsubscribe;
  },

  subscribeToProgress: (userId: string) => {
    const unsubscribe = onSnapshot(
      collection(db, `users/${userId}/progress`),
      async (snapshot) => {
        const progress: Record<string, boolean> = {};
        snapshot.docs.forEach(doc => {
          progress[doc.id] = true;
        });
        
        await storeProgress(userId, progress);
        set({ userProgress: progress });
      },
      (error) => {
        set({ error: error.message });
      }
    );
    return unsubscribe;
  },

  syncOfflineData: async () => {
    const { user } = useAuthStore.getState();
    if (!user || !navigator.onLine) return;

    try {
      const storedProgress = await getStoredProgress(user.uid);
      
      // Sync offline progress to Firebase
      for (const [lessonId, completed] of Object.entries(storedProgress)) {
        if (completed) {
          await setDoc(doc(db, `users/${user.uid}/progress/${lessonId}`), {
            completed: true,
            completedAt: new Date().toISOString(),
            syncedFromOffline: true
          });
        }
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));