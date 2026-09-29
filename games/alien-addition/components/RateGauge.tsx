'use client';

import React, { useId } from 'react';

interface RateGaugeProps {
  rate: number;
  max?: number;
}

export function RateGauge({ rate, max = 20 }: RateGaugeProps) {
  const uid = useId().replace(/:/g, '');
  const angle = -90 + Math.min(Math.max(0, rate) / max, 1) * 180;

  return (
    <div className="w-14 sm:w-16 h-8 sm:h-9 flex items-center justify-center select-none">
      <svg viewBox="0 0 120 68" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`r${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#E0301E" />
            <stop offset=".5" stopColor="#FFC21A" />
            <stop offset="1" stopColor="#39C46B" />
          </linearGradient>
        </defs>
        <path d="M4 64 A56 56 0 0 1 116 64Z" fill="#8A8290" />
        <path
          d="M16 64 A44 44 0 0 1 104 64"
          fill="none"
          stroke={`url(#r${uid})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: '60px 64px',
            transition: 'transform .5s ease-out',
          }}
        >
          <path d="M60 64 L57.5 24 L62.5 24Z" fill="#FFD91A" />
        </g>
        <circle cx="60" cy="64" r="6" fill="#3a3a3a" />
        <text
          x="60"
          y="50"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#fff"
          fontFamily="system-ui, sans-serif"
          opacity=".9"
        >
          RATE
        </text>
      </svg>
    </div>
  );
}
