export type PlayerColor = 'blue' | 'yellow' | 'red' | 'orange' | string;

export type RacePhase = 'countdown' | 'racing' | 'finishing' | 'results';

export interface MultiplicationQuestion {
  id: string;
  a: number;
  b: number;
  answer: number;
  options: number[]; // 4 options for 4 lanes
  correctLaneIndex: number; // 0 to 3
}

export interface AnswerArrowItem {
  id: string;
  lane: number; // 0 to 3
  value: number;
  isCorrect: boolean;
  x: number; // screen x position of arrow tip (holds at 600)
  y: number; // screen y position
  status: 'normal' | 'selected_correct' | 'selected_wrong' | 'expired';
  blipScale: number; // 1.0 to 1.10
  isUrgent: boolean;
}

export interface AnswerArrowSet {
  id: string;
  question: MultiplicationQuestion;
  spawnTimeSec: number;
  arrows: AnswerArrowItem[];
  isResolved: boolean;
  holdReachedTimeSec: number | null;
}

export interface ShipState {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  lane: number; // 0 to 3 (home lane)
  pos: number; // 0 to MAX_STEPS (step index)
  tweenOffset: number; // pixel lead offset (0 to pos * STEP_PX)
  s: number; // distance along track in px (s = v*t + tweenOffset)
  drawnX: number; // screen x of ship nose
  drawnY: number; // screen y of ship center (steered during lane change)
  bankDeg: number; // banking angle during vertical steering (±12 deg)
  reachedAt: number; // timestamp when pos changed
  correctCount: number;
  wrongCount: number;
  timeoutCount: number;
  crossedAt: number | null; // time in seconds since GO when nose crossed S_FINISH
  isLocked: boolean; // wrong answer lock
  shakeUntil: number; // timestamp for ship shake effect
  streak: number;
  lap: number; // 0 (before start gate), 1, 2, 3
  ringProgress: number; // 0.0 to 1.0 around the current lap
}

export interface BotConfig {
  accuracy: number;
  meanTimeSec: number;
  sdTimeSec: number;
  minTimeSec: number;
}

export interface GateInfo {
  id: string;
  label: 'START' | 'LAP 2' | 'LAP 3' | 'FINISH';
  s: number;
  lapIndex: number;
  phi0: number; // angle on moon surface at t=0
}

export interface MissedQuestionItem {
  id: string;
  questionText: string;
  correctAnswer: number;
  chosenAnswer: number | string; // number or "—" for timeout
}

export interface CompetitionResultItem {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  lane: number;
  finishTimeSec: number;
  finishTimeFormatted: string;
  rank: number; // 1, 2, 3, 4 with shared ranks (1, 1, 1, 4)
  placeText: string; // "1st", "2nd", "3rd", "4th"
  correctCount: number;
  wrongCount: number;
}

export interface StarItem {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

export interface AsteroidItem {
  id: string;
  radius: number; // distance from moon center C
  angle0: number; // initial polar angle in rad
  size: number;
  rotationSpeed: number;
  color: string;
}

export interface PlanetItem {
  id: string;
  radius: number;
  angle0: number;
  size: number;
  color: string;
}

export interface MoonCraterItem {
  id: string;
  phi0: number;
  rx: number;
  ry: number;
}

export interface MoonRockItem {
  id: string;
  phi0: number;
  size: number;
  color: string;
}

export interface MoonCrystalItem {
  id: string;
  phi0: number;
  color: string;
}
