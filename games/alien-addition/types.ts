export type Speed = 'slow' | 'normal' | 'fast';

export type UfoColor = 'orange' | 'red' | 'green' | 'yellow';

export interface UfoState {
  id: string;
  slot: number;
  a: number;
  b: number;
  isCorrect: boolean;
  color: UfoColor;
  x: number; // design px (fixed column)
  y: number; // design px (descending)
  status: 'flying' | 'gone' | 'exploding' | 'wrong';
  spawn: 'pop' | 'fade';
}

export interface RoundState {
  target: number;
  ufos: UfoState[]; // length 5
}

export interface Missed {
  a: number;
  b: number;
  yourAnswer: number | null; // null = ship landed, not shot
}

export interface GameStats {
  hits: number;
  misses: number;
  secondsLeft: number;
  missed: Missed[];
  stagesCompleted: number;
  isGrandVictory?: boolean;
}

export interface GameOptions {
  from: number;
  to: number;
  speed: Speed;
  soundOn: boolean;
}

export type GamePhase = 'title' | 'name' | 'instructions' | 'options' | 'play' | 'results';

export interface AlienAdditionLeaderboardEntry {
  id: string;
  name: string;
  hits: number;
  misses: number;
  accuracy: number;
  rate: number;
  date: string;
}

