import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Rocket } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLessonStore } from '../store/lessonStore';
import { seedLessons } from '../utils/seedData';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { lessons, userProgress, fetchLessons } = useLessonStore();

  useEffect(() => {
    const initializeData = async () => {
      await fetchLessons();
      if (lessons.length === 0) {
        await seedLessons();
        await fetchLessons();
      }
    };
    
    initializeData();
  }, [fetchLessons, lessons.length]);

  const completedLessons = Object.keys(userProgress).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn through engaging content and practical exercises'
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking'
    },
    {
      icon: Rocket,
      title: 'Personalized Path',
      description: 'Content tailored to your skill level and learning goals'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="mt-2 text-gray-600">
          Continue your language learning journey
        </p>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>
        <button
          onClick={() => navigate('/lessons')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue Learning
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-white overflow-hidden shadow-sm rounded-xl"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;