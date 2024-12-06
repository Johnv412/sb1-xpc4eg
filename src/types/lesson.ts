export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  flashcards?: Flashcard[];
  quiz?: Quiz;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: string;
  nextReview?: string;
  difficulty?: number;
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}