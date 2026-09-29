export interface JetSkiColorPalette {
  hull: string;
  hullDark: string;
  deck: string;
  seat: string;
  highlight: string;
}

export type PlayerColor = 'blue' | 'yellow' | 'red' | 'orange' | string;

export interface WorldPoint {
  x: number;
  y: number;
}

export interface ScreenPose {
  x: number;
  y: number;
  yawRad: number;
  yawDeg: number;
}

export interface CourseSample {
  s: number;
  x: number;
  y: number;
  headingRad: number;
}

export interface CourseBBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface RacerState {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  lane: number; // 0 to 3 (LANE_LATERAL indices)
  pos: number; // 0 to MAX_STEPS (integer step index)
  tweenOffset: number; // tweened pixel lead offset (0 to pos * STEP_PX)
  s: number; // distance along course in px
  reachedAt: number; // timestamp when current pos was reached
  correctCount: number;
  wrongCount: number;
  finishTimeMs: number;
  crossedAt: number | null; // time in seconds since GO when boat nose crossed COURSE_LENGTH
  isLocked: boolean; // 1s wrong lock
  wobbleUntil: number; // timestamp for wrong wobble
  pose: ScreenPose; // computed 2D screen coordinate & yaw angle
  question: SubtractionQuestion | null;
  questionIndex: number;
  streak: number;
}

export interface SubtractionQuestion {
  id: string;
  a: number;
  b: number;
  answer: number;
  options: number[];
  correctIndex: number;
}

export interface BotConfig {
  accuracy: number;
  meanTimeSec: number;
  sdTimeSec: number;
  minTimeSec: number;
}

export type RacePhase = 'countdown' | 'racing' | 'finishing' | 'results';

export interface MissedQuestionItem {
  id: string;
  questionText: string;
  correctAnswer: number;
  chosenAnswer: number;
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

export interface SceneryFeature {
  id: string;
  type: 'island_turn' | 'islet' | 'shore_strip' | 'palm_cluster';
  worldX: number;
  worldY: number;
  radius: number;
  color?: string;
  s: number;
}
