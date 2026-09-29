import { WORLD_SPEED, LAUNCH_PX, LAUNCH_MS } from '../constants';
import { COURSE_LENGTH } from './course';

/**
 * Standard cubic ease-out function
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Calculates boat launch surge distance from the start line.
 * t is in seconds since GO.
 */
export function calculateLaunchPx(tSec: number): number {
  if (tSec <= 0) return 0;
  const launchDurationSec = LAUNCH_MS / 1000;
  const frac = Math.min(tSec / launchDurationSec, 1);
  return LAUNCH_PX * easeOutCubic(frac);
}

/**
 * Calculates zero-step reference distance sRef(t) along the course.
 */
export function calculateSRef(tSec: number): number {
  const launchPx = calculateLaunchPx(tSec);
  return WORLD_SPEED * tSec + launchPx;
}

/**
 * Calculates a boat's nose distance along the course.
 */
export function calculateBoatS(tSec: number, tweenedOffsetPx: number): number {
  const sRef = calculateSRef(tSec);
  return sRef + tweenedOffsetPx;
}

/**
 * Sub-frame interpolation of finish line crossing time.
 */
export function interpolateCrossingTime(
  prevS: number,
  currentS: number,
  prevTSec: number,
  currentTSec: number,
  finishDistance: number = COURSE_LENGTH
): number {
  if (currentS <= prevS) return currentTSec;
  const frac = (finishDistance - prevS) / (currentS - prevS);
  const clampedFrac = Math.max(0, Math.min(1, frac));
  return prevTSec + (currentTSec - prevTSec) * clampedFrac;
}
