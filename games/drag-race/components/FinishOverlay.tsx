'use client';

import React from 'react';

interface FinishOverlayProps {
  winnerName?: string;
  isWinner?: boolean;
  rank?: number;
}

const CONFETTI_PIECES = [
  { x: 120, y: 50, rot: 15, color: '#FFD700', size: 14 },
  { x: 240, y: 90, rot: -25, color: '#FF3366', size: 16 },
  { x: 360, y: 40, rot: 45, color: '#33CCFF', size: 12 },
  { x: 500, y: 70, rot: -10, color: '#33FF66', size: 18 },
  { x: 640, y: 45, rot: 30, color: '#FF9933', size: 14 },
  { x: 780, y: 90, rot: -35, color: '#CC33FF', size: 16 },
  { x: 900, y: 60, rot: 20, color: '#FFD700', size: 12 },
  { x: 160, y: 160, rot: -40, color: '#33FF66', size: 15 },
  { x: 320, y: 180, rot: 15, color: '#FF3366', size: 14 },
  { x: 680, y: 170, rot: -20, color: '#FFD700', size: 16 },
  { x: 840, y: 150, rot: 35, color: '#33CCFF', size: 14 },
];

export const FinishOverlay: React.FC<FinishOverlayProps> = ({ isWinner = true, rank = 1 }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-14 pointer-events-none select-none bg-black/45 backdrop-blur-[2px] animate-fade-in-up">
      {/* Floating Confetti Elements */}
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-xs shadow-md animate-bounce"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rot}deg)`,
            animationDelay: `${(i % 5) * 0.12}s`,
          }}
        />
      ))}

      {/* Main Finish Celebration Badge */}
      <div className="relative flex flex-col items-center gap-2 animate-[correctPop_0.45s_ease-out]">
        <div className="px-10 py-3.5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-4 border-white text-amber-950 font-fredoka font-black text-3xl sm:text-4xl shadow-[0_12px_35px_rgba(0,0,0,0.75)] flex items-center gap-4">
          {/* Checkered Flag Icon */}
          <div className="w-9 h-7 rounded-sm overflow-hidden border-2 border-black grid grid-cols-2 grid-rows-2">
            <div className="bg-white" />
            <div className="bg-black" />
            <div className="bg-black" />
            <div className="bg-white" />
          </div>

          <span className="tracking-wider drop-shadow-sm uppercase">
            {isWinner ? '🏆 YOU WON 1ST PLACE! 🏆' : `RACE FINISHED! YOU PLACED #${rank}`}
          </span>

          <div className="w-9 h-7 rounded-sm overflow-hidden border-2 border-black grid grid-cols-2 grid-rows-2">
            <div className="bg-black" />
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-black" />
          </div>
        </div>

        <span className="font-fredoka text-white/90 text-sm font-bold tracking-wide drop-shadow-md">
          Calculating final scores...
        </span>
      </div>
    </div>
  );
};
