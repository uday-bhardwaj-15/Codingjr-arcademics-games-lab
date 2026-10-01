// 3D Endless Runner Projection Math
// Exact parameters from Section 3.1 & Section 4

export const HORIZON_Y = 105;
export const BOTTOM_Y = 577;
export const VANISH_X = 505;

export const Z_NEAR = 1;
export const Z_FAR = 40;
export const WORLD_SPEED = 12; // world units per second (travels Z_FAR to Z_NEAR in ~3.3s)
export const BIOME_LENGTH = 400; // world units per biome

// 4 Racing Lanes convergence fractions relative to half-road width
export const LANE_FRAC = [-0.62, -0.21, 0.21, 0.62] as const;

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * 3D perspective projection factor p and screen Y coordinate for a given world depth Z
 */
export function project(z: number): { p: number; y: number } {
  const safeZ = Math.max(0.1, z);
  const p = Z_NEAR / safeZ; // ~0 at horizon, 1 at camera
  const y = HORIZON_Y + (BOTTOM_Y - HORIZON_Y) * p;
  return { p, y };
}

/**
 * Given a screen Y coordinate, reverse calculate projection factor p
 */
export function pFromY(y: number): { p: number; z: number } {
  const p = (y - HORIZON_Y) / (BOTTOM_Y - HORIZON_Y);
  const z = Z_NEAR / Math.max(0.001, p);
  return { p, z };
}

/**
 * Stylised half road width at projection factor p
 */
export function roadHalf(p: number): number {
  return 70 + 1310 * p;
}

/**
 * Calculate screen X coordinate for scenery sitting relative to the road edge
 * @param side -1 for left side, +1 for right side
 * @param offset pixel clearance offset away from road edge
 * @param p projection factor (0 at horizon, 1 at camera)
 */
export function roadSideX(side: -1 | 1, offset: number, p: number): number {
  return VANISH_X + side * (roadHalf(p) + offset * p);
}

/**
 * Calculate screen X coordinate for a racer in a specific lane
 */
export function laneX(lane: number, p: number): number {
  const frac = LANE_FRAC[clamp(lane, 0, 3)] ?? 0;
  return VANISH_X + frac * roadHalf(p);
}
