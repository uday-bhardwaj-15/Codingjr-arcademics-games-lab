import { GameOptions, Speed, UfoColor } from "./types";
import { COLUMNS_X, STAGGER, SPAWN_Y, STEP } from "./engine/ufoMotion";

export const UFO_COUNT = 5;
export const FIRE_COOLDOWN_MS = 250;

export { STEP };

export interface StageConfig {
  stage: number;
  seconds: number;
  label: string;
}

// 6 Stages with decreasing time: 60s -> 50s -> 40s -> 30s -> 20s -> 10s
export const STAGES: StageConfig[] = [
  { stage: 1, seconds: 60, label: "Stage 1" },
  { stage: 2, seconds: 50, label: "Stage 2" },
  { stage: 3, seconds: 40, label: "Stage 3" },
  { stage: 4, seconds: 30, label: "Stage 4" },
  { stage: 5, seconds: 20, label: "Stage 5" },
  { stage: 6, seconds: 10, label: "Stage 6 (Final)" },
];

export const TOTAL_STAGES = STAGES.length;
export const ROUND_SECONDS = STAGES[0].seconds;

export const DEFAULT_OPTIONS: GameOptions = {
  from: 1,
  to: 12,
  speed: "normal",
  soundOn: true,
};

export const SLOT_COLORS: UfoColor[] = [
  "orange",
  "red",
  "green",
  "yellow",
  "red",
];

export interface UfoSlotConfig {
  slot: number;
  x: number; // design px (fixed column)
  y: number; // design px (initial staggered y)
  color: UfoColor;
}

export const UFO_SLOTS: UfoSlotConfig[] = COLUMNS_X.map((colX, idx) => ({
  slot: idx,
  x: colX,
  y: SPAWN_Y + (STAGGER[idx] || 0),
  color: SLOT_COLORS[idx % SLOT_COLORS.length],
}));
