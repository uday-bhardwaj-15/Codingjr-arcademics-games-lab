'use client';

import React from 'react';
import { ShipState, MultiplicationQuestion } from '../types';
import { SHIP_PALETTES, SHIP_W, SHIP_H, PLATE, PLATE_FONT_MIN, PLATE_FONT_MAX, NOZZLE } from '../constants';

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
        .exhaust-scale-anim {
          animation: exhaustScaleKeyframes 0.09s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: 100% 50%;
        }
        @keyframes exhaustScaleKeyframes {
          0% { transform: scaleX(0.88) scaleY(0.92); opacity: 0.85; }
          100% { transform: scaleX(1.15) scaleY(1.06); opacity: 1; }
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

          {/* 3. Chunky Saucer SpaceShip SVG */}
          <svg
            viewBox="0 0 210 105"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-visible"
            style={{
              transform: `rotate(${ship.bankDeg || 0}deg)`,
              transformOrigin: '105px 62px',
            }}
          >
            <defs>
              {/* Upper Deck Gradient */}
              <linearGradient id={`shipDeck_${ship.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={pal.highlight} />
                <stop offset="35%" stopColor={pal.deck} />
                <stop offset="100%" stopColor={pal.hull} />
              </linearGradient>

              {/* Lower Belly Dark Gradient */}
              <linearGradient id={`shipBelly_${ship.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={pal.hull} />
                <stop offset="100%" stopColor={pal.hullDark} />
              </linearGradient>

              {/* Glass Bubble Dome Gradient */}
              <linearGradient id="shipGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#dbeafe" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.85" />
              </linearGradient>

              {/* Question Plate Gradient */}
              <linearGradient id={`shipPlateGrad_${ship.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#091b2e" />
                <stop offset="100%" stopColor="#040d17" />
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

            {/* A. Thruster Exhaust Flames (Anchored directly at nozzle (6, 62)) */}
            {isRacing && (
              <g transform={`translate(${NOZZLE.x}, ${NOZZLE.y})`}>
                <g className="exhaust-scale-anim">
                  {isSurging ? (
                    <>
                      <path
                        d="M 0 0 C -30 -18, -85 -24, -135 0 C -85 24, -30 18, 0 0 Z"
                        fill={`url(#surgeGrad_${ship.id})`}
                      />
                      <path
                        d="M 0 0 C -15 -9, -50 -11, -85 0 C -50 11, -15 9, 0 0 Z"
                        fill="#ffffff"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M 0 0 C -15 -10, -45 -14, -75 0 C -45 14, -15 10, 0 0 Z"
                        fill={`url(#flameGrad_${ship.id})`}
                      />
                      <path
                        d="M 0 0 C -8 -5, -25 -7, -45 0 C -25 7, -8 5, 0 0 Z"
                        fill="#ffffff"
                      />
                    </>
                  )}
                </g>
              </g>
            )}

            {/* B. Top Swept Tail Fin */}
            <path
              d="M 28 48 L 8 14 C 4 9, 22 7, 46 25 L 70 48 Z"
              fill={pal.wings}
              stroke={pal.hullDark}
              strokeWidth="2.5"
            />
            {/* Small Lower Tail Fin */}
            <path
              d="M 28 76 L 10 95 C 6 99, 20 100, 42 86 L 66 76 Z"
              fill={pal.wings}
              stroke={pal.hullDark}
              strokeWidth="2.5"
            />

            {/* C. Rear Thruster Cone Nozzle at (6, 62) */}
            <path
              d="M 4 50 L 22 54 L 22 70 L 4 74 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <ellipse cx="4" cy="62" rx="3.5" ry="12" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />

            {/* D. Main Chunky Saucer Hull Body (Deep belly down to y=98, top deck y=26, axis y=62) */}
            {/* Lower Hull Belly (Shaded) */}
            <path
              d="M 16 62 C 16 92, 102 98, 196 62 C 102 70, 16 70, 16 62 Z"
              fill={`url(#shipBelly_${ship.id})`}
            />

            {/* Full Hull Outer Shell */}
            <path
              d="M 16 62 C 16 28, 102 24, 196 62 C 102 98, 16 94, 16 62 Z"
              fill={`url(#shipDeck_${ship.id})`}
              stroke={pal.hullDark}
              strokeWidth="3.5"
            />

            {/* Hull Center Specular Ridge Line */}
            <path
              d="M 18 62 Q 102 70 194 62"
              fill="none"
              stroke={pal.hullDark}
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Upper Hull Gloss Highlight Arc */}
            <path
              d="M 42 42 C 85 31, 148 33, 184 54"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* E. Glass Bubble Dome Cockpit (Sitting on top of hull, cy=30, rx=31, ry=25) */}
            <ellipse
              cx="104"
              cy="30"
              rx="31"
              ry="25"
              fill="url(#shipGlassGrad)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Specular White Glass Reflection Arc */}
            <path
              d="M 86 20 C 94 12, 116 12, 126 20"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* F. Creature Inside Dome with Forward-Right Looking Eyes */}
            {/* Left Eye */}
            <ellipse cx="98" cy="29" rx="8.5" ry="10.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <ellipse cx="102.5" cy="29" rx="4.5" ry="6.5" fill="#0f172a" />
            <circle cx="100.5" cy="26" r="2" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="116" cy="29" rx="8.5" ry="10.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <ellipse cx="120.5" cy="29" rx="4.5" ry="6.5" fill="#0f172a" />
            <circle cx="118.5" cy="26" r="2" fill="#ffffff" />

            {/* G. Hull Question Plate (Comfortably nested inside the hull body at x=56, y=52, w=98, h=36) */}
            {isHuman && (
              <g transform={`translate(${PLATE.x}, ${PLATE.y})`}>
                <rect
                  x="0"
                  y="0"
                  width={PLATE.w}
                  height={PLATE.h}
                  rx="8"
                  fill={`url(#shipPlateGrad_${ship.id})`}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="drop-shadow-md"
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
              d="M 182 56 Q 198 62 182 68 Z"
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
