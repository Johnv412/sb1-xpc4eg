import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Event types for logging
export const events = {
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  LESSON_START: 'lesson_start',
  LESSON_COMPLETE: 'lesson_complete',
  PROFILE_UPDATE: 'profile_update'
} as const;

// Helper function to log events
export function logEvent(eventName: string, eventParams?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.log('Event logged:', eventName, eventParams);
  }
}