'use client';

import React from 'react';

interface TimeDialProps {
  secondsLeft?: number;
  elapsed?: number;
  total?: number;
}

export function TimeDial({
  secondsLeft,
  elapsed,
  total = 60,
}: TimeDialProps) {
  const currentElapsed =
    elapsed !== undefined ? elapsed : total - (secondsLeft ?? total);
  const deg = Math.min(Math.max(0, currentElapsed) / total, 1) * 360;

  return (
    <div
      className="grid aspect-square w-10 sm:w-12 place-items-center rounded-full text-[11px] sm:text-xs font-black text-white shadow-md select-none border border-slate-700/60"
      style={{
        background: `conic-gradient(#FFC21A ${deg}deg, #8A8290 0deg)`,
      }}
    >
      <div className="w-[74%] h-[74%] rounded-full bg-[#3a3540] flex items-center justify-center font-black tracking-wider text-[10px] text-white/90">
        TIME
      </div>
    </div>
  );
}
