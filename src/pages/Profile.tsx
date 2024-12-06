import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLessonStore } from '../store/lessonStore';
import { User, Mail, Award, BookOpen } from 'lucide-react';

function Profile() {
  const { user } = useAuthStore();
  const { lessons, userProgress } = useLessonStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');

  const completedLessons = Object.keys(userProgress).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.displayName || user?.email?.split('@')[0]}
              </h1>
              <div className="flex items-center mt-2 text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Learning Progress</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-indigo-50 rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Completed Lessons</h3>
                  <p className="mt-1 text-3xl font-semibold text-indigo-600">{completedLessons}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
                  <p className="mt-1 text-3xl font-semibold text-indigo-600">{progressPercentage.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;