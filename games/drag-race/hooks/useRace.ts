'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DivisionQuestion, RacerProgress, RaceRoundResult, PlayerColor } from '../types';
import { TOTAL_QUESTIONS, DEFAULT_BOT_NAMES, BOT_COLORS } from '../constants';
import { generateDivisionQuestions } from '../engine/questionGenerator';
import { STEPS_TO_FINISH, WRONG_LOCK_MS, rankRacers } from '../engine/raceMath';
import { getBotNextDelayMs, checkBotAnswer } from '../engine/botAI';
import { soundManager } from '@/core/audio/soundManager';

export interface UseRaceOptions {
  playerName: string;
  playerColor?: PlayerColor;
  onFinish?: (racers: RacerProgress[], results: RaceRoundResult[]) => void;
}

export function useRace({
  playerName,
  playerColor = 'blue',
  onFinish,
}: UseRaceOptions) {
  const [questions, setQuestions] = useState<DivisionQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<RaceRoundResult[]>([]);
  const [racers, setRacers] = useState<RacerProgress[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [lastAnswerIndex, setLastAnswerIndex] = useState<number | null>(null);
  const [isSurging, setIsSurging] = useState<boolean>(false);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const raceStartTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);
  const botTimersRef = useRef<NodeJS.Timeout[]>([]);
  const raceFinishedRef = useRef<boolean>(false);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Racers & Reset All State
  const initRacers = useCallback((name: string) => {
    // Clear all active timers
    botTimersRef.current.forEach(clearTimeout);
    botTimersRef.current = [];
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

    raceFinishedRef.current = false;
    finishTimeoutRef.current = null;
    setIsFinished(false);
    setIsRacing(false);
    setIsLocked(false);
    setLastAnswerStatus(null);
    setLastAnswerIndex(null);
    setIsSurging(false);
    setRoundResults([]);
    setCurrentQuestionIdx(0);

    const list: RacerProgress[] = [
      {
        id: 'human_player',
        name,
        color: playerColor,
        isBot: false,
        lane: 0,
        progress: 0,
        currentQuestionIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        finished: false,
        speed: 0,
      },
      ...DEFAULT_BOT_NAMES.map((botName, i) => ({
        id: `bot_${i + 1}`,
        name: botName,
        color: BOT_COLORS[i] ?? 'yellow',
        isBot: true,
        lane: i + 1,
        progress: 0,
        currentQuestionIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        finished: false,
        speed: 0,
      })),
    ];
    setRacers(list);
  }, [playerColor]);

  // End Race helper
  const endRace = useCallback(() => {
    if (raceFinishedRef.current) return;
    raceFinishedRef.current = true;
    setIsRacing(false);
    setIsFinished(true);

    botTimersRef.current.forEach(clearTimeout);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

    setRacers((prev) => {
      const totalElapsed = Date.now() - raceStartTimeRef.current;
      const updated = prev.map((r) => {
        if (r.finished && r.finishTimeMs) return r;
        const steps = r.correctCount;
        const answersPerSec = steps > 0 ? steps / (totalElapsed / 1000) : 0.3;
        const remainingSteps = Math.max(0, STEPS_TO_FINISH - steps);
        const projectedExtraMs = (remainingSteps / Math.max(0.1, answersPerSec)) * 1000;
        return {
          ...r,
          finished: r.correctCount >= STEPS_TO_FINISH,
          finishTimeMs: r.correctCount >= STEPS_TO_FINISH ? totalElapsed : totalElapsed + projectedExtraMs,
        };
      });

      const ranked = rankRacers(updated);
      onFinish?.(ranked, roundResults);
      return ranked;
    });

    soundManager.playVictory();
  }, [onFinish, roundResults]);

  // Start Race
  const startRace = useCallback(() => {
    const qs = generateDivisionQuestions(TOTAL_QUESTIONS + 15);
    setQuestions(qs);
    setCurrentQuestionIdx(0);
    setRoundResults([]);
    setIsLocked(false);
    setLastAnswerStatus(null);
    setLastAnswerIndex(null);
    setIsSurging(false);
    setIsFinished(false);
    setIsRacing(true);
    raceFinishedRef.current = false;
    finishTimeoutRef.current = null;

    const startTime = Date.now();
    raceStartTimeRef.current = startTime;
    questionStartTimeRef.current = startTime;

    // Safety timeout at 180s
    safetyTimeoutRef.current = setTimeout(() => {
      if (!raceFinishedRef.current) {
        endRace();
      }
    }, 180000);
  }, [endRace]);

  // Bot AI loop during active race
  useEffect(() => {
    if (!isRacing || isFinished) return;

    const scheduleBot = (botIndex: number) => {
      if (raceFinishedRef.current) return;

      const delay = getBotNextDelayMs(botIndex);
      const timer = setTimeout(() => {
        if (raceFinishedRef.current) return;

        setRacers((prev) => {
          const updated = [...prev];
          const bot = updated[botIndex + 1];
          if (!bot || bot.finished) return prev;

          const isCorrect = checkBotAnswer(botIndex);
          const newCorrect = isCorrect ? bot.correctCount + 1 : bot.correctCount;
          const newIncorrect = isCorrect ? bot.incorrectCount : bot.incorrectCount + 1;
          const newProgress = Math.min(1, newCorrect / STEPS_TO_FINISH);
          const finished = newCorrect >= STEPS_TO_FINISH;

          updated[botIndex + 1] = {
            ...bot,
            currentQuestionIndex: bot.currentQuestionIndex + 1,
            correctCount: newCorrect,
            incorrectCount: newIncorrect,
            progress: newProgress,
            finished,
            finishTimeMs: finished ? Date.now() - raceStartTimeRef.current : undefined,
          };

          // If this bot finished first, end race after 1.8s and award respective positions
          if (finished && !finishTimeoutRef.current) {
            finishTimeoutRef.current = setTimeout(() => {
              endRace();
            }, 1800);
          }

          return updated;
        });

        // Continue scheduling if not finished
        scheduleBot(botIndex);
      }, delay);

      botTimersRef.current.push(timer);
    };

    DEFAULT_BOT_NAMES.forEach((_, idx) => scheduleBot(idx));

    return () => {
      botTimersRef.current.forEach(clearTimeout);
    };
  }, [isRacing, isFinished, endRace]);

  // Handle human player answer
  const handleAnswer = useCallback(
    (selectedAnswer: number, optIndex?: number) => {
      if (!isRacing || isLocked || raceFinishedRef.current) return;

      const q = questions[currentQuestionIdx];
      if (!q) return;

      const isCorrect = selectedAnswer === q.quotient;
      const actualIdx = optIndex ?? q.options.indexOf(selectedAnswer);
      setLastAnswerIndex(actualIdx >= 0 ? actualIdx : null);
      const timeTaken = Date.now() - questionStartTimeRef.current;

      // Log result
      setRoundResults((prev) => [
        ...prev,
        {
          questionNumber: currentQuestionIdx + 1,
          prompt: q.prompt,
          userAnswer: selectedAnswer,
          correctAnswer: q.quotient,
          isCorrect,
          timeTakenMs: timeTaken,
        },
      ]);

      if (isCorrect) {
        soundManager.playCorrect();
        setLastAnswerStatus('correct');
        setIsSurging(true);
        setTimeout(() => setIsSurging(false), 500);

        setRacers((prev) => {
          const updated = [...prev];
          const human = updated[0];
          if (!human) return prev;

          const newCorrect = human.correctCount + 1;
          const newProgress = Math.min(1, newCorrect / STEPS_TO_FINISH);
          const finished = newCorrect >= STEPS_TO_FINISH;

          updated[0] = {
            ...human,
            currentQuestionIndex: currentQuestionIdx + 1,
            correctCount: newCorrect,
            progress: newProgress,
            finished,
            finishTimeMs: finished ? Date.now() - raceStartTimeRef.current : undefined,
          };

          // If human finishes first (or finishes), trigger endRace after 1.8s
          if (finished && !finishTimeoutRef.current) {
            finishTimeoutRef.current = setTimeout(() => {
              endRace();
            }, 1800);
          }

          return updated;
        });

        // Quick advance to next question
        setTimeout(() => {
          setCurrentQuestionIdx((prev) => prev + 1);
          setLastAnswerStatus(null);
          setLastAnswerIndex(null);
          questionStartTimeRef.current = Date.now();
        }, 300);
      } else {
        // Wrong answer: 1.5s lock, red feedback, green hint, no step
        soundManager.playBoom();
        setLastAnswerStatus('incorrect');
        setIsLocked(true);

        setRacers((prev) => {
          const updated = [...prev];
          const human = updated[0];
          if (!human) return prev;

          updated[0] = {
            ...human,
            currentQuestionIndex: currentQuestionIdx + 1,
            incorrectCount: human.incorrectCount + 1,
          };
          return updated;
        });

        // Unlock after 1500ms
        setTimeout(() => {
          setIsLocked(false);
          setLastAnswerStatus(null);
          setLastAnswerIndex(null);
          setCurrentQuestionIdx((prev) => prev + 1);
          questionStartTimeRef.current = Date.now();
        }, WRONG_LOCK_MS);
      }
    },
    [isRacing, isLocked, questions, currentQuestionIdx, endRace]
  );

  return {
    questions,
    currentQuestion: questions[currentQuestionIdx] || null,
    currentQuestionIdx,
    roundResults,
    racers,
    isLocked,
    lastAnswerStatus,
    lastAnswerIndex,
    isSurging,
    isRacing,
    isFinished,
    initRacers,
    startRace,
    handleAnswer,
    endRace,
  };
}
