import React from 'react';
import { Clock, BookOpen, Layout } from 'lucide-react';
import { Lesson } from '../store/lessonStore';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onStart: () => void;
  onPractice: () => void;
}

export function LessonCard({ lesson, isCompleted, onStart, onPractice }: LessonCardProps) {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColors[lesson.level]}`}>
              {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
            </span>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{lesson.title}</h3>
            <p className="mt-2 text-gray-600">{lesson.description}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{lesson.duration} min</span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onPractice}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
              <Layout className="h-4 w-4 mr-2" />
              Practice
            </button>
            <button
              onClick={onStart}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isCompleted ? 'Review' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}