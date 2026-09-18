'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayerProfile } from '@/core/types/player';
import { PlayerRunState } from '../types';
import { generateRound } from '../engine/roundGenerator';
import { computeBotDecision } from '../engine/botAI';

interface UseBotRunnerProps {
  bots: PlayerProfile[];
  targetRounds: number;
  numberRange?: [number, number];
  isActive: boolean;
  onBotFinish: (botId: string, correct: number, wrong: number) => void;
}

export function useBotRunner({
  bots,
  targetRounds,
  numberRange = [1, 10],
  isActive,
  onBotFinish,
}: UseBotRunnerProps) {
  const [botStates, setBotStates] = useState<PlayerRunState[]>(() =>
    bots.map((bot) => ({
      playerId: bot.id,
      name: bot.name,
      isBot: true,
      color: bot.color,
      currentRound: generateRound(numberRange),
      correctCount: 0,
      wrongCount: 0,
      status: 'idle',
      currentPlatformIndex: null,
      targetPlatformIndex: undefined,
    }))
  );

  const botStatesRef = useRef<PlayerRunState[]>(botStates);
  botStatesRef.current = botStates;

  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const scheduleBotStep = (botIndex: number) => {
    const currentBot = botStatesRef.current[botIndex];
    // If finished or exceeded target, do not schedule further turns (despawned/docked)
    if (!currentBot || currentBot.status === 'finished' || currentBot.correctCount >= targetRounds) {
      return;
    }

    const botProfile = bots[botIndex];
    // 70% success / 30% fail per-turn roll
    const decision = computeBotDecision(currentBot.currentRound, botProfile?.botConfig);

    const timeout = setTimeout(() => {
      const liveBot = botStatesRef.current[botIndex];
      if (!liveBot || liveBot.status === 'finished') return;

      if (decision.isCorrect) {
        const nextCorrect = liveBot.correctCount + 1;
        const isNowFinished = nextCorrect >= targetRounds;

        // Jump state
        setBotStates((prev) =>
          prev.map((b, idx) =>
            idx === botIndex
              ? {
                  ...b,
                  status: isNowFinished ? 'finished' : 'jumping',
                  targetPlatformIndex: decision.chosenPlatformIndex,
                  correctCount: nextCorrect,
                  finishedAtMs: isNowFinished ? Date.now() : undefined,
                }
              : b
          )
        );

        if (isNowFinished) {
          onBotFinish(liveBot.playerId, nextCorrect, liveBot.wrongCount);
        } else {
          const afterJumpTimeout = setTimeout(() => {
            const nextRound = generateRound(numberRange, liveBot.currentRound.targetNumber);
            setBotStates((prev) =>
              prev.map((b, idx) =>
                idx === botIndex
                  ? {
                      ...b,
                      status: 'idle',
                      currentPlatformIndex: decision.chosenPlatformIndex,
                      targetPlatformIndex: undefined,
                      currentRound: nextRound,
                    }
                  : b
              )
            );
            scheduleBotStep(botIndex);
          }, 450);

          timeoutsRef.current.set(`${liveBot.playerId}_jump`, afterJumpTimeout);
        }
      } else {
        // 30% fail -> brief miss reaction, does not advance
        const nextWrong = liveBot.wrongCount + 1;
        setBotStates((prev) =>
          prev.map((b, idx) =>
            idx === botIndex
              ? {
                  ...b,
                  status: 'falling',
                  targetPlatformIndex: decision.chosenPlatformIndex,
                  wrongCount: nextWrong,
                }
              : b
          )
        );

        const respawnTimeout = setTimeout(() => {
          const nextRound = generateRound(numberRange, liveBot.currentRound.targetNumber);
          setBotStates((prev) =>
            prev.map((b, idx) =>
              idx === botIndex
                ? {
                    ...b,
                    status: 'idle',
                    targetPlatformIndex: undefined,
                    currentRound: nextRound,
                  }
                : b
            )
          );
          scheduleBotStep(botIndex);
        }, 700);

        timeoutsRef.current.set(`${liveBot.playerId}_respawn`, respawnTimeout);
      }
    }, decision.reactionDelayMs);

    timeoutsRef.current.set(currentBot.playerId, timeout);
  };

  useEffect(() => {
    if (!isActive) return;

    bots.forEach((_, idx) => {
      scheduleBotStep(idx);
    });

    const activeTimeouts = timeoutsRef.current;
    return () => {
      activeTimeouts.forEach((t) => clearTimeout(t));
      activeTimeouts.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return { botStates };
}
