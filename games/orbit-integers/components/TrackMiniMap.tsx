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
    <div
      className="w-[128px] h-[106px] rounded-[18px] p-2 flex flex-col justify-between select-none relative overflow-hidden shrink-0"
      style={{
        background: 'linear-gradient(180deg, #0e3270 0%, #061b40 100%)',
        border: '2.5px solid #7dd3fc',
        boxShadow: '0 0 16px rgba(125, 211, 252, 0.4), 0 6px 14px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Top Gloss Highlight */}
      <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-[16px] pointer-events-none" />

      {/* Mini Track SVG */}
      <svg viewBox={`0 0 ${mapW} ${mapH}`} className="w-full h-full overflow-visible">
        {/* Outer track glow */}
        <path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* Crisp white track spine */}
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start Line Green Dot */}
        {points[0] && (
          <circle
            cx={toMapX(points[0].x)}
            cy={toMapY(points[0].y)}
            r="4.5"
            fill="#22c55e"
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
            <polygon points="0,-9 8,-5.5 0,-2" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
            <line x1="0" y1="-9" x2="0" y2="3" stroke="#ffffff" strokeWidth="1.5" />
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
              r={pod.isHuman ? 6 : 4}
              fill={c.primary}
              stroke={pod.isHuman ? '#ffffff' : '#02082e'}
              strokeWidth={pod.isHuman ? 2.2 : 1.2}
              className="transition-all duration-100"
            />
          );
        })}
      </svg>
    </div>
  );
};
