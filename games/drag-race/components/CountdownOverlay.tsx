'use client';

import React from 'react';

interface CountdownOverlayProps {
  stage: 'idle' | 'yellow1' | 'yellow2' | 'yellow3' | 'green';
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ stage }) => {
  if (stage === 'idle') return null;

  const countText =
    stage === 'yellow1'
      ? '3'
      : stage === 'yellow2'
      ? '2'
      : stage === 'yellow3'
      ? '1'
      : stage === 'green'
      ? 'GO!'
      : '';

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-6 sm:pt-8 pointer-events-none select-none">
      <div className="relative flex items-center justify-center animate-[correctPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        {/* Top Floating Countdown Indicator */}
        <div
          className="px-8 py-2 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center"
          style={{
            background:
              stage === 'green'
                ? 'linear-gradient(180deg, #22C55E 0%, #15803D 100%)'
                : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
            boxShadow:
              stage === 'green'
                ? '0 0 35px rgba(34, 197, 94, 0.9), 0 8px 16px rgba(0,0,0,0.5)'
                : '0 0 35px rgba(59, 130, 246, 0.9), 0 8px 16px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="font-fredoka font-black text-6xl sm:text-7xl italic tracking-wider text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
            style={{
              WebkitTextStroke: stage === 'green' ? '2.5px #14532D' : '2.5px #1E3A8A',
            }}
          >
            {countText}
          </span>
        </div>
      </div>
    </div>
  );
};
