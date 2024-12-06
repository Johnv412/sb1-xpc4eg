import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';
import { Lesson } from '../store/lessonStore';
import { QuizComponent } from './QuizComponent';

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
  isCompleted: boolean;
}

export function LessonViewer({ lesson, onComplete, onClose, isCompleted }: LessonViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const content = lesson.content.split('\n');
  const totalSteps = content.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showQuiz) {
    return (
      <QuizComponent
        lesson={lesson}
        onComplete={onComplete}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                lesson.level === 'beginner' ? 'bg-green-100 text-green-800' :
                lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
              </span>
            </div>
            
            <div className="text-xl font-medium text-gray-900 mb-4">
              {content[currentStep]}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentStep === totalSteps - 1 ? 'Start Quiz' : 'Next'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}