'use client';

import React from 'react';
import { project, roadHalf, VANISH_X } from '../engine/worldMath';

interface FinishGantryProps {
  humanProgress: number; // 0 (start of race) to 1.0 (finish)
}

export const FinishGantry: React.FC<FinishGantryProps> = ({ humanProgress = 0 }) => {
  // Only show when human player is in the final stretch (progress >= 70% / step 7+)
  if (humanProgress < 0.7) {
    return null;
  }

  // Progress from 0.70 to 1.0 maps depth Z from 16 down to 0.75
  const normalizedP = Math.min(1.0, (humanProgress - 0.7) / 0.3); // 0 to 1.0
  const finishZ = Math.max(0.75, 16 - normalizedP * 15.25);

  const { p, y } = project(finishZ);
  const halfW = roadHalf(p);
  const scale = p * 1.35;
  const opacity = Math.min(1, Math.max(0, normalizedP * 3.0));
  const zIndex = Math.floor((1 - p) * 90);

  // If passed behind camera or opacity is 0, hide
  if (finishZ < 0.55 || opacity <= 0.05) return null;

  const leftPoleX = VANISH_X - halfW;
  const rightPoleX = VANISH_X + halfW;
  const gantryWidth = halfW * 2;
  const poleHeight = 120 * scale;
  const bannerTopY = y - poleHeight;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none transition-opacity duration-300"
      style={{
        zIndex: Math.max(12, zIndex),
        opacity,
      }}
    >
      {/* ── 1. Left Vertical Black Post with Base Pad ── */}
      <div
        className="absolute origin-bottom"
        style={{
          left: `${leftPoleX}px`,
          top: `${y}px`,
          transform: `translate3d(-50%, -100%, 0) scale(${scale})`,
        }}
      >
        <svg viewBox="0 0 24 140" className="w-[24px] h-[140px] overflow-visible drop-shadow-md">
          {/* Ground Base Foot Pad */}
          <rect x="0" y="130" width="24" height="10" rx="2" fill="#111827" />
          {/* Main Solid Black Upright Post */}
          <rect x="7" y="0" width="10" height="130" fill="#111827" />
        </svg>
      </div>

      {/* ── 2. Right Vertical Black Post with Base Pad ── */}
      <div
        className="absolute origin-bottom"
        style={{
          left: `${rightPoleX}px`,
          top: `${y}px`,
          transform: `translate3d(-50%, -100%, 0) scale(${scale})`,
        }}
      >
        <svg viewBox="0 0 24 140" className="w-[24px] h-[140px] overflow-visible drop-shadow-md">
          {/* Ground Base Foot Pad */}
          <rect x="0" y="130" width="24" height="10" rx="2" fill="#111827" />
          {/* Main Solid Black Upright Post */}
          <rect x="7" y="0" width="10" height="130" fill="#111827" />
        </svg>
      </div>

      {/* ── 3. Overhead Checkered Finish Banner in Air (Matching Reference Image) ── */}
      <div
        className="absolute origin-bottom"
        style={{
          left: `${VANISH_X}px`,
          top: `${bannerTopY}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
        }}
      >
        <div
          className="relative flex items-center justify-center border-4 border-black shadow-2xl overflow-hidden"
          style={{
            width: `${Math.max(260, (gantryWidth + 40 * p) / Math.max(0.1, scale))}px`,
            height: '56px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* 4 Rows of Checkerboard Grid */}
          <div className="absolute inset-0 grid grid-rows-4 grid-cols-24 w-full h-full pointer-events-none">
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 24 }).map((_, col) => (
                <div
                  key={`chk_${row}_${col}`}
                  className={(row + col) % 2 === 0 ? 'bg-black' : 'bg-white'}
                />
              ))
            )}
          </div>

          {/* Center White FINISH Badge Box */}
          <div
            className="relative z-10 px-8 py-1.5 rounded-md border-3 border-black bg-white shadow-lg flex items-center justify-center"
            style={{
              minWidth: '150px',
            }}
          >
            <span
              className="font-fredoka font-black text-[24px] text-black tracking-[4px] leading-none uppercase select-none"
              style={{
                fontFamily: 'Fredoka, sans-serif',
              }}
            >
              FINISH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
