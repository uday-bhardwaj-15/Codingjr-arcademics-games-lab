export type PlayerColor = 'blue' | 'yellow' | 'red' | 'orange';

export type IntegerOperation = 'add' | 'subtract' | 'mixed';
export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface IntegerSettings {
  from: number;
  to: number;
  operation: IntegerOperation;
  speed: GameSpeed;
  soundOn: boolean;
}

export interface QuestionOption {
  id: string;
  value: number;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  a: number;
  b: number;
  op: '+' | '−';
  answer: number;
  prompt: string;
  options: QuestionOption[];
}

export interface PodState {
  id: string;
  playerId: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  isHuman: boolean;
  lane: number; // 0, 1, 2, 3
  logicalS: number;
  displayS: number;
  heading: number;
  correctCount: number;
  wrongCount: number;
  status: 'countdown' | 'racing' | 'sputtering' | 'finished';
  finishedAtMs?: number;
  projectedFinishTimeMs?: number;
  rank?: number;
  currentQuestion: Question | null;
  questionNumber: number;
  missed: Array<{
    prompt: string;
    correctAnswer: number;
    userAnswer: number;
  }>;
}

export interface SplinePoint {
  x: number;
  y: number;
  s: number;
  angle: number;
  nx: number;
  ny: number;
}
