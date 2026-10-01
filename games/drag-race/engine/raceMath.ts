import { clamp, roadHalf, LANE_FRAC, VANISH_X, HORIZON_Y, BOTTOM_Y } from './worldMath';
import { RacerProgress } from '../types';

export const STEPS_TO_FINISH = 10;
export const WRONG_LOCK_MS = 1500;
export const BASE_PLAYER_Y = 235;

export interface CarPlacement {
  x: number;
  y: number;
  p: number;
  scale: number;
  gap: number; // positive = ahead, negative = behind
  opacity: number; // 1.0 when near, fading down when far ahead, 0 when fallen behind
}

/**
 * Calculate instantaneous 3D perspective position, scale and opacity based on step gap.
 * When the human player is ahead, cars that are behind fall off and disappear (opacity: 0).
 * Opponents must answer correctly to catch back up onto the screen.
 */
export function calculateCarPosition(
  lane: number,
  theirSteps: number,
  yourSteps: number,
  isPlayer: boolean
): CarPlacement {
  const gap = theirSteps - yourSteps;

  if (isPlayer) {
    const y = BASE_PLAYER_Y;
    const p = (y - HORIZON_Y) / (BOTTOM_Y - HORIZON_Y);
    const laneFrac = LANE_FRAC[clamp(lane, 0, 3)] ?? 0;
    const x = VANISH_X + laneFrac * roadHalf(p);
    return {
      x,
      y,
      p,
      scale: 1.0,
      gap: 0,
      opacity: 1.0,
    };
  }

  // If opponent is 2 or more steps behind, they fall completely off the player's screen
  if (gap <= -2) {
    const y = 350;
    const p = (y - HORIZON_Y) / (BOTTOM_Y - HORIZON_Y);
    const laneFrac = LANE_FRAC[clamp(lane, 0, 3)] ?? 0;
    const x = VANISH_X + laneFrac * roadHalf(p);
    return {
      x,
      y,
      p,
      scale: 1.15,
      gap,
      opacity: 0, // Gone from screen!
    };
  }

  let y = BASE_PLAYER_Y;
  let opacity = 1.0;

  if (gap > 0) {
    // Ahead: smooth depth progression towards horizon (y = 235 -> 138)
    const g = clamp(gap, 0, 10);
    y = BASE_PLAYER_Y - (g / 10) * 97;
    opacity = clamp(1.0 - gap * 0.055, 0.45, 1.0);
  } else if (gap === -1) {
    // 1 step behind: lower on screen and semi-transparent
    y = 278;
    opacity = 0.45;
  }

  const p = (y - HORIZON_Y) / (BOTTOM_Y - HORIZON_Y);
  const playerP = (BASE_PLAYER_Y - HORIZON_Y) / (BOTTOM_Y - HORIZON_Y);
  const scale = clamp(p / playerP, 0.36, 1.15);

  const laneFrac = LANE_FRAC[clamp(lane, 0, 3)] ?? 0;
  const x = VANISH_X + laneFrac * roadHalf(p);

  return {
    x,
    y,
    p,
    scale,
    gap,
    opacity,
  };
}

/**
 * Rank racers by fastest finish time, ties broken by fewer wrong answers
 */
export function rankRacers(racers: RacerProgress[]): RacerProgress[] {
  const sorted = [...racers].sort((a, b) => {
    // Finished cars always beat unfinished cars
    if (a.finished && !b.finished) return -1;
    if (!a.finished && b.finished) return 1;

    // Both finished: rank by fastest finishTimeMs
    if (a.finished && b.finished) {
      const timeA = a.finishTimeMs ?? Infinity;
      const timeB = b.finishTimeMs ?? Infinity;
      if (Math.abs(timeA - timeB) > 10) {
        return timeA - timeB;
      }
      // Tie breaker: fewer incorrect answers
      return a.incorrectCount - b.incorrectCount;
    }

    // Neither finished: rank by most steps (correctCount), ties by fewer incorrect
    if (a.correctCount !== b.correctCount) {
      return b.correctCount - a.correctCount;
    }
    return a.incorrectCount - b.incorrectCount;
  });

  return sorted.map((r, index) => ({
    ...r,
    rank: index + 1,
  }));
}
