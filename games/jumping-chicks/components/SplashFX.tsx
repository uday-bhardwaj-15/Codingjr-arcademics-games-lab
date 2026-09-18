'use client';

import React from 'react';

export const SplashFX: React.FC = () => {
  return (
    <div className="relative pointer-events-none flex items-center justify-center select-none">
      {/* Ripple ring and splash droplets matching Screenshot 2 */}
      <svg viewBox="0 0 100 60" className="w-24 h-16 overflow-visible">
        {/* Expanding oval water ripple */}
        <ellipse
          cx="50"
          cy="30"
          rx="32"
          ry="12"
          fill="none"
          stroke="#7470b0"
          strokeWidth="3"
          className="animate-splash-ring-1"
        />
        <ellipse
          cx="50"
          cy="30"
          rx="18"
          ry="6"
          fill="#4f4b90"
          opacity="0.8"
        />

        {/* Small splash droplet particles around the ripple */}
        <g fill="#5c579e">
          <circle cx="28" cy="18" r="2.5" />
          <circle cx="36" cy="12" r="3" />
          <circle cx="50" cy="8" r="3.5" />
          <circle cx="64" cy="12" r="3" />
          <circle cx="72" cy="18" r="2.5" />
          <circle cx="22" cy="28" r="2" />
          <circle cx="78" cy="28" r="2" />
        </g>
      </svg>
    </div>
  );
};
