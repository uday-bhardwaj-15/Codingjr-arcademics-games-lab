'use client';

import React from 'react';
import { SHIP_PALETTES } from '../constants';

interface SpaceShipAvatarProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  facing?: 'front' | 'side';
}

export function SpaceShipAvatar({
  color = 'blue',
  size = 'md',
  className = '',
  facing = 'front',
}: SpaceShipAvatarProps) {
  const pal = SHIP_PALETTES[color] || SHIP_PALETTES.blue;

  const sizeStyles = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18 sm:w-28 sm:h-20',
    lg: 'w-36 h-26 sm:w-44 sm:h-30',
  }[size];

  // 1. Side View Profile (for results / race previews if specified)
  if (facing === 'side') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
        <svg
          viewBox="0 0 210 105"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <defs>
            <linearGradient id={`avatarHullSide_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={pal.highlight} />
              <stop offset="25%" stopColor={pal.deck} />
              <stop offset="55%" stopColor={pal.hull} />
              <stop offset="100%" stopColor={pal.hullDark} />
            </linearGradient>

            <linearGradient id="avatarGlassGradSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#dbeafe" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Top Tail Fin */}
          <path
            d="M 28 48 L 8 14 C 4 9, 22 7, 46 25 L 70 48 Z"
            fill={pal.wings}
            stroke={pal.hullDark}
            strokeWidth="2.5"
          />
          {/* Lower Fin */}
          <path
            d="M 28 76 L 10 95 C 6 99, 20 100, 42 86 L 66 76 Z"
            fill={pal.wings}
            stroke={pal.hullDark}
            strokeWidth="2.5"
          />

          {/* Rear Nozzle */}
          <path
            d="M 4 50 L 22 54 L 22 70 L 4 74 Z"
            fill="#334155"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <ellipse cx="4" cy="62" rx="3.5" ry="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />

          {/* Main Hull Body */}
          <path
            d="M 16 62 C 16 28, 102 24, 196 62 C 102 98, 16 94, 16 62 Z"
            fill={`url(#avatarHullSide_${color})`}
            stroke={pal.hullDark}
            strokeWidth="3.5"
          />

          {/* Upper Gloss highlight */}
          <path
            d="M 42 42 C 85 31, 148 33, 184 54"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Glass Dome */}
          <ellipse
            cx="104"
            cy="30"
            rx="31"
            ry="25"
            fill="url(#avatarGlassGradSide)"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <path
            d="M 86 20 C 94 12, 116 12, 126 20"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Pilot Eyes */}
          <ellipse cx="98" cy="29" rx="8.5" ry="10.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="102.5" cy="29" rx="4.5" ry="6.5" fill="#0f172a" />
          <circle cx="100.5" cy="26" r="2" fill="#ffffff" />

          <ellipse cx="116" cy="29" rx="8.5" ry="10.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="120.5" cy="29" rx="4.5" ry="6.5" fill="#0f172a" />
          <circle cx="118.5" cy="26" r="2" fill="#ffffff" />

          {/* Nose Highlight */}
          <path
            d="M 182 56 Q 198 62 182 68 Z"
            fill={pal.highlight}
            stroke={pal.hullDark}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  // 2. Front-Facing Smiling UFO Saucer (Arcademics Space Race Entry Lobby & Avatars)
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeStyles} ${className}`}>
      <svg
        viewBox="0 0 200 130"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] overflow-visible"
      >
        <defs>
          <linearGradient id={`frontHull_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pal.highlight} />
            <stop offset="25%" stopColor={pal.deck} />
            <stop offset="65%" stopColor={pal.hull} />
            <stop offset="100%" stopColor={pal.hullDark} />
          </linearGradient>

          <linearGradient id={`frontBelly_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pal.hull} />
            <stop offset="100%" stopColor={pal.hullDark} />
          </linearGradient>

          {/* Clean Glass Bubble Dome with High Visibility for Eyes */}
          <linearGradient id="frontGlassGradUniversal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f1f5f9" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#94a3b8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.55" />
          </linearGradient>

          <clipPath id={`hullClip_${color}`}>
            <ellipse cx="100" cy="74" rx="86" ry="34" />
          </clipPath>
        </defs>

        {/* 1. Left and Right Winglet Fins / Antennae */}
        <path
          d="M 38 60 L 22 42 C 26 36, 42 42, 48 52 Z"
          fill={pal.wings}
          stroke={pal.hullDark}
          strokeWidth="2.5"
        />
        <path
          d="M 162 60 L 178 42 C 174 36, 158 42, 152 52 Z"
          fill={pal.wings}
          stroke={pal.hullDark}
          strokeWidth="2.5"
        />

        {/* 2. Glass Bubble Dome (Cockpit Backing) */}
        <ellipse
          cx="100"
          cy="48"
          rx="36"
          ry="30"
          fill="url(#frontGlassGradUniversal)"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* 3. High-Visibility Cartoon Eyes */}
        {/* Left Eye */}
        <ellipse cx="88" cy="46" rx="10.5" ry="12.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
        <ellipse cx="90.5" cy="45" rx="5.5" ry="7.5" fill="#090d16" />
        <circle cx="88" cy="41" r="2.3" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="112" cy="46" rx="10.5" ry="12.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
        <ellipse cx="114.5" cy="45" rx="5.5" ry="7.5" fill="#090d16" />
        <circle cx="112" cy="41" r="2.3" fill="#ffffff" />

        {/* Specular White Dome Reflection Arc */}
        <path
          d="M 80 30 C 90 22, 110 22, 120 30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* 4. Main Saucer Hull (Front Ellipse) */}
        <ellipse
          cx="100"
          cy="74"
          rx="86"
          ry="34"
          fill={`url(#frontHull_${color})`}
          stroke={pal.hullDark}
          strokeWidth="4"
        />

        {/* 5. Diagonal Glossy Specular Stripe Bands (Clipped to Hull) */}
        <g clipPath={`url(#hullClip_${color})`}>
          {/* Lower Shaded Belly Rim */}
          <path
            d="M 14 74 C 14 104, 186 104, 186 74 C 186 86, 14 86, 14 74 Z"
            fill={`url(#frontBelly_${color})`}
            opacity="0.75"
          />

          {/* Diagonal Stripe 1 */}
          <path
            d="M 25 40 L 52 40 L 98 110 L 71 110 Z"
            fill="#ffffff"
            opacity="0.25"
          />
          {/* Diagonal Stripe 2 */}
          <path
            d="M 68 40 L 95 40 L 141 110 L 114 110 Z"
            fill="#ffffff"
            opacity="0.32"
          />
          {/* Diagonal Stripe 3 */}
          <path
            d="M 132 40 L 155 40 L 188 110 L 165 110 Z"
            fill="#ffffff"
            opacity="0.22"
          />

          {/* Upper Top Rim Specular Arch */}
          <path
            d="M 30 64 C 65 48, 135 48, 170 64"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* Outer Hull Contour Stroke Reinforcement */}
        <ellipse
          cx="100"
          cy="74"
          rx="86"
          ry="34"
          fill="none"
          stroke={pal.hullDark}
          strokeWidth="3.5"
        />

        {/* 6. Big Happy Smiling Mouth */}
        <path
          d="M 78 72 Q 100 94 122 72 Z"
          fill="#991b1b"
          stroke="#0f172a"
          strokeWidth="3"
        />
        {/* Pink Tongue inside mouth */}
        <path
          d="M 88 80 Q 100 74 112 80 Q 100 92 88 80 Z"
          fill="#ef4444"
        />
      </svg>
    </div>
  );
}

