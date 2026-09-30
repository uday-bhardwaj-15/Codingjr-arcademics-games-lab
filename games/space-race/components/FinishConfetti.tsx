'use client';

import React from 'react';
import { ShipState } from '../types';

interface FinishConfettiProps {
  humanShip: ShipState;
  winner: ShipState;
}

export function FinishConfetti({ humanShip, winner }: FinishConfettiProps) {
  const isHumanWinner = winner.id === humanShip.id;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 flex flex-col items-center justify-center overflow-hidden">
      {/* Winner Banner */}
      <div className="px-8 py-3 rounded-2xl bg-slate-900/90 border-2 border-amber-400 text-white shadow-[0_0_40px_rgba(245,158,11,0.5)] flex flex-col items-center animate-in zoom-in-75 duration-300">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-300 uppercase">
          {isHumanWinner ? '🌟 VICTORY! 🌟' : '🏁 RACE COMPLETE! 🏁'}
        </span>
        <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white drop-shadow">
          {winner.name} Wins!
        </span>
      </div>

      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => {
          const left = `${(i * 3.3) % 100}%`;
          const delay = `${(i * 0.1) % 1.5}s`;
          const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444'];
          const color = colors[i % colors.length];

          return (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-sm animate-bounce"
              style={{
                left,
                top: `${(i * 7) % 60}%`,
                backgroundColor: color,
                animationDelay: delay,
                animationDuration: '1.2s',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
