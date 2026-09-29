import { BotConfig } from '../types';
import { BOT_PROFILES } from '../constants';

/**
 * Standard Box-Muller normal distribution sample
 */
export function sampleNormal(
  mean: number,
  sd: number,
  rng: () => number = Math.random
): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * sd;
}

/**
 * Calculates the next reaction delay in ms for a bot.
 */
export function getBotNextDelayMs(
  botIndex: number,
  rng: () => number = Math.random
): number {
  const profile = BOT_PROFILES[botIndex] || BOT_PROFILES[1];
  const sampleSec = sampleNormal(profile.meanTimeSec, profile.sdTimeSec, rng);
  const clampedSec = Math.max(profile.minTimeSec, sampleSec);
  return Math.round(clampedSec * 1000);
}

/**
 * Determines if the bot's upcoming answer is correct based on accuracy profile.
 */
export function isBotAnswerCorrect(
  botIndex: number,
  rng: () => number = Math.random
): boolean {
  const profile = BOT_PROFILES[botIndex] || BOT_PROFILES[1];
  return rng() < profile.accuracy;
}
