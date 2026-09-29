'use client';

import React from 'react';

interface HitMissBoxProps {
  hits: number;
  misses: number;
}

export const HitMissBox: React.FC<HitMissBoxProps> = ({ hits, misses }) => {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* HIT box */}
      <div className="flex items-center bg-[#2B0F1F] border border-rose-900/80 rounded-xs px-2 py-0.5 shadow-md">
        <span className="text-[10px] sm:text-xs font-black uppercase text-rose-200 mr-1.5">
          HIT
        </span>
        <span className="text-sm sm:text-base font-black text-white min-w-[16px] text-center">
          {hits}
        </span>
      </div>

      {/* MISS box */}
      <div className="flex items-center bg-[#2B0F1F] border border-rose-900/80 rounded-xs px-2 py-0.5 shadow-md">
        <span className="text-[10px] sm:text-xs font-black uppercase text-rose-200 mr-1.5">
          MISS
        </span>
        <span className="text-sm sm:text-base font-black text-white min-w-[16px] text-center">
          {misses}
        </span>
      </div>
    </div>
  );
};
