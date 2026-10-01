export type WordCategory = 'antonyms' | 'synonyms' | 'homophones' | 'mixed';
export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface AntonymPair {
  prompt: string;
  answer: string;
  category?: string;
  distractors?: string[];
}

export interface OptionFly {
  id: string;
  word: string;
  isCorrect: boolean;
  positionIndex: number; // 0 to 5 (6 flies)
}

export interface Question {
  prompt: string;
  answer: string;
  categoryLabel: string;
  options: OptionFly[];
}

export interface WordFrogSettings {
  category: WordCategory;
  speed: GameSpeed;
  durationSeconds: number; // 60, 90, 120, or 0 (practice)
  soundOn: boolean;
}

export interface MissedWordRecord {
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
  category: string;
}

export interface GameSummary {
  hits: number;
  misses: number;
  totalAnswered: number;
  accuracy: number;
  wordsPerMinute: number;
  durationSeconds: number;
  missed: MissedWordRecord[];
}
