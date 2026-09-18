'use client';

import React from 'react';

interface FinishPlatformProps {
  className?: string;
}

export const FinishPlatform: React.FC<FinishPlatformProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* SVG Finish Platform matching Image A exactly */}
      <svg
        viewBox="0 0 1000 320"
        className="w-full h-48 sm:h-64 overflow-visible drop-shadow-xl"
      >
        <defs>
          <linearGradient id="finish-platform-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7bc932" />
            <stop offset="40%" stopColor="#5ea825" />
            <stop offset="100%" stopColor="#3d8015" />
          </linearGradient>

          <linearGradient id="finish-border-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8ee03c" />
            <stop offset="100%" stopColor="#2e6410" />
          </linearGradient>
        </defs>

        {/* Goal Post Left */}
        <line x1="320" y1="120" x2="320" y2="40" stroke="#1b420d" strokeWidth="4" strokeLinecap="round" />
        <circle cx="320" cy="38" r="4" fill="#ffcc00" />

        {/* Goal Post Right */}
        <line x1="680" y1="120" x2="680" y2="40" stroke="#1b420d" strokeWidth="4" strokeLinecap="round" />
        <circle cx="680" cy="38" r="4" fill="#ffcc00" />

        {/* Yellow Finish Overhead Line */}
        <line x1="320" y1="52" x2="680" y2="52" stroke="#255613" strokeWidth="3" />

        {/* Big Circular Green Finish Platform (Matching Image A) */}
        <ellipse
          cx="500"
          cy="200"
          rx="520"
          ry="150"
          fill="url(#finish-platform-grad)"
          stroke="url(#finish-border-grad)"
          strokeWidth="6"
        />

        {/* Segmented radial leaf spokes */}
        <path d="M 500,200 L 120,120" stroke="#48881c" strokeWidth="2.5" />
        <path d="M 500,200 L 260,70" stroke="#48881c" strokeWidth="2.5" />
        <path d="M 500,200 L 500,52" stroke="#48881c" strokeWidth="2.5" />
        <path d="M 500,200 L 740,70" stroke="#48881c" strokeWidth="2.5" />
        <path d="M 500,200 L 880,120" stroke="#48881c" strokeWidth="2.5" />

        {/* Black & Yellow Checkered Finish Line (Matches Image A) */}
        <g transform="translate(260, 110)">
          {/* Row 1 */}
          <rect x="0" y="0" width="60" height="24" fill="#2d6015" />
          <rect x="60" y="0" width="60" height="24" fill="#75bb2a" />
          <rect x="120" y="0" width="60" height="24" fill="#2d6015" />
          <rect x="180" y="0" width="60" height="24" fill="#75bb2a" />
          <rect x="240" y="0" width="60" height="24" fill="#2d6015" />
          <rect x="300" y="0" width="60" height="24" fill="#75bb2a" />
          <rect x="360" y="0" width="60" height="24" fill="#2d6015" />
          <rect x="420" y="0" width="60" height="24" fill="#75bb2a" />

          {/* Row 2 */}
          <rect x="0" y="24" width="60" height="24" fill="#75bb2a" />
          <rect x="60" y="24" width="60" height="24" fill="#2d6015" />
          <rect x="120" y="24" width="60" height="24" fill="#75bb2a" />
          <rect x="180" y="24" width="60" height="24" fill="#2d6015" />
          <rect x="240" y="24" width="60" height="24" fill="#75bb2a" />
          <rect x="300" y="24" width="60" height="24" fill="#2d6015" />
          <rect x="360" y="24" width="60" height="24" fill="#75bb2a" />
          <rect x="420" y="24" width="60" height="24" fill="#2d6015" />
        </g>

        {/* Large "FINISH" Text printed across platform */}
        <text
          x="500"
          y="98"
          textAnchor="middle"
          fontSize="56"
          fontWeight="900"
          fontFamily="Impact, sans-serif"
          letterSpacing="12"
          fill="#336a18"
          opacity="0.9"
        >
          FINISH
        </text>
      </svg>
    </div>
  );
};
