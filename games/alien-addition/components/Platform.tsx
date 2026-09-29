'use client';

import React from 'react';

export function Platform() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[88px] pointer-events-none select-none z-10">
      {/* 1. Light Lavender-Gray Metallic Platform Slab in slight perspective */}
      <div className="absolute inset-x-8 top-0 h-4 bg-gradient-to-b from-[#E2DDE8] via-[#C5BDCC] to-[#8E8594] border-t-2 border-white/90 shadow-md">
        {/* Top Perspective Highlight Line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-white" />
      </div>

      {/* Two Support Legs */}
      <div className="absolute left-[28%] top-4 w-4 h-9 bg-[#7D7584] border-x border-[#5C5562] shadow-inner" />
      <div className="absolute right-[28%] top-4 w-4 h-9 bg-[#7D7584] border-x border-[#5C5562] shadow-inner" />

      {/* 2. Magenta / Red Ground Strip at the very bottom (54px high) */}
      <div className="absolute inset-x-0 bottom-0 h-[54px] bg-gradient-to-r from-[#B0234A] via-[#981C3D] to-[#8E1B3C] border-t-2 border-rose-400/30 shadow-2xl" />
    </div>
  );
}
