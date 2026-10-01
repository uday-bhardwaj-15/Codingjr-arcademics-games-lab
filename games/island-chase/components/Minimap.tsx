'use client';

import React from 'react';
import { RacerState } from '../types';
import { COLOR_PALETTES } from '../constants';
import { COURSE_LENGTH, pointAt, headingAt, getCourseSamples, getCourseBBox } from '../engine/course';
import { UI_THEME } from '../ui/theme';

interface MinimapProps {
  racers: RacerState[];
  isFinishApproaching?: boolean;
}

export function Minimap({ racers, isFinishApproaching = false }: MinimapProps) {
  const bbox = getCourseBBox();
  const samples = getCourseSamples();

  // Minimap dimensions 128 x 106 with 12px padding
  const pad = 12;
  const targetW = 128 - pad * 2;
  const targetH = 106 - pad * 2;

  const scaleX = targetW / bbox.width;
  const scaleY = targetH / bbox.height;
  const scale = Math.min(scaleX, scaleY);

  const mapX = (wx: number) => pad + (wx - bbox.minX) * scale;
  const mapY = (wy: number) => pad + (wy - bbox.minY) * scale;

  // Generate track path points for minimap
  const trackPathPts = samples
    .filter((_, i) => i % 5 === 0)
    .map((smp) => `${mapX(smp.x).toFixed(1)},${mapY(smp.y).toFixed(1)}`);

  const trackPathSvg = `M ${trackPathPts.join(' L ')}`;

  // Start & Finish positions on minimap
  const pStart = pointAt(0);
  const pFinish = pointAt(COURSE_LENGTH);
  const startMapPt = { x: mapX(pStart.x), y: mapY(pStart.y) };
  const finishMapPt = { x: mapX(pFinish.x), y: mapY(pFinish.y) };

  // Island Tree Foliage Blobs
  const isl1 = { x: mapX(500), y: mapY(1100), r: 24 };
  const isl2 = { x: mapX(2700), y: mapY(1350), r: 24 };

  return (
    <div
      className="relative w-[128px] h-[106px] rounded-2xl overflow-hidden p-1 select-none backdrop-blur-xs shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
      style={{
        background: 'linear-gradient(180deg, #2a8f9d 0%, #175e6a 100%)',
        border: '3px solid #a3eef7',
      }}
    >
      {/* Pale Blue Water Base inside Minimap */}
      <div className="absolute inset-1 rounded-xl bg-[#bfeaf6]/90 overflow-hidden">
        <svg viewBox="0 0 128 106" className="w-full h-full">
          {/* Tropical Island Silhouettes / Tree Blobs */}
          <g opacity="0.6">
            {/* Island 1 */}
            <rect x={isl1.x - 2} y={isl1.y} width="4" height="20" fill="#78350f" />
            <circle cx={isl1.x - 9} cy={isl1.y + 2} r="14" fill="#15803d" />
            <circle cx={isl1.x + 9} cy={isl1.y - 1} r="13" fill="#16a34a" />
            <circle cx={isl1.x} cy={isl1.y - 7} r="14" fill="#22c55e" />

            {/* Island 2 */}
            <rect x={isl2.x - 2} y={isl2.y} width="4" height="20" fill="#78350f" />
            <circle cx={isl2.x - 7} cy={isl2.y + 2} r="14" fill="#15803d" />
            <circle cx={isl2.x + 8} cy={isl2.y - 1} r="13" fill="#16a34a" />
            <circle cx={isl2.x} cy={isl2.y - 7} r="13" fill="#22c55e" />
          </g>

          {/* Course Track Outer Navy Shadow Bed */}
          <path
            d={trackPathSvg}
            fill="none"
            stroke="#093b44"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Course Track Thick White Path (5px) */}
          <path
            d={trackPathSvg}
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Line Red-Orange Marker */}
          <circle cx={startMapPt.x} cy={startMapPt.y} r="4.5" fill="#f4572e" stroke="#ffffff" strokeWidth="1.5" />

          {/* Finish Flag Marker */}
          <g
            transform={`translate(${finishMapPt.x}, ${finishMapPt.y})`}
            className={isFinishApproaching ? 'animate-bounce' : ''}
          >
            <circle r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
            <text x="0" y="3.5" textAnchor="middle" fontSize="7" fontWeight="bold">
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
            const perpOffset = (idx - 1.5) * 2.2;
            const mx = mapX(pt.x + perpOffset * (-Math.sin(h)));
            const my = mapY(pt.y + perpOffset * Math.cos(h));

            return (
              <g key={racer.id} transform={`translate(${mx}, ${my})`}>
                {isHuman ? (
                  <>
                    {/* 12px Human Racer Indicator Dot with White Outline */}
                    <circle r="6" fill="#ffffff" />
                    <circle r="4.5" fill="#1f6bff" stroke="#0d3fb0" strokeWidth="1" />
                    <circle r="1.8" fill="#ffffff" />
                  </>
                ) : (
                  <circle r="3.5" fill={pal.hull} stroke="#ffffff" strokeWidth="1.2" />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
