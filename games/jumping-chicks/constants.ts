import { PlayerColor } from '@/core/types/player';

export const GAME_ID = 'jumping-chicks';
export const DEFAULT_ROUNDS_TO_WIN = 10;
export const DEFAULT_NUMBER_RANGE: [number, number] = [1, 10];
export const NUM_PLATFORMS = 4;

// 70% success / 30% fail opponent AI calibrated for 3rd-grade students
export const BOT_AI_CONFIG = {
  accuracy: 0.70, // 70% success, 30% fail
  minReactionMs: 2600,
  maxReactionMs: 4600,
};

export const CHICK_COLORS: Record<
  PlayerColor,
  {
    primary: string;
    secondary: string;
    belly: string;
    beak: string;
    feet: string;
    comb: string;
    shadow: string;
  }
> = {
  blue: {
    primary: '#0066ff',
    secondary: '#3399ff',
    belly: '#e0f2fe',
    beak: '#ff9900',
    feet: '#e67300',
    comb: '#0055ee',
    shadow: 'rgba(0, 102, 255, 0.3)'
  },
  yellow: {
    primary: '#ffcc00',
    secondary: '#ffe066',
    belly: '#fef3c7',
    beak: '#ff7700',
    feet: '#cc5500',
    comb: '#e6b800',
    shadow: 'rgba(255, 204, 0, 0.3)'
  },
  red: {
    primary: '#ee2211',
    secondary: '#ff5544',
    belly: '#fee2e2',
    beak: '#ff9900',
    feet: '#c2410c',
    comb: '#cc1800',
    shadow: 'rgba(238, 34, 17, 0.3)'
  },
  orange: {
    primary: '#ff7700',
    secondary: '#ff9933',
    belly: '#ffedd5',
    beak: '#cc4400',
    feet: '#993300',
    comb: '#e66000',
    shadow: 'rgba(255, 119, 0, 0.3)'
  }
};
