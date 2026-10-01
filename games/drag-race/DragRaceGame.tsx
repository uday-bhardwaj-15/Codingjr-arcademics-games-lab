'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RacerProgress, RaceRoundResult, PlayerColor } from './types';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { RoadWorld } from './components/RoadWorld';
import { CarMotion } from './components/CarMotion';
import { ProgressRail } from './components/ProgressRail';
import { ForegroundFoliage } from './components/ForegroundFoliage';
import { QuestionPanel } from './components/QuestionPanel';
import { CountdownOverlay } from './components/CountdownOverlay';
import { FinishOverlay } from './components/FinishOverlay';
import { TitleScreen } from './components/TitleScreen';
import { NameScreen } from './components/NameScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { useRace } from './hooks/useRace';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2 } from 'lucide-react';

type GameScreenState = 'title' | 'name' | 'lobby' | 'countdown' | 'racing' | 'results';

export const DragRaceGame: React.FC = () => {
  const router = useRouter();

  // Screen State
  const [screen, setScreen] = useState<GameScreenState>('title');
  const [playerName, setPlayerName] = useState<string>('Player396');
  const [playerColor] = useState<PlayerColor>('blue');
  const [treeStage, setTreeStage] = useState<'idle' | 'yellow1' | 'yellow2' | 'yellow3' | 'green'>('idle');

  // Callback when race finishes
  const handleRaceFinish = useCallback((_finalRacers: RacerProgress[], _finalResults: RaceRoundResult[]) => {
    setTimeout(() => {
      setScreen('results');
    }, 2200);
  }, []);

  // Runner-style Race Engine Hook
  const {
    currentQuestion,
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
  } = useRace({
    playerName,
    playerColor,
    onFinish: handleRaceFinish,
  });

  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup countdown timers on unmount
  useEffect(() => {
    return () => {
      countdownTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Start Countdown Sequence
  const startCountdown = useCallback(() => {
    setScreen('countdown');
    setTreeStage('yellow1');
    soundManager.playCountdown(false);

    const t1 = setTimeout(() => {
      setTreeStage('yellow2');
      soundManager.playCountdown(false);
    }, 700);

    const t2 = setTimeout(() => {
      setTreeStage('yellow3');
      soundManager.playCountdown(false);
    }, 1400);

    const t3 = setTimeout(() => {
      setTreeStage('green');
      soundManager.playCountdown(true);

      startRace();

      setTimeout(() => {
        setScreen('racing');
      }, 500);
    }, 2100);

    countdownTimersRef.current = [t1, t2, t3];
  }, [startRace]);

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'racing' || isLocked || !currentQuestion) return;

      if (e.key === '1' && currentQuestion.options[0] !== undefined) {
        handleAnswer(currentQuestion.options[0], 0);
      } else if (e.key === '2' && currentQuestion.options[1] !== undefined) {
        handleAnswer(currentQuestion.options[1], 1);
      } else if (e.key === '3' && currentQuestion.options[2] !== undefined) {
        handleAnswer(currentQuestion.options[2], 2);
      } else if (e.key === '4' && currentQuestion.options[3] !== undefined) {
        handleAnswer(currentQuestion.options[3], 3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isLocked, currentQuestion, handleAnswer]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Screen 1: Title Screen
  if (screen === 'title') {
    return <TitleScreen onPlay={() => setScreen('name')} />;
  }

  // Screen 2: Name Input Screen
  if (screen === 'name') {
    return (
      <NameScreen
        initialName={playerName}
        onNext={(name) => {
          setPlayerName(name);
          initRacers(name);
          setScreen('lobby');
        }}
      />
    );
  }

  // Screen 3: Lobby Screen
  if (screen === 'lobby') {
    return (
      <LobbyScreen
        playerName={playerName}
        playerColor={playerColor}
        onStart={() => {
          initRacers(playerName);
          startCountdown();
        }}
        onLeave={() => router.push('/')}
        onUpdateName={(name) => {
          setPlayerName(name);
          initRacers(name);
        }}
      />
    );
  }

  // Screen 5: Results Screen
  if (screen === 'results') {
    const humanRacer = racers[0] || {
      id: 'human_player',
      name: playerName,
      color: playerColor,
      isBot: false,
      lane: 0,
      progress: 1,
      currentQuestionIndex: 10,
      correctCount: roundResults.filter((r) => r.isCorrect).length,
      incorrectCount: roundResults.filter((r) => !r.isCorrect).length,
      finished: true,
      speed: 0,
      rank: 1,
    };

    return (
      <ResultsScreen
        racers={racers}
        roundResults={roundResults}
        humanRacer={humanRacer}
        onPlayAgain={() => {
          initRacers(playerName);
          startCountdown();
        }}
        onBackToMenu={() => router.push('/')}
      />
    );
  }

  // Screen 4: Active Racing / Countdown View (3D Endless Runner World)
  const humanRacer = racers.find((r) => !r.isBot) || racers[0];
  const yourSteps = humanRacer ? humanRacer.correctCount : 0;
  const maxProgress = racers.length > 0 ? Math.max(...racers.map((r) => r.progress || 0)) : 0;

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-2 sm:p-4 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">
              Drag Race Division
            </h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">
              Math Games, Division Games
            </p>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#c2580b] hover:bg-amber-200/50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* 1010x577 Scaled Game Window Container */}
        <GameWindow>
          <RoadWorld
            isRacing={screen === 'racing' && isRacing}
            isFinished={isFinished}
            isSurging={isSurging}
            humanProgress={humanRacer ? humanRacer.progress : 0}
          >
            {/* 1. Progress Rail (Right Side) */}
            <ProgressRail racers={racers} />

            {/* 2. 4 Race Cars with Old Dragster Art + Step Gap Positioning */}
            {racers.map((racer, idx) => {
              let carState: 'idle' | 'boost' | 'sputter' | 'finished' = 'idle';
              if (racer.finished) {
                carState = 'finished';
              } else if (!racer.isBot && isSurging) {
                carState = 'boost';
              } else if (!racer.isBot && lastAnswerStatus === 'incorrect') {
                carState = 'sputter';
              }

              return (
                <CarMotion
                  key={racer.id}
                  color={racer.color}
                  name={racer.name}
                  isHuman={!racer.isBot}
                  lane={racer.lane ?? idx}
                  theirSteps={racer.correctCount}
                  yourSteps={yourSteps}
                  state={carState}
                  isBoosting={!racer.isBot && isSurging}
                />
              );
            })}

            {/* 3. Foreground Foliage (Bottom Corners behind panel) */}
            <ForegroundFoliage />

            {/* 4. Question Panel (Hero Element Bottom-Center) */}
            {screen === 'racing' && currentQuestion && (
              <QuestionPanel
                playerName={playerName}
                questionNumber={currentQuestionIdx + 1}
                expression={currentQuestion.prompt}
                options={currentQuestion.options.map((opt, idx) => ({
                  id: `opt_${idx}`,
                  value: opt,
                  label: opt,
                }))}
                onAnswer={(val, idx) => handleAnswer(val, idx)}
                disabled={isLocked || isFinished}
                feedback={
                  lastAnswerStatus === 'correct' && lastAnswerIndex !== null
                    ? { correctIndex: lastAnswerIndex }
                    : lastAnswerStatus === 'incorrect' && lastAnswerIndex !== null
                    ? {
                        wrongIndex: lastAnswerIndex,
                        correctIndex: currentQuestion.options.indexOf(currentQuestion.quotient),
                      }
                    : null
                }
              />
            )}

            {/* 5. Candy Countdown Overlay (3, 2, 1, GO!) */}
            {screen === 'countdown' && (
              <CountdownOverlay stage={treeStage} />
            )}

            {/* 6. Finish Celebration Overlay (Only during racing finish, Z-50 elevated above cars) */}
            {screen === 'racing' && isFinished && (
              <FinishOverlay
                isWinner={humanRacer?.rank === 1}
                rank={humanRacer?.rank ?? 1}
              />
            )}
          </RoadWorld>
        </GameWindow>
      </div>
    </div>
  );
};
