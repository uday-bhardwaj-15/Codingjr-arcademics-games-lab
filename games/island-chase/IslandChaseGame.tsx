'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Maximize2 } from 'lucide-react';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { useMatchStore } from '@/core/state/useMatchStore';
import { ArcadeStorage } from '@/core/state/storage';
import { soundManager } from '@/core/audio/soundManager';
import {
  RacerState,
  RacePhase,
  SubtractionQuestion,
  MissedQuestionItem,
  CompetitionResultItem,
} from './types';
import {
  STEP_PX,
  ANCHOR_X,
  WORLD_SPEED,
  COUNTDOWN_STEP_MS,
  WRONG_LOCK_MS,
  NEXT_QUESTION_DELAY_MS,
  FINISH_MAX_MS,
  RESULTS_DELAY_MS,
  MAX_RACE_SECONDS,
  DT_CLAMP_MS,
  FINISH_CUE_DISTANCE,
} from './constants';
import { COURSE_LENGTH, smoothHeadingAt } from './engine/course';
import { boatScreenPose } from './engine/camera';
import { calculateLaunchPx, calculateSRef, interpolateCrossingTime } from './engine/raceClock';
import { applyCorrect, applyWrong, unlockRacer, getCompetitionPlaces } from './engine/raceRules';
import { generateSubtractionQuestion } from './engine/questionGenerator';
import { getBotNextDelayMs, isBotAnswerCorrect } from './engine/botBrain';
import { calculateAccuracy, calculateRate, formatMissedQuestion } from './engine/resultStats';
import { WaterWorld } from './components/WaterWorld';
import { JetSkiBoat } from './components/JetSkiBoat';
import { CountdownCard } from './components/CountdownCard';
import { QuestionPanel } from './components/QuestionPanel';
import { FinishCelebration } from './components/FinishCelebration';
import { ResultsScreen } from './components/ResultsScreen';

export function IslandChaseGame() {
  const router = useRouter();
  const { humanPlayer } = useMatchStore();

  const [phase, setPhase] = useState<RacePhase>('countdown');
  const [countdownValue, setCountdownValue] = useState<string | number>(3);
  const [racers, setRacers] = useState<RacerState[]>([]);
  const [humanQuestion, setHumanQuestion] = useState<SubtractionQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrectFlash, setIsCorrectFlash] = useState<boolean>(false);
  const [isWrongLocked, setIsWrongLocked] = useState<boolean>(false);
  const [winner, setWinner] = useState<RacerState | null>(null);
  const [sRefVal, setSRefVal] = useState<number>(0);
  const [launchPxVal, setLaunchPxVal] = useState<number>(0);

  // Result statistics state
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestionItem[]>([]);
  const [finalResults, setFinalResults] = useState<CompetitionResultItem[]>([]);

  // Live refs to prevent stale closures and ensure strict cleanup
  const racersRef = useRef<RacerState[]>([]);
  racersRef.current = racers;

  const phaseRef = useRef<RacePhase>('countdown');
  phaseRef.current = phase;

  const raceClockSecRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const reqAnimRef = useRef<number | null>(null);
  const firstCrossingTimeRef = useRef<number | null>(null);
  const resultSavedRef = useRef<boolean>(false);
  const activeTimersRef = useRef<(NodeJS.Timeout | number)[]>([]);

  // Register a timer to be automatically cleared on phase change or unmount
  const registerTimer = (timer: NodeJS.Timeout | number) => {
    activeTimersRef.current.push(timer);
    return timer;
  };

  // Stop everything: rAF loop, all timers, bot loops, sound
  const stopAll = useCallback(() => {
    if (reqAnimRef.current !== null) {
      cancelAnimationFrame(reqAnimRef.current);
      reqAnimRef.current = null;
    }
    activeTimersRef.current.forEach((t) => clearTimeout(t));
    activeTimersRef.current = [];
  }, []);

  // 1. Racer Initialization
  const initializeRacers = useCallback(() => {
    const defaultColors = ['blue', 'yellow', 'red', 'orange'];
    const humanColor = humanPlayer?.color || 'blue';
    const remainingColors = defaultColors.filter((c) => c !== humanColor);

    const initial: RacerState[] = [
      {
        id: humanPlayer?.id || 'player_human',
        name: humanPlayer?.name || 'Player1',
        color: humanColor,
        isBot: false,
        lane: 0,
        pos: 0,
        tweenOffset: 0,
        s: 0,
        reachedAt: 0,
        correctCount: 0,
        wrongCount: 0,
        finishTimeMs: 0,
        crossedAt: null,
        isLocked: false,
        wobbleUntil: 0,
        pose: boatScreenPose(0, 0, 0, 0, 0),
        question: null,
        questionIndex: 1,
        streak: 0,
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
        reachedAt: 0,
        correctCount: 0,
        wrongCount: 0,
        finishTimeMs: 0,
        crossedAt: null,
        isLocked: false,
        wobbleUntil: 0,
        pose: boatScreenPose(0, botIdx, 0, 0, 0),
        question: null,
        questionIndex: 1,
        streak: 0,
      })),
    ];

    setRacers(initial);
    racersRef.current = initial;
    setSRefVal(0);
    setLaunchPxVal(0);
  }, [humanPlayer?.color, humanPlayer?.id, humanPlayer?.name]);

  // 2. Start Countdown
  const startCountdown = useCallback(() => {
    stopAll();
    firstCrossingTimeRef.current = null;
    resultSavedRef.current = false;
    setPhase('countdown');
    phaseRef.current = 'countdown';
    setCountdownValue(3);
    setWinner(null);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setIsCorrectFlash(false);
    setIsWrongLocked(false);
    setMissedQuestions([]);
    raceClockSecRef.current = 0;

    initializeRacers();

    const q1 = generateSubtractionQuestion({ questionIndex: 1 });
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
      }
    }, COUNTDOWN_STEP_MS);

    registerTimer(countdownTimer);
  }, [initializeRacers, stopAll]);

  // Mount effect: run countdown once
  useEffect(() => {
    startCountdown();
    return () => stopAll();
  }, [startCountdown, stopAll]);

  // 3. Transition to RESULTS phase and save record once
  const transitionToResults = useCallback(() => {
    if (phaseRef.current === 'results') return;

    setPhase('results');
    phaseRef.current = 'results';
    stopAll();

    // Compute final competition places
    const places = getCompetitionPlaces(racersRef.current);
    setFinalResults(places);

    // Save leaderboard record once
    if (!resultSavedRef.current) {
      resultSavedRef.current = true;
      const humanPlace = places.find((p) => p.id === (humanPlayer?.id || 'player_human')) || places[0];
      const acc = calculateAccuracy(humanPlace.correctCount, humanPlace.wrongCount);

      ArcadeStorage.recordMatchResult({
        matchId: `ic_${Date.now()}`,
        gameId: 'island-chase',
        gameTitle: 'Island Chase Subtraction',
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

  // 4. Bot Answering Loop (Active only during RACING)
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
          const updated = applyCorrect(racersRef.current, botId, now);
          setRacers(updated);
          racersRef.current = updated;
        } else {
          const updated = applyWrong(racersRef.current, botId, now);
          setRacers(updated);
          racersRef.current = updated;

          const unlockTimer = setTimeout(() => {
            if (phaseRef.current === 'racing') {
              const unlocked = unlockRacer(racersRef.current, botId);
              setRacers(unlocked);
              racersRef.current = unlocked;
            }
          }, WRONG_LOCK_MS);
          registerTimer(unlockTimer);
        }

        // Schedule next turn
        scheduleBotTurn(botIdx);
      }, delayMs);

      registerTimer(timer);
    };

    [1, 2, 3].forEach((idx) => scheduleBotTurn(idx));
  }, [phase]);

  // 5. Main Animation Frame Loop (Runs during RACING and FINISHING)
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

      const launchPx = calculateLaunchPx(t);
      const sRef = calculateSRef(t);
      const thetaCam = smoothHeadingAt(sRef);

      setSRefVal(sRef);
      setLaunchPxVal(launchPx);

      let newlyCrossed = false;
      let firstCrossingDetectedInFrame: number | null = null;

      // Update positions & crossing times
      const nextRacers = racersRef.current.map((racer) => {
        const targetOffset = racer.pos * STEP_PX;
        const diff = targetOffset - racer.tweenOffset;
        const nextTweenOffset =
          Math.abs(diff) < 0.2 ? targetOffset : racer.tweenOffset + diff * Math.min(1, dtSec * 7);

        const prevS = racer.s;
        const currentS = sRef + nextTweenOffset;

        let crossedAt = racer.crossedAt;
        if (crossedAt === null && currentS >= COURSE_LENGTH) {
          crossedAt = interpolateCrossingTime(prevS, currentS, t - dtSec, t, COURSE_LENGTH);
          newlyCrossed = true;
          if (firstCrossingTimeRef.current === null && firstCrossingDetectedInFrame === null) {
            firstCrossingDetectedInFrame = crossedAt;
          }
        }

        const pose = boatScreenPose(currentS, racer.lane, sRef, launchPx, thetaCam);

        return {
          ...racer,
          tweenOffset: nextTweenOffset,
          s: currentS,
          crossedAt,
          pose,
        };
      });

      racersRef.current = nextRacers;
      setRacers(nextRacers);

      // 5.1 Check First Crossing -> Transition from RACING to FINISHING
      if (phaseRef.current === 'racing' && firstCrossingDetectedInFrame !== null) {
        firstCrossingTimeRef.current = firstCrossingDetectedInFrame;
        setPhase('finishing');
        phaseRef.current = 'finishing';

        soundManager.playVictory();

        const places = getCompetitionPlaces(nextRacers);
        const winRacer = nextRacers.find((r) => r.id === places[0].id) || nextRacers[0];
        setWinner(winRacer);

        // Set watchdog timer: FINISHING -> RESULTS at latest FINISH_MAX_MS after first crossing
        const watchdogTimer = setTimeout(() => {
          if (phaseRef.current === 'finishing') {
            transitionToResults();
          }
        }, FINISH_MAX_MS);
        registerTimer(watchdogTimer);
      }

      // 5.2 Check if All 4 Boats have crossed during FINISHING -> RESULTS
      if (phaseRef.current === 'finishing') {
        const allCrossed = nextRacers.every((r) => r.crossedAt !== null);
        if (allCrossed) {
          const resultsDelayTimer = setTimeout(() => {
            if (phaseRef.current === 'finishing') {
              transitionToResults();
            }
          }, RESULTS_DELAY_MS);
          registerTimer(resultsDelayTimer);
        }
      }

      // Safety timeout
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
  }, [phase, transitionToResults]);

  // 6. Handle Human Answer
  const handleHumanAnswer = useCallback(
    (choiceIndex: number) => {
      if (
        phase !== 'racing' ||
        isWrongLocked ||
        !humanQuestion ||
        firstCrossingTimeRef.current !== null
      ) {
        return;
      }

      setSelectedAnswer(choiceIndex);
      const chosenValue = humanQuestion.options[choiceIndex];
      const isCorrect = chosenValue === humanQuestion.answer;
      const now = Math.round(raceClockSecRef.current * 1000);
      const humanId = humanPlayer?.id || 'player_human';

      if (isCorrect) {
        soundManager.playCorrect();
        soundManager.playHop();
        setIsCorrectFlash(true);

        const updated = applyCorrect(racersRef.current, humanId, now);
        setRacers(updated);
        racersRef.current = updated;

        const nextQTimer = setTimeout(() => {
          setIsCorrectFlash(false);
          setSelectedAnswer(null);
          const nextQNum = questionNumber + 1;
          setQuestionNumber(nextQNum);
          const nextQ = generateSubtractionQuestion({
            questionIndex: nextQNum,
            lastQuestion: { a: humanQuestion.a, b: humanQuestion.b },
            lastCorrectSlot: humanQuestion.correctIndex,
          });
          setHumanQuestion(nextQ);
        }, NEXT_QUESTION_DELAY_MS);
        registerTimer(nextQTimer);
      } else {
        soundManager.playSplash();
        setIsWrongLocked(true);

        // Record missed question
        const miss = formatMissedQuestion(humanQuestion.a, humanQuestion.b, chosenValue);
        setMissedQuestions((prev) => [...prev, miss]);

        const updated = applyWrong(racersRef.current, humanId, now);
        setRacers(updated);
        racersRef.current = updated;

        const wrongTimer = setTimeout(() => {
          setIsWrongLocked(false);
          setSelectedAnswer(null);
          const nextQNum = questionNumber + 1;
          setQuestionNumber(nextQNum);
          const nextQ = generateSubtractionQuestion({
            questionIndex: nextQNum,
            lastQuestion: { a: humanQuestion.a, b: humanQuestion.b },
          });
          setHumanQuestion(nextQ);
          const unlocked = unlockRacer(racersRef.current, humanId);
          setRacers(unlocked);
          racersRef.current = unlocked;
        }, WRONG_LOCK_MS);
        registerTimer(wrongTimer);
      }
    },
    [
      phase,
      isWrongLocked,
      humanQuestion,
      humanPlayer?.id,
      questionNumber,
    ]
  );

  // 7. Keyboard Input (1, 2, 3, 4)
  useEffect(() => {
    if (phase !== 'racing' || isWrongLocked || firstCrossingTimeRef.current !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        handleHumanAnswer(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isWrongLocked, handleHumanAnswer]);

  const humanRacer = racers[0] || {
    id: 'player_human',
    name: humanPlayer?.name || 'Player1',
    color: humanPlayer?.color || 'blue',
    pos: 0,
    pose: { x: ANCHOR_X, y: 119, yawRad: 0, yawDeg: 0 },
    correctCount: 0,
    wrongCount: 0,
  };

  const isFinishApproaching =
    COURSE_LENGTH - sRefVal < FINISH_CUE_DISTANCE && COURSE_LENGTH - sRefVal > 200;

  // Compute crossing rank badges for in-race display
  const crossedRacers = racers
    .filter((r) => r.crossedAt !== null)
    .sort((a, b) => a.crossedAt! - b.crossedAt!);
  const rankBadgeMap = new Map<string, number>();
  crossedRacers.forEach((r, idx) => rankBadgeMap.set(r.id, idx + 1));

  const humanPlaceItem = finalResults.find((p) => p.id === humanRacer.id);
  const humanAccuracy = calculateAccuracy(humanRacer.correctCount, humanRacer.wrongCount);
  const humanFinishTime = humanPlaceItem ? humanPlaceItem.finishTimeSec : raceClockSecRef.current;
  const humanRate = calculateRate(humanRacer.correctCount, humanFinishTime);
  const totalAttempted = humanRacer.correctCount + humanRacer.wrongCount;

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FEFCBF] text-slate-900 p-2 sm:p-4 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#C05A00] tracking-tight">
              Island Chase Subtraction
            </h1>
            <p className="text-xs sm:text-sm text-[#C05A00]/90 font-medium">
              Math Games, Subtraction Games
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
          <div className="relative w-full h-full overflow-hidden select-none bg-[#1e88a8]">
            {phase === 'results' ? (
              /* RESULTS SCREEN: Clean, comprehensive post-race view */
              <ResultsScreen
                results={finalResults}
                humanId={humanRacer.id}
                accuracy={humanAccuracy}
                ratePerMin={humanRate}
                missedQuestions={missedQuestions}
                totalQuestionsAnswered={totalAttempted}
                onPlayAgain={startCountdown}
                onEndGame={() => router.push('/games/island-chase')}
              />
            ) : (
              /* IN-GAME VIEW (Countdown, Racing, Finishing) */
              <>
                {/* 1. Rotating World Group with Course & Scenery */}
                <WaterWorld
                  sRef={sRefVal}
                  launchPx={launchPxVal}
                />

                {/* 2. Four Jet-Ski Racers */}
                {racers.map((racer) => {
                  const rankBadge = rankBadgeMap.get(racer.id);
                  const maxLead = Math.max(...racers.map((r) => r.pos));
                  const isSurging = racer.pos === maxLead && maxLead > 0;

                  return (
                    <JetSkiBoat
                      key={racer.id}
                      racer={racer}
                      isRacing={phase === 'racing' || phase === 'finishing'}
                      isSurging={isSurging}
                      rankBadge={rankBadge}
                    />
                  );
                })}

                {/* 3. Countdown Card (3, 2, 1, GO!) */}
                {phase === 'countdown' && (
                  <CountdownCard value={countdownValue} />
                )}

                {/* 4. Finish Cue Chip */}
                {isFinishApproaching && phase === 'racing' && (
                  <div className="absolute top-4 right-6 z-30 pointer-events-none select-none animate-pulse">
                    <div className="px-3.5 py-1.5 rounded-full bg-amber-500/90 border-2 border-yellow-200 text-amber-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5">
                      <span>FINISH</span>
                      <span className="text-base">➔</span>
                    </div>
                  </div>
                )}

                {/* 5. Bottom Question & Answer Panel */}
                <QuestionPanel
                  humanRacer={humanRacer as RacerState}
                  allRacers={racers}
                  question={humanQuestion}
                  questionNumber={questionNumber}
                  isCountdown={phase === 'countdown'}
                  isWrongLocked={isWrongLocked}
                  selectedAnswer={selectedAnswer}
                  isCorrectFlash={isCorrectFlash}
                  isFinishApproaching={isFinishApproaching}
                  onAnswer={handleHumanAnswer}
                />

                {/* 6. Finish Celebration Banner */}
                {phase === 'finishing' && winner && (
                  <FinishCelebration
                    humanRacer={humanRacer as RacerState}
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

export default IslandChaseGame;
