'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';
import { GameWindow, DESIGN_W, DESIGN_H } from '@/core/components/GameWindow/GameWindow';
import { soundManager } from '@/core/audio/soundManager';
import {
  PodState,
  IntegerSettings,
  Question,
  PlayerColor,
} from './types';
import {
  STEPS_TO_FINISH,
  STEP_PX,
  COURSE_LENGTH,
  DRIFT_PX_PER_S,
  SPEED_REACTION_MULTIPLIERS,
  WRONG_LOCK_MS,
  BOT_CONFIGS,
  DEFAULT_SETTINGS,
} from './constants';
import { generateIntegerQuestion } from './engine/questionGenerator';
import { getCoursePointAt } from './engine/course';
import { calculateProjectedFinishTime, rankPods } from './engine/raceMath';
import { SpaceScene } from './components/SpaceScene';
import { QuestionPanel } from './components/QuestionPanel';
import { TrackMiniMap } from './components/TrackMiniMap';
import { NameScreen } from './screens/NameScreen';
import { OptionsScreen } from './screens/OptionsScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ArcadeStorage } from '@/core/state/storage';

type GamePhase = 'name' | 'options' | 'lobby' | 'countdown' | 'racing' | 'finished' | 'results';

export const OrbitIntegersGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('name');
  const [playerName, setPlayerName] = useState('Player622');
  const [settings, setSettings] = useState<IntegerSettings>(DEFAULT_SETTINGS);

  // Load persistent profile and game settings
  useEffect(() => {
    try {
      const profile = ArcadeStorage.getPlayerProfile();
      if (profile?.name) {
        setPlayerName(profile.name);
      }
      const savedSettings = ArcadeStorage.getGameSettings<IntegerSettings>(
        'orbit-integers',
        DEFAULT_SETTINGS
      );
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch {
      // storage fallback
    }
  }, []);

  // Human Question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);

  // Countdown value: 3, 2, 1, 'GO!'
  const [countdownText, setCountdownText] = useState<string>('');

  // Pods State (Human is pods[0])
  const [pods, setPods] = useState<PodState[]>([]);
  const podsRef = useRef<PodState[]>([]);
  podsRef.current = pods;

  // Camera coordinates
  const [camera, setCamera] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Timing refs
  const raceStartTimeRef = useRef<number>(0);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const botTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const rAFRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize pods for a fresh match
  const initPods = useCallback(
    (name: string): PodState[] => {
      const p1: PodState = {
        id: 'human_pod',
        playerId: 'human',
        name,
        color: 'blue' as PlayerColor,
        isBot: false,
        isHuman: true,
        lane: 0,
        logicalS: 0,
        displayS: 0,
        heading: 0,
        correctCount: 0,
        wrongCount: 0,
        status: 'countdown',
        currentQuestion: null,
        questionNumber: 1,
        missed: [],
      };

      const bots: PodState[] = BOT_CONFIGS.map((bot, idx) => ({
        id: `bot_pod_${idx + 1}`,
        playerId: `bot_${idx + 1}`,
        name: bot.name,
        color: bot.color,
        isBot: true,
        isHuman: false,
        lane: idx + 1,
        logicalS: 0,
        displayS: 0,
        heading: 0,
        correctCount: 0,
        wrongCount: 0,
        status: 'countdown',
        currentQuestion: null,
        questionNumber: 1,
        missed: [],
      }));

      return [p1, ...bots];
    },
    []
  );

  // Clean up all timers and rAF
  const stopAllTimers = useCallback(() => {
    if (rAFRef.current) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
    botTimeoutsRef.current.forEach((t) => clearTimeout(t));
    botTimeoutsRef.current = [];
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAllTimers();
  }, [stopAllTimers]);

  // Schedule Bot question cycles
  const scheduleBotCycle = useCallback(
    (botIndex: number, currentSettings: IntegerSettings) => {
      const config = BOT_CONFIGS[botIndex - 1];
      if (!config) return;

      const speedMult = SPEED_REACTION_MULTIPLIERS[currentSettings.speed] || 1.0;
      const minDelay = config.reactionRange[0] * speedMult;
      const maxDelay = config.reactionRange[1] * speedMult;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);

      const timeout = setTimeout(() => {
        const currentPods = [...podsRef.current];
        const bot = currentPods[botIndex];
        if (!bot || bot.status === 'finished') return;

        const isCorrect = Math.random() <= config.accuracy;

        if (isCorrect) {
          bot.logicalS += STEP_PX;
          bot.correctCount += 1;
          bot.status = 'racing';

          // Check if bot finished
          if (bot.logicalS >= COURSE_LENGTH && !bot.finishedAtMs) {
            bot.finishedAtMs = Date.now() - raceStartTimeRef.current;
            bot.status = 'finished';
          }
        } else {
          bot.wrongCount += 1;
          bot.status = 'sputtering';
          setTimeout(() => {
            if (podsRef.current[botIndex]) {
              podsRef.current[botIndex].status = 'racing';
            }
          }, 1200);
        }

        setPods([...currentPods]);

        if (bot.logicalS < COURSE_LENGTH) {
          scheduleBotCycle(botIndex, currentSettings);
        }
      }, delay);

      botTimeoutsRef.current.push(timeout);
    },
    []
  );

  // Start the countdown sequence (3 -> 2 -> 1 -> GO!)
  const startCountdown = useCallback(() => {
    setPhase('countdown');
    const freshPods = initPods(playerName);
    setPods(freshPods);
    podsRef.current = freshPods;

    // Reset camera to launch tower
    const startCoursePt = getCoursePointAt(0);
    cameraRef.current = {
      x: startCoursePt.x + 120 - DESIGN_W / 2,
      y: startCoursePt.y - DESIGN_H / 2,
    };
    setCamera({ ...cameraRef.current });

    // Initial question for human
    const q1 = generateIntegerQuestion(settings.from, settings.to, settings.operation);
    setCurrentQuestion(q1);
    setQuestionNumber(1);
    setIsLocked(false);
    setSelectedOptionIndex(null);
    setCorrectOptionIndex(null);

    soundManager.playCountdown(false);
    setCountdownText('3');

    setTimeout(() => {
      soundManager.playCountdown(false);
      setCountdownText('2');

      setTimeout(() => {
        soundManager.playCountdown(false);
        setCountdownText('1');

        setTimeout(() => {
          soundManager.playCountdown(true);
          setCountdownText('GO!');

          setTimeout(() => {
            setCountdownText('');
            setPhase('racing');
            raceStartTimeRef.current = Date.now();
            lastTimeRef.current = performance.now();

            // Set all pods to racing
            const racingPods = podsRef.current.map((p) => ({
              ...p,
              status: 'racing' as const,
            }));
            setPods(racingPods);
            podsRef.current = racingPods;

            // Start bot timers
            [1, 2, 3].forEach((idx) => scheduleBotCycle(idx, settings));
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  }, [playerName, settings, initPods, scheduleBotCycle]);

  // Human Answer handler
  const handleHumanAnswer = useCallback(
    (optionIndex: number, value: number, isCorrect: boolean) => {
      if (phase !== 'racing' || isLocked || !currentQuestion) return;

      setSelectedOptionIndex(optionIndex);

      if (isCorrect) {
        soundManager.playCorrect();

        const updatedPods = [...podsRef.current];
        const human = updatedPods[0];
        human.logicalS += STEP_PX;
        human.correctCount += 1;
        human.status = 'racing';

        // Check human finish
        if (human.logicalS >= COURSE_LENGTH && !human.finishedAtMs) {
          human.finishedAtMs = Date.now() - raceStartTimeRef.current;
          human.status = 'finished';

          // Race ends 2.5s after human finishes
          if (!finishTimeoutRef.current) {
            finishTimeoutRef.current = setTimeout(() => {
              endRace();
            }, 2500);
          }
        }

        setPods(updatedPods);

        // Next question immediately
        const nextQ = generateIntegerQuestion(
          settings.from,
          settings.to,
          settings.operation,
          currentQuestion.prompt
        );
        setCurrentQuestion(nextQ);
        setQuestionNumber((prev) => prev + 1);
        setSelectedOptionIndex(null);
      } else {
        soundManager.playBoom();
        setIsLocked(true);

        const correctIdx = currentQuestion.options.findIndex((o) => o.isCorrect);
        setCorrectOptionIndex(correctIdx);

        const updatedPods = [...podsRef.current];
        const human = updatedPods[0];
        human.wrongCount += 1;
        human.status = 'sputtering';
        human.missed.push({
          prompt: currentQuestion.prompt,
          correctAnswer: currentQuestion.answer,
          userAnswer: value,
        });
        setPods(updatedPods);

        // Unlock after 1.5s lock
        setTimeout(() => {
          setIsLocked(false);
          setSelectedOptionIndex(null);
          setCorrectOptionIndex(null);
          if (podsRef.current[0]) {
            podsRef.current[0].status = 'racing';
          }
          const nextQ = generateIntegerQuestion(
            settings.from,
            settings.to,
            settings.operation,
            currentQuestion.prompt
          );
          setCurrentQuestion(nextQ);
          setQuestionNumber((prev) => prev + 1);
        }, WRONG_LOCK_MS);
      }
    },
    [phase, isLocked, currentQuestion, settings]
  );

  // End race and transition to Results
  const endRace = useCallback(() => {
    stopAllTimers();
    const elapsedMs = Date.now() - raceStartTimeRef.current;

    // Calculate projected finish times for any unfinished pods and rank them
    const evaluated = podsRef.current.map((pod) => {
      const projTime = calculateProjectedFinishTime(pod, elapsedMs, settings.speed);
      return {
        ...pod,
        projectedFinishTimeMs: projTime,
      };
    });

    const ranked = rankPods(evaluated);
    setPods(ranked);
    podsRef.current = ranked;
    setPhase('results');
  }, [settings.speed, stopAllTimers]);

  // Main 60fps Physics & Smooth Motion Animation Loop
  useEffect(() => {
    if (phase !== 'racing' && phase !== 'countdown' && phase !== 'finished') {
      return;
    }

    let isRunning = true;

    const loop = (time: number) => {
      if (!isRunning) return;

      if (!lastTimeRef.current) lastTimeRef.current = time;
      const rawDt = (time - lastTimeRef.current) / 1000;
      const dt = Math.min(0.05, Math.max(0.001, rawDt)); // Clamp dt to 50ms
      lastTimeRef.current = time;

      const driftSpeed = DRIFT_PX_PER_S[settings.speed] || 20;
      const currentPods = [...podsRef.current];

      // Update pod physics
      currentPods.forEach((pod) => {
        if (phase === 'racing' && pod.status !== 'finished') {
          // Constant drift for all pods
          pod.logicalS += driftSpeed * dt;

          if (pod.logicalS >= COURSE_LENGTH && !pod.finishedAtMs) {
            pod.finishedAtMs = Date.now() - raceStartTimeRef.current;
            pod.status = 'finished';

            if (pod.isHuman && !finishTimeoutRef.current) {
              finishTimeoutRef.current = setTimeout(() => {
                endRace();
              }, 2500);
            }
          }
        }

        // Display position smoothing: displayS += (logicalS - displayS) * (1 - exp(-dt / 0.22))
        pod.displayS += (pod.logicalS - pod.displayS) * (1 - Math.exp(-dt / 0.22));

        // Heading smoothing toward path tangent: heading += angleDiff * (1 - exp(-dt / 0.12))
        const coursePt = getCoursePointAt(pod.displayS);
        const targetAngle = coursePt.angle;

        let angleDiff = targetAngle - pod.heading;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        pod.heading += angleDiff * (1 - Math.exp(-dt / 0.12));
      });

      // Smooth Camera follow: follows human pod + 120px look-ahead, smoothed with 0.35s time constant
      const human = currentPods[0];
      if (human) {
        const humanPt = getCoursePointAt(human.displayS);
        const lookAheadX = Math.cos(human.heading) * 120;
        const lookAheadY = Math.sin(human.heading) * 120;

        const targetCamX = humanPt.x + lookAheadX - DESIGN_W / 2;
        const targetCamY = humanPt.y + lookAheadY - DESIGN_H / 2;

        cameraRef.current.x += (targetCamX - cameraRef.current.x) * (1 - Math.exp(-dt / 0.35));
        cameraRef.current.y += (targetCamY - cameraRef.current.y) * (1 - Math.exp(-dt / 0.35));
      }

      setPods([...currentPods]);
      setCamera({ ...cameraRef.current });

      rAFRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    rAFRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [phase, settings.speed, endRace]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-900 p-2 sm:p-4 flex flex-col items-center justify-start py-4 font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Header Bar (Matching Reference Screenshots & Consistent with all games) */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c05a00] tracking-tight">
              Orbit Integers
            </h1>
            <p className="text-xs sm:text-sm text-[#c05a00]/90 font-medium">
              Math Games, Integer Games
            </p>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#c05a00] hover:bg-amber-200/50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* 1010x577 Scaled Game Window Container */}
        <GameWindow>
          <div className="relative w-full h-full bg-[#02082e] overflow-hidden select-none font-sans">
            {/* Step 1: Player Name Screen */}
            {phase === 'name' && (
              <NameScreen
                onNext={(name) => {
                  setPlayerName(name);
                  setPhase('options');
                }}
              />
            )}

            {/* Step 2: Options Screen */}
            {phase === 'options' && (
              <OptionsScreen
                onNext={(opt) => {
                  setSettings(opt);
                  setPhase('lobby');
                }}
              />
            )}

            {/* Step 3: Generic Lobby Screen */}
            {phase === 'lobby' && (
              <LobbyScreen
                playerName={playerName}
                onStart={startCountdown}
                onLeave={() => setPhase('options')}
              />
            )}

            {/* Step 4 & 5: Countdown & Active Space Race Screen */}
            {(phase === 'countdown' || phase === 'racing' || phase === 'finished') && (
              <div className="relative w-full h-full">
                {/* Parallax Space Scene */}
                <SpaceScene
                  pods={pods}
                  cameraX={camera.x}
                  cameraY={camera.y}
                  status={phase}
                />

                {/* Countdown Overlay (3, 2, 1, GO!) */}
                {countdownText && (
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="relative flex items-center justify-center animate-ping-once">
                      <div className="absolute w-40 h-40 rounded-full border-4 border-amber-400 opacity-60 animate-ping" />
                      <span className="text-6xl sm:text-8xl font-black italic tracking-wider text-amber-400 drop-shadow-[0_0_30px_#f59e0b]">
                        {countdownText}
                      </span>
                    </div>
                  </div>
                )}

                {/* Question Panel (Bottom) with Integrated Mini-Map & Progress Badge */}
                <QuestionPanel
                  question={currentQuestion}
                  questionNumber={questionNumber}
                  playerName={playerName}
                  playerColor="blue"
                  onAnswer={handleHumanAnswer}
                  isLocked={isLocked}
                  selectedOptionIndex={selectedOptionIndex}
                  correctOptionIndex={correctOptionIndex}
                  disabled={phase !== 'racing'}
                  pods={pods}
                  correctCount={pods[0]?.correctCount || 0}
                />
              </div>
            )}

            {/* Step 6: Results Screen */}
            {phase === 'results' && (
              <ResultsScreen
                pods={pods}
                totalTimeMs={Date.now() - raceStartTimeRef.current}
                onPlayAgain={() => {
                  setPhase('lobby');
                }}
              />
            )}
          </div>
        </GameWindow>
      </div>
    </div>
  );
};
