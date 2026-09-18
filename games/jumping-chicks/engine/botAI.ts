import { RoundState } from '../types';
import { BotConfig } from '@/core/types/player';
import { randomInt, sampleOne } from '@/core/utils/random';
import { BOT_AI_CONFIG } from '../constants';

export interface BotDecision {
  reactionDelayMs: number;
  chosenPlatformIndex: number;
  isCorrect: boolean;
}

/**
 * Computes an independent decision for an opponent bird:
 * Exactly 70% success (picks correct platform, advances one step),
 * 30% fail (picks wrong platform, does not advance, plays miss reaction).
 */
export function computeBotDecision(
  round: RoundState,
  botConfig?: BotConfig
): BotDecision {
  const minReaction = botConfig?.reactionMsRange?.[0] ?? BOT_AI_CONFIG.minReactionMs;
  const maxReaction = botConfig?.reactionMsRange?.[1] ?? BOT_AI_CONFIG.maxReactionMs;
  const accuracy = botConfig?.accuracy ?? BOT_AI_CONFIG.accuracy; // 70%

  const reactionDelayMs = randomInt(minReaction, maxReaction);
  // Independent per-turn 70% success roll
  const isSuccessRoll = Math.random() < accuracy;

  const correctIndex = round.options.findIndex((o) => o.isCorrect);
  const wrongIndices = round.options
    .map((o, idx) => (!o.isCorrect ? idx : -1))
    .filter((idx) => idx !== -1);

  let chosenPlatformIndex: number;

  if (isSuccessRoll && correctIndex !== -1) {
    chosenPlatformIndex = correctIndex;
  } else {
    chosenPlatformIndex = wrongIndices.length > 0 ? sampleOne(wrongIndices) : (correctIndex !== -1 ? correctIndex : 0);
  }

  const isActuallyCorrect = chosenPlatformIndex === correctIndex;

  return {
    reactionDelayMs,
    chosenPlatformIndex,
    isCorrect: isActuallyCorrect,
  };
}
