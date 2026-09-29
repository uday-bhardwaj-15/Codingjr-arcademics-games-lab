'use client';

import React from 'react';
import { STAGE } from '../engine/ufoMotion';

interface LaserBoltProps {
  startX: number; // design px
  startY: number; // design px
  endX: number; // design px
  endY: number; // design px
}

export const LaserBolt: React.FC<LaserBoltProps> = ({
  startX,
  startY,
  endX,
  endY,
}) => {
  return (
    <svg
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      className="absolute inset-0 w-full h-full pointer-events-none z-35"
    >
      <defs>
        <linearGradient id="laserGlow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3CC8D8" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Outer beam glow */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#38BDF8"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Core laser beam */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="url(#laserGlow)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
