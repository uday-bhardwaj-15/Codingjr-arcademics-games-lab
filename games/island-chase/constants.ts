import { BotConfig, JetSkiColorPalette } from './types';

export const STAGE = { w: 1010, h: 577 };

// 1. Speeds & Motion
export const WORLD_SPEED = 90; // px/s, constant for all boats, always
export const STEP_PX = 20; // distance advance per step
export const MAX_STEPS = 20; // max lead cap = 400 px
export const ANCHOR_X = 173; // screen x of zero-step boat's nose before launch
export const ANCHOR_Y = 215; // screen y center anchor
export const LANE_LATERAL = [-96, -32, 32, 96] as const; // screen lane centres y = 119, 183, 247, 311

export const LAUNCH_PX = 240; // boats pull forward from start line by 240px
export const LAUNCH_MS = 2000; // over 2.0s with ease-out cubic
export const CHANNEL_HALF_WIDTH = 175;
export const CAM_SMOOTH_PX = 100; // smoothing window for camera heading (±100px)
export const FINISH_CUE_DISTANCE = 1500; // show "FINISH →" cue when finish line is within 1500px

export const SAFE_Y: [number, number] = [45, 385];
export const SAFE_X: [number, number] = [140, 960];

export const COUNTDOWN_STEP_MS = 1000;
export const STEP_TWEEN_MS = 550;
export const CATCHUP_BASE_MS = 350;
export const CATCHUP_PER_STEP_MS = 90;
export const CATCHUP_MAX_MS = 1000;
export const WRONG_LOCK_MS = 1000;
export const NEXT_QUESTION_DELAY_MS = 350; // after correct answer green flash
export const FINISH_MAX_MS = 6000; // watchdog: FINISHING -> RESULTS at latest 6.0s after first crossing
export const RESULTS_DELAY_MS = 1000; // hold 1.0s after all boats cross so player sees their own finish
export const MAX_RACE_SECONDS = 180;
export const DT_CLAMP_MS = 100;

// 2. Course Definition (Section 6.2)
export const COURSE_SEGMENTS = [
  { type: 'straight', length: 500 }, // start straight (start line at s = 0)
  { type: 'arc', dir: 'right', angleDeg: 90, radius: 1100 }, // turn 1 (right, heading east -> south)
  { type: 'straight', length: 250 },
  { type: 'arc', dir: 'left', angleDeg: 90, radius: 1100 }, // turn 2 (left, heading south -> east)
  { type: 'straight', length: 1000 }, // finish straight (finish line at its end)
] as const;

export const RUNWAY_BEFORE = 500; // straight extension before s = 0 (for drawing behind start line)
export const RUNWAY_AFTER = 700; // straight extension after finish (beach + coasting)

// 3. Bot Profiles (Section 8)
export const BOT_PROFILES: Record<number, BotConfig> = {
  1: { accuracy: 0.65, meanTimeSec: 6.5, sdTimeSec: 1.5, minTimeSec: 2.5 }, // Computer 2
  2: { accuracy: 0.80, meanTimeSec: 5.0, sdTimeSec: 1.2, minTimeSec: 2.0 }, // Computer 3
  3: { accuracy: 0.90, meanTimeSec: 4.0, sdTimeSec: 1.0, minTimeSec: 1.8 }, // Computer 4
};

// 4. Color Palettes for Boats and Avatars
export const COLOR_PALETTES: Record<string, JetSkiColorPalette> = {
  blue: {
    hull: '#2563eb',
    hullDark: '#1d4ed8',
    deck: '#60a5fa',
    seat: '#451a03',
    highlight: '#93c5fd',
  },
  yellow: {
    hull: '#eab308',
    hullDark: '#ca8a04',
    deck: '#fde047',
    seat: '#451a03',
    highlight: '#fef08a',
  },
  red: {
    hull: '#dc2626',
    hullDark: '#b91c1c',
    deck: '#f87171',
    seat: '#451a03',
    highlight: '#fca5a5',
  },
  orange: {
    hull: '#ea580c',
    hullDark: '#c2410c',
    deck: '#fb923c',
    seat: '#451a03',
    highlight: '#fed7aa',
  },
  green: {
    hull: '#16a34a',
    hullDark: '#15803d',
    deck: '#4ade80',
    seat: '#451a03',
    highlight: '#bbf7d0',
  },
};
