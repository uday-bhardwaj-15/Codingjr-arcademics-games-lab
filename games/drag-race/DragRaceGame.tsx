'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DivisionQuestion, RacerProgress, RaceRoundResult, PlayerColor } from './types';
import { TOTAL_QUESTIONS, DEFAULT_BOT_NAMES, BOT_COLORS } from './constants';
import { generateDivisionQuestions } from './engine/questionGenerator';
import { DragTrack } from './components/DragTrack';
import { DragCar } from './components/DragCar';
import { DragTree } from './components/DragTree';
import { RaceHUD } from './components/RaceHUD';
import { DistanceBar } from './components/DistanceBar';
import { TitleScreen } from './components/TitleScreen';
import { NameScreen } from './components/NameScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2 } from 'lucide-react';

type GameScreenState = 'title' | 'name' | 'lobby' | 'countdown' | 'racing' | 'results';

export const DragRaceGame: React.FC = () => {
  const router = useRouter();

  // Screen State
  const [screen, setScreen] = useState<GameScreenState>('title');
  const [playerName, setPlayerName] = useState<string>('Player396');
  const [playerColor] = useState<PlayerColor>('blue');

  // Race State
  const [questions, setQuestions] = useState<DivisionQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<RaceRoundResult[]>([]);
  const [racers, setRacers] = useState<RacerProgress[]>([]);
  const [treeStage, setTreeStage] = useState<'idle' | 'yellow1' | 'yellow2' | 'yellow3' | 'green'>('idle');
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [raceStartTime, setRaceStartTime] = useState<number>(0);

  const questionStartTimeRef = useRef<number>(0);
  const raceFinishedRef = useRef<boolean>(false);
  const botTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Initialize Racers
  const initRacers = useCallback((humanName: string) => {
    const list: RacerProgress[] = [
      {
        id: 'human_player',
        name: humanName,
        color: 'blue',
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
        color: BOT_COLORS[i],
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
  }, []);

  // Cleanup bot timers on unmount
  useEffect(() => {
    return () => {
      botTimersRef.current.forEach(clearTimeout);
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

      const qs = generateDivisionQuestions(TOTAL_QUESTIONS);
      setQuestions(qs);
      setCurrentQuestionIdx(0);
      setRoundResults([]);
      raceFinishedRef.current = false;
      questionStartTimeRef.current = Date.now();
      setRaceStartTime(Date.now());

      setTimeout(() => {
        setScreen('racing');
      }, 500);
    }, 2100);

    botTimersRef.current.push(t1, t2, t3);
  }, []);

  // Bot AI loop during race
  useEffect(() => {
    if (screen !== 'racing') return;

    // Schedule bot answers
    const scheduleBotStep = (botIndex: number) => {
      if (raceFinishedRef.current) return;

      // Realistic reaction time: 2.8s to 5.2s per question
      const delay = 2800 + Math.random() * 2400;

      const timer = setTimeout(() => {
        if (raceFinishedRef.current) return;

        setRacers((prev) => {
          const updated = [...prev];
          const bot = updated[botIndex + 1];
          if (!bot || bot.finished) return prev;

          // ~80% accuracy for bot
          const isCorrect = Math.random() < 0.8;
          const nextQIdx = bot.currentQuestionIndex + 1;
          const newCorrect = isCorrect ? bot.correctCount + 1 : bot.correctCount;
          const newProgress = Math.min(1, newCorrect / TOTAL_QUESTIONS);
          const finished = newProgress >= 1;

          updated[botIndex + 1] = {
            ...bot,
            currentQuestionIndex: nextQIdx,
            correctCount: newCorrect,
            incorrectCount: isCorrect ? bot.incorrectCount : bot.incorrectCount + 1,
            progress: newProgress,
            finished,
            finishTimeMs: finished ? Date.now() - raceStartTime : undefined,
          };

          return updated;
        });

        // Schedule next question for this bot if not finished
        scheduleBotStep(botIndex);
      }, delay);

      botTimersRef.current.push(timer);
    };

    DEFAULT_BOT_NAMES.forEach((_, idx) => scheduleBotStep(idx));

    return () => {
      botTimersRef.current.forEach(clearTimeout);
    };
  }, [screen, raceStartTime]);

  // Check race finish conditions
  const checkRaceEnd = useCallback(() => {
    if (raceFinishedRef.current) return;

    const allDone = racers.every((r) => r.finished);
    const humanDone = racers.find((r) => !r.isBot)?.finished;

    if (humanDone || allDone) {
      raceFinishedRef.current = true;
      botTimersRef.current.forEach(clearTimeout);

      // Assign ranks
      setRacers((prev) => {
        const sorted = [...prev].sort((a, b) => {
          if (a.finished && !b.finished) return -1;
          if (!a.finished && b.finished) return 1;
          if (a.finishTimeMs && b.finishTimeMs) return a.finishTimeMs - b.finishTimeMs;
          return b.progress - a.progress;
        });

        return prev.map((r) => {
          const rank = sorted.findIndex((s) => s.id === r.id) + 1;
          return { ...r, rank };
        });
      });

      soundManager.playVictory();
      setTimeout(() => {
        setScreen('results');
      }, 1500);
    }
  }, [racers]);

  useEffect(() => {
    if (screen === 'racing') {
      checkRaceEnd();
    }
  }, [racers, screen, checkRaceEnd]);

  // Handle human player answer
  const handleSelectAnswer = useCallback(
    (selectedAnswer: number) => {
      if (screen !== 'racing' || raceFinishedRef.current) return;

      const q = questions[currentQuestionIdx];
      if (!q) return;

      const isCorrect = selectedAnswer === q.quotient;
      const timeTaken = Date.now() - questionStartTimeRef.current;

      // Update round result history
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
        setIsBoosting(true);
        setTimeout(() => setIsBoosting(false), 800);

        setRacers((prev) => {
          const updated = [...prev];
          const human = updated[0];
          const newCorrect = human.correctCount + 1;
          const newProgress = Math.min(1, newCorrect / TOTAL_QUESTIONS);
          const finished = newProgress >= 1;

          updated[0] = {
            ...human,
            currentQuestionIndex: currentQuestionIdx + 1,
            correctCount: newCorrect,
            progress: newProgress,
            finished,
            finishTimeMs: finished ? Date.now() - raceStartTime : undefined,
          };
          return updated;
        });
      } else {
        soundManager.playBoom();
        setLastAnswerStatus('incorrect');
        setRacers((prev) => {
          const updated = [...prev];
          const human = updated[0];
          updated[0] = {
            ...human,
            currentQuestionIndex: currentQuestionIdx + 1,
            incorrectCount: human.incorrectCount + 1,
          };
          return updated;
        });
      }

      // Advance to next question
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < questions.length) {
        setTimeout(() => {
          setCurrentQuestionIdx(nextIdx);
          setLastAnswerStatus(null);
          questionStartTimeRef.current = Date.now();
        }, 350);
      } else {
        // Player answered all questions
        setTimeout(() => {
          setRacers((prev) => {
            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              finished: true,
              finishTimeMs: Date.now() - raceStartTime,
            };
            return updated;
          });
        }, 400);
      }
    },
    [screen, questions, currentQuestionIdx, raceStartTime]
  );

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'racing') return;

      const q = questions[currentQuestionIdx];
      if (!q) return;

      if (e.key === '1' && q.options[0] !== undefined) {
        handleSelectAnswer(q.options[0]);
      } else if (e.key === '2' && q.options[1] !== undefined) {
        handleSelectAnswer(q.options[1]);
      } else if (e.key === '3' && q.options[2] !== undefined) {
        handleSelectAnswer(q.options[2]);
      } else if (e.key === '4' && q.options[3] !== undefined) {
        handleSelectAnswer(q.options[3]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, questions, currentQuestionIdx, handleSelectAnswer]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Screen 1: Title Screen (Screenshot 4)
  if (screen === 'title') {
    return <TitleScreen onPlay={() => setScreen('name')} />;
  }

  // Screen 2: Name Input Screen (Screenshot 3)
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

  // Screen 3: Lobby Screen (Screenshot 2)
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
      currentQuestionIndex: TOTAL_QUESTIONS,
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

  // Screen 4: Active Racing / Countdown View (Screenshot 1)
  const currentQ = questions[currentQuestionIdx] || null;

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-2 sm:p-6 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Header Bar (Matching Screenshot 1) */}
        <div className="flex items-center justify-between px-2">
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

        {/* Main 4-Lane Speedway Canvas Frame */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-2xl overflow-hidden border border-amber-300/60 bg-[#4b58b8]">
          <DragTrack isRacing={screen === 'racing'}>
            {/* Starting Christmas Tree Light Fixture in Center (during Countdown only) */}
            {screen === 'countdown' && (
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 z-30 scale-95 sm:scale-110 pointer-events-none animate-in fade-in duration-200">
                <DragTree stage={treeStage} />
              </div>
            )}

            {/* 4 Racing Drag Cars on Track */}
            {racers.map((racer) => (
              <DragCar
                key={racer.id}
                color={racer.color}
                name={racer.name}
                isHuman={!racer.isBot}
                progress={racer.progress}
                laneIndex={racer.lane}
                isBoosting={!racer.isBot && isBoosting}
              />
            ))}

            {/* Right Vertical Track Progress Meter */}
            <DistanceBar racers={racers} />

            {/* Bottom HUD: Player Avatar + Black Question Bar + 4 Blue Answer Buttons */}
            {screen === 'racing' && currentQ && (
              <RaceHUD
                questionNumber={currentQuestionIdx + 1}
                totalQuestions={TOTAL_QUESTIONS}
                question={currentQ}
                playerName={playerName}
                playerColor={playerColor}
                onSelectAnswer={handleSelectAnswer}
                lastAnswerStatus={lastAnswerStatus}
              />
            )}
          </DragTrack>
        </div>
      </div>
    </div>
  );
};
