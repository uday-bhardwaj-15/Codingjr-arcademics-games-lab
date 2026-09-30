export type PlayerColor = 'blue' | 'yellow' | 'red' | 'orange' | 'purple' | 'pink';

export interface DivisionQuestion {
  id: string;
  dividend: number;
  divisor: number;
  quotient: number;
  prompt: string;
  options: number[];
  correctIndex: number;
}

export interface RacerProgress {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  lane: number; // 0, 1, 2, 3
  progress: number; // 0.0 to 1.0
  currentQuestionIndex: number;
  correctCount: number;
  incorrectCount: number;
  finished: boolean;
  finishTimeMs?: number;
  speed: number;
  rank?: number;
}

export interface RaceRoundResult {
  questionNumber: number;
  prompt: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTakenMs: number;
}
