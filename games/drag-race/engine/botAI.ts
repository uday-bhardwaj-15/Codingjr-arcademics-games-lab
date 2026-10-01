export interface BotConfig {
  name: string;
  accuracy: number;
  minReactionSec: number;
  maxReactionSec: number;
}

export const BOT_AI_CONFIGS: BotConfig[] = [
  {
    name: 'Computer 2',
    accuracy: 0.85,
    minReactionSec: 4.0,
    maxReactionSec: 7.5,
  },
  {
    name: 'Computer 3',
    accuracy: 0.80,
    minReactionSec: 3.5,
    maxReactionSec: 7.0,
  },
  {
    name: 'Computer 4',
    accuracy: 0.90,
    minReactionSec: 4.5,
    maxReactionSec: 8.0,
  },
];

/**
 * Generate a next reaction delay for a bot based on its configuration
 */
export function getBotNextDelayMs(botIndex: number, speedMultiplier = 1): number {
  const cfg = BOT_AI_CONFIGS[botIndex] ?? BOT_AI_CONFIGS[0];
  const range = cfg.maxReactionSec - cfg.minReactionSec;
  const rand = Math.random();
  const rawSec = cfg.minReactionSec + rand * range;
  return (rawSec * 1000) / speedMultiplier;
}

/**
 * Determine if bot answered correctly
 */
export function checkBotAnswer(botIndex: number): boolean {
  const cfg = BOT_AI_CONFIGS[botIndex] ?? BOT_AI_CONFIGS[0];
  return Math.random() < cfg.accuracy;
}
