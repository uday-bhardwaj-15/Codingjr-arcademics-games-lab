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
    md: 'w-24 h-16 sm:w-28 sm:h-18',
    lg: 'w-32 h-22 sm:w-36 sm:h-24',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
      <svg
        viewBox="0 0 160 110"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] overflow-visible"
      >
        <defs>
          {/* Hull Gradient */}
          <linearGradient id={`avatarHull_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Seat Cushion */}
          <linearGradient id="avatarSeatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Face Dome Gradient */}
          <linearGradient id="avatarFaceDome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Water Splash Foam */}
          <linearGradient id="avatarWaterFoam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Water Splashes Behind/Under the Jet Ski */}
        {/* Left rear water splash */}
        <path
          d="M 12 75 C 6 60, 2 68, 0 58 C 4 64, 10 68, 18 70"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="2" cy="52" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="8" cy="46" r="1.8" fill="#ffffff" opacity="0.85" />

        {/* Right water splash droplet */}
        <circle cx="152" cy="74" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="156" cy="66" r="1.5" fill="#ffffff" opacity="0.75" />

        {/* 2. Rear Seat & Steering Handle */}
        <path
          d="M 38 48 C 36 28, 56 26, 68 44 L 68 62 L 36 62 Z"
          fill="url(#avatarSeatGrad)"
          stroke="#0f172a"
          strokeWidth="2.5"
        />
        {/* Handlebar */}
        <path
          d="M 52 30 C 58 22, 74 22, 80 30"
          fill="none"
          stroke="#0f172a"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <circle cx="52" cy="30" r="3.5" fill="#334155" />
        <circle cx="80" cy="30" r="3.5" fill="#334155" />

        {/* 3. Lower White Foam Sponson / Water Edge */}
        <path
          d="M 20 78 C 35 96, 125 96, 146 76 C 130 92, 45 92, 20 78 Z"
          fill="#ffffff"
          stroke="#93c5fd"
          strokeWidth="1.5"
        />

        {/* 4. Main Blue Hull */}
        <path
          d="M 18 64 C 18 64, 16 82, 42 85 C 80 88, 126 84, 148 68 C 144 58, 126 56, 102 56 C 60 56, 26 58, 18 64 Z"
          fill={`url(#avatarHull_${color})`}
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />

        {/* 5. Cute Rounded Face Dome / Cowling */}
        <path
          d="M 62 58 C 62 30, 132 28, 136 58 C 138 74, 62 76, 62 58 Z"
          fill="url(#avatarFaceDome)"
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />

        {/* 6. Big Happy Cartoon Eyes */}
        {/* Left Eye */}
        <ellipse cx="88" cy="48" rx="10.5" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
        <ellipse cx="91" cy="48" rx="6" ry="8" fill="#0f172a" />
        <circle cx="89" cy="44" r="3" fill="#ffffff" />
        <circle cx="93" cy="51" r="1.2" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="114" cy="48" rx="10.5" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
        <ellipse cx="111" cy="48" rx="6" ry="8" fill="#0f172a" />
        <circle cx="109" cy="44" r="3" fill="#ffffff" />
        <circle cx="113" cy="51" r="1.2" fill="#ffffff" />

        {/* Cheerful Eyebrows */}
        <path d="M 80 32 Q 88 27 96 33" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 106 33 Q 114 27 122 32" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

        {/* 7. Cute Open Red Smiling Mouth */}
        <path
          d="M 94 65 Q 102 78 110 65 Z"
          fill="#dc2626"
          stroke="#7f1d1d"
          strokeWidth="2"
        />
        {/* Tongue highlight */}
        <path
          d="M 98 71 Q 102 76 106 71"
          fill="none"
          stroke="#fca5a5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 8. Front White Bumper Trim */}
        <path
          d="M 14 74 C 28 84, 130 84, 146 72"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
