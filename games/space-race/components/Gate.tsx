'use client';

import React from 'react';
import { GateInfo } from '../types';
import { CROWD_COLORS } from '../engine/scenery';
import { MOON_R } from '../constants';

interface GateProps {
  gate: GateInfo;
}

export function Gate({ gate }: GateProps) {
  // Flag banner is planted in local moon coordinates at phi0
  const flagPhiDeg = (gate.phi0 * 180) / Math.PI;

  return (
    <g>
      {/* 1. Flag & Banner Assembly (Planted at phi0) */}
      <g transform={`rotate(${flagPhiDeg}) translate(0, ${-MOON_R})`}>
        {/* Purple Crystal Cluster at the base of left pole */}
        <g transform="translate(-75, 4)">
          <polygon points="0,0 8,-18 16,-4 12,0" fill="#8b6fc0" stroke="#5b21b6" strokeWidth="1" />
          <polygon points="10,0 20,-26 28,-8 22,0" fill="#a68be0" stroke="#5b21b6" strokeWidth="1" />
          <polygon points="24,0 32,-16 38,-2 32,0" fill="#c4b5fd" stroke="#5b21b6" strokeWidth="1" />
        </g>

        {/* Two Silver Poles (130px apart, 330px tall, radial to moon) */}
        <g transform="translate(-65, -330)">
          {/* Top Crossbar connecting the poles */}
          <rect x="0" y="0" width="130" height="8" rx="2" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />

          {/* Left Tapered Pole */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="334"
            stroke="url(#gatePoleGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

          {/* Right Tapered Pole */}
          <line
            x1="130"
            y1="0"
            x2="130"
            y2="334"
            stroke="url(#gatePoleGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="130" cy="0" r="6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

          {/* White Swallowtail Cloth Banner Hanging from Crossbar */}
          <g transform="translate(2, 8)">
            {/* Main Cloth with V-Cut Bottom */}
            <path
              d="M 0 0 L 126 0 L 126 95 L 63 70 L 0 95 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="3"
              className="drop-shadow-lg"
            />

            {/* Stitched Inner Border */}
            <path
              d="M 6 6 L 120 6 L 120 86 L 63 64 L 6 86 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />

            {/* Banner Fold Shadows */}
            <path d="M 38 0 L 32 78 L 44 80 L 50 0 Z" fill="#e2e8f0" opacity="0.5" />
            <path d="M 88 0 L 82 78 L 94 80 L 100 0 Z" fill="#e2e8f0" opacity="0.5" />

            {/* Heavy Italic Stencil Text */}
            <text
              x="63"
              y="52"
              textAnchor="middle"
              fill="#10162f"
              fontSize={gate.label === 'FINISH' ? '26' : '30'}
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              fontStyle="italic"
              letterSpacing="1"
              transform="skewX(-8)"
            >
              {gate.label}
            </text>
          </g>
        </g>
      </g>

      {/* 2. Curved Grandstand (Built from 12 slices of 56px laid side-by-side along the moon surface) */}
      {Array.from({ length: 12 }).map((_, sliceIdx) => {
        // Starts 180px to the right of the gate flag center, each slice offset by sliceIdx * 56px along the arc
        const slicePhi = gate.phi0 + (180 + sliceIdx * 56) / MOON_R;
        const slicePhiDeg = (slicePhi * 180) / Math.PI;

        return (
          <g
            key={sliceIdx}
            transform={`rotate(${slicePhiDeg}) translate(0, ${-MOON_R})`}
          >
            {/* Grandstand Seating Tier Slice (56px wide, 135px tall upward from surface) */}
            <path
              d="M 0 0 L 0 -135 L 56 -135 L 56 0 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* Seating Plank Lines */}
            <line x1="0" y1="-45" x2="56" y2="-45" stroke="#475569" strokeWidth="2" />
            <line x1="0" y1="-85" x2="56" y2="-85" stroke="#475569" strokeWidth="2" />
            <line x1="0" y1="-125" x2="56" y2="-125" stroke="#ffffff" strokeWidth="3" opacity="0.8" />

            {/* 3 Rows of Spectators */}
            {/* Row 1 (Top) */}
            <g transform="translate(28, -125)">
              <circle
                cx="0"
                cy="-12"
                r="7.5"
                fill={CROWD_COLORS[(sliceIdx * 3 + gate.lapIndex) % CROWD_COLORS.length]}
              />
              <ellipse
                cx="0"
                cy="0"
                rx="9.5"
                ry="7.5"
                fill={CROWD_COLORS[(sliceIdx * 3 + gate.lapIndex + 1) % CROWD_COLORS.length]}
              />
            </g>

            {/* Row 2 (Middle) */}
            <g transform="translate(28, -85)">
              <circle
                cx="0"
                cy="-12"
                r="7.5"
                fill={CROWD_COLORS[(sliceIdx * 5 + gate.lapIndex + 2) % CROWD_COLORS.length]}
              />
              <ellipse
                cx="0"
                cy="0"
                rx="9.5"
                ry="7.5"
                fill={CROWD_COLORS[(sliceIdx * 5 + gate.lapIndex + 3) % CROWD_COLORS.length]}
              />
            </g>

            {/* Row 3 (Bottom) */}
            <g transform="translate(28, -45)">
              <circle
                cx="0"
                cy="-12"
                r="8"
                fill={CROWD_COLORS[(sliceIdx * 7 + gate.lapIndex + 4) % CROWD_COLORS.length]}
              />
              <ellipse
                cx="0"
                cy="0"
                rx="10"
                ry="8"
                fill={CROWD_COLORS[(sliceIdx * 7 + gate.lapIndex + 5) % CROWD_COLORS.length]}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
