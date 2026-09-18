'use client';

import React from 'react';

interface PlatformClusterProps {
  count: number;
  index: number;
  onClick?: () => void;
  disabled?: boolean;
  highlightCorrect?: boolean;
  isWrongSelected?: boolean;
  isFinishPodium?: boolean;
}

/**
 * Single Arcademics Lily Leaf matching the authentic visual style:
 * - Round wide spade shape with dark outline
 * - Vertical main spine vein & delicate curved side ribs
 * - Green stem extending below into water
 * - Drop shadow
 */
const ArcademicsLeaf: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  gradId: string;
}> = ({ x, y, scale = 1, rotation = 0, gradId }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}, 23, 20) scale(${scale})`}>
      {/* Stem sticking out at the bottom */}
      <path
        d="M 23,37 Q 23,48 22,54"
        fill="none"
        stroke="#1a4609"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Leaf water drop shadow */}
      <ellipse cx="23" cy="42" rx="20" ry="6" fill="rgba(0,0,0,0.16)" />

      {/* Leaf rounded body */}
      <path
        d="M 23,38
           C 9,38 1,29 1,18
           C 1,7 10,1 21,1
           C 22.3,1 23,2.2 23,2.8
           C 23,2.2 23.7,1 25,1
           C 36,1 45,7 45,18
           C 45,29 37,38 23,38 Z"
        fill={`url(#${gradId})`}
        stroke="#1a4609"
        strokeWidth="1.8"
      />

      {/* Central main vein */}
      <line
        x1="23"
        y1="36"
        x2="23"
        y2="4"
        stroke="#1a4609"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Side curved ribs - clean, delicate, authentic */}
      <path
        d="M 23,13 C 16,11 10,13 6,17"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M 23,13 C 30,11 36,13 40,17"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M 23,22 C 14,20 7,24 4,28"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M 23,22 C 32,20 39,24 42,28"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M 23,30 C 17,29 11,32 8,34"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.0"
        strokeLinecap="round"
      />
      <path
        d="M 23,30 C 29,29 35,32 38,34"
        fill="none"
        stroke="#1a4609"
        strokeWidth="1.0"
        strokeLinecap="round"
      />
    </g>
  );
};

// Layout coordinates for leaves within 140x120 SVG box
function getClusterLayout(count: number): { x: number; y: number; scale: number; rotation: number }[] {
  switch (count) {
    case 1:
      return [{ x: 47, y: 32, scale: 1.35, rotation: 0 }];

    case 2:
      return [
        { x: 24, y: 34, scale: 1.2, rotation: -6 },
        { x: 68, y: 34, scale: 1.2, rotation: 6 },
      ];

    case 3:
      return [
        { x: 26, y: 16, scale: 1.1, rotation: -6 },
        { x: 68, y: 16, scale: 1.1, rotation: 6 },
        { x: 47, y: 46, scale: 1.15, rotation: 0 },
      ];

    case 4:
      return [
        { x: 26, y: 16, scale: 1.05, rotation: -6 },
        { x: 68, y: 16, scale: 1.05, rotation: 6 },
        { x: 24, y: 48, scale: 1.08, rotation: -6 },
        { x: 70, y: 48, scale: 1.08, rotation: 6 },
      ];

    case 5:
      return [
        { x: 16, y: 15, scale: 0.98, rotation: -8 },
        { x: 47, y: 12, scale: 0.98, rotation: 0 },
        { x: 78, y: 15, scale: 0.98, rotation: 8 },
        { x: 30, y: 48, scale: 1.02, rotation: -5 },
        { x: 64, y: 48, scale: 1.02, rotation: 5 },
      ];

    case 6:
      return [
        { x: 16, y: 14, scale: 0.95, rotation: -8 },
        { x: 47, y: 12, scale: 0.95, rotation: 0 },
        { x: 78, y: 14, scale: 0.95, rotation: 8 },
        { x: 16, y: 46, scale: 0.98, rotation: -8 },
        { x: 47, y: 46, scale: 0.98, rotation: 0 },
        { x: 78, y: 46, scale: 0.98, rotation: 8 },
      ];

    case 7:
      return [
        { x: 16, y: 12, scale: 0.9, rotation: -8 },
        { x: 47, y: 10, scale: 0.9, rotation: 0 },
        { x: 78, y: 12, scale: 0.9, rotation: 8 },
        { x: 16, y: 40, scale: 0.92, rotation: -8 },
        { x: 47, y: 40, scale: 0.92, rotation: 0 },
        { x: 78, y: 40, scale: 0.92, rotation: 8 },
        { x: 47, y: 64, scale: 0.94, rotation: 0 },
      ];

    case 8:
      return [
        { x: 8,  y: 14, scale: 0.88, rotation: -8 },
        { x: 34, y: 12, scale: 0.88, rotation: -3 },
        { x: 60, y: 12, scale: 0.88, rotation: 3 },
        { x: 86, y: 14, scale: 0.88, rotation: 8 },
        { x: 8,  y: 46, scale: 0.9,  rotation: -8 },
        { x: 34, y: 46, scale: 0.9,  rotation: -3 },
        { x: 60, y: 46, scale: 0.9,  rotation: 3 },
        { x: 86, y: 46, scale: 0.9,  rotation: 8 },
      ];

    case 9:
      return [
        { x: 16, y: 10, scale: 0.85, rotation: -8 },
        { x: 47, y: 8,  scale: 0.85, rotation: 0 },
        { x: 78, y: 10, scale: 0.85, rotation: 8 },
        { x: 16, y: 36, scale: 0.87, rotation: -8 },
        { x: 47, y: 36, scale: 0.87, rotation: 0 },
        { x: 78, y: 36, scale: 0.87, rotation: 8 },
        { x: 16, y: 62, scale: 0.89, rotation: -8 },
        { x: 47, y: 62, scale: 0.89, rotation: 0 },
        { x: 78, y: 62, scale: 0.89, rotation: 8 },
      ];

    case 10:
      return [
        { x: 4,  y: 12, scale: 0.82, rotation: -10 },
        { x: 26, y: 10, scale: 0.82, rotation: -5 },
        { x: 47, y: 9,  scale: 0.82, rotation: 0 },
        { x: 68, y: 10, scale: 0.82, rotation: 5 },
        { x: 90, y: 12, scale: 0.82, rotation: 10 },
        { x: 4,  y: 46, scale: 0.84, rotation: -10 },
        { x: 26, y: 45, scale: 0.84, rotation: -5 },
        { x: 47, y: 44, scale: 0.84, rotation: 0 },
        { x: 68, y: 45, scale: 0.84, rotation: 5 },
        { x: 90, y: 46, scale: 0.84, rotation: 10 },
      ];

    default: {
      const n = Math.min(count, 12);
      return Array.from({ length: n }, (_, i) => ({
        x: (i % 3) * 34 + 14,
        y: Math.floor(i / 3) * 32 + 12,
        scale: 0.82,
        rotation: (i % 2 === 0 ? -1 : 1) * 6,
      }));
    }
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
  const leaves = getClusterLayout(count);
  const gradPrefix = `lg-${index}-${count}`;

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
        <div className="relative flex flex-col items-center">
          {/* Subtle glow */}
          <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-xl scale-125" />

          <svg viewBox="0 0 220 140" className="w-48 h-32 sm:w-56 sm:h-36 drop-shadow-2xl overflow-visible">
            <defs>
              <linearGradient id="fp-top-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a3d426" />
                <stop offset="60%" stopColor="#8cc71b" />
                <stop offset="100%" stopColor="#6ea612" />
              </linearGradient>
            </defs>

            {/* Goal Posts & Overhead Bar */}
            <line x1="28" y1="42" x2="28" y2="14" stroke="#1d4d0a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="28" cy="13" r="3.5" fill="#facc15" stroke="#1d4d0a" strokeWidth="1" />
            <line x1="192" y1="42" x2="192" y2="14" stroke="#1d4d0a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="192" cy="13" r="3.5" fill="#facc15" stroke="#1d4d0a" strokeWidth="1" />
            <line x1="28" y1="20" x2="192" y2="20" stroke="#25630d" strokeWidth="2.5" />

            {/* 3D Side Bevel Rim */}
            <path
              d="M 16,70 C 16,108 204,108 204,70 L 204,80 C 204,118 16,118 16,80 Z"
              fill="#55800d"
              stroke="#1b4209"
              strokeWidth="2"
            />

            {/* Main Top Disc Ellipse */}
            <ellipse
              cx="110"
              cy="70"
              rx="94"
              ry="42"
              fill="url(#fp-top-grad)"
              stroke="#1b4209"
              strokeWidth="2.5"
            />

            {/* Radial perspective lines */}
            {([0, 35, 70, 110, 145, 180, 215, 250, 290, 325] as number[]).map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="110"
                  y1="70"
                  x2={110 + Math.cos(rad) * 92}
                  y2={70 + Math.sin(rad) * 40}
                  stroke="#598411"
                  strokeWidth="1.2"
                  opacity="0.6"
                />
              );
            })}

            {/* Checkered Finish Pattern Stripe */}
            <g transform="translate(46, 74)">
              <rect x="0" y="0" width="16" height="8" fill="#305a0d" />
              <rect x="16" y="0" width="16" height="8" fill="#8bc920" />
              <rect x="32" y="0" width="16" height="8" fill="#305a0d" />
              <rect x="48" y="0" width="16" height="8" fill="#8bc920" />
              <rect x="64" y="0" width="16" height="8" fill="#305a0d" />
              <rect x="80" y="0" width="16" height="8" fill="#8bc920" />
              <rect x="96" y="0" width="16" height="8" fill="#305a0d" />
              <rect x="112" y="0" width="16" height="8" fill="#8bc920" />

              <rect x="0" y="8" width="16" height="8" fill="#8bc920" />
              <rect x="16" y="8" width="16" height="8" fill="#305a0d" />
              <rect x="32" y="8" width="16" height="8" fill="#8bc920" />
              <rect x="48" y="8" width="16" height="8" fill="#305a0d" />
              <rect x="64" y="8" width="16" height="8" fill="#8bc920" />
              <rect x="80" y="8" width="16" height="8" fill="#305a0d" />
              <rect x="96" y="8" width="16" height="8" fill="#8bc920" />
              <rect x="112" y="8" width="16" height="8" fill="#305a0d" />
            </g>

            {/* FINISH text embossed on the platform */}
            <text
              x="110"
              y="66"
              textAnchor="middle"
              fontSize="24"
              fontWeight="900"
              fontFamily="Impact, Arial Black, sans-serif"
              letterSpacing="6"
              fill="#2b540c"
              opacity="0.95"
            >
              FINISH
            </text>
          </svg>
        </div>
      </button>
    );
  }

  const borderGlow = highlightCorrect
    ? 'drop-shadow-[0_0_14px_rgba(74,222,128,0.9)]'
    : isWrongSelected
    ? 'drop-shadow-[0_0_14px_rgba(239,68,68,0.9)]'
    : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)] group-hover:drop-shadow-[0_6px_16px_rgba(74,222,128,0.55)]';

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
      <div className="relative w-32 h-28 sm:w-40 sm:h-34 md:w-48 md:h-40 flex items-center justify-center">
        <svg
          viewBox="0 0 140 120"
          className={`w-full h-full overflow-visible transition-all duration-200 ${borderGlow}`}
        >
          <defs>
            <linearGradient id={`${gradPrefix}-leaf`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#68c42a" />
              <stop offset="60%" stopColor="#51a620" />
              <stop offset="100%" stopColor="#3d8515" />
            </linearGradient>
          </defs>

          {leaves.map((leaf, lIdx) => (
            <ArcademicsLeaf
              key={lIdx}
              x={leaf.x}
              y={leaf.y}
              scale={leaf.scale}
              rotation={leaf.rotation}
              gradId={`${gradPrefix}-leaf`}
            />
          ))}
        </svg>

        {/* Hover/selected glow underlay */}
        <div
          className={`absolute bottom-1 inset-x-4 h-4 rounded-full blur-lg transition-all duration-200 ${
            highlightCorrect
              ? 'bg-emerald-400/80 scale-110'
              : isWrongSelected
              ? 'bg-rose-500/80 scale-110'
              : 'bg-transparent group-hover:bg-emerald-500/30'
          }`}
        />
      </div>
    </button>
  );
};
