'use client';

import React from 'react';
import { SHIP_PALETTES } from '../constants';

interface SpaceShipAvatarProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SpaceShipAvatar({
  color = 'blue',
  size = 'md',
  className = '',
}: SpaceShipAvatarProps) {
  const pal = SHIP_PALETTES[color] || SHIP_PALETTES.blue;

  const sizeStyles = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18 sm:w-28 sm:h-20',
    lg: 'w-32 h-24 sm:w-40 sm:h-28',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] overflow-visible"
      >
        <defs>
          <linearGradient id={`avatarHull_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pal.highlight} />
            <stop offset="25%" stopColor={pal.deck} />
            <stop offset="55%" stopColor={pal.hull} />
            <stop offset="100%" stopColor={pal.hullDark} />
          </linearGradient>

          <linearGradient id="avatarGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#dbeafe" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Top Tail Fin */}
        <path
          d="M 32 38 L 12 14 C 8 9, 22 6, 44 22 L 68 38 Z"
          fill={pal.wings}
          stroke={pal.hullDark}
          strokeWidth="2.5"
        />
        {/* Lower Fin */}
        <path
          d="M 32 66 L 14 86 C 10 90, 22 93, 42 78 L 65 66 Z"
          fill={pal.wings}
          stroke={pal.hullDark}
          strokeWidth="2.5"
        />

        {/* Rear Nozzle */}
        <rect x="14" y="43" width="14" height="18" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="2" />

        {/* Main Hull Body */}
        <path
          d="M 22 52 C 22 28, 95 24, 188 52 C 95 80, 22 76, 22 52 Z"
          fill={`url(#avatarHull_${color})`}
          stroke={pal.hullDark}
          strokeWidth="3.5"
        />

        {/* Gloss highlight */}
        <path
          d="M 45 42 C 85 32, 135 34, 172 48"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Glass Dome */}
        <ellipse
          cx="110"
          cy="38"
          rx="30"
          ry="24"
          fill="url(#avatarGlassGrad)"
          stroke="#0f172a"
          strokeWidth="2.5"
        />
        <path
          d="M 94 28 C 102 20, 122 20, 132 28"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Cute Pilot Eyes */}
        <ellipse cx="106" cy="38" rx="8" ry="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="109" cy="38" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="108" cy="35" r="2" fill="#ffffff" />

        <ellipse cx="122" cy="38" rx="8" ry="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="125" cy="38" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="124" cy="35" r="2" fill="#ffffff" />

        {/* Nose Highlight */}
        <path
          d="M 176 47 Q 192 52 176 57 Z"
          fill={pal.highlight}
          stroke={pal.hullDark}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
