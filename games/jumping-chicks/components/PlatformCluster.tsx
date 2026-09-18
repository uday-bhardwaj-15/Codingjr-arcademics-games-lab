'use client';

import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface PlatformClusterProps {
  count: number;
  index: number;
  onClick?: () => void;
  disabled?: boolean;
  highlightCorrect?: boolean;
  isWrongSelected?: boolean;
  isFinishPodium?: boolean;
}

// Ribbed leaf matching Arcademics visual proportions
const BigRibbedLeaf: React.FC<{ x: number; y: number; scale?: number; rotation?: number }> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
}) => {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
      className="transition-transform duration-200"
    >
      <defs>
        <linearGradient id="big-leaf-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6fd638" />
          <stop offset="45%" stopColor="#4ea824" />
          <stop offset="100%" stopColor="#2e7815" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <path
        d="M 32,54 Q 33,64 32,72"
        stroke="#1a400e"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaf Body */}
      <path
        d="M 32,54 C 10,52 2,38 4,22 C 6,6 20,2 32,4 C 44,2 58,6 60,22 C 62,38 54,52 32,54 Z"
        fill="url(#big-leaf-grad)"
        stroke="#1a440e"
        strokeWidth="1.5"
      />

      {/* Central Vein */}
      <path
        d="M 32,4 C 32,20 32,38 32,54"
        stroke="#183f0d"
        strokeWidth="1.4"
        fill="none"
      />

      {/* Radial Rib Veins (Left side) */}
      <path d="M 32,14 Q 20,11 11,16" stroke="#183f0d" strokeWidth="1.1" fill="none" />
      <path d="M 32,26 Q 18,24 6,30" stroke="#183f0d" strokeWidth="1.1" fill="none" />
      <path d="M 32,38 Q 20,38 13,46" stroke="#183f0d" strokeWidth="1.1" fill="none" />

      {/* Radial Rib Veins (Right side) */}
      <path d="M 32,14 Q 44,11 53,16" stroke="#183f0d" strokeWidth="1.1" fill="none" />
      <path d="M 32,26 Q 46,24 58,30" stroke="#183f0d" strokeWidth="1.1" fill="none" />
      <path d="M 32,38 Q 44,38 51,46" stroke="#183f0d" strokeWidth="1.1" fill="none" />
    </g>
  );
};

// Clean layouts for 1 to 12 leaves
function getLeafClusterLayout(count: number): { x: number; y: number; scale: number; rotation: number }[] {
  switch (count) {
    case 1:
      return [{ x: 50, y: 38, scale: 1.45, rotation: 0 }];

    case 2:
      return [
        { x: 30, y: 38, scale: 1.3, rotation: -6 },
        { x: 70, y: 38, scale: 1.3, rotation: 6 },
      ];

    case 3:
      return [
        { x: 50, y: 18, scale: 1.2, rotation: 0 },
        { x: 26, y: 50, scale: 1.2, rotation: -8 },
        { x: 74, y: 50, scale: 1.2, rotation: 8 },
      ];

    case 4:
      return [
        { x: 28, y: 16, scale: 1.15, rotation: -5 },
        { x: 72, y: 16, scale: 1.15, rotation: 5 },
        { x: 24, y: 54, scale: 1.15, rotation: -6 },
        { x: 76, y: 54, scale: 1.15, rotation: 6 },
      ];

    case 5:
      return [
        { x: 50, y: 14, scale: 1.1, rotation: 0 },
        { x: 20, y: 34, scale: 1.1, rotation: -8 },
        { x: 80, y: 34, scale: 1.1, rotation: 8 },
        { x: 28, y: 62, scale: 1.1, rotation: -6 },
        { x: 72, y: 62, scale: 1.1, rotation: 6 },
      ];

    case 6:
      return [
        { x: 18, y: 16, scale: 1.05, rotation: -6 },
        { x: 50, y: 12, scale: 1.05, rotation: 0 },
        { x: 82, y: 16, scale: 1.05, rotation: 6 },
        { x: 18, y: 54, scale: 1.05, rotation: -6 },
        { x: 50, y: 52, scale: 1.05, rotation: 0 },
        { x: 82, y: 54, scale: 1.05, rotation: 6 },
      ];

    case 7:
      return [
        { x: 34, y: 12, scale: 1.0, rotation: -5 },
        { x: 66, y: 12, scale: 1.0, rotation: 5 },
        { x: 16, y: 36, scale: 1.0, rotation: -8 },
        { x: 50, y: 34, scale: 1.0, rotation: 0 },
        { x: 84, y: 36, scale: 1.0, rotation: 8 },
        { x: 32, y: 62, scale: 1.0, rotation: -6 },
        { x: 68, y: 62, scale: 1.0, rotation: 6 },
      ];

    case 8:
      return [
        { x: 34, y: 12, scale: 0.96, rotation: -5 },
        { x: 66, y: 12, scale: 0.96, rotation: 5 },
        { x: 14, y: 36, scale: 0.96, rotation: -8 },
        { x: 42, y: 36, scale: 0.96, rotation: -2 },
        { x: 70, y: 36, scale: 0.96, rotation: 2 },
        { x: 98, y: 36, scale: 0.96, rotation: 8 },
        { x: 28, y: 62, scale: 0.96, rotation: -6 },
        { x: 80, y: 62, scale: 0.96, rotation: 6 },
      ];

    case 9:
      return [
        { x: 20, y: 14, scale: 0.92, rotation: -6 },
        { x: 50, y: 10, scale: 0.92, rotation: 0 },
        { x: 80, y: 14, scale: 0.92, rotation: 6 },
        { x: 16, y: 38, scale: 0.92, rotation: -8 },
        { x: 50, y: 36, scale: 0.92, rotation: 0 },
        { x: 84, y: 38, scale: 0.92, rotation: 8 },
        { x: 20, y: 64, scale: 0.92, rotation: -6 },
        { x: 50, y: 62, scale: 0.92, rotation: 0 },
        { x: 80, y: 64, scale: 0.92, rotation: 6 },
      ];

    case 10:
      return [
        { x: 26, y: 10, scale: 0.88, rotation: -6 },
        { x: 54, y: 8, scale: 0.88, rotation: 0 },
        { x: 82, y: 10, scale: 0.88, rotation: 6 },
        { x: 12, y: 34, scale: 0.88, rotation: -8 },
        { x: 40, y: 32, scale: 0.88, rotation: -2 },
        { x: 68, y: 32, scale: 0.88, rotation: 2 },
        { x: 96, y: 34, scale: 0.88, rotation: 8 },
        { x: 26, y: 58, scale: 0.88, rotation: -6 },
        { x: 54, y: 56, scale: 0.88, rotation: 0 },
        { x: 82, y: 58, scale: 0.88, rotation: 6 },
      ];

    default:
      return Array.from({ length: Math.min(count, 12) }).map((_, i) => ({
        x: 20 + (i % 4) * 24,
        y: 15 + Math.floor(i / 4) * 24,
        scale: 0.85,
        rotation: 0,
      }));
  }
}

export const PlatformCluster: React.FC<PlatformClusterProps> = ({
  count,
  index,
  onClick,
  disabled = false,
  highlightCorrect = false,
  isWrongSelected = false,
  isFinishPodium = false,
}) => {
  const leaves = getLeafClusterLayout(count);

  if (isFinishPodium) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type="button"
        className={`group relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none select-none ${
          disabled ? 'pointer-events-none' : 'hover:scale-105 active:scale-95 cursor-pointer'
        }`}
      >
        <div className="relative w-36 h-30 sm:w-44 sm:h-38 md:w-56 md:h-46 flex flex-col items-center justify-center">
          {/* Golden Glow */}
          <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-xl animate-pulse" />

          {/* Golden Trophy Podium Platform */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 border-4 border-amber-500 shadow-2xl flex items-center justify-center text-amber-950 animate-bounce">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11 fill-current drop-shadow" />
            </div>
            <span className="mt-1 bg-amber-500 text-amber-950 font-black text-xs sm:text-sm px-3 py-0.5 rounded-full border-2 border-yellow-200 shadow-md uppercase tracking-wider">
              FINISH PODIUM
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`group relative flex flex-col items-center justify-center transition-all duration-200 focus:outline-none select-none ${
        disabled ? 'pointer-events-none' : 'hover:scale-105 active:scale-95 cursor-pointer'
      }`}
      aria-label={`Lily cluster ${index + 1} with ${count} leaves`}
    >
      <div className="relative w-28 h-24 sm:w-36 sm:h-30 md:w-44 md:h-36 flex items-center justify-center">
        <div
          className={`absolute inset-x-2 bottom-2 h-8 rounded-full blur-md transition-all duration-200 ${
            highlightCorrect
              ? 'bg-emerald-400/70 scale-110'
              : isWrongSelected
              ? 'bg-rose-500/70 scale-110'
              : 'bg-emerald-950/25 group-hover:bg-emerald-700/35'
          }`}
        />

        <svg
          viewBox="0 0 150 120"
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          {leaves.map((leaf, lIdx) => (
            <BigRibbedLeaf
              key={lIdx}
              x={leaf.x}
              y={leaf.y}
              scale={leaf.scale}
              rotation={leaf.rotation}
            />
          ))}
        </svg>
      </div>
    </button>
  );
};
