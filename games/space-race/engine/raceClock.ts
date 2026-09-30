import { WORLD_SPEED, HUMAN_NOSE_X, LANE_CENTER_Y, SHIP_W, OFFSCREEN_MARGIN, STAGE } from '../constants';

/**
 * Calculates ship distance s along the track: s_i(t) = v * t + tweenOffset
 */
export function calculateShipS(t: number, tweenOffset: number): number {
  return WORLD_SPEED * t + tweenOffset;
}

/**
 * Calculates screen x position of any world object at distance s relative to camera s_h:
 * worldX(s, s_h) = HUMAN_NOSE_X + (s - s_h)
 */
export function calculateWorldX(s: number, s_h: number): number {
  return HUMAN_NOSE_X + (s - s_h);
}

/**
 * Calculates drawn screen x coordinate of ship i's nose:
 * x_i = HUMAN_NOSE_X + (s_i - s_h)
 * For the human (s_i === s_h), x_i is always exactly HUMAN_NOSE_X (300).
 */
export function calculateShipDrawnX(s_i: number, s_h: number): number {
  return HUMAN_NOSE_X + (s_i - s_h);
}

/**
 * Calculates drawn screen y coordinate of a ship's center for a given lane.
 */
export function calculateShipDrawnY(lane: number): number {
  return LANE_CENTER_Y[lane] ?? LANE_CENTER_Y[0];
}

/**
 * Determines whether a ship is within the visible stage viewport + margin.
 */
export function isShipInFrame(drawnX: number): boolean {
  return drawnX > -SHIP_W - OFFSCREEN_MARGIN && drawnX < STAGE.w + OFFSCREEN_MARGIN;
}

/**
 * Sub-frame linear interpolation for exact finish crossing time.
 */
export function interpolateCrossingTime(
  prevS: number,
  currentS: number,
  prevT: number,
  currentT: number,
  targetS: number
): number {
  if (currentS <= prevS) return currentT;
  const ratio = (targetS - prevS) / (currentS - prevS);
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  return prevT + clampedRatio * (currentT - prevT);
}
