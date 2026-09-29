'use client';

import React from 'react';
import { COLOR_PALETTES } from '../constants';

interface JetSkiAvatarProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function JetSkiAvatar({
  color = 'blue',
  size = 'md',
  className = '',
}: JetSkiAvatarProps) {
  const pal = COLOR_PALETTES[color] || COLOR_PALETTES.blue;

  const sizeStyles = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18 sm:w-28 sm:h-20',
    lg: 'w-32 h-24 sm:w-40 sm:h-30',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
      <svg
        viewBox="0 0 200 140"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-visible"
      >
        <defs>
          {/* Hull Gradient */}
          <linearGradient id={`hullGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pal.deck} />
            <stop offset="50%" stopColor={pal.hull} />
            <stop offset="100%" stopColor={pal.hullDark} />
          </linearGradient>

          {/* Nose Highlight */}
          <linearGradient id={`noseGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pal.highlight} />
            <stop offset="100%" stopColor={pal.hull} />
          </linearGradient>

          {/* Seat Gradient */}
          <linearGradient id="seatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5c2c16" />
            <stop offset="100%" stopColor="#2c140a" />
          </linearGradient>
        </defs>

        {/* 1. Jet Ski Seat & Back Cushion */}
        <path
          d="M 50 78 C 45 45, 80 40, 95 65 L 105 85 L 50 85 Z"
          fill="url(#seatGrad)"
          stroke="#1c0b05"
          strokeWidth="3"
        />

        {/* 2. Handlebar Post & Grips */}
        <rect x="92" y="38" width="10" height="22" rx="4" fill="#334155" />
        <path
          d="M 80 42 C 86 36, 108 36, 114 42"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="80" cy="42" r="5" fill="#475569" />
        <circle cx="114" cy="42" r="5" fill="#475569" />

        {/* 3. Main Hull Body (Angled Front Nose) */}
        <path
          d="M 25 82 L 115 82 C 160 82, 185 92, 180 115 C 176 130, 130 135, 75 125 C 30 118, 18 100, 25 82 Z"
          fill={`url(#hullGrad_${color})`}
          stroke={pal.hullDark}
          strokeWidth="3.5"
        />

        {/* 4. White Lower Water Hull Trim */}
        <path
          d="M 25 86 C 18 102, 35 122, 75 128 C 130 138, 178 132, 182 118 C 172 138, 115 142, 65 132 C 22 124, 16 102, 25 86 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* 5. Front Nose Face Shield */}
        <path
          d="M 105 80 C 120 52, 165 52, 178 80 C 185 105, 145 118, 115 110 C 102 105, 100 90, 105 80 Z"
          fill={`url(#noseGrad_${color})`}
          stroke={pal.hullDark}
          strokeWidth="2.5"
        />

        {/* 6. Big Happy Cartoon Eyes */}
        {/* Left Eye */}
        <ellipse cx="128" cy="74" rx="13" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
        <ellipse cx="132" cy="74" rx="7" ry="9" fill="#0f172a" />
        <circle cx="130" cy="70" r="3.5" fill="#ffffff" />
        <circle cx="134" cy="76" r="1.5" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="158" cy="74" rx="13" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
        <ellipse cx="154" cy="74" rx="7" ry="9" fill="#0f172a" />
        <circle cx="152" cy="70" r="3.5" fill="#ffffff" />
        <circle cx="156" cy="76" r="1.5" fill="#ffffff" />

        {/* Eyebrows */}
        <path d="M 120 55 Q 128 50 138 56" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <path d="M 148 56 Q 158 50 166 55" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

        {/* 7. Cute Open Smile on the Nose */}
        <path
          d="M 132 98 Q 148 120 164 98 Z"
          fill="#991b1b"
          stroke="#450a0a"
          strokeWidth="2"
        />
        <path
          d="M 138 108 Q 148 116 158 108 Z"
          fill="#f87171"
        />
      </svg>
    </div>
  );
}
