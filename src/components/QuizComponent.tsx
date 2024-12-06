import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Lesson } from '../store/lessonStore';

interface QuizComponentProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuizComponent({ lesson, onComplete, onClose }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuestions = (lesson: Lesson): Question[] => {
    const content = lesson.content.split('\n');
    return content.map(line => {
      const [term, definition] = line.split('=').map(s => s.trim());
      return {
        question: `What is the translation of "${term}"?`,
        options: [
          definition,
          ...content
            .filter(l => l !== line)
            .map(l => l.split('=')[1].trim())
            .slice(0, 3)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: definition
      };
    });
  };

  const questions = generateQuestions(lesson);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quiz: {lesson.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  Score: {score}/{currentQuestion}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-lg border ${
                      selectedAnswer === option
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                {score >= questions.length * 0.7 ? (
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="mx-auto h-12 w-12 text-red-500" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-gray-600">
                You scored {score} out of {questions.length}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {score >= questions.length * 0.7
                  ? "Great job! You've mastered this lesson!"
                  : "Keep practicing to improve your score!"}
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
}