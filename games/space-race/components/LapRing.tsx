'use client';

import React from 'react';
import { ShipState } from '../types';
import { SHIP_PALETTES } from '../constants';

interface LapRingProps {
  humanLap: number;
  ships: ShipState[];
}

export function LapRing({ humanLap, ships }: LapRingProps) {
  // Center is (945, 512) on stage
  const radius = 45;
  const strokeWidth = 10;

  // Compute live position rank of human ship based on distance s
  const sortedByS = [...ships].sort((a, b) => b.s - a.s);
  const humanIndex = sortedByS.findIndex((s) => !s.isBot);
  let liveRank = 1;
  for (let i = 0; i < sortedByS.length; i++) {
    if (i > 0 && Math.round(sortedByS[i].s) < Math.round(sortedByS[i - 1].s)) {
      liveRank = i + 1;
    }
    if (i === humanIndex) break;
  }
  const liveRankText = liveRank === 1 ? '1st' : liveRank === 2 ? '2nd' : liveRank === 3 ? '3rd' : `${liveRank}th`;

  return (
    <div
      className="absolute z-30 pointer-events-none select-none flex flex-col items-center justify-center"
      style={{
        left: '890px',
        top: '436px',
        width: '110px',
        height: '136px',
      }}
    >
      {/* 1. Live Position Chip Above the Ring (at approx y = 448) */}
      <div className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-500 border border-yellow-200 text-amber-950 font-black text-[11px] shadow-md uppercase tracking-wider">
        {liveRankText}
      </div>

      {/* 2. Main Lap Ring SVG */}
      <svg viewBox="0 0 120 120" className="w-[110px] h-[110px] overflow-visible drop-shadow-xl">
        <defs>
          <linearGradient id="ringTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Backdrop Circle */}
        <circle cx="60" cy="60" r="54" fill="#091b2e" stroke="#1e293b" strokeWidth="2" opacity="0.95" />

        {/* Outer Ring Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ringTrackGrad)"
          strokeWidth={strokeWidth}
        />

        {/* Lap-Line Tick at 3 o'clock (0 rad / 90 deg from top) */}
        <line
          x1="105"
          y1="60"
          x2="117"
          y2="60"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Four Player Dots (Moving clockwise from 3 o'clock, human 16px, bots 12px) */}
        {ships.map((ship) => {
          const pal = SHIP_PALETTES[ship.color] || SHIP_PALETTES.blue;
          // 3 o'clock is angle = 0 rad; clockwise angle = progress * 2*PI
          const angle = ship.ringProgress * 2 * Math.PI;
          const dotX = 60 + radius * Math.cos(angle);
          const dotY = 60 + radius * Math.sin(angle);
          const isHuman = !ship.isBot;

          return (
            <g key={ship.id}>
              <circle
                cx={dotX}
                cy={dotY}
                r={isHuman ? 8 : 6}
                fill={pal.hull}
                stroke="#ffffff"
                strokeWidth={isHuman ? 2.5 : 1.5}
                className="drop-shadow-md"
              />
            </g>
          );
        })}

        {/* Center Text: "LAP" + Big Lap Number */}
        <g transform="translate(60, 52)">
          <text
            x="0"
            y="-4"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="14"
            fontWeight="800"
            letterSpacing="1"
          >
            LAP
          </text>
          <text
            x="0"
            y="26"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="34"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            className="drop-shadow"
          >
            {humanLap}
          </text>
        </g>
      </svg>
    </div>
  );
}
