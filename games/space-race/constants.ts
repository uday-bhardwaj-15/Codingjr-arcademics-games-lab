import { BotConfig } from "./types";

export const STAGE = { w: 1010, h: 577 };

// 1. Speeds & Motion (v1.2)
export const WORLD_SPEED = 100; // px/s, all ships, always
export const STEP_PX = 180; // v1.2: distance advance per step (~1 ship length)
export const CATCH_UP = false; // v1.2: catch-up disabled, plain +1 for everyone
export const HUMAN_NOSE_X = 300; // v1.2: human nose is always drawn at x = 300

export const GATE_ANCHOR_X = 269; // distance anchor reference
export const LANE_CENTER_Y = [107, 222, 336, 452] as const; // 4 lane center y coordinates

// 2. Moon & Orbit Projection (Section 22.1, 23.1)
export const MOON_R = 1600;
export const MOON_CX = 505;
export const MOON_TOP_Y = 500;
export const MOON_CENTER_Y = MOON_TOP_Y + MOON_R; // 2100 px (below screen)
export const SKY_OMEGA_FACTORS = {
  starsFar: 0.06,
  starsNear: 0.18,
  asteroids: 0.55,
  setPieces: 0.8,
} as const;

// 3. Gates, Laps, Track (v1.2)
export const S_START = 350; // ships start 350px behind START gate (flag at x = 650 at GO)
export const LAPS = 3;
export const LAP_LENGTH = 1800; // v1.2
export const S_FINISH = S_START + LAPS * LAP_LENGTH; // 5750 px

// 4. Answer Arrows & Idle Blip (Section 23.7, 23.11)
export const ARROWS_ABOVE_SHIPS = true;
export const ARROW_SPAWN_X = 1030; // initial spawn x
export const ARROW_HOLD_X = 600; // arrows scroll to here, then hold
export const ARROW_SCROLL_SPEED = 110; // px/s screen space scroll
export const ARROW_LIFE_MS = 9000; // timeout since spawn
export const ARROW_Y_OFFSET = -12; // arrow center y = lane center y + ARROW_Y_OFFSET

export const IDLE_HINT_MS = 2000; // v1.2: start blip after 2.0s since spawn
export const BLIP_PERIOD_MS = 1200; // normal blip wave period
export const BLIP_STAGGER_MS = 120; // stagger per lane
export const BLIP_URGENT_MS = 3000; // last 3s before timeout
export const BLIP_URGENT_PERIOD_MS = 600; // urgent blip wave period
export const BLIP_SCALE = 1.14; // v1.2: peak pulse scale

// 5. Steering, Lane Swapping & Ship Dimensions (Chunky Saucer Body)
export const SHIP_W = 210;
export const SHIP_H = 104;
export const HULL_H = 68;
export const NOZZLE = { x: 6, y: 62 } as const;
export const PLATE = { x: 56, y: 56, w: 85, h: 30 } as const;
export const PLATE_FONT_MIN = 18;
export const PLATE_FONT_MAX = 30;

export const STEER_GLIDE_MS_MIN = 200;
export const STEER_GLIDE_MS_MAX = 420;
export const STEER_GLIDE_PER_LANE_MS = 140;
export const STEER_BANK_DEG = 12;
export const OFFSCREEN_MARGIN = 40;

// 6. Timings (v1.2)
export const COUNTDOWN_STEP_MS = 1000;
export const STEP_TWEEN_MS = 500;
export const WRONG_LOCK_MS = 1000;
export const NEXT_QUESTION_DELAY_MS = 400;
export const FINISH_MAX_MS = 12000; // watchdog: FINISHING -> RESULTS at latest 12s after T_f
export const RESULTS_DELAY_MS = 1000; // 1s delay after human crosses
export const DT_CLAMP_MS = 100;
export const MAX_RACE_SECONDS = 180;

// 7. Bot Profiles
export const BOT_ACCURACY = 0.8;
export const BOT_PROFILES: Record<number, BotConfig> = {
  1: {
    accuracy: BOT_ACCURACY,
    meanTimeSec: 7.0,
    sdTimeSec: 1.5,
    minTimeSec: 2.5,
  }, // Computer 2
  2: {
    accuracy: BOT_ACCURACY,
    meanTimeSec: 5.5,
    sdTimeSec: 1.2,
    minTimeSec: 2.2,
  }, // Computer 3
  3: {
    accuracy: BOT_ACCURACY,
    meanTimeSec: 4.5,
    sdTimeSec: 1.0,
    minTimeSec: 2.0,
  }, // Computer 4
};

// 8. Ship & Palette Styles
export interface ShipColorPalette {
  hull: string;
  hullDark: string;
  deck: string;
  wings: string;
  highlight: string;
  glow: string;
}

export const SHIP_PALETTES: Record<string, ShipColorPalette> = {
  blue: {
    hull: "#1f6bff",
    hullDark: "#1244b8",
    deck: "#3b82f6",
    wings: "#1955cc",
    highlight: "#70a4ff",
    glow: "rgba(31, 107, 255, 0.6)",
  },
  yellow: {
    hull: "#f5c400",
    hullDark: "#ba9400",
    deck: "#facc15",
    wings: "#c99f00",
    highlight: "#ffe666",
    glow: "rgba(245, 196, 0, 0.6)",
  },
  red: {
    hull: "#e8321f",
    hullDark: "#aa1f11",
    deck: "#ef4444",
    wings: "#b82314",
    highlight: "#ff7766",
    glow: "rgba(232, 50, 31, 0.6)",
  },
  orange: {
    hull: "#f28a00",
    hullDark: "#b86600",
    deck: "#f97316",
    wings: "#c46f00",
    highlight: "#ffbb55",
    glow: "rgba(242, 138, 0, 0.6)",
  },
  green: {
    hull: "#16a34a",
    hullDark: "#116d32",
    deck: "#22c55e",
    wings: "#127a37",
    highlight: "#6ee7b7",
    glow: "rgba(22, 163, 74, 0.6)",
  },
};
