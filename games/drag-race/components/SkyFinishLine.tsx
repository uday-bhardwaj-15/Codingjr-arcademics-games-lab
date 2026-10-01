'use client';

import React from 'react';
import { project, roadHalf, VANISH_X } from '../engine/worldMath';

interface SkyFinishLineProps {
  humanProgress: number; // 0 (start) to 1.0 (finish)
}

export const SkyFinishLine: React.FC<SkyFinishLineProps> = ({ humanProgress = 0 }) => {
  // Only show when human player is in the final stretch (progress >= 65% / step >= 7)
  if (humanProgress < 0.65) {
    return null;
  }

  // Linear progression from 0.65 to 1.0
  const normalizedP = Math.min(1.0, Math.max(0, (humanProgress - 0.65) / 0.35)); // 0 to 1.0

  // Perspective depth: moves from Z=16 down to Z=0.85
  const finishZ = Math.max(0.85, 16 - normalizedP * 15.15);

  const { p, y } = project(finishZ);
  const halfW = roadHalf(p);
  const scale = p * 1.35;

  // Opacity smoothly increases as you approach, full 1.0 at finish line
  const opacity = Math.min(1.0, Math.max(0.1, Math.pow(normalizedP, 1.2)));

  const zIndex = Math.floor((1 - p) * 90);

  // Position high in the sky above the horizon / road
  const bannerWidth = Math.max(260, (halfW * 2 + 50 * p) / Math.max(0.1, scale));
  const skyY = y - 110 * scale;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none transition-opacity duration-300"
      style={{
        zIndex: Math.max(15, zIndex),
        opacity,
      }}
    >
      {/* ── Aerial Floating Checkered Finish Arch in Sky (No Road Posts) ── */}
      <div
        className="absolute origin-bottom"
        style={{
          left: `${VANISH_X}px`,
          top: `${skyY}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
        }}
      >
        <div
          className="relative flex items-center justify-center rounded-2xl border-4 border-black shadow-[0_12px_28px_rgba(0,0,0,0.65)] overflow-hidden"
          style={{
            width: `${bannerWidth}px`,
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
            className="relative z-10 px-8 py-1.5 rounded-lg border-3 border-black bg-white shadow-xl flex items-center justify-center"
            style={{
              minWidth: '150px',
            }}
          >
            <span
              className="font-fredoka font-black text-[24px] text-black tracking-[5px] leading-none uppercase select-none drop-shadow-xs"
            >
              FINISH
            </span>
          </div>
        </div>

        {/* Subtle Sky Suspension Cables */}
        <div className="absolute -top-16 inset-x-8 flex justify-between pointer-events-none opacity-40">
          <div className="w-0.5 h-16 bg-white/70" />
          <div className="w-0.5 h-16 bg-white/70" />
        </div>
      </div>
    </div>
  );
};
