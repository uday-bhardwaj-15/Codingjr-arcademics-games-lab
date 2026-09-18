'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { PlayerRunState, PlatformOption } from '../types';
import { generateRound, DEFAULT_INITIAL_ROUND } from '../engine/roundGenerator';
import { soundManager } from '@/core/audio/soundManager';
import { PlayerColor } from '@/core/types/player';

interface UsePlayerRoundProps {
  playerId: string;
  name: string;
  color: PlayerColor;
  targetRounds: number;
  numberRange?: [number, number];
  onPlayerFinish: (playerId: string, correct: number, wrong: number) => void;
}

export function usePlayerRound({
  playerId,
  name,
  color,
  targetRounds,
  numberRange = [1, 10],
  onPlayerFinish,
}: UsePlayerRoundProps) {
  const [playerState, setPlayerState] = useState<PlayerRunState>(() => ({
    playerId,
    name,
    isBot: false,
    color,
    currentRound: DEFAULT_INITIAL_ROUND,
    correctCount: 0,
    wrongCount: 0,
    status: 'idle',
    currentPlatformIndex: null, // Starts on base leaf
    targetPlatformIndex: undefined,
  }));

  // On client mount, randomize the initial round
  useEffect(() => {
    setPlayerState((prev) => ({
      ...prev,
      currentRound: generateRound(numberRange),
    }));
  }, []);

  const [activeSplashIndex, setActiveSplashIndex] = useState<number | null>(null);
  const isHandlingRef = useRef(false);

  const handleSelectPlatform = useCallback(
    (index: number, option: PlatformOption) => {
      if (isHandlingRef.current) return;
      if (playerState.status === 'finished' || playerState.correctCount >= targetRounds) return;

      isHandlingRef.current = true;
      const isCorrect = option.isCorrect;

      if (isCorrect) {
        soundManager.playHop();
        soundManager.playCorrect();

        const nextCorrect = playerState.correctCount + 1;
        const isNowFinished = nextCorrect >= targetRounds;

        setPlayerState((prev) => ({
          ...prev,
          status: 'jumping',
          targetPlatformIndex: index,
          correctCount: nextCorrect,
        }));

        setTimeout(() => {
          if (isNowFinished) {
            setPlayerState((prev) => ({
              ...prev,
              status: 'finished',
              currentPlatformIndex: index,
              targetPlatformIndex: undefined,
              finishedAtMs: Date.now(),
            }));
            onPlayerFinish(playerId, nextCorrect, playerState.wrongCount);
          } else {
            const nextRound = generateRound(numberRange, playerState.currentRound.targetNumber);
            setPlayerState((prev) => ({
              ...prev,
              status: 'idle',
              currentPlatformIndex: index, // Stays on the petal!
              targetPlatformIndex: undefined,
              currentRound: nextRound,
            }));
          }
          isHandlingRef.current = false;
        }, 420);
      } else {
        // Wrong platform selected -> Splash into water & stay on petal
        soundManager.playHop();
        setTimeout(() => {
          soundManager.playSplash();
        }, 200);

        const nextWrong = playerState.wrongCount + 1;

        setPlayerState((prev) => ({
          ...prev,
          status: 'falling',
          targetPlatformIndex: index,
          wrongCount: nextWrong,
        }));
        setActiveSplashIndex(index);

        setTimeout(() => {
          const nextRound = generateRound(numberRange, playerState.currentRound.targetNumber);
          setActiveSplashIndex(null);
          setPlayerState((prev) => ({
            ...prev,
            status: 'idle',
            currentPlatformIndex: index, // Stays on petal
            targetPlatformIndex: undefined,
            currentRound: nextRound,
          }));
          isHandlingRef.current = false;
        }, 750);
      }
    },
    [
      playerId,
      numberRange,
      playerState.correctCount,
      playerState.wrongCount,
      playerState.status,
      playerState.currentRound.targetNumber,
      targetRounds,
      onPlayerFinish,
    ]
  );

  return {
    playerState,
    activeSplashIndex,
    handleSelectPlatform,
  };
}
