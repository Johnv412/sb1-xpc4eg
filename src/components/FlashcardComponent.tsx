import React, { useState, useEffect } from 'react';
import { Lesson } from '../store/lessonStore';
import { Repeat, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashcardProps {
  lesson: Lesson;
  onClose: () => void;
}

interface Flashcard {
  front: string;
  back: string;
}

export function FlashcardComponent({ lesson, onClose }: FlashcardProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  useEffect(() => {
    const content = lesson.content.split('\n');
    const flashcards = content.map(line => {
      const [term, definition] = line.split('=').map(s => s.trim());
      return {
        front: term,
        back: definition
      };
    });
    setCards(flashcards);
  }, [lesson]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  };

  const handleReset = () => {
    const content = lesson.content.split('\n');
    const flashcards = content.map(line => {
      const [term, definition] = line.split('=').map(s => s.trim());
      return {
        front: term,
        back: definition
      };
    });
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(false);
  };

  if (cards.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Practice: {lesson.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex space-x-4">
              <button
                onClick={handleShuffle}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Repeat className="h-4 w-4 mr-1" />
                {shuffled ? 'Reshuffle' : 'Shuffle'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>

          {/* Flashcard */}
          <div
            onClick={handleFlip}
            className="relative w-full h-64 cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of card */}
              <div
                className={`absolute w-full h-full bg-white rounded-xl shadow-md p-8 flex items-center justify-center backface-hidden ${
                  isFlipped ? 'hidden' : ''
                }`}
              >
                <p className="text-2xl font-medium text-gray-900 text-center">
                  {cards[currentIndex].front}
                </p>
              </div>

              {/* Back of card */}
              <div
                className={`absolute w-full h-full bg-indigo-50 rounded-xl shadow-md p-8 flex items-center justify-center backface-hidden rotate-y-180 ${
                  isFlipped ? '' : 'hidden'
                }`}
              >
                <p className="text-2xl font-medium text-indigo-900 text-center">
                  {cards[currentIndex].back}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}