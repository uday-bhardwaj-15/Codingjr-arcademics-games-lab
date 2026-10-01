'use client';

import React from 'react';

interface GapPillProps {
  gap: number; // positive = ahead, negative = behind
  className?: string;
}

export const GapPill: React.FC<GapPillProps> = ({ gap, className = '' }) => {
  if (gap === 0) {
    return (
      <div
        className={`px-2 py-0.5 rounded-full bg-black/60 border border-white/30 text-white font-fredoka text-[11px] font-bold shadow-md select-none pointer-events-none ${className}`}
      >
        <span>—</span>
      </div>
    );
  }

  const isAhead = gap > 0;
  const absGap = Math.abs(gap);

  return (
    <div
      className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border shadow-md font-fredoka text-[11px] font-bold select-none pointer-events-none transition-all ${
        isAhead
          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
          : 'bg-rose-950/90 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(251,113,133,0.5)]'
      } ${className}`}
    >
      <span className="text-[10px]">{isAhead ? '▲' : '▼'}</span>
      <span>{absGap}</span>
    </div>
  );
};
