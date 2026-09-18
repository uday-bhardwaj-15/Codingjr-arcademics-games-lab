'use client';

import React from 'react';
import { PlayerColor } from '@/core/types/player';
import { PlayerActionStatus } from '../types';

interface ChickProps {
  color: PlayerColor;
  status?: PlayerActionStatus;
  facing?: 'front' | 'back'; // 'front' for lobby, 'back' for in-game pond view
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
  className?: string;
}

const CHICK_THEMES: Record<
  PlayerColor,
  {
    base: string;
    light: string;
    dark: string;
    crest: string;
    beak: string;
    feet: string;
  }
> = {
  blue: {
    base: '#0066ff',
    light: '#3399ff',
    dark: '#0044cc',
    crest: '#0055ee',
    beak: '#ff9900',
    feet: '#e67300',
  },
  yellow: {
    base: '#ffcc00',
    light: '#ffe066',
    dark: '#d4a000',
    crest: '#e6b800',
    beak: '#ff7700',
    feet: '#cc5500',
  },
  red: {
    base: '#ee2211',
    light: '#ff5544',
    dark: '#aa1100',
    crest: '#cc1800',
    beak: '#ff9900',
    feet: '#c2410c',
  },
  orange: {
    base: '#ff7700',
    light: '#ff9933',
    dark: '#cc5500',
    crest: '#e66000',
    beak: '#cc4400',
    feet: '#993300',
  },
};

export const Chick: React.FC<ChickProps> = ({
  color,
  status = 'idle',
  facing = 'front',
  size = 'md',
  showShadow = true,
  className = '',
}) => {
  const theme = CHICK_THEMES[color] || CHICK_THEMES.blue;

  const dims = {
    sm: { w: 42, h: 48 },
    md: { w: 64, h: 72 },
    lg: { w: 90, h: 100 },
    xl: { w: 120, h: 135 },
  }[size];

  // Animation classes
  let animClass = '';
  if (status === 'jumping') {
    animClass = 'animate-chick-jump';
  } else if (status === 'falling' || status === 'respawning') {
    animClass = 'animate-chick-fall';
  } else if (status === 'finished' || status === 'celebrate') {
    animClass = 'animate-chick-celebrate';
  } else {
    animClass = 'animate-chick-idle';
  }

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <div
        className={`transition-all duration-300 transform-gpu ${animClass}`}
        style={{ width: dims.w, height: dims.h }}
      >
        {facing === 'front' ? (
          /* FRONT FACING CHICK (Lobby view - matches Screenshot 1 exactly) */
          <svg viewBox="0 0 100 115" width="100%" height="100%" className="overflow-visible">
            <defs>
              {/* Radial gradient for round 2.5D spherical body */}
              <radialGradient id={`chick-body-front-${color}`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor={theme.light} />
                <stop offset="50%" stopColor={theme.base} />
                <stop offset="100%" stopColor={theme.dark} />
              </radialGradient>

              {/* Head gradient */}
              <radialGradient id={`chick-head-front-${color}`} cx="42%" cy="38%" r="60%">
                <stop offset="0%" stopColor={theme.light} />
                <stop offset="55%" stopColor={theme.base} />
                <stop offset="100%" stopColor={theme.dark} />
              </radialGradient>
            </defs>

            {/* Little Feather Crest on Head */}
            <path
              d="M 50,14 C 47,4 40,2 45,0 C 53,0 56,8 55,14 Z"
              fill={theme.crest}
            />

            {/* Feet (Orange with 3 toes) */}
            <g>
              {/* Left Foot */}
              <path
                d="M 40,94 L 33,105 M 40,94 L 40,107 M 40,94 L 47,105"
                stroke={theme.feet}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Right Foot */}
              <path
                d="M 60,94 L 53,105 M 60,94 L 60,107 M 60,94 L 67,105"
                stroke={theme.feet}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* Main Round Body */}
            <ellipse
              cx="50"
              cy="68"
              rx="32"
              ry="30"
              fill={`url(#chick-body-front-${color})`}
            />

            {/* Wing details on sides */}
            <path
              d="M 23,62 Q 18,72 26,80 Q 30,72 28,64 Z"
              fill={theme.dark}
              opacity="0.8"
            />
            <path
              d="M 77,62 Q 82,72 74,80 Q 70,72 72,64 Z"
              fill={theme.dark}
              opacity="0.8"
            />

            {/* Head (Sits slightly on top of body) */}
            <circle
              cx="50"
              cy="40"
              r="24"
              fill={`url(#chick-head-front-${color})`}
            />

            {/* Big Expressive Cartoon Eyes */}
            {/* Left Eye */}
            <ellipse cx="41" cy="36" rx="6.5" ry="8" fill="#ffffff" />
            <ellipse cx="43" cy="36" rx="3.5" ry="4.5" fill="#000000" />
            <circle cx="44.5" cy="34" r="1.5" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="59" cy="36" rx="6.5" ry="8" fill="#ffffff" />
            <ellipse cx="57" cy="36" rx="3.5" ry="4.5" fill="#000000" />
            <circle cx="58.5" cy="34" r="1.5" fill="#ffffff" />

            {/* Cute Open Beak */}
            <path
              d="M 43,44 Q 50,42 57,44 Q 50,54 43,44 Z"
              fill={theme.beak}
              stroke={theme.feet}
              strokeWidth="0.8"
            />
            {/* Inner mouth tongue */}
            <path
              d="M 47,46 Q 50,51 53,46 Z"
              fill="#e11d48"
            />
          </svg>
        ) : (
          /* BACK / 3/4 REAR FACING CHICK (In-Game Pond view - matches Screenshots 2 & 3) */
          <svg viewBox="0 0 100 115" width="100%" height="100%" className="overflow-visible">
            <defs>
              <radialGradient id={`chick-body-back-${color}`} cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor={theme.light} />
                <stop offset="55%" stopColor={theme.base} />
                <stop offset="100%" stopColor={theme.dark} />
              </radialGradient>

              <radialGradient id={`chick-head-back-${color}`} cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor={theme.light} />
                <stop offset="60%" stopColor={theme.base} />
                <stop offset="100%" stopColor={theme.dark} />
              </radialGradient>
            </defs>

            {/* Little Feather Crest pointing up-forward */}
            <path
              d="M 50,12 C 48,3 44,2 47,0 C 53,0 55,6 53,12 Z"
              fill={theme.crest}
            />

            {/* Little Beak visible slightly at top right / front */}
            <polygon
              points="58,26 67,29 58,33"
              fill={theme.beak}
            />

            {/* Orange Feet underneath */}
            <g>
              <path
                d="M 42,92 L 35,103 M 42,92 L 42,105 M 42,92 L 49,103"
                stroke={theme.feet}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 58,92 L 51,103 M 58,92 L 58,105 M 58,92 L 65,103"
                stroke={theme.feet}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* Main Chubby Round Body (Back View) */}
            <ellipse
              cx="50"
              cy="66"
              rx="32"
              ry="30"
              fill={`url(#chick-body-back-${color})`}
            />

            {/* Wing creases / feather outlines on back */}
            <path
              d="M 28,58 Q 23,68 31,76"
              stroke={theme.dark}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 72,58 Q 77,68 69,76"
              stroke={theme.dark}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Head (Back View) */}
            <circle
              cx="50"
              cy="36"
              r="22"
              fill={`url(#chick-head-back-${color})`}
            />

            {/* Subtle feather curve on back of head */}
            <path
              d="M 44,28 Q 50,33 56,28"
              stroke={theme.dark}
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </svg>
        )}
      </div>

      {/* Shadow */}
      {showShadow && status !== 'falling' && (
        <div
          className={`h-2.5 rounded-full bg-slate-900/30 blur-[2px] transition-all duration-300 ${
            status === 'jumping' ? 'w-6 opacity-20' : 'w-12 opacity-40'
          }`}
        />
      )}
    </div>
  );
};
