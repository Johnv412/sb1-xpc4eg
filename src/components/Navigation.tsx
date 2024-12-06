import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Navigation() {
  const location = useLocation();
  const { signOut } = useAuthStore();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/lessons', icon: BookOpen, label: 'Lessons' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                LinguaLearn
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === to
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="grid grid-cols-3 gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex flex-col items-center justify-center py-3 ${
                  location.pathname === to
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}