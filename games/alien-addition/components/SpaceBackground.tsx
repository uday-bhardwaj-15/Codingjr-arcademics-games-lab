'use client';

import React from 'react';
import { STAGE } from '../engine/ufoMotion';

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(42); // seeded: identical on server and client
const STARS = Array.from({ length: 160 }, (_, i) => ({
  x: +(rand() * 1010).toFixed(1),
  y: +(rand() * 577).toFixed(1),
  r: +(0.6 + rand() * 1.9).toFixed(1),
  o: +(0.3 + rand() * 0.7).toFixed(2),
  d: +(rand() * 5).toFixed(1),
  pink: i % 6 === 0,
}));

const SPARKLES = [
  [95, 60],
  [870, 220],
  [580, 95],
  [230, 260],
  [930, 70],
  [440, 320],
  [750, 390],
  [55, 360],
];

export function SpaceBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full h-full bg-[#0A0418] overflow-hidden select-none">
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <style>{`
          .tw { animation: tw 3.2s ease-in-out infinite; }
          @keyframes tw { 50% { opacity: .25; } }
          .spk { animation: spk 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          @keyframes spk { 50% { transform: scale(.6) rotate(20deg); opacity: .5; } }
        `}</style>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07020f" />
            <stop offset="100%" stopColor="#15062b" />
          </linearGradient>
          <radialGradient id="glow" cx=".7" cy=".3" r=".6">
            <stop offset="0%" stopColor="#5b1a7a" stopOpacity=".35" />
            <stop offset="100%" stopColor="#5b1a7a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={STAGE.w} height={STAGE.h} fill="url(#sky)" />
        <rect width={STAGE.w} height={STAGE.h} fill="url(#glow)" />
        <path
          d="M0 180 C210 70 390 140 480 280 C570 420 820 480 1010 310 L1010 577 L0 577Z"
          fill="#2a0838"
          opacity=".85"
        />
        <path
          d="M0 310 C180 240 300 340 430 410 C580 500 820 520 1010 430 L1010 577 L0 577Z"
          fill="#1d0a33"
          opacity=".9"
        />
        {STARS.map((s, i) => (
          <circle
            key={i}
            className="tw"
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.pink ? '#f0b8e8' : '#fff'}
            opacity={s.o}
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
        {SPARKLES.map(([x, y], i) => (
          <path
            key={i}
            className="spk"
            transform={`translate(${x} ${y})`}
            style={{ animationDelay: `${i * 0.6}s` }}
            d="M0-16 Q2-3 16 0 Q2 3 0 16 Q-2 3 -16 0 Q-2-3 0-16Z"
            fill="#d9d2ee"
            opacity=".8"
          />
        ))}
      </svg>
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
