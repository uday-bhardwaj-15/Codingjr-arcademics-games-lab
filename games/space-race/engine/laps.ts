import { S_START, LAP_LENGTH, S_FINISH, HUMAN_NOSE_X, MOON_CX, MOON_R } from '../constants';
import { GateInfo } from '../types';

/**
 * Calculates surface polar angle phi0(s) on the moon: (s + HUMAN_NOSE_X - MOON_CX) / MOON_R
 */
export function calculateSurfacePhi(s: number): number {
  return (s + (HUMAN_NOSE_X - MOON_CX)) / MOON_R;
}

export const GATES: GateInfo[] = [
  { id: 'gate_start', label: 'START', s: S_START, lapIndex: 1, phi0: calculateSurfacePhi(S_START) },
  { id: 'gate_lap2', label: 'LAP 2', s: S_START + LAP_LENGTH, lapIndex: 2, phi0: calculateSurfacePhi(S_START + LAP_LENGTH) },
  { id: 'gate_lap3', label: 'LAP 3', s: S_START + 2 * LAP_LENGTH, lapIndex: 3, phi0: calculateSurfacePhi(S_START + 2 * LAP_LENGTH) },
  { id: 'gate_finish', label: 'FINISH', s: S_FINISH, lapIndex: 3, phi0: calculateSurfacePhi(S_FINISH) },
];

/**
 * Calculates current lap index (0, 1, 2, 3) for a ship at distance s.
 */
export function getShipLap(s: number): number {
  if (s < S_START) return 0;
  if (s < S_START + LAP_LENGTH) return 1;
  if (s < S_START + 2 * LAP_LENGTH) return 2;
  return 3;
}

/**
 * Calculates clockwise progress [0..1] around the current lap on the Lap Ring.
 */
export function getRingProgress(s: number): number {
  if (s < S_START) return 0;
  if (s >= S_FINISH) return 1;

  const currentLap = getShipLap(s);
  const lapStartS = S_START + (currentLap - 1) * LAP_LENGTH;
  const progress = (s - lapStartS) / LAP_LENGTH;

  return Math.max(0, Math.min(1, progress));
}
