import { MissedQuestionItem } from '../types';

export interface HumanRaceStats {
  accuracy: number; // percentage 0-100
  ratePerMin: number; // rate per minute
  missedQuestions: MissedQuestionItem[];
}

/**
 * Calculates accuracy percentage: round(100 * correct / (correct + wrong))
 */
export function calculateAccuracy(correctCount: number, wrongCount: number): number {
  const total = correctCount + wrongCount;
  if (total <= 0) return 0;
  return Math.round((100 * correctCount) / total);
}

/**
 * Calculates rate per minute: round(correct / (finishTimeSec / 60))
 */
export function calculateRate(correctCount: number, finishTimeSec: number): number {
  if (finishTimeSec <= 0 || correctCount <= 0) return 0;
  const minutes = finishTimeSec / 60;
  return Math.round(correctCount / minutes);
}

/**
 * Formats a missed question entry
 */
export function formatMissedQuestion(
  a: number,
  b: number,
  chosenAnswer: number
): MissedQuestionItem {
  return {
    id: `miss_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    questionText: `${a} − ${b}`,
    correctAnswer: a - b,
    chosenAnswer,
  };
}
