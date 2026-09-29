'use client';

import React from 'react';
import { RacerState } from '../types';
import { COLOR_PALETTES } from '../constants';
import { WakeTrail } from './WakeTrail';

interface JetSkiBoatProps {
  racer: RacerState;
  isRacing: boolean;
  isSurging?: boolean;
  rankBadge?: number;
}

export function JetSkiBoat({
  racer,
  isRacing,
  isSurging = false,
  rankBadge,
}: JetSkiBoatProps) {
  const pal = COLOR_PALETTES[racer.color] || COLOR_PALETTES.blue;
  const isHuman = !racer.isBot;
  const isWobbling = racer.wobbleUntil > Date.now();
  const { x, y, yawDeg } = racer.pose;

  return (
    <>
      <style>{`
        .boat-bob {
          animation: boatBobAnim 2s ease-in-out infinite alternate;
        }
        @keyframes boatBobAnim {
          0% { transform: translateY(-1.5px); }
          100% { transform: translateY(1.5px); }
        }
        .boat-wobble {
          animation: boatWobbleAnim 0.12s ease-in-out 3;
        }
        @keyframes boatWobbleAnim {
          0% { transform: rotate(0deg) scale(0.96); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div
        className="absolute z-20 pointer-events-none select-none"
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) rotate(${yawDeg}deg) translate(-100%, -50%)`,
          width: '96px',
          height: '52px',
          transformOrigin: '100% 50%',
          willChange: 'transform',
        }}
      >
        {/* Animated Wake Foam Trail trailing behind the boat along its yaw heading */}
        <WakeTrail active={isRacing} isSurging={isSurging} />

        <div
          className={`relative w-full h-full ${
            isWobbling ? 'boat-wobble' : isRacing ? 'boat-bob' : ''
          }`}
        >
          {/* 1. "YOU" Marker above human boat */}
          {isHuman && (
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-30"
              style={{ transform: `rotate(${-yawDeg}deg)` }}
            >
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] tracking-wider shadow-md uppercase">
                YOU
              </span>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-400 -mt-0.5" />
            </div>
          )}

          {/* 2. Crossed Rank Badge ("1st", "2nd", etc.) */}
          {rankBadge !== undefined && (
            <div
              className="absolute -top-8 right-0 flex items-center justify-center pointer-events-none select-none z-30 animate-in zoom-in-75 duration-200"
              style={{ transform: `rotate(${-yawDeg}deg)` }}
            >
              <div className="px-2.5 py-1 rounded-md bg-amber-500 border-2 border-yellow-200 text-amber-950 font-black text-xs shadow-lg">
                {rankBadge === 1
                  ? '🥇 1st'
                  : rankBadge === 2
                  ? '🥈 2nd'
                  : rankBadge === 3
                  ? '🥉 3rd'
                  : '4th'}
              </div>
            </div>
          )}

          {/* 3. Jet-Ski Top-Down / 3/4 Racer Body SVG (Faces Right, Nose at x=100%) */}
          <svg
            viewBox="0 0 120 70"
            className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] overflow-visible"
          >
            <defs>
              <linearGradient id={`boatHull_${racer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={pal.deck} />
                <stop offset="50%" stopColor={pal.hull} />
                <stop offset="100%" stopColor={pal.hullDark} />
              </linearGradient>

              <linearGradient id={`boatDeck_${racer.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={pal.hullDark} />
                <stop offset="80%" stopColor={pal.deck} />
                <stop offset="100%" stopColor={pal.highlight} />
              </linearGradient>

              <linearGradient id="boatSeatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#270e02" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* A. Main Tapered Hull */}
            <path
              d="M 10 16 C 10 16, 85 14, 114 35 C 85 56, 10 54, 10 54 L 6 35 Z"
              fill={`url(#boatHull_${racer.id})`}
              stroke={pal.hullDark}
              strokeWidth="2.5"
            />

            {/* B. Top Deck Inset */}
            <path
              d="M 18 20 C 25 20, 80 19, 106 35 C 80 51, 25 50, 18 50 Z"
              fill={`url(#boatDeck_${racer.id})`}
              opacity="0.9"
            />

            {/* C. Long Padded Cushion Seat */}
            <rect
              x="20"
              y="27"
              width="44"
              height="16"
              rx="4"
              fill="url(#boatSeatGrad)"
              stroke="#180701"
              strokeWidth="1.5"
            />
            <line x1="31" y1="27" x2="31" y2="43" stroke="#180701" strokeWidth="1" />
            <line x1="42" y1="27" x2="42" y2="43" stroke="#180701" strokeWidth="1" />
            <line x1="53" y1="27" x2="53" y2="43" stroke="#180701" strokeWidth="1" />

            {/* D. Steering Handlebar & Grips */}
            <path
              d="M 66 31 L 76 31 L 79 35 L 76 39 L 66 39 Z"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <line x1="72" y1="18" x2="72" y2="52" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="72" cy="19" r="2.5" fill="#f87171" />
            <circle cx="72" cy="51" r="2.5" fill="#f87171" />

            {/* E. Nose White Stripe */}
            <path
              d="M 80 35 L 102 35"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
