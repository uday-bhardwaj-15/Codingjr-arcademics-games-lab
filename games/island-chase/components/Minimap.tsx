'use client';

import React from 'react';
import { RacerState } from '../types';
import { COLOR_PALETTES } from '../constants';
import { COURSE_LENGTH, pointAt, headingAt, getCourseSamples, getCourseBBox } from '../engine/course';

interface MinimapProps {
  racers: RacerState[];
  isFinishApproaching?: boolean;
}

export function Minimap({ racers, isFinishApproaching = false }: MinimapProps) {
  const bbox = getCourseBBox();
  const samples = getCourseSamples();

  // Minimap dimensions 128 x 92 with 8px padding
  const pad = 10;
  const targetW = 128 - pad * 2;
  const targetH = 92 - pad * 2;

  const scaleX = targetW / bbox.width;
  const scaleY = targetH / bbox.height;
  const scale = Math.min(scaleX, scaleY);

  const mapX = (wx: number) => pad + (wx - bbox.minX) * scale;
  const mapY = (wy: number) => pad + (wy - bbox.minY) * scale;

  // Generate track path points for minimap
  const trackPathPts = samples
    .filter((_, i) => i % 6 === 0)
    .map((smp) => `${mapX(smp.x).toFixed(1)},${mapY(smp.y).toFixed(1)}`);

  const trackPathSvg = `M ${trackPathPts.join(' L ')}`;

  // Start & Finish positions on minimap
  const pStart = pointAt(0);
  const pFinish = pointAt(COURSE_LENGTH);
  const startMapPt = { x: mapX(pStart.x), y: mapY(pStart.y) };
  const finishMapPt = { x: mapX(pFinish.x), y: mapY(pFinish.y) };

  // Turn Island centers on minimap
  const isl1 = { x: mapX(500), y: mapY(1100), r: 850 * scale };
  const isl2 = { x: mapX(2700), y: mapY(1350), r: 850 * scale };

  return (
    <div className="relative w-32 h-[92px] bg-[#1a4b56]/85 border-2 border-[#54b8c8]/80 rounded-lg shadow-inner overflow-hidden p-1 select-none backdrop-blur-xs">
      <svg viewBox="0 0 128 92" className="w-full h-full">
        {/* Inside Turn Island Blobs */}
        <circle cx={isl1.x} cy={isl1.y} r={isl1.r} fill="#22c55e" opacity="0.3" />
        <circle cx={isl2.x} cy={isl2.y} r={isl2.r} fill="#22c55e" opacity="0.3" />

        {/* Course Track Glow & Line */}
        <path
          d={trackPathSvg}
          fill="none"
          stroke="#0f2e35"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={trackPathSvg}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Start Line Marker */}
        <circle cx={startMapPt.x} cy={startMapPt.y} r="3" fill="#10b981" />

        {/* Finish Flag Marker */}
        <g
          transform={`translate(${finishMapPt.x}, ${finishMapPt.y})`}
          className={isFinishApproaching ? 'animate-bounce' : ''}
        >
          <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fontSize="6" fontWeight="bold">
            🏁
          </text>
        </g>

        {/* 4 Racer Progress Dots */}
        {racers.map((racer, idx) => {
          const clampedS = Math.max(0, Math.min(COURSE_LENGTH, racer.s));
          const pt = pointAt(clampedS);
          const h = headingAt(clampedS);
          const pal = COLOR_PALETTES[racer.color] || COLOR_PALETTES.blue;
          const isHuman = !racer.isBot;

          // Slight lateral offset on minimap
          const perpOffset = (idx - 1.5) * 2;
          const mx = mapX(pt.x + perpOffset * (-Math.sin(h)));
          const my = mapY(pt.y + perpOffset * Math.cos(h));

          return (
            <g key={racer.id} transform={`translate(${mx}, ${my})`}>
              {isHuman ? (
                <>
                  <circle r="5.5" fill="#ffffff" />
                  <circle r="4" fill={pal.hull} />
                  <circle r="1.5" fill="#ffffff" />
                </>
              ) : (
                <circle r="3" fill={pal.hull} stroke="#ffffff" strokeWidth="1" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
