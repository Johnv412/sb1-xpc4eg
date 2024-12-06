// Spaced repetition intervals in days
const intervals = [1, 3, 7, 14, 30, 90, 180];

export function calculateNextReview(currentInterval: number, success: boolean): number {
  const currentIndex = intervals.indexOf(currentInterval);
  
  if (success) {
    // Move to next interval if successful
    return intervals[Math.min(currentIndex + 1, intervals.length - 1)];
  } else {
    // Move back to previous interval if failed
    return intervals[Math.max(currentIndex - 1, 0)];
  }
}

export function getDueFlashcards(flashcards: Array<{ nextReview?: string }>) {
  const now = new Date();
  return flashcards.filter(card => {
    if (!card.nextReview) return true;
    return new Date(card.nextReview) <= now;
  });
}

export function updateFlashcardProgress(
  flashcard: { difficulty?: number; lastReviewed?: string; nextReview?: string },
  success: boolean
) {
  const now = new Date();
  const currentInterval = flashcard.difficulty || intervals[0];
  const nextInterval = calculateNextReview(currentInterval, success);
  
  const nextReview = new Date();
  nextReview.setDate(now.getDate() + nextInterval);
  
  return {
    ...flashcard,
    difficulty: nextInterval,
    lastReviewed: now.toISOString(),
    nextReview: nextReview.toISOString()
  };
}