import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, events, logEvent } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUserProfile: (displayName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      logEvent(events.USER_LOGIN, {
        userId: result.user.uid
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      logEvent(events.USER_SIGNUP, {
        userId: result.user.uid
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      const { user } = get();
      if (user) {
        logEvent('user_logout', {
          userId: user.uid
        });
      }
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  setUser: (user) => set({ user }),
  updateUserProfile: async (displayName) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      await updateProfile(user, { displayName });
      set({ user: { ...user, displayName } });
      
      logEvent(events.PROFILE_UPDATE, {
        userId: user.uid
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));