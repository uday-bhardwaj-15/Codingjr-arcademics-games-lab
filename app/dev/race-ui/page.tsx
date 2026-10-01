'use client';

import React, { useState } from 'react';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { RoadWorld } from '@/games/drag-race/components/RoadWorld';
import { CarMotion } from '@/games/drag-race/components/CarMotion';
import { ProgressRail } from '@/games/drag-race/components/ProgressRail';
import { ForegroundFoliage } from '@/games/drag-race/components/ForegroundFoliage';
import { QuestionPanel } from '@/games/drag-race/components/QuestionPanel';
import { RacerProgress } from '@/games/drag-race/types';

export default function DevRaceUIPage() {
  // Static mock racers matching start line side-by-side positioning
  const mockRacers: RacerProgress[] = [
    {
      id: 'human_player',
      name: 'Player396',
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
    {
      id: 'bot_1',
      name: 'Computer 2',
      color: 'yellow',
      isBot: true,
      lane: 1,
      progress: 0,
      currentQuestionIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      finished: false,
      speed: 0,
    },
    {
      id: 'bot_2',
      name: 'Computer 3',
      color: 'red',
      isBot: true,
      lane: 2,
      progress: 0,
      currentQuestionIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      finished: false,
      speed: 0,
    },
    {
      id: 'bot_3',
      name: 'Computer 4',
      color: 'orange',
      isBot: true,
      lane: 3,
      progress: 0,
      currentQuestionIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      finished: false,
      speed: 0,
    },
  ];

  const mockOptions = [
    { id: 'opt_1', value: 12 },
    { id: 'opt_2', value: 8 },
    { id: 'opt_3', value: 13 },
    { id: 'opt_4', value: 10 },
  ];

  const [feedback, setFeedback] = useState<{ correctIndex?: number; wrongIndex?: number } | null>(null);
  const [isSurging, setIsSurging] = useState<boolean>(false);

  const handleAnswer = (val: number, idx: number) => {
    if (val === 10) {
      setFeedback({ correctIndex: idx });
      setIsSurging(true);
      setTimeout(() => setIsSurging(false), 500);
    } else {
      setFeedback({ wrongIndex: idx });
    }
    setTimeout(() => setFeedback(null), 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] flex flex-col items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Preview Title Bar */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c05a00] tracking-tight">
              Drag Race UI Preview (Dev Mock)
            </h1>
            <p className="text-xs sm:text-sm text-[#c05a00]/90 font-medium">
              Reference Mock Parity Verification • 1010 × 577 Design Stage
            </p>
          </div>
          <div className="text-xs font-mono bg-amber-200/60 text-amber-950 px-2.5 py-1 rounded-md border border-amber-300">
            Dev Route: /dev/race-ui
          </div>
        </div>

        {/* 1010x577 GameWindow */}
        <GameWindow>
          <RoadWorld isRacing={true} isSurging={isSurging} humanProgress={0}>
            {/* 1. Progress Rail (Right Side) */}
            <ProgressRail racers={mockRacers} />

            {/* 2. 4 Race Cars with Old Dragster Art + Step Gap Placement */}
            {mockRacers.map((racer, idx) => (
              <CarMotion
                key={racer.id}
                color={racer.color}
                name={racer.name}
                isHuman={!racer.isBot}
                lane={idx}
                theirSteps={racer.correctCount}
                yourSteps={0}
                state={isSurging && !racer.isBot ? 'boost' : 'idle'}
                isBoosting={isSurging && !racer.isBot}
              />
            ))}

            {/* 3. Foreground Foliage (Bottom Corners behind panel) */}
            <ForegroundFoliage />

            {/* 4. Question Panel (Hero Element Bottom-Center) */}
            <QuestionPanel
              playerName="Player396"
              questionNumber={1}
              expression="20 ÷ 2"
              options={mockOptions}
              onAnswer={handleAnswer}
              feedback={feedback}
            />
          </RoadWorld>
        </GameWindow>
      </div>
    </div>
  );
}
