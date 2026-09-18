'use client';

import React from 'react';
import { PlayerRunState } from '../types';
import { PlayerColor } from '@/core/types/player';

interface ProgressRailProps {
  players: PlayerRunState[];
  targetRounds: number;
}

const COLOR_DOTS: Record<PlayerColor, string> = {
  blue: '#0066ff',
  yellow: '#ffcc00',
  red: '#ee2211',
  orange: '#ff7700',
};

export const ProgressRail: React.FC<ProgressRailProps> = ({ players, targetRounds }) => {
  return (
    <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-8 z-20 flex flex-col items-center">
      {/* Translucent White Vertical Bar (Matches Screenshot 2 & 3 exactly) */}
      <div className="relative w-3.5 sm:w-4 h-32 sm:h-44 bg-white/70 backdrop-blur-xs rounded-full border border-white/90 shadow-sm flex flex-col justify-end p-0.5">
        {/* Track Line */}
        <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300/60 rounded-full" />

        {/* 4 Colored Player Progress Marker Dots */}
        {players.map((p, idx) => {
          const colorHex = COLOR_DOTS[p.color] || '#0066ff';
          const ratio = Math.min(p.correctCount / targetRounds, 1);
          // Bottom percentage from 0% to 90%
          const bottomPercent = ratio * 88;
          // Offset slightly horizontally for overlapping dots
          const horizontalOffset = (idx - 1.5) * 3;

          return (
            <div
              key={p.playerId}
              className="absolute transition-all duration-300 ease-out -translate-x-1/2 left-1/2 flex items-center justify-center"
              style={{
                bottom: `${bottomPercent}%`,
                transform: `translateX(calc(-50% + ${horizontalOffset}px))`,
              }}
              title={`${p.name}: ${p.correctCount}/${targetRounds}`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full shadow-md border border-white"
                style={{ backgroundColor: colorHex }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
