'use client';

import React from 'react';

interface CountdownCardProps {
  value: number | string; // 3, 2, 1, or 'GO!'
}

export function CountdownCard({ value }: CountdownCardProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none select-none">
      {/* 346x346 Card Container */}
      <div
        className="relative w-[346px] h-[346px] -mt-8 rounded-3xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, rgba(166, 236, 248, 0.95) 0%, rgba(122, 214, 242, 0.95) 100%)',
          border: '4px solid #c8f5ff',
          boxShadow: '0 0 32px #8be8f7, 0 12px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* 4 Corner 3D Orange Buoys */}
        <div className="absolute -top-3.5 -left-3.5 w-8 h-8 rounded-full bg-gradient-to-b from-[#ff8c66] via-[#f4572e] to-[#b32d0c] border-2 border-white shadow-lg" />
        <div className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-gradient-to-b from-[#ff8c66] via-[#f4572e] to-[#b32d0c] border-2 border-white shadow-lg" />
        <div className="absolute -bottom-3.5 -left-3.5 w-8 h-8 rounded-full bg-gradient-to-b from-[#ff8c66] via-[#f4572e] to-[#b32d0c] border-2 border-white shadow-lg" />
        <div className="absolute -bottom-3.5 -right-3.5 w-8 h-8 rounded-full bg-gradient-to-b from-[#ff8c66] via-[#f4572e] to-[#b32d0c] border-2 border-white shadow-lg" />

        {/* Big Navy Number Display */}
        <span className="text-[130px] sm:text-[150px] font-black text-[#0a2a72] drop-shadow-[0_4px_10px_rgba(10,42,114,0.3)] leading-none select-none">
          {value}
        </span>
      </div>
    </div>
  );
}

