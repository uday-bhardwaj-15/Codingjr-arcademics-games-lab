'use client';

import React from 'react';
import { PlayerColor } from '../types';
import { raceTheme } from '../raceTheme';

interface RaceCarProps {
  color: PlayerColor;
  name: string;
  isHuman?: boolean;
  progress?: number; // 0.0 to 1.0
  laneIndex?: number; // 0, 1, 2, 3
  state?: 'idle' | 'boost' | 'sputter' | 'finished';
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const RaceCar: React.FC<RaceCarProps> = ({
  color = 'blue',
  name,
  isHuman = false,
  progress = 0,
  laneIndex = 0,
  state = 'idle',
  scale = 1,
  className = '',
  style,
}) => {
  // Color palette for this car
  const c = raceTheme.cars[color as keyof typeof raceTheme.cars] || raceTheme.cars.blue;

  // Base lane X centers from PRD: 236, 404, 591, 761 at Start (y ≈ 235)
  // Perspective convergence toward horizon (horizon lane centers: 470, 490, 510, 530 at y ≈ 105)
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const startY = 235;
  const finishY = 110;
  const currentY = startY - clampedProgress * (startY - finishY);

  const baseLanes = [236, 404, 591, 761];
  const horizonLanes = [472, 492, 518, 538];
  const currentX =
    baseLanes[laneIndex] + (horizonLanes[laneIndex] - baseLanes[laneIndex]) * clampedProgress;

  // Perspective scaling (1.0 at start down to 0.42 near finish)
  const perspectiveScale = (1.0 - clampedProgress * 0.58) * scale;

  return (
    <div
      className={`absolute transition-all duration-500 ease-out flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `translate(-50%, -50%) scale(${perspectiveScale})`,
        zIndex: Math.floor(20 + (1 - clampedProgress) * 30),
        ...style,
      }}
    >
      {/* Car Body Container with Dynamic State Animations */}
      <div
        className={`relative flex flex-col items-center ${
          state === 'idle'
            ? 'animate-[carIdleVibe_0.4s_ease-in-out_infinite_alternate]'
            : state === 'boost'
            ? 'animate-[carBoostLunge_0.6s_ease-out]'
            : state === 'sputter'
            ? 'animate-[carSputterWobble_0.3s_linear_infinite]'
            : state === 'finished'
            ? 'animate-[carCelebration_0.8s_ease-in-out_infinite]'
            : ''
        }`}
      >
        {/* Boost Nitro Flame Effect */}
        {state === 'boost' && (
          <div className="absolute -bottom-8 flex items-center justify-center animate-pulse z-0 pointer-events-none">
            <svg viewBox="0 0 60 90" className="w-16 h-20 drop-shadow-[0_0_20px_#38bdf8]">
              <defs>
                <linearGradient id={`nitroFlameGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#67e8f9" />
                  <stop offset="60%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M 30 0 C 14 25, 6 55, 30 90 C 54 55, 46 25, 30 0 Z"
                fill={`url(#nitroFlameGrad_${color})`}
              />
              <path
                d="M 30 10 C 20 30, 16 55, 30 75 C 44 55, 40 30, 30 10 Z"
                fill="#ffffff"
                opacity="0.9"
              />
            </svg>
          </div>
        )}

        {/* Sputter Smoke / Sparks Effect */}
        {state === 'sputter' && (
          <div className="absolute -bottom-4 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce ml-2" />
          </div>
        )}

        {/* ── Main Rear-View Race Car SVG (Width 135px) ── */}
        <svg
          viewBox="0 0 140 100"
          className="w-[135px] h-[96px] overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Body 3-Stop Vibrant Gradient */}
            <linearGradient id={`carChassisGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={c.light} />
              <stop offset="45%" stopColor={c.mid} />
              <stop offset="100%" stopColor={c.dark} />
            </linearGradient>

            {/* Spoiler Bar Gradient */}
            <linearGradient id={`spoilerWingGrad_${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c.mid} />
              <stop offset="35%" stopColor={c.light} />
              <stop offset="70%" stopColor={c.mid} />
              <stop offset="100%" stopColor={c.dark} />
            </linearGradient>

            {/* Tire Dark Rubber Gradient */}
            <linearGradient id="rearTireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#141419" />
              <stop offset="25%" stopColor="#2A2B36" />
              <stop offset="60%" stopColor="#1C1D24" />
              <stop offset="100%" stopColor="#111116" />
            </linearGradient>

            {/* Chrome Exhaust Outer Rim Radial */}
            <radialGradient id={`exhaustOuterRim_${color}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="85%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* Exhaust Deep Jet Core */}
            <radialGradient id="exhaustJetCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E222E" />
              <stop offset="75%" stopColor="#0B0D14" />
              <stop offset="100%" stopColor="#040508" />
            </radialGradient>
          </defs>

          {/* 1. Ground Shadow (Soft dark blur ellipse) */}
          <ellipse cx="70" cy="94" rx="56" ry="7" fill="#000000" opacity="0.35" />

          {/* 2. Left and Right Massive Rear Tires (34 × 64 px rounded) */}
          {/* Left Rear Tire */}
          <g transform="translate(10, 32)">
            <rect
              x="0"
              y="0"
              width="30"
              height="58"
              rx="12"
              fill="url(#rearTireGrad)"
              stroke="#0D0D12"
              strokeWidth="2.5"
            />
            {/* Tire Highlight Tread Lines */}
            <path
              d="M 9 8 Q 9 29 9 50"
              stroke="#4E5266"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 21 8 Q 21 29 21 50"
              stroke="#262833"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Right Rear Tire */}
          <g transform="translate(100, 32)">
            <rect
              x="0"
              y="0"
              width="30"
              height="58"
              rx="12"
              fill="url(#rearTireGrad)"
              stroke="#0D0D12"
              strokeWidth="2.5"
            />
            {/* Tire Highlight Tread Lines */}
            <path
              d="M 9 8 Q 9 29 9 50"
              stroke="#262833"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 21 8 Q 21 29 21 50"
              stroke="#4E5266"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 3. Rear Spoiler Struts (2 vertical supports) */}
          <rect x="42" y="14" width="6" height="22" rx="2" fill="#1C1D24" stroke="#0E0F14" strokeWidth="1" />
          <rect x="92" y="14" width="6" height="22" rx="2" fill="#1C1D24" stroke="#0E0F14" strokeWidth="1" />

          {/* 4. Rear Spoiler Wing (Wide rounded bar in car color) */}
          <g transform="translate(18, 6)">
            {/* Dark underside shadow */}
            <rect x="2" y="7" width="100" height="10" rx="4" fill={c.dark} opacity="0.8" />
            {/* Main Spoiler Blade */}
            <rect
              x="0"
              y="0"
              width="104"
              height="11"
              rx="5.5"
              fill={`url(#spoilerWingGrad_${color})`}
              stroke={c.dark}
              strokeWidth="1.5"
            />
            {/* Wing Top Specular Highlight */}
            <path
              d="M 6 3 L 98 3"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Left Endplate */}
            <rect x="-3" y="-3" width="5" height="17" rx="2.5" fill={c.dark} stroke="#000000" strokeWidth="1" />
            <rect x="-2" y="-2" width="3" height="15" rx="1.5" fill={c.mid} />
            {/* Right Endplate */}
            <rect x="102" y="-3" width="5" height="17" rx="2.5" fill={c.dark} stroke="#000000" strokeWidth="1" />
            <rect x="103" y="-2" width="3" height="15" rx="1.5" fill={c.mid} />
          </g>

          {/* 5. Main Rounded Chassis Body ("Bean" approx 88 × 72) */}
          <g transform="translate(26, 26)">
            {/* Body Outer Tub */}
            <ellipse
              cx="44"
              cy="36"
              rx="44"
              ry="33"
              fill={`url(#carChassisGrad_${color})`}
              stroke={c.dark}
              strokeWidth="2.5"
            />

            {/* Top Glossy Highlight Crescent */}
            <path
              d="M 18 18 C 30 8, 58 8, 70 18 C 60 12, 28 12, 18 18 Z"
              fill="#FFFFFF"
              opacity="0.75"
            />
            <ellipse cx="44" cy="14" rx="18" ry="4" fill="#FFFFFF" opacity="0.6" />

            {/* 6. Central Round Jet Turbine Exhaust (Large round ring in center) */}
            <g transform="translate(44, 38)">
              {/* Outer Chrome Ring */}
              <circle
                cx="0"
                cy="0"
                r="21"
                fill={`url(#exhaustOuterRim_${color})`}
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Inner White Rim Highlight */}
              <circle cx="0" cy="0" r="18" fill="#FFFFFF" opacity="0.9" />
              {/* Jet Interior Hole */}
              <circle
                cx="0"
                cy="0"
                r="15"
                fill="url(#exhaustJetCore)"
                stroke="#0F172A"
                strokeWidth="1"
              />
              {/* Inner Chrome Nozzle Ring */}
              <circle cx="0" cy="0" r="8" fill="#1E293B" opacity="0.85" />
              {/* Deep Central Core */}
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill={state === 'boost' ? '#38BDF8' : '#040508'}
              />
              {/* Specular White Shine Crescent on Rim */}
              <path
                d="M -12 -10 C -4 -16, 8 -16, 14 -10 C 6 -13, -4 -13, -12 -10 Z"
                fill="#FFFFFF"
                opacity="0.85"
              />
            </g>
          </g>
        </svg>

        {/* ── Name Pill Underneath (y ≈ 310, ~118 × 32 px) ── */}
        <div
          className={`-mt-1 flex items-center justify-center px-4 py-1.5 rounded-full border shadow-md font-fredoka transition-all ${
            isHuman
              ? 'bg-gradient-to-b from-[#4da8ff] to-[#146de0] border-[#99d0ff] shadow-[0_0_16px_rgba(46,139,255,0.7)]'
              : color === 'yellow'
              ? 'bg-gradient-to-b from-[#ffd747] to-[#e69d00] border-[#ffe88a] shadow-[0_0_10px_rgba(255,198,26,0.4)]'
              : color === 'red'
              ? 'bg-gradient-to-b from-[#ff6b77] to-[#d42234] border-[#ffa3ab] shadow-[0_0_10px_rgba(240,58,71,0.4)]'
              : 'bg-gradient-to-b from-[#ffa347] to-[#e06809] border-[#ffcd8a] shadow-[0_0_10px_rgba(255,138,31,0.4)]'
          }`}
          style={{
            minWidth: '118px',
            height: '32px',
          }}
        >
          <span className="text-[16px] font-bold text-white tracking-wide truncate max-w-[110px] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)]">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
};
