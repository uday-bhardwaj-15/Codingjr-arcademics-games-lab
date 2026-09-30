import { PlayerColor } from './types';

export const TOTAL_QUESTIONS = 10;

export const CAR_COLORS: Record<
  PlayerColor,
  {
    primary: string;
    secondary: string;
    spoiler: string;
    dark: string;
    highlight: string;
    accent: string;
  }
> = {
  blue: {
    primary: '#1877f2',
    secondary: '#0c5ec7',
    spoiler: '#3b82f6',
    dark: '#0a3d82',
    highlight: '#60a5fa',
    accent: '#93c5fd',
  },
  yellow: {
    primary: '#f59e0b',
    secondary: '#d97706',
    spoiler: '#fbbf24',
    dark: '#92400e',
    highlight: '#fde68a',
    accent: '#fef08a',
  },
  red: {
    primary: '#ef4444',
    secondary: '#dc2626',
    spoiler: '#f87171',
    dark: '#991b1b',
    highlight: '#fca5a5',
    accent: '#fecaca',
  },
  orange: {
    primary: '#f97316',
    secondary: '#ea580c',
    spoiler: '#fb923c',
    dark: '#9a3412',
    highlight: '#fdba74',
    accent: '#fed7aa',
  },
  purple: {
    primary: '#9333ea',
    secondary: '#7e22ce',
    spoiler: '#a855f7',
    dark: '#581c87',
    highlight: '#d8b4fe',
    accent: '#e9d5ff',
  },
  pink: {
    primary: '#ec4899',
    secondary: '#db2777',
    spoiler: '#f472b6',
    dark: '#9d174d',
    highlight: '#fbcfe8',
    accent: '#fce7f3',
  },
};

export const LANE_X_PERCENTAGES = [18, 38, 62, 82]; // 4 lanes on perspective road
export const DEFAULT_BOT_NAMES = ['Computer 2', 'Computer 3', 'Computer 4'];
export const BOT_COLORS: PlayerColor[] = ['yellow', 'red', 'orange'];
