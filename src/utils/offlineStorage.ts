import { openDB } from 'idb';
import { Lesson } from '../types/lesson';

const DB_NAME = 'linguaLearnDB';
const LESSONS_STORE = 'lessons';
const PROGRESS_STORE = 'progress';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(LESSONS_STORE)) {
        db.createObjectStore(LESSONS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function storeLessons(lessons: Lesson[]) {
  const db = await initDB();
  const tx = db.transaction(LESSONS_STORE, 'readwrite');
  const store = tx.objectStore(LESSONS_STORE);
  
  await Promise.all(lessons.map(lesson => store.put(lesson)));
  await tx.done;
}

export async function getStoredLessons(): Promise<Lesson[]> {
  const db = await initDB();
  return db.getAll(LESSONS_STORE);
}

export async function storeProgress(userId: string, progress: Record<string, boolean>) {
  const db = await initDB();
  await db.put(PROGRESS_STORE, { id: userId, progress });
}

export async function getStoredProgress(userId: string): Promise<Record<string, boolean>> {
  const db = await initDB();
  const data = await db.get(PROGRESS_STORE, userId);
  return data?.progress || {};
}

export async function clearStoredData() {
  const db = await initDB();
  await db.clear(LESSONS_STORE);
  await db.clear(PROGRESS_STORE);
}