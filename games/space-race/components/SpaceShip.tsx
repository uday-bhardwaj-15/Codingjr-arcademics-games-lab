'use client';

import React from 'react';
import { ShipState, MultiplicationQuestion } from '../types';
import { SHIP_PALETTES, SHIP_W, SHIP_H, PLATE, PLATE_FONT_MIN, PLATE_FONT_MAX } from '../constants';

interface SpaceShipProps {
  ship: ShipState;
  isRacing: boolean;
  isSurging?: boolean;
  rankBadge?: number;
  question?: MultiplicationQuestion | null;
  statusMessage?: string | null; // e.g. "Oops!", "Time's up!"
}

/**
 * Auto-fits font size for multiplication question text (e.g. "10×10", "7×8")
 * advance(digit) = 0.60em, advance('×') = 0.58em, advance(' ') = 0.28em
 */
function getAutoFontSize(text: string): number {
  let sumAdvance = 0;
  for (const ch of text) {
    if (ch === '×') sumAdvance += 0.58;
    else if (ch === ' ') sumAdvance += 0.28;
    else sumAdvance += 0.60;
  }
  const fontPx = (PLATE.w - 12) / Math.max(1, sumAdvance);
  return Math.max(PLATE_FONT_MIN, Math.min(PLATE_FONT_MAX, Math.round(fontPx)));
}

export function SpaceShip({
  ship,
  isRacing,
  isSurging = false,
  rankBadge,
  question,
  statusMessage,
}: SpaceShipProps) {
  const pal = SHIP_PALETTES[ship.color] || SHIP_PALETTES.blue;
  const isHuman = !ship.isBot;
  const isShaking = ship.shakeUntil > Date.now();

  const questionText = question ? `${question.a}×${question.b}` : '';
  const questionFontSize = questionText ? getAutoFontSize(questionText) : 24;

  return (
    <>
      <style>{`
        .ship-bob {
          animation: shipBobAnim 2.2s ease-in-out infinite alternate;
        }
        @keyframes shipBobAnim {
          0% { transform: translateY(-2.5px); }
          100% { transform: translateY(2.5px); }
        }
        .ship-shake {
          animation: shipShakeAnim 0.12s ease-in-out 3;
        }
        @keyframes shipShakeAnim {
          0% { transform: rotate(0deg) scale(0.96); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
          100% { transform: rotate(0deg); }
        }
        .exhaust-flicker {
          animation: exhaustFlickerAnim 0.09s ease-in-out infinite alternate;
        }
        @keyframes exhaustFlickerAnim {
          0% { transform: scaleX(0.90) scaleY(0.95); opacity: 0.85; }
          100% { transform: scaleX(1.18) scaleY(1.05); opacity: 1; }
        }
      `}</style>

      <div
        className="absolute pointer-events-none select-none"
        style={{
          transform: `translate3d(${ship.drawnX}px, ${ship.drawnY}px, 0) translate(-100%, -50%)`,
          width: `${SHIP_W}px`,
          height: `${SHIP_H}px`,
          willChange: 'transform',
          zIndex: isHuman ? 25 : 20,
        }}
      >
        <div
          className={`relative w-full h-full ${
            isShaking ? 'ship-shake' : isRacing ? 'ship-bob' : ''
          }`}
        >
          {/* 1. Floating Bubble Message ("Oops!", "Time's up!") or "YOU" Badge */}
          {isHuman && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-30">
              {statusMessage ? (
                <div className="px-2.5 py-0.5 max-w-[90px] rounded-full bg-rose-600 text-white font-black text-[11px] tracking-wide shadow-md uppercase truncate animate-bounce">
                  {statusMessage}
                </div>
              ) : (
                <>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] tracking-wider shadow-md uppercase">
                    YOU
                  </span>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-400 -mt-0.5" />
                </>
              )}
            </div>
          )}

          {/* 2. Crossed Rank Badge ("🥇 1st", "🥈 2nd", etc.) */}
          {rankBadge !== undefined && (
            <div className="absolute -top-8 right-2 flex items-center justify-center pointer-events-none select-none z-30 animate-in zoom-in-75 duration-200">
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

          {/* 3. Polished SpaceShip SVG with Anchored Nozzle Flame & Bank Angle */}
          <svg
            viewBox="0 0 200 100"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-visible"
            style={{
              transform: `rotate(${ship.bankDeg || 0}deg)`,
              transformOrigin: '95px 58px',
            }}
          >
            <defs>
              {/* Hull Gradient: Top highlight -> Base Color -> Dark Belly */}
              <linearGradient id={`shipHull_${ship.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={pal.highlight} />
                <stop offset="25%" stopColor={pal.deck} />
                <stop offset="55%" stopColor={pal.hull} />
                <stop offset="100%" stopColor={pal.hullDark} />
              </linearGradient>

              {/* Cockpit Glass Gradient */}
              <linearGradient id="shipGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#dbeafe" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.85" />
              </linearGradient>

              {/* Normal Thruster Flame */}
              <linearGradient id={`flameGrad_${ship.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
                <stop offset="30%" stopColor="#f97316" />
                <stop offset="70%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* Surge Boost Flame */}
              <linearGradient id={`surgeGrad_${ship.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* A. Thruster Exhaust Flames (Anchored directly at nozzle (10, 58) extending left) */}
            {isRacing && (
              <g className="exhaust-flicker" transform="translate(10, 58)">
                {isSurging ? (
                  <>
                    <path
                      d="M 0 0 C -30 -16, -80 -22, -120 0 C -80 22, -30 16, 0 0 Z"
                      fill={`url(#surgeGrad_${ship.id})`}
                    />
                    <path
                      d="M 0 0 C -15 -8, -50 -10, -75 0 C -50 10, -15 8, 0 0 Z"
                      fill="#ffffff"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M 0 0 C -15 -10, -45 -14, -65 0 C -45 14, -15 10, 0 0 Z"
                      fill={`url(#flameGrad_${ship.id})`}
                    />
                    <path
                      d="M 0 0 C -8 -5, -25 -7, -38 0 C -25 7, -8 5, 0 0 Z"
                      fill="#ffffff"
                    />
                  </>
                )}
              </g>
            )}

            {/* B. Top Swept Tail Fin */}
            <path
              d="M 32 44 L 12 18 C 8 13, 22 10, 44 26 L 68 44 Z"
              fill={pal.wings}
              stroke={pal.hullDark}
              strokeWidth="2.5"
            />
            {/* Lower Fin */}
            <path
              d="M 32 72 L 14 92 C 10 96, 22 98, 42 84 L 65 72 Z"
              fill={pal.wings}
              stroke={pal.hullDark}
              strokeWidth="2.5"
            />

            {/* C. Rear Dark Metal Nozzle at (10, 58) */}
            <rect x="10" y="49" width="14" height="18" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="2" />

            {/* D. Main Rounded Hull (56px tall from y=30 to y=86, length tail x=8 to nose x=186) */}
            <path
              d="M 18 58 C 18 30, 95 26, 186 58 C 95 90, 18 86, 18 58 Z"
              fill={`url(#shipHull_${ship.id})`}
              stroke={pal.hullDark}
              strokeWidth="3.5"
            />

            {/* Upper Specular Gloss Strip */}
            <path
              d="M 45 44 C 85 34, 135 36, 172 52"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* E. Glass Bubble Dome Cockpit (Rising from hull near x=100) */}
            <ellipse
              cx="110"
              cy="40"
              rx="30"
              ry="24"
              fill="url(#shipGlassGrad)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Specular White Reflection Arc */}
            <path
              d="M 94 30 C 102 22, 122 22, 132 30"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* F. Creature Inside Dome with Forward-Right Looking Eyes */}
            {/* Left Eye */}
            <ellipse cx="106" cy="40" rx="8" ry="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <ellipse cx="109" cy="40" rx="4.5" ry="6" fill="#0f172a" />
            <circle cx="108" cy="37" r="2" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="122" cy="40" rx="8" ry="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <ellipse cx="125" cy="40" rx="4.5" ry="6" fill="#0f172a" />
            <circle cx="124" cy="37" r="2" fill="#ffffff" />

            {/* G. Hull Question Plate (84x34 at local (62, 41), inside hull, clipped) */}
            {isHuman && (
              <g transform={`translate(${PLATE.x}, ${PLATE.y})`}>
                <rect
                  x="0"
                  y="0"
                  width={PLATE.w}
                  height={PLATE.h}
                  rx="6"
                  fill="#091b2e"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                {question && (
                  <text
                    x={PLATE.w / 2}
                    y={PLATE.h / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={questionFontSize}
                    fontWeight="900"
                    fontFamily="monospace"
                    letterSpacing="0.5"
                  >
                    {questionText}
                  </text>
                )}
              </g>
            )}

            {/* H. Nose Cone Highlight */}
            <path
              d="M 174 53 Q 190 58 174 63 Z"
              fill={pal.highlight}
              stroke={pal.hullDark}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
