'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Maximize2 } from 'lucide-react';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { useMatchStore } from '@/core/state/useMatchStore';
import { ArcadeStorage } from '@/core/state/storage';
import { soundManager } from '@/core/audio/soundManager';
import {
  ShipState,
  RacePhase,
  MultiplicationQuestion,
  AnswerArrowSet,
  MissedQuestionItem,
  CompetitionResultItem,
} from './types';
import {
  STEP_PX,
  COUNTDOWN_STEP_MS,
  WRONG_LOCK_MS,
  NEXT_QUESTION_DELAY_MS,
  FINISH_MAX_MS,
  RESULTS_DELAY_MS,
  MAX_RACE_SECONDS,
  DT_CLAMP_MS,
  S_FINISH,
  CATCH_UP,
  LANE_CENTER_Y,
  HUMAN_NOSE_X,
  STEER_GLIDE_MS_MIN,
  STEER_GLIDE_MS_MAX,
  STEER_GLIDE_PER_LANE_MS,
  STEER_BANK_DEG,
} from './constants';
import {
  calculateShipS,
  calculateShipDrawnX,
  calculateShipDrawnY,
  isShipInFrame,
  interpolateCrossingTime,
} from './engine/raceClock';
import { getShipLap, getRingProgress } from './engine/laps';
import { applyCorrect, applyWrong, applyTimeout, unlockShip, getCompetitionPlaces } from './engine/raceRules';
import { spawnArrowSet, updateArrowSet } from './engine/answerArrows';
import { generateMultiplicationQuestion } from './engine/questionGenerator';
import { getBotNextDelayMs, isBotAnswerCorrect } from './engine/botBrain';
import { calculateAccuracy, calculateRate, formatMissedQuestion } from './engine/resultStats';
import { SpaceWorld } from './components/SpaceWorld';
import { SpaceShip } from './components/SpaceShip';
import { AnswerArrow } from './components/AnswerArrow';
import { LapRing } from './components/LapRing';
import { CountdownCard } from './components/CountdownCard';
import { FinishConfetti } from './components/FinishConfetti';
import { ResultsScreen } from './components/ResultsScreen';

interface LaneGlideAnimation {
  shipId: string;
  startY: number;
  targetY: number;
  startTime: number;
  durationMs: number;
}

export function SpaceRaceGame() {
  const router = useRouter();
  const { humanPlayer } = useMatchStore();

  const [phase, setPhase] = useState<RacePhase>('countdown');
  const [countdownValue, setCountdownValue] = useState<string | number>(3);
  const [ships, setShips] = useState<ShipState[]>([]);
  const [humanQuestion, setHumanQuestion] = useState<MultiplicationQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [activeArrowSet, setActiveArrowSet] = useState<AnswerArrowSet | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isWrongLocked, setIsWrongLocked] = useState<boolean>(false);
  const [winner, setWinner] = useState<ShipState | null>(null);
  const [firstFinisherName, setFirstFinisherName] = useState<string | null>(null);
  const [raceClockSec, setRaceClockSec] = useState<number>(0);

  // Result statistics state
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestionItem[]>([]);
  const [finalResults, setFinalResults] = useState<CompetitionResultItem[]>([]);

  // Live refs to prevent stale closures and ensure strict cleanup
  const shipsRef = useRef<ShipState[]>([]);
  shipsRef.current = ships;

  const phaseRef = useRef<RacePhase>('countdown');
  phaseRef.current = phase;

  const activeArrowSetRef = useRef<AnswerArrowSet | null>(null);
  activeArrowSetRef.current = activeArrowSet;

  const raceClockSecRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const reqAnimRef = useRef<number | null>(null);
  const firstCrossingTimeRef = useRef<number | null>(null);
  const humanCrossingTimeRef = useRef<number | null>(null);
  const resultSavedRef = useRef<boolean>(false);
  const activeTimersRef = useRef<(NodeJS.Timeout | number)[]>([]);

  // Persistent Lane Assignment: Map from shipId -> current lane index (0..3)
  const laneOfRef = useRef<Map<string, number>>(new Map());
  // Active vertical gliding animations for lane swapping
  const laneGlidesRef = useRef<Map<string, LaneGlideAnimation>>(new Map());
  const humanBankDegRef = useRef<number>(0);

  const registerTimer = (timer: NodeJS.Timeout | number) => {
    activeTimersRef.current.push(timer);
    return timer;
  };

  const stopAll = useCallback(() => {
    if (reqAnimRef.current !== null) {
      cancelAnimationFrame(reqAnimRef.current);
      reqAnimRef.current = null;
    }
    activeTimersRef.current.forEach((t) => clearTimeout(t));
    activeTimersRef.current = [];
  }, []);

  // 1. Initialize Ships & Lanes
  const initializeShips = useCallback(() => {
    const defaultColors = ['blue', 'yellow', 'red', 'orange'];
    const humanColor = humanPlayer?.color || 'blue';
    const remainingColors = defaultColors.filter((c) => c !== humanColor);
    const humanId = humanPlayer?.id || 'player_human';

    const laneMap = new Map<string, number>();
    laneMap.set(humanId, 0);
    laneMap.set('bot_2', 1);
    laneMap.set('bot_3', 2);
    laneMap.set('bot_4', 3);
    laneOfRef.current = laneMap;
    laneGlidesRef.current.clear();
    humanBankDegRef.current = 0;

    const initial: ShipState[] = [
      {
        id: humanId,
        name: humanPlayer?.name || 'Player1',
        color: humanColor,
        isBot: false,
        lane: 0,
        pos: 0,
        tweenOffset: 0,
        s: 0,
        drawnX: HUMAN_NOSE_X,
        drawnY: calculateShipDrawnY(0),
        bankDeg: 0,
        reachedAt: 0,
        correctCount: 0,
        wrongCount: 0,
        timeoutCount: 0,
        crossedAt: null,
        isLocked: false,
        shakeUntil: 0,
        streak: 0,
        lap: 0,
        ringProgress: 0,
      },
      ...[1, 2, 3].map((botIdx) => ({
        id: `bot_${botIdx + 1}`,
        name: `Computer ${botIdx + 1}`,
        color: remainingColors[botIdx - 1] || 'yellow',
        isBot: true,
        lane: botIdx,
        pos: 0,
        tweenOffset: 0,
        s: 0,
        drawnX: HUMAN_NOSE_X,
        drawnY: calculateShipDrawnY(botIdx),
        bankDeg: 0,
        reachedAt: 0,
        correctCount: 0,
        wrongCount: 0,
        timeoutCount: 0,
        crossedAt: null,
        isLocked: false,
        shakeUntil: 0,
        streak: 0,
        lap: 0,
        ringProgress: 0,
      })),
    ];

    setShips(initial);
    shipsRef.current = initial;
  }, [humanPlayer?.color, humanPlayer?.id, humanPlayer?.name]);

  // 2. Start Countdown
  const startCountdown = useCallback(() => {
    stopAll();
    firstCrossingTimeRef.current = null;
    humanCrossingTimeRef.current = null;
    resultSavedRef.current = false;
    setPhase('countdown');
    phaseRef.current = 'countdown';
    setCountdownValue(3);
    setWinner(null);
    setFirstFinisherName(null);
    setQuestionNumber(1);
    setStatusMessage(null);
    setIsWrongLocked(false);
    setActiveArrowSet(null);
    activeArrowSetRef.current = null;
    setMissedQuestions([]);
    raceClockSecRef.current = 0;
    setRaceClockSec(0);

    initializeShips();

    const q1 = generateMultiplicationQuestion({ questionIndex: 1 });
    setHumanQuestion(q1);

    let step = 3;
    soundManager.playCountdown(false);

    const countdownTimer = setInterval(() => {
      step -= 1;
      if (step > 0) {
        setCountdownValue(step);
        soundManager.playCountdown(false);
      } else if (step === 0) {
        setCountdownValue('GO!');
        soundManager.playCountdown(true);
      } else {
        clearInterval(countdownTimer);
        setPhase('racing');
        phaseRef.current = 'racing';
        raceClockSecRef.current = 0;

        const firstArrows = spawnArrowSet(q1, 0);
        setActiveArrowSet(firstArrows);
        activeArrowSetRef.current = firstArrows;
      }
    }, COUNTDOWN_STEP_MS);

    registerTimer(countdownTimer);
  }, [initializeShips, stopAll]);

  useEffect(() => {
    startCountdown();
    return () => stopAll();
  }, [startCountdown, stopAll]);

  // 3. Transition to RESULTS phase
  const transitionToResults = useCallback(() => {
    if (phaseRef.current === 'results') return;

    setPhase('results');
    phaseRef.current = 'results';
    stopAll();

    const places = getCompetitionPlaces(shipsRef.current, raceClockSecRef.current);
    setFinalResults(places);

    if (!resultSavedRef.current) {
      resultSavedRef.current = true;
      const humanId = humanPlayer?.id || 'player_human';
      const humanShip = shipsRef.current.find((s) => s.id === humanId) || shipsRef.current[0];
      const acc = calculateAccuracy(humanShip.correctCount, humanShip.wrongCount, humanShip.timeoutCount);

      ArcadeStorage.recordMatchResult({
        matchId: `sr_${Date.now()}`,
        gameId: 'space-race',
        gameTitle: 'Space Race Multiplication',
        playedAt: new Date().toISOString(),
        targetRounds: 1,
        players: places.map((p) => ({
          playerId: p.id,
          name: p.name,
          color: p.color as any,
          isBot: p.isBot,
          rank: p.rank,
          correctCount: p.correctCount,
          wrongCount: p.wrongCount,
          finishTimeMs: Math.round(p.finishTimeSec * 1000),
          accuracy: acc,
        })),
      });
    }
  }, [humanPlayer?.id, stopAll]);

  // 4. Independent Bot Loops (purely scheduled on their own timers, 70% accuracy)
  useEffect(() => {
    if (phase !== 'racing') return;

    const scheduleBotTurn = (botIdx: number) => {
      if (phaseRef.current !== 'racing' || firstCrossingTimeRef.current !== null) return;

      const delayMs = getBotNextDelayMs(botIdx);
      const timer = setTimeout(() => {
        if (phaseRef.current !== 'racing' || firstCrossingTimeRef.current !== null) return;

        const botId = `bot_${botIdx + 1}`;
        const isCorrect = isBotAnswerCorrect(botIdx);
        const now = Math.round(raceClockSecRef.current * 1000);

        if (isCorrect) {
          const updated = applyCorrect(shipsRef.current, botId, now, CATCH_UP);
          setShips(updated);
          shipsRef.current = updated;
        } else {
          const updated = applyWrong(shipsRef.current, botId, now);
          setShips(updated);
          shipsRef.current = updated;

          const unlockTimer = setTimeout(() => {
            if (phaseRef.current === 'racing') {
              const unlocked = unlockShip(shipsRef.current, botId);
              setShips(unlocked);
              shipsRef.current = unlocked;
            }
          }, WRONG_LOCK_MS);
          registerTimer(unlockTimer);
        }

        scheduleBotTurn(botIdx);
      }, delayMs);

      registerTimer(timer);
    };

    [1, 2, 3].forEach((idx) => scheduleBotTurn(idx));
  }, [phase]);

  // 5. Main Animation Frame Loop (Camera follows human, s_h)
  useEffect(() => {
    if (phase !== 'racing' && phase !== 'finishing') return;

    lastFrameTimeRef.current = performance.now();

    const loop = (time: number) => {
      if (phaseRef.current === 'results') return;

      const dtMs = Math.min(time - lastFrameTimeRef.current, DT_CLAMP_MS);
      lastFrameTimeRef.current = time;
      const dtSec = dtMs / 1000;

      raceClockSecRef.current += dtSec;
      const t = raceClockSecRef.current;
      setRaceClockSec(t);

      const humanId = humanPlayer?.id || 'player_human';
      const prevHuman = shipsRef.current.find((s) => s.id === humanId) || shipsRef.current[0];
      const humanTargetOffset = prevHuman.pos * STEP_PX;
      const humanDiff = humanTargetOffset - prevHuman.tweenOffset;
      const nextHumanTweenOffset =
        Math.abs(humanDiff) < 0.2 ? humanTargetOffset : prevHuman.tweenOffset + humanDiff * Math.min(1, dtSec * 7);
      const currentHumanS = calculateShipS(t, nextHumanTweenOffset);

      let firstCrossingDetectedInFrame: number | null = null;
      let humanCrossingDetectedInFrame: number | null = null;

      // 5.1 Update Gliding Animations for Lane Swapping
      const glides = laneGlidesRef.current;
      const shipDrawnYMap = new Map<string, number>();

      shipsRef.current.forEach((ship) => {
        const assignedLane = laneOfRef.current.get(ship.id) ?? ship.lane;
        const targetY = calculateShipDrawnY(assignedLane);
        const activeGlide = glides.get(ship.id);

        if (activeGlide) {
          const elapsed = time - activeGlide.startTime;
          const progress = Math.min(1, elapsed / activeGlide.durationMs);
          // Ease-in-out
          const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          const currentY = activeGlide.startY + (activeGlide.targetY - activeGlide.startY) * ease;
          shipDrawnYMap.set(ship.id, currentY);

          if (!ship.isBot) {
            const dir = activeGlide.targetY > activeGlide.startY ? 1 : -1;
            humanBankDegRef.current = Math.sin(progress * Math.PI) * STEER_BANK_DEG * dir;
          }

          if (progress >= 1) {
            glides.delete(ship.id);
            shipDrawnYMap.set(ship.id, targetY);
            if (!ship.isBot) humanBankDegRef.current = 0;
          }
        } else {
          shipDrawnYMap.set(ship.id, targetY);
          if (!ship.isBot) humanBankDegRef.current = 0;
        }
      });

      // 5.2 Update All Ships with Camera Locked to Human (s_h)
      const nextShips = shipsRef.current.map((ship) => {
        const targetOffset = ship.pos * STEP_PX;
        const diff = targetOffset - ship.tweenOffset;
        const nextTweenOffset =
          Math.abs(diff) < 0.2 ? targetOffset : ship.tweenOffset + diff * Math.min(1, dtSec * 7);

        const prevS = ship.s;
        const currentS = calculateShipS(t, nextTweenOffset);

        let crossedAt = ship.crossedAt;
        if (crossedAt === null && currentS >= S_FINISH) {
          crossedAt = interpolateCrossingTime(prevS, currentS, t - dtSec, t, S_FINISH);
          if (firstCrossingTimeRef.current === null && firstCrossingDetectedInFrame === null) {
            firstCrossingDetectedInFrame = crossedAt;
          }
          if (!ship.isBot && humanCrossingTimeRef.current === null) {
            humanCrossingDetectedInFrame = crossedAt;
          }
        }

        // Camera locked to human: drawnX = HUMAN_NOSE_X + (s_i - s_h)
        const drawnX = calculateShipDrawnX(currentS, currentHumanS);
        const drawnY = shipDrawnYMap.get(ship.id) ?? calculateShipDrawnY(ship.lane);
        const bankDeg = !ship.isBot ? humanBankDegRef.current : 0;
        const lap = getShipLap(currentS);
        const ringProgress = getRingProgress(currentS);

        return {
          ...ship,
          tweenOffset: nextTweenOffset,
          s: currentS,
          drawnX,
          drawnY,
          bankDeg,
          crossedAt,
          lap,
          ringProgress,
        };
      });

      shipsRef.current = nextShips;
      setShips(nextShips);

      // 5.3 Update Answer Arrows (Screen space scroll to 600, hold, idle blip, expire)
      if (phaseRef.current === 'racing' && activeArrowSetRef.current && !activeArrowSetRef.current.isResolved) {
        const { updatedSet, hasExpired } = updateArrowSet(activeArrowSetRef.current, t);
        activeArrowSetRef.current = updatedSet;
        setActiveArrowSet(updatedSet);

        if (hasExpired && humanQuestion) {
          soundManager.playSplash();
          setStatusMessage("Time's up!");

          const miss = formatMissedQuestion(humanQuestion.a, humanQuestion.b, '—');
          setMissedQuestions((prev) => [...prev, miss]);

          const updatedShips = applyTimeout(shipsRef.current, humanId);
          shipsRef.current = updatedShips;
          setShips(updatedShips);

          const nextQTimer = setTimeout(() => {
            setStatusMessage(null);
            const nextQNum = questionNumber + 1;
            setQuestionNumber(nextQNum);
            const nextQ = generateMultiplicationQuestion({
              questionIndex: nextQNum,
              lastQuestion: { a: humanQuestion.a, b: humanQuestion.b },
            });
            setHumanQuestion(nextQ);
            const newArrows = spawnArrowSet(nextQ, raceClockSecRef.current);
            setActiveArrowSet(newArrows);
            activeArrowSetRef.current = newArrows;
          }, NEXT_QUESTION_DELAY_MS);
          registerTimer(nextQTimer);
        }
      }

      // 5.4 First Crossing Detection
      if (phaseRef.current === 'racing' && firstCrossingDetectedInFrame !== null) {
        firstCrossingTimeRef.current = firstCrossingDetectedInFrame;
        setPhase('finishing');
        phaseRef.current = 'finishing';

        soundManager.playVictory();

        const places = getCompetitionPlaces(nextShips, t);
        const winShip = nextShips.find((s) => s.id === places[0].id) || nextShips[0];
        setWinner(winShip);

        if (winShip.isBot) {
          setFirstFinisherName(`${winShip.name} finished!`);
        }

        // Watchdog: FINISHING -> RESULTS after FINISH_MAX_MS (12s)
        const watchdogTimer = setTimeout(() => {
          if (phaseRef.current === 'finishing') {
            transitionToResults();
          }
        }, FINISH_MAX_MS);
        registerTimer(watchdogTimer);
      }

      // 5.5 Human Crossing Detection in FINISHING phase
      if (humanCrossingDetectedInFrame !== null && humanCrossingTimeRef.current === null) {
        humanCrossingTimeRef.current = humanCrossingDetectedInFrame;
        const resultsDelayTimer = setTimeout(() => {
          if (phaseRef.current === 'finishing') {
            transitionToResults();
          }
        }, RESULTS_DELAY_MS);
        registerTimer(resultsDelayTimer);
      }

      if (t >= MAX_RACE_SECONDS) {
        transitionToResults();
        return;
      }

      reqAnimRef.current = requestAnimationFrame(loop);
    };

    reqAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqAnimRef.current !== null) {
        cancelAnimationFrame(reqAnimRef.current);
        reqAnimRef.current = null;
      }
    };
  }, [phase, humanQuestion, humanPlayer?.id, questionNumber, transitionToResults]);

  // 6. Handle Human Answer Selection with Persistent Lane Swapping (Section 23.4)
  const handleHumanAnswer = useCallback(
    (chosenLane: number) => {
      if (
        phase !== 'racing' ||
        isWrongLocked ||
        !humanQuestion ||
        !activeArrowSetRef.current ||
        activeArrowSetRef.current.isResolved ||
        firstCrossingTimeRef.current !== null
      ) {
        return;
      }

      const currentArrows = activeArrowSetRef.current.arrows;
      const selectedArrow = currentArrows.find((a) => a.lane === chosenLane);
      if (!selectedArrow) return;

      const isCorrect = selectedArrow.isCorrect;
      const now = Math.round(raceClockSecRef.current * 1000);
      const humanId = humanPlayer?.id || 'player_human';
      const currentHumanLane = laneOfRef.current.get(humanId) ?? 0;

      // Calculate lane glide duration and trigger lane swap
      const laneDelta = Math.abs(chosenLane - currentHumanLane);
      const steerDuration = Math.min(
        STEER_GLIDE_MS_MAX,
        Math.max(STEER_GLIDE_MS_MIN, laneDelta * STEER_GLIDE_PER_LANE_MS)
      );

      if (chosenLane !== currentHumanLane) {
        // Find ship currently occupying chosenLane
        let displacedShipId: string | null = null;
        laneOfRef.current.forEach((assignedLane, id) => {
          if (assignedLane === chosenLane && id !== humanId) {
            displacedShipId = id;
          }
        });

        // Swap visual lanes in persistent laneOfRef
        laneOfRef.current.set(humanId, chosenLane);
        if (displacedShipId) {
          laneOfRef.current.set(displacedShipId, currentHumanLane);
        }

        // Trigger simultaneous glides
        const nowTime = performance.now();
        laneGlidesRef.current.set(humanId, {
          shipId: humanId,
          startY: calculateShipDrawnY(currentHumanLane),
          targetY: calculateShipDrawnY(chosenLane),
          startTime: nowTime,
          durationMs: steerDuration,
        });

        if (displacedShipId) {
          laneGlidesRef.current.set(displacedShipId, {
            shipId: displacedShipId,
            startY: calculateShipDrawnY(chosenLane),
            targetY: calculateShipDrawnY(currentHumanLane),
            startTime: nowTime,
            durationMs: steerDuration,
          });
        }
      }

      // Mark arrow selection status
      const updatedArrows = currentArrows.map((a) => {
        if (a.lane === chosenLane) {
          return { ...a, status: isCorrect ? ('selected_correct' as const) : ('selected_wrong' as const) };
        }
        return a;
      });

      const resolvedSet: AnswerArrowSet = {
        ...activeArrowSetRef.current,
        arrows: updatedArrows,
        isResolved: true,
      };
      activeArrowSetRef.current = resolvedSet;
      setActiveArrowSet(resolvedSet);

      if (isCorrect) {
        soundManager.playCorrect();
        soundManager.playHop();

        const updated = applyCorrect(shipsRef.current, humanId, now, CATCH_UP);
        setShips(updated);
        shipsRef.current = updated;

        const nextQTimer = setTimeout(() => {
          setStatusMessage(null);
          const nextQNum = questionNumber + 1;
          setQuestionNumber(nextQNum);
          const nextQ = generateMultiplicationQuestion({
            questionIndex: nextQNum,
            lastQuestion: { a: humanQuestion.a, b: humanQuestion.b },
            lastCorrectLane: humanQuestion.correctLaneIndex,
          });
          setHumanQuestion(nextQ);
          const newArrows = spawnArrowSet(nextQ, raceClockSecRef.current);
          setActiveArrowSet(newArrows);
          activeArrowSetRef.current = newArrows;
        }, NEXT_QUESTION_DELAY_MS);
        registerTimer(nextQTimer);
      } else {
        soundManager.playSplash();
        setIsWrongLocked(true);
        setStatusMessage('Oops!');

        const miss = formatMissedQuestion(humanQuestion.a, humanQuestion.b, selectedArrow.value);
        setMissedQuestions((prev) => [...prev, miss]);

        const updated = applyWrong(shipsRef.current, humanId, now);
        setShips(updated);
        shipsRef.current = updated;

        const wrongTimer = setTimeout(() => {
          setIsWrongLocked(false);
          setStatusMessage(null);
          const nextQNum = questionNumber + 1;
          setQuestionNumber(nextQNum);
          const nextQ = generateMultiplicationQuestion({
            questionIndex: nextQNum,
            lastQuestion: { a: humanQuestion.a, b: humanQuestion.b },
          });
          setHumanQuestion(nextQ);
          const unlocked = unlockShip(shipsRef.current, humanId);
          setShips(unlocked);
          shipsRef.current = unlocked;
          const newArrows = spawnArrowSet(nextQ, raceClockSecRef.current);
          setActiveArrowSet(newArrows);
          activeArrowSetRef.current = newArrows;
        }, WRONG_LOCK_MS);
        registerTimer(wrongTimer);
      }
    },
    [phase, isWrongLocked, humanQuestion, humanPlayer?.id, questionNumber]
  );

  // 7. Keyboard Input (1, 2, 3, 4)
  useEffect(() => {
    if (phase !== 'racing' || isWrongLocked || firstCrossingTimeRef.current !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const laneIdx = parseInt(e.key, 10) - 1;
        handleHumanAnswer(laneIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isWrongLocked, handleHumanAnswer]);

  const humanShip = ships.find((s) => !s.isBot) || ships[0] || {
    id: 'player_human',
    name: humanPlayer?.name || 'Player1',
    color: humanPlayer?.color || 'blue',
    pos: 0,
    s: 0,
    drawnX: HUMAN_NOSE_X,
    drawnY: 107,
    bankDeg: 0,
    correctCount: 0,
    wrongCount: 0,
    timeoutCount: 0,
    lap: 0,
    ringProgress: 0,
  };

  const botShips = ships.filter((s) => s.isBot);

  const crossedShips = ships
    .filter((s) => s.crossedAt !== null)
    .sort((a, b) => a.crossedAt! - b.crossedAt!);
  const rankBadgeMap = new Map<string, number>();
  crossedShips.forEach((s, idx) => rankBadgeMap.set(s.id, idx + 1));

  const humanPlaceItem = finalResults.find((p) => p.id === humanShip.id);
  const humanAccuracy = calculateAccuracy(humanShip.correctCount, humanShip.wrongCount, humanShip.timeoutCount);
  const humanFinishTime = humanPlaceItem ? humanPlaceItem.finishTimeSec : raceClockSec;
  const humanRate = calculateRate(humanShip.correctCount, humanFinishTime);
  const totalAttempted = humanShip.correctCount + humanShip.wrongCount + humanShip.timeoutCount;

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-900 p-2 sm:p-4 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#C05A00] tracking-tight">
              Space Race Multiplication
            </h1>
            <p className="text-xs sm:text-sm text-[#C05A00]/90 font-medium">
              Math Games, Multiplication Games
            </p>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#C05A00] hover:bg-amber-200/50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* 1010x577 Scaled Game Window Container */}
        <GameWindow>
          <div className="relative w-full h-full overflow-hidden select-none bg-[#050b18]">
            {phase === 'results' ? (
              /* RESULTS SCREEN */
              <ResultsScreen
                results={finalResults}
                humanId={humanShip.id}
                accuracy={humanAccuracy}
                ratePerMin={humanRate}
                missedQuestions={missedQuestions}
                totalQuestionsAnswered={totalAttempted}
                onPlayAgain={startCountdown}
                onEndGame={() => router.push('/games/space-race')}
              />
            ) : (
              /* IN-RACE WORLD (Draw order per Section 22.7) */
              <>
                {/* 1. Deep Space World with Rotating Moon, Craters, Asteroids, Planets, and Gates */}
                <SpaceWorld cameraS={humanShip.s} />

                {/* Top Notification Chip (e.g. "Computer 3 finished!") */}
                {firstFinisherName && phase === 'finishing' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400 text-amber-300 font-bold text-sm tracking-wide shadow-2xl animate-in fade-in zoom-in-95">
                    {firstFinisherName}
                  </div>
                )}

                {/* 2. Bot Ships (Layer 5 - Rendered only if in-frame) */}
                {botShips.map((ship) => {
                  if (!isShipInFrame(ship.drawnX)) return null;

                  const rankBadge = rankBadgeMap.get(ship.id);
                  const maxLead = Math.max(...ships.map((s) => s.pos));
                  const isSurging = ship.pos === maxLead && maxLead > 0;

                  return (
                    <SpaceShip
                      key={ship.id}
                      ship={ship}
                      isRacing={phase === 'racing' || phase === 'finishing'}
                      isSurging={isSurging}
                      rankBadge={rankBadge}
                      question={null}
                      statusMessage={null}
                    />
                  );
                })}

                {/* 3. Human Ship (Layer 6 - Always drawn at x = 300, above bots) */}
                {humanShip && (
                  <SpaceShip
                    key={humanShip.id}
                    ship={humanShip as ShipState}
                    isRacing={phase === 'racing' || phase === 'finishing'}
                    isSurging={humanShip.pos === Math.max(...ships.map((s) => s.pos)) && humanShip.pos > 0}
                    rankBadge={rankBadgeMap.get(humanShip.id)}
                    question={humanQuestion}
                    statusMessage={statusMessage}
                  />
                )}

                {/* 4. Answer Arrows in 4 Lanes (Layer 7 - Drawn ABOVE all ships, numbers never hidden!) */}
                {phase === 'racing' &&
                  activeArrowSet &&
                  activeArrowSet.arrows.map((arr) => (
                    <AnswerArrow
                      key={arr.id}
                      arrow={arr}
                      disabled={isWrongLocked}
                      onSelect={handleHumanAnswer}
                    />
                  ))}

                {/* 5. Lap Ring (Layer 9 - Bottom Right with live rank chip) */}
                <LapRing humanLap={humanShip.lap} ships={ships} />

                {/* 6. Countdown Card (Layer 9 - 3, 2, 1, GO!) */}
                {phase === 'countdown' && (
                  <CountdownCard value={countdownValue} />
                )}

                {/* 7. Finish Celebration Confetti (Layer 8) */}
                {phase === 'finishing' && winner && (
                  <FinishConfetti
                    humanShip={humanShip as ShipState}
                    winner={winner}
                  />
                )}
              </>
            )}
          </div>
        </GameWindow>
      </div>
    </div>
  );
}

export default SpaceRaceGame;
