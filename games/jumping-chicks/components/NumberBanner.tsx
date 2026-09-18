'use client';

import React from 'react';

interface NumberBannerProps {
  targetNumber: number;
}

export const NumberBanner: React.FC<NumberBannerProps> = ({ targetNumber }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Royal Blue Number Box (Matches Screenshot 2 & 3) */}
      <div className="w-36 sm:w-48 h-12 sm:h-14 bg-gradient-to-b from-[#0066ee] to-[#0044bb] rounded-xs shadow-lg border-2 border-[#002b80] flex items-center justify-center select-none">
        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider drop-shadow-sm font-sans">
          {targetNumber}
        </span>
      </div>
    </div>
  );
};
