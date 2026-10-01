import { PlayerColor, GameSpeed, IntegerSettings } from './types';

export const STEPS_TO_FINISH = 15;
export const STEP_PX = 200;
export const COURSE_LENGTH = STEPS_TO_FINISH * STEP_PX; // 3000 px

export const DRIFT_PX_PER_S: Record<GameSpeed, number> = {
  slow: 14,
  normal: 20,
  fast: 28,
};

export const SPEED_REACTION_MULTIPLIERS: Record<GameSpeed, number> = {
  slow: 1.3,
  normal: 1.0,
  fast: 0.75,
};

export const WRONG_LOCK_MS = 1500;

export const LANE_OFFSETS = [-114, -38, 38, 114]; // px normal offset along course (generous clearance to prevent any overlap)

export const DEFAULT_SETTINGS: IntegerSettings = {
  from: -10,
  to: 10,
  operation: 'mixed',
  speed: 'normal',
  soundOn: true,
};

export const BOT_CONFIGS = [
  { name: 'Computer 2', color: 'yellow' as PlayerColor, accuracy: 0.85, reactionRange: [4000, 7500] as [number, number] },
  { name: 'Computer 3', color: 'red' as PlayerColor, accuracy: 0.80, reactionRange: [3500, 7000] as [number, number] },
  { name: 'Computer 4', color: 'orange' as PlayerColor, accuracy: 0.90, reactionRange: [4500, 8000] as [number, number] },
];

export const POD_COLORS: Record<
  PlayerColor,
  {
    primary: string;
    secondary: string;
    highlight: string;
    dark: string;
    stripe: string;
    glow: string;
  }
> = {
  blue: {
    primary: '#1f6fe0',
    secondary: '#124ab8',
    highlight: '#60a5fa',
    dark: '#0a2a6e',
    stripe: '#93c5fd',
    glow: '#38bdf8',
  },
  yellow: {
    primary: '#ffd91a',
    secondary: '#d9a806',
    highlight: '#fef08a',
    dark: '#855802',
    stripe: '#ffffff',
    glow: '#facc15',
  },
  red: {
    primary: '#e0301e',
    secondary: '#a81c0e',
    highlight: '#fca5a5',
    dark: '#6e1008',
    stripe: '#fecaca',
    glow: '#ef4444',
  },
  orange: {
    primary: '#f5911b',
    secondary: '#c26909',
    highlight: '#fed7aa',
    dark: '#7c3a02',
    stripe: '#ffffff',
    glow: '#fb923c',
  },
};
