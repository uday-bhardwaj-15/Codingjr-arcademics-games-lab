import React from 'react';
import { PodState } from '../types';
import { POD_COLORS, COURSE_LENGTH, STEPS_TO_FINISH } from '../constants';
import { getAllCoursePoints } from '../engine/course';

interface TrackMiniMapProps {
  pods: PodState[];
  correctCount?: number;
}

export const TrackMiniMap: React.FC<TrackMiniMapProps> = ({ pods, correctCount = 0 }) => {
  const points = getAllCoursePoints();

  // Bounding box of the course
  const minX = 100;
  const maxX = 3300;
  const minY = 100;
  const maxY = 420;

  const mapW = 140;
  const mapH = 75;

  const toMapX = (x: number) => ((x - minX) / (maxX - minX)) * (mapW - 20) + 10;
  const toMapY = (y: number) => ((y - minY) / (maxY - minY)) * (mapH - 20) + 10;

  // Build SVG path data for the course line
  const pathD = points
    .filter((_, idx) => idx % 4 === 0 || idx === points.length - 1)
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toMapX(p.x).toFixed(1)} ${toMapY(p.y).toFixed(1)}`)
    .join(' ');

  return (
    <div className="flex flex-col items-end space-y-1.5 select-none shrink-0">
      {/* Top: PROGRESS Badge (Matching Screenshot) */}
      <div className="bg-black/90 px-3 py-1 rounded-sm border border-white/20 shadow-md flex items-center justify-between gap-2.5 min-w-[100px]">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          PROGRESS
        </span>
        <span className="text-xs font-black text-white font-mono">
          {correctCount} / {STEPS_TO_FINISH}
        </span>
      </div>

      {/* Bottom: Enlarged Track Mini-Map Card */}
      <div className="w-36 sm:w-44 h-22 sm:h-24 bg-[#0a1226]/90 backdrop-blur-md rounded-md border border-white/25 p-2 shadow-2xl flex items-center justify-center">
        <svg viewBox={`0 0 ${mapW} ${mapH}`} className="w-full h-full overflow-visible">
          {/* Outer glow line */}
          <path
            d={pathD}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Track Spine Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Line Orange Dot */}
          {points[0] && (
            <circle
              cx={toMapX(points[0].x)}
              cy={toMapY(points[0].y)}
              r="4.5"
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}

          {/* Finish Flag at End */}
          {points[points.length - 1] && (
            <g
              transform={`translate(${toMapX(points[points.length - 1].x)}, ${toMapY(
                points[points.length - 1].y
              )})`}
            >
              <polygon points="0,-10 9,-6 0,-2" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
              <line x1="0" y1="-10" x2="0" y2="4" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {/* 4 Racer Colored Dots */}
          {pods.map((pod) => {
            const ratio = Math.min(1, Math.max(0, pod.displayS / COURSE_LENGTH));
            const idx = Math.floor(ratio * (points.length - 1));
            const pt = points[idx] || points[0];
            const c = POD_COLORS[pod.color] || POD_COLORS.blue;

            return (
              <circle
                key={pod.id}
                cx={toMapX(pt.x)}
                cy={toMapY(pt.y)}
                r={pod.isHuman ? 5.5 : 4}
                fill={c.primary}
                stroke={pod.isHuman ? '#ffffff' : '#0f172a'}
                strokeWidth={pod.isHuman ? 2 : 1}
                className="transition-all duration-100"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
