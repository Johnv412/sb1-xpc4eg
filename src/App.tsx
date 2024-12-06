import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import { useLessonStore } from './store/lessonStore';
import { AuthForm } from './components/AuthForm';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { OfflineIndicator } from './components/OfflineIndicator';

const Home = React.lazy(() => import('./pages/Home'));
const Lessons = React.lazy(() => import('./pages/Lessons'));
const Profile = React.lazy(() => import('./pages/Profile'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  const { setUser } = useAuthStore();
  const { subscribeToLessons, subscribeToProgress, syncOfflineData } = useLessonStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        const unsubscribeProgress = subscribeToProgress(user.uid);
        return () => {
          unsubscribeProgress();
        };
      }
    });

    const unsubscribeLessons = subscribeToLessons();

    // Handle offline/online status
    const handleOnline = () => {
      syncOfflineData();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribeAuth();
      unsubscribeLessons();
      window.removeEventListener('online', handleOnline);
    };
  }, [setUser, subscribeToLessons, subscribeToProgress, syncOfflineData]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div>
                  <Navigation />
                  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/lessons" element={<Lessons />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <OfflineIndicator />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;