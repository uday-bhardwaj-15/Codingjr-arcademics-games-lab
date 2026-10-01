'use client';

import React from 'react';

interface SpeedLinesProps {
  speedFactor: number; // 0 (still) to 1.4 (surge)
  className?: string;
}

export const SpeedLines: React.FC<SpeedLinesProps> = ({ speedFactor, className = '' }) => {
  if (speedFactor <= 1.05) return null;

  const opacity = Math.min(1, Math.max(0, (speedFactor - 1.05) / 0.35));

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-15 transition-opacity duration-300 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* 1. Perspective Radial Streaks strictly near screen edges */}
      <svg viewBox="0 0 1010 577" className="w-full h-full">
        {/* Left Peripheral Streaks */}
        <line x1="505" y1="105" x2="0" y2="220" stroke="#ffffff" strokeWidth="2" strokeDasharray="30 80" opacity="0.65" />
        <line x1="505" y1="105" x2="0" y2="340" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="40 90" opacity="0.75" />
        <line x1="505" y1="105" x2="0" y2="480" stroke="#ffffff" strokeWidth="3" strokeDasharray="50 100" opacity="0.75" />
        <line x1="505" y1="105" x2="120" y2="577" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="40 90" opacity="0.7" />

        {/* Right Peripheral Streaks */}
        <line x1="505" y1="105" x2="1010" y2="220" stroke="#ffffff" strokeWidth="2" strokeDasharray="30 80" opacity="0.65" />
        <line x1="505" y1="105" x2="1010" y2="340" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="40 90" opacity="0.75" />
        <line x1="505" y1="105" x2="1010" y2="480" stroke="#ffffff" strokeWidth="3" strokeDasharray="50 100" opacity="0.75" />
        <line x1="505" y1="105" x2="890" y2="577" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="40 90" opacity="0.7" />
      </svg>

      {/* 2. Soft Edge Tunnel Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 65%, rgba(255,255,255,0.18) 100%)',
        }}
      />
    </div>
  );
};
