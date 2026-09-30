'use client';

import React from 'react';

interface CountdownCardProps {
  value: string | number;
}

export function CountdownCard({ value }: CountdownCardProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-40">
      <div className="relative flex items-center justify-center w-56 h-56 rounded-3xl bg-slate-900/90 border-4 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.6)] backdrop-blur-md animate-in zoom-in-75 duration-300">
        <span className="text-7xl sm:text-8xl font-black italic text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] tracking-wider">
          {value}
        </span>
      </div>
    </div>
  );
}
