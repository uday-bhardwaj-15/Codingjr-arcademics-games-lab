'use client';

import React from 'react';

interface CountdownCardProps {
  value: number | string; // 3, 2, 1, or 'GO!'
}

export function CountdownCard({ value }: CountdownCardProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none select-none">
      {/* 346x346 Card Container */}
      <div className="relative w-[346px] h-[346px] -mt-10 bg-[#b0d8e8]/95 border-4 border-[#7ab6cc] rounded-2xl shadow-2xl flex items-center justify-center">
        {/* 4 Corner Orange Buoys */}
        <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-600 border-2 border-orange-950 shadow-md" />
        <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-600 border-2 border-orange-950 shadow-md" />
        <div className="absolute -bottom-3 -left-3 w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-600 border-2 border-orange-950 shadow-md" />
        <div className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-600 border-2 border-orange-950 shadow-md" />

        {/* Big Number Display */}
        <span className="text-[140px] sm:text-[160px] font-black text-[#2c7a94] drop-shadow-[0_4px_8px_rgba(44,122,148,0.3)] leading-none select-none">
          {value}
        </span>
      </div>
    </div>
  );
}
