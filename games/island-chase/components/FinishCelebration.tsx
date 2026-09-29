'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RacerState } from '../types';

interface FinishCelebrationProps {
  humanRacer: RacerState;
  winner: RacerState;
}

export function FinishCelebration({ humanRacer, winner }: FinishCelebrationProps) {
  const isHumanWinner = winner.id === humanRacer.id;

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#f59e0b', '#ef4444', '#10b981', '#ffffff'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-center justify-center pointer-events-none select-none animate-in fade-in duration-300">
      <div className="bg-[#102a33]/90 border-4 border-amber-400/80 rounded-2xl px-12 py-8 text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-4xl sm:text-5xl font-black italic tracking-wide text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
          {isHumanWinner ? '🏆 YOU WIN! 🏆' : '🏁 NICE RACE! 🏁'}
        </h2>
        <p className="text-lg sm:text-xl font-extrabold text-white">
          {isHumanWinner
            ? 'First Place Finish! Outstanding Speed!'
            : `${winner.name} crossed the finish line!`}
        </p>
      </div>
    </div>
  );
}
