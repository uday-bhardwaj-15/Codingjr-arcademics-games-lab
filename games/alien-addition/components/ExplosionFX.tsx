'use client';

import React from 'react';

interface ExplosionFXProps {
  x: number; // percentage
  y: number; // percentage
}

export const ExplosionFX: React.FC<ExplosionFXProps> = ({ x, y }) => {
  return (
    <div
      className="absolute pointer-events-none z-45 transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-200"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Shockwave circle */}
        <div className="absolute w-20 h-20 rounded-full bg-yellow-400/50 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full bg-orange-500/70 blur-xs" />

        {/* Starburst SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_#ffedd5]">
          <polygon
            points="50,0 60,35 95,20 70,50 100,65 65,70 60,100 45,70 10,80 30,50 0,35 35,35"
            fill="#FFD91A"
            stroke="#EA580C"
            strokeWidth="3"
          />
          <circle cx="50" cy="50" r="16" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
};
