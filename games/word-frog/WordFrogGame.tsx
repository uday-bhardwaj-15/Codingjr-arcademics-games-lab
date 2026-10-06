'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { soundManager } from '@/core/audio/soundManager';
import { ArcadeStorage } from '@/core/state/storage';
import {
  WordFrogSettings,
  Question,
  OptionFly,
  GameSummary,
  MissedWordRecord,
} from './types';
import { DEFAULT_SETTINGS, FLY_POSITIONS } from './constants';
import { generateFrogQuestion } from './engine/questionGenerator';
import { PondScene } from './components/PondScene';
import { PondHud } from './components/PondHud';
import { NameScreen } from './screens/NameScreen';
import { OptionsScreen } from './screens/OptionsScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { ResultsScreen } from './screens/ResultsScreen';

type GamePhase = 'name' | 'options' | 'lobby' | 'countdown' | 'playing' | 'results';

interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const WordFrogGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('name');
  const [playerName, setPlayerName] = useState('Player742');
  const [settings, setSettings] = useState<WordFrogSettings>(DEFAULT_SETTINGS);
  const [showOnboarding, setShowOnboarding] = useState(true); // Interactive tooltip guide on first game

  // Load saved profile & settings
  useEffect(() => {
    try {
      const profile = ArcadeStorage.getPlayerProfile();
      if (profile?.name) setPlayerName(profile.name);

      const savedSettings = ArcadeStorage.getGameSettings<WordFrogSettings>('word-frog', DEFAULT_SETTINGS);
      if (savedSettings) setSettings(savedSettings);
    } catch {
      // fallback
    }
  }, []);

  // Audio mute state
  const [soundOn, setSoundOn] = useState(true);

  // Active Game State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isWrongLocked, setIsWrongLocked] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  // Frog Animation & Tongue Lash States
  const [frogStatus, setFrogStatus] = useState<'idle' | 'shooting' | 'retracting' | 'chewing' | 'miss'>('idle');
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [tongueProgress, setTongueProgress] = useState(0);
  const [eatenFlyIndex, setEatenFlyIndex] = useState<number | null>(null);
  const [wrongFlyIndex, setWrongFlyIndex] = useState<number | null>(null);

  // Missed words for review
  const missedWordsRef = useRef<MissedWordRecord[]>([]);
  const startTimeRef = useRef<number>(0);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean timers
  const stopAllTimers = useCallback(() => {
    if (roundTimerRef.current) {
      clearInterval(roundTimerRef.current);
      roundTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAllTimers();
  }, [stopAllTimers]);

  // Handle Fullscreen toggle
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setMuted(!next);
  };

  // End round and show results
  const endRound = useCallback(() => {
    stopAllTimers();
    setPhase('results');
  }, [stopAllTimers]);

  // Start countdown sequence
  const startCountdown = useCallback(() => {
    setPhase('countdown');
    setHits(0);
    setMisses(0);
    missedWordsRef.current = [];
    setTimeLeft(settings.durationSeconds);
    setFrogStatus('idle');
    setTargetPosition(null);
    setTongueProgress(0);
    setEatenFlyIndex(null);
    setWrongFlyIndex(null);
    setIsWrongLocked(false);
    setScorePopups([]);

    const q1 = generateFrogQuestion(settings.category);
    setCurrentQuestion(q1);

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
            setPhase('playing');
            startTimeRef.current = Date.now();

            // Start timed round if duration > 0
            if (settings.durationSeconds > 0) {
              const totalSec = settings.durationSeconds;
              const startTs = Date.now();

              roundTimerRef.current = setInterval(() => {
                const elapsedSec = (Date.now() - startTs) / 1000;
                const remain = Math.max(0, totalSec - elapsedSec);
                setTimeLeft(remain);

                if (remain <= 0) {
                  endRound();
                }
              }, 200);
            }
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  }, [settings, endRound]);

  // Handle player clicking / selecting a fly
  const handleSelectFly = useCallback(
    (option: OptionFly, index: number) => {
      if (showOnboarding) setShowOnboarding(false);
      if (phase !== 'playing' || isWrongLocked || !currentQuestion || frogStatus === 'shooting' || frogStatus === 'retracting') return;

      const flyPos = FLY_POSITIONS[index] || { x: 505, y: 245 };
      setTargetPosition(flyPos);

      if (option.isCorrect) {
        soundManager.playCorrect();
        setHits((h) => h + 1);

        // 1. Shoot Tongue outward with smooth cubic ease-out (~120ms)
        setFrogStatus('shooting');
        setTongueProgress(0);

        let shootStart: number | null = null;
        const shootDur = 120;

        const shootOut = (now: number) => {
          if (!shootStart) shootStart = now;
          const rawLinear = Math.min(1, (now - shootStart) / shootDur);
          // Cubic ease-out: starts ultra-fast, snaps precisely to fly
          const easedProgress = 1 - Math.pow(1 - rawLinear, 3);
          setTongueProgress(easedProgress);

          if (rawLinear < 1) {
            animFrameRef.current = requestAnimationFrame(shootOut);
          } else {
            // Reached fly: mark eaten & retract tongue back to mouth (~100ms) with quadratic ease-in
            setEatenFlyIndex(index);
            setFrogStatus('retracting');

            let retractStart: number | null = null;
            const retractDur = 100;

            const snapBack = (retractNow: number) => {
              if (!retractStart) retractStart = retractNow;
              const rLinear = Math.min(1, (retractNow - retractStart) / retractDur);
              // Quadratic ease-in: starts gentle and accelerates into mouth
              const rProgress = Math.max(0, 1 - Math.pow(rLinear, 2));
              setTongueProgress(rProgress);

              if (rLinear < 1) {
                animFrameRef.current = requestAnimationFrame(snapBack);
              } else {
                // Fully retracted: spawn score popup & frog chews
                setFrogStatus('chewing');
                setTongueProgress(0);
                setTargetPosition(null);

                // Add floating popup
                const newPopup: ScorePopup = {
                  id: Date.now() + Math.random(),
                  text: '+100',
                  x: 505,
                  y: 160,
                };
                setScorePopups((prev) => [...prev, newPopup]);
                setTimeout(() => {
                  setScorePopups((prev) => prev.filter((p) => p.id !== newPopup.id));
                }, 850);

                setTimeout(() => {
                  setFrogStatus('idle');
                  setEatenFlyIndex(null);
                  const nextQ = generateFrogQuestion(settings.category, currentQuestion.prompt);
                  setCurrentQuestion(nextQ);
                }, 320);
              }
            };

            animFrameRef.current = requestAnimationFrame(snapBack);
          }
        };

        animFrameRef.current = requestAnimationFrame(shootOut);
      } else {
        soundManager.playBoom();
        setMisses((m) => m + 1);
        setIsWrongLocked(true);
        setWrongFlyIndex(index);
        setFrogStatus('miss');

        missedWordsRef.current.push({
          prompt: currentQuestion.prompt,
          correctAnswer: currentQuestion.answer,
          userAnswer: option.word,
          category: currentQuestion.categoryLabel,
        });

        // 0.8s Wrong Lockout shake
        setTimeout(() => {
          setIsWrongLocked(false);
          setWrongFlyIndex(null);
          setFrogStatus('idle');
          setTargetPosition(null);
        }, 800);
      }
    },
    [showOnboarding, phase, isWrongLocked, currentQuestion, frogStatus, settings.category]
  );

  // Compute live WPM
  const elapsedMinutes = Math.max(0.1, (Date.now() - (startTimeRef.current || Date.now())) / 60000);
  const liveWpm = Math.round(hits / elapsedMinutes);

  // Prepare Summary for Results Screen
  const totalAnswered = hits + misses;
  const accuracy = totalAnswered > 0 ? Math.round((hits / totalAnswered) * 100) : 100;
  const summary: GameSummary = {
    hits,
    misses,
    totalAnswered,
    accuracy,
    wordsPerMinute: liveWpm,
    durationSeconds: settings.durationSeconds,
    missed: missedWordsRef.current,
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-900 p-2 sm:p-4 flex flex-col items-center justify-start py-4 font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c05a00] tracking-tight">
              Word Frog
            </h1>
            <p className="text-xs sm:text-sm text-[#c05a00]/90 font-medium">
              Language Arts Games, Antonyms
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

        {/* Scaled 1010 x 577 Game Window */}
        <GameWindow>
          <div className="relative w-full h-full bg-[#74b9d8] overflow-hidden select-none font-sans">
            {/* Step 1: Name Screen */}
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

            {/* Step 3: Lobby Screen */}
            {phase === 'lobby' && (
              <LobbyScreen
                playerName={playerName}
                categoryLabel={settings.category.toUpperCase()}
                onStart={startCountdown}
                onBack={() => setPhase('options')}
              />
            )}

            {/* Step 4 & 5: Countdown & Active Pond Play Screen */}
            {(phase === 'countdown' || phase === 'playing') && (
              <div className="relative w-full h-full">
                <PondScene
                  question={currentQuestion}
                  frogStatus={frogStatus}
                  targetPosition={targetPosition}
                  tongueProgress={tongueProgress}
                  isWrongLocked={isWrongLocked}
                  eatenFlyIndex={eatenFlyIndex}
                  wrongFlyIndex={wrongFlyIndex}
                  scorePopups={scorePopups}
                  showOnboarding={showOnboarding}
                  onDismissOnboarding={() => setShowOnboarding(false)}
                  onSelectFly={handleSelectFly}
                  disabled={phase !== 'playing'}
                />

                {/* Countdown 3, 2, 1, GO! overlay */}
                {countdownText && (
                  <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                    <div className="relative flex items-center justify-center animate-ping-once">
                      <div className="absolute w-40 h-40 rounded-full border-4 border-amber-400 opacity-60 animate-ping" />
                      <span className="text-6xl sm:text-8xl font-black italic tracking-wider text-amber-400 drop-shadow-[0_0_30px_#f59e0b]">
                        {countdownText}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom HUD Bar (TIME, sound, HIT/MISS, RATE) */}
                <PondHud
                  hits={hits}
                  misses={misses}
                  timeLeftSeconds={timeLeft}
                  totalTimeSeconds={settings.durationSeconds}
                  wordsPerMinute={liveWpm}
                  soundOn={soundOn}
                  onToggleSound={handleToggleSound}
                />
              </div>
            )}

            {/* Step 6: Results Screen */}
            {phase === 'results' && (
              <ResultsScreen
                summary={summary}
                onPlayAgain={startCountdown}
                onOptions={() => setPhase('options')}
              />
            )}
          </div>
        </GameWindow>
      </div>
    </div>
  );
};
