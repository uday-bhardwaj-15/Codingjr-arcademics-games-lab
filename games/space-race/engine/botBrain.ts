import { BOT_PROFILES } from '../constants';

/**
 * Standard Box-Muller transform for normal distribution sampling
 */
export function sampleNormal(mean: number, sd: number, rng: () => number = Math.random): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + num * sd;
}

/**
 * Calculates bot next answer delay in milliseconds
 */
export function getBotNextDelayMs(botIdx: number, rng: () => number = Math.random): number {
  const profile = BOT_PROFILES[botIdx] || BOT_PROFILES[1];
  const sampledSec = sampleNormal(profile.meanTimeSec, profile.sdTimeSec, rng);
  const clampedSec = Math.max(profile.minTimeSec, sampledSec);
  return Math.round(clampedSec * 1000);
}

/**
 * Determines whether bot answer is correct
 */
export function isBotAnswerCorrect(botIdx: number, rng: () => number = Math.random): boolean {
  const profile = BOT_PROFILES[botIdx] || BOT_PROFILES[1];
  return rng() < profile.accuracy;
}
