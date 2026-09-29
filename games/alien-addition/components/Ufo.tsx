'use client';

import React, { useId } from 'react';
import { UfoState, UfoColor } from '../types';

export const PAL = {
  orange: ['#FFB347', '#F5911B', '#B8600A'],
  red: ['#FF6B55', '#E0301E', '#9C1C10'],
  green: ['#C8E635', '#9DBE1B', '#657D0C'],
  yellow: ['#F3E24A', '#D6C21A', '#8F7F08'],
};

export const COLOR_HEX: Record<string, string> = {
  orange: '#F5911B',
  red: '#E0301E',
  green: '#9DBE1B',
  yellow: '#D6C21A',
};

interface UfoSvgProps {
  a: number;
  b: number;
  color?: UfoColor;
  isLocked?: boolean;
}

export function UfoSvg({ a, b, color = 'red', isLocked = false }: UfoSvgProps) {
  const uid = useId().replace(/:/g, '');
  const [l, m, d] = PAL[color] || PAL.red;

  const label = `${a} + ${b}`;
  const fs = label.length <= 5 ? 27 : label.length <= 7 ? 22 : 19;

  return (
    <svg
      viewBox="0 0 180 100"
      className="w-full h-full overflow-visible drop-shadow-[0_6px_6px_rgba(0,0,0,.5)]"
    >
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={l} />
          <stop offset=".55" stopColor={m} />
          <stop offset="1" stopColor={d} />
        </linearGradient>
        <radialGradient id={`d${uid}`} cx=".35" cy=".3">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".45" stopColor="#c9d3e3" stopOpacity=".65" />
          <stop offset="1" stopColor="#7d8aa3" stopOpacity=".55" />
        </radialGradient>
        <clipPath id={`c${uid}`}>
          <ellipse cx="90" cy="62" rx="86" ry="26" />
        </clipPath>
      </defs>

      {/* 1. Glass Dome */}
      <path
        d="M54 50 C50 4 130 4 126 50Z"
        fill={`url(#d${uid})`}
        stroke="rgba(255,255,255,.55)"
      />
      <ellipse
        cx="76"
        cy="24"
        rx="12"
        ry="5"
        fill="#fff"
        opacity=".75"
        transform="rotate(-22 76 24)"
      />

      {/* 2. Saucer Body */}
      <ellipse cx="90" cy="62" rx="86" ry="26" fill={`url(#b${uid})`} />

      {/* 3. Slanted Stripes */}
      <g clipPath={`url(#c${uid})`} fill="#fff" opacity=".2">
        <path d="M18 34 L46 34 L26 92 L-2 92Z" />
        <path d="M64 34 L92 34 L72 92 L44 92Z" />
        <path d="M110 34 L138 34 L118 92 L90 92Z" />
        <path d="M156 34 L184 34 L164 92 L136 92Z" />
      </g>

      {/* 4. Glossy Highlight & Rim */}
      <ellipse cx="90" cy="52" rx="62" ry="8" fill="#fff" opacity=".14" />
      <ellipse
        cx="90"
        cy="62"
        rx="86"
        ry="26"
        fill="none"
        stroke={isLocked ? '#38BDF8' : d}
        strokeWidth={isLocked ? '3' : '1.5'}
      />

      {/* 5. Scaled Sum Label */}
      <text
        x="90"
        y="72"
        textAnchor="middle"
        fontSize={fs}
        fontWeight="800"
        fill="#fff"
        stroke="rgba(0,0,0,.35)"
        strokeWidth="3"
        paintOrder="stroke"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

interface UfoProps {
  ufo: UfoState;
  isLocked?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
}

export function Ufo({ ufo, isLocked = false, isRevealed = false, onClick }: UfoProps) {
  if (ufo.status === 'gone') return null;

  const animClass =
    ufo.spawn === 'pop'
      ? 'ufo-pop-in'
      : ufo.spawn === 'fade'
      ? 'ufo-fade-in'
      : '';

  return (
    <>
      <style>{`
        .ufo-wrong {
          animation: ufoShake .3s 2;
          filter: brightness(1.4) hue-rotate(-20deg);
        }
        @keyframes ufoShake {
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .ufo-locked {
          filter: drop-shadow(0 0 14px #38bdf8) drop-shadow(0 0 6px #ffffff);
        }
        .ufo-revealed {
          filter: drop-shadow(0 0 20px #f59e1b) drop-shadow(0 0 8px #ffd700);
          animation: revealPulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes revealPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .ufo-pop-in {
          animation: ufoPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes ufoPopIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        .ufo-fade-in {
          animation: ufoFadeIn 0.2s ease-out forwards;
        }
        @keyframes ufoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        onClick={onClick}
        className="absolute left-0 top-0 cursor-pointer select-none"
        style={{
          transform: `translate3d(${ufo.x}px, ${ufo.y}px, 0) translate(-50%, -50%)`,
          width: '172px',
          height: '96px',
          willChange: 'transform',
          zIndex: isRevealed ? 50 : isLocked ? 30 : 20,
        }}
        title={`Shoot ${ufo.a} + ${ufo.b}`}
      >
        {/* Inner Wrapper holding spawn animation and visual states */}
        <div
          className={`w-full h-full transition-transform hover:scale-105 active:scale-95 ${
            ufo.status === 'wrong' ? 'ufo-wrong' : ''
          } ${isRevealed ? 'ufo-revealed' : isLocked ? 'ufo-locked' : ''} ${animClass}`}
        >
          <UfoSvg
            a={ufo.a}
            b={ufo.b}
            color={ufo.color}
            isLocked={isLocked}
          />
        </div>
      </div>
    </>
  );
}
