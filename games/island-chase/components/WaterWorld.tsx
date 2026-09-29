'use client';

import React from 'react';
import { ANCHOR_X, ANCHOR_Y, CHANNEL_HALF_WIDTH } from '../constants';
import { COURSE_LENGTH, pointAt, headingAt, smoothHeadingAt, getCourseSamples } from '../engine/course';
import { SCENERY } from '../engine/scenery';

interface WaterWorldProps {
  sRef: number;
  launchPx: number;
}

export function WaterWorld({ sRef, launchPx }: WaterWorldProps) {
  const thetaCam = smoothHeadingAt(sRef);
  const pRef = pointAt(sRef);
  const thetaCamDeg = (thetaCam * 180) / Math.PI;

  const anchorX = ANCHOR_X + launchPx;
  const anchorY = ANCHOR_Y;

  // Cull range along course: sRef - 600 to sRef + 1400
  const minCullS = sRef - 600;
  const maxCullS = sRef + 1400;

  const courseSamples = getCourseSamples();

  // Generate SVG path for the water channel band (lateral ±175)
  const leftEdgePts: string[] = [];
  const rightEdgePts: string[] = [];

  for (let i = 0; i < courseSamples.length; i += 4) {
    const smp = courseSamples[i];
    const lx = smp.x + (-CHANNEL_HALF_WIDTH) * (-Math.sin(smp.headingRad));
    const ly = smp.y + (-CHANNEL_HALF_WIDTH) * Math.cos(smp.headingRad);
    const rx = smp.x + CHANNEL_HALF_WIDTH * (-Math.sin(smp.headingRad));
    const ry = smp.y + CHANNEL_HALF_WIDTH * Math.cos(smp.headingRad);

    leftEdgePts.push(`${lx.toFixed(1)},${ly.toFixed(1)}`);
    rightEdgePts.unshift(`${rx.toFixed(1)},${ry.toFixed(1)}`);
  }

  const channelPolygonPath = `M ${leftEdgePts.join(' L ')} L ${rightEdgePts.join(' L ')} Z`;

  // Start Line pose at s = 0
  const pStart = pointAt(0);
  const hStart = headingAt(0);
  const startDeg = (hStart * 180) / Math.PI;

  // Finish Line pose at s = COURSE_LENGTH
  const pFinish = pointAt(COURSE_LENGTH);
  const hFinish = headingAt(COURSE_LENGTH);
  const finishDeg = (hFinish * 180) / Math.PI;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#2496b8]">
      {/* 1. Original Bright Ocean Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b7f9e] via-[#2496b8] to-[#1e88a8]" />

      {/* 2. Rotating World SVG Group (World Space) */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <g
          transform={`translate(${anchorX}, ${anchorY}) rotate(${-thetaCamDeg}) translate(${-pRef.x}, ${-pRef.y})`}
        >
          {/* A. Original Water Channel Band (±175px from centerline) */}
          <path
            d={channelPolygonPath}
            fill="#1e88a8"
            stroke="#1b7f9e"
            strokeWidth="4"
            opacity="0.95"
          />

          {/* B. Channel Boundary Foam Lines */}
          {[-CHANNEL_HALF_WIDTH, CHANNEL_HALF_WIDTH].map((lat, lIdx) => {
            const edgePathPts = courseSamples
              .filter((_, i) => i % 6 === 0)
              .map((smp) => {
                const ex = smp.x + lat * (-Math.sin(smp.headingRad));
                const ey = smp.y + lat * Math.cos(smp.headingRad);
                return `${ex.toFixed(1)},${ey.toFixed(1)}`;
              });
            return (
              <path
                key={lIdx}
                d={`M ${edgePathPts.join(' L ')}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="16 12"
                opacity="0.6"
              />
            );
          })}

          {/* C. Inside Turn Islands */}
          {SCENERY.islands.map((isl) => {
            if (isl.s < minCullS - 1000 || isl.s > maxCullS + 1000) return null;
            return (
              <g key={isl.id} transform={`translate(${isl.worldX}, ${isl.worldY})`}>
                {/* Shallow reef water ring */}
                <circle r={isl.radius + 60} fill="#67e8f9" opacity="0.4" />
                {/* Sandy Beach Ring */}
                <circle r={isl.radius} fill="#fef08a" stroke="#facc15" strokeWidth="6" />
                {/* White Foam Edge */}
                <circle r={isl.radius - 8} fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.85" />
                {/* Lush Green Tropical Forest */}
                <circle r={isl.radius - 40} fill="#15803d" />
                <circle r={isl.radius - 120} fill="#16a34a" />
                <circle r={isl.radius - 240} fill="#22c55e" />
                {/* Palm Trees */}
                <circle cx="-100" cy="-60" r="50" fill="#14532d" opacity="0.8" />
                <circle cx="80" cy="90" r="60" fill="#14532d" opacity="0.8" />
                <circle cx="-40" cy="120" r="45" fill="#14532d" opacity="0.8" />
              </g>
            );
          })}

          {/* D. Small Shoreline Islets along straights */}
          {SCENERY.shorelineIslets.map((islet) => {
            if (islet.s < minCullS || islet.s > maxCullS) return null;
            return (
              <g key={islet.id} transform={`translate(${islet.worldX}, ${islet.worldY})`}>
                <circle r={islet.radius + 15} fill="#67e8f9" opacity="0.4" />
                <circle r={islet.radius} fill="#fef08a" stroke="#facc15" strokeWidth="3" />
                <circle r={islet.radius - 10} fill="#22c55e" />
                <circle r={islet.radius - 20} fill="#15803d" />
              </g>
            );
          })}

          {/* E. Floating Channel Buoys */}
          {SCENERY.buoys.map((buoy) => {
            if (buoy.s < minCullS || buoy.s > maxCullS) return null;
            return (
              <g key={buoy.id} transform={`translate(${buoy.worldX}, ${buoy.worldY})`}>
                {/* Water ripple */}
                <ellipse rx="10" ry="5" fill="#000000" opacity="0.25" />
                {/* Buoy ball */}
                <circle r="7" fill="#f97316" stroke="#431407" strokeWidth="1.5" />
                <circle cx="-2" cy="-2" r="2.5" fill="#fed7aa" />
              </g>
            );
          })}

          {/* F. Start Line Object at s = 0 */}
          {0 >= minCullS - 200 && 0 <= maxCullS + 200 && (
            <g transform={`translate(${pStart.x}, ${pStart.y}) rotate(${startDeg})`}>
              <line
                x1="0"
                y1={-CHANNEL_HALF_WIDTH}
                x2="0"
                y2={CHANNEL_HALF_WIDTH}
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1={-CHANNEL_HALF_WIDTH}
                x2="0"
                y2={CHANNEL_HALF_WIDTH}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="12 8"
              />
              {/* Left & Right Start Line Posts */}
              <rect x="-6" y={-CHANNEL_HALF_WIDTH - 16} width="12" height="24" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="2" />
              <rect x="-6" y={CHANNEL_HALF_WIDTH - 8} width="12" height="24" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="2" />
            </g>
          )}

          {/* G. Finish Gate & Beach Island at s = COURSE_LENGTH */}
          {COURSE_LENGTH >= minCullS - 400 && (
            <g transform={`translate(${pFinish.x}, ${pFinish.y}) rotate(${finishDeg})`}>
              {/* 1. Beach Island Shoreline behind finish line */}
              <path
                d={`M 80 ${-CHANNEL_HALF_WIDTH - 180} Q 40 0 80 ${CHANNEL_HALF_WIDTH + 180} L 600 ${CHANNEL_HALF_WIDTH + 180} L 600 ${-CHANNEL_HALF_WIDTH - 180} Z`}
                fill="#fde047"
                stroke="#facc15"
                strokeWidth="6"
              />
              {/* Foam edge */}
              <path
                d={`M 75 ${-CHANNEL_HALF_WIDTH - 180} Q 35 0 75 ${CHANNEL_HALF_WIDTH + 180}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                opacity="0.9"
              />
              {/* Island green interior */}
              <path
                d={`M 140 ${-CHANNEL_HALF_WIDTH - 140} Q 100 0 140 ${CHANNEL_HALF_WIDTH + 140} L 600 ${CHANNEL_HALF_WIDTH + 140} L 600 ${-CHANNEL_HALF_WIDTH - 140} Z`}
                fill="#22c55e"
              />
              {/* Beach Umbrellas & Palms */}
              <circle cx="240" cy="-120" r="45" fill="#15803d" />
              <circle cx="280" cy="130" r="50" fill="#15803d" />
              <g transform="translate(180, 80)">
                <path d="M 0 16 Q 16 -6 32 16 Z" fill="#ef4444" />
                <path d="M 6 16 Q 16 -6 26 16 Z" fill="#ffffff" />
              </g>
              <g transform="translate(190, -80)">
                <path d="M 0 16 Q 16 -6 32 16 Z" fill="#3b82f6" />
                <path d="M 6 16 Q 16 -6 26 16 Z" fill="#ffffff" />
              </g>

              {/* 2. Checkered Finish Line Bar */}
              <line
                x1="0"
                y1={-CHANNEL_HALF_WIDTH}
                x2="0"
                y2={CHANNEL_HALF_WIDTH}
                stroke="#ffffff"
                strokeWidth="12"
              />
              <line
                x1="0"
                y1={-CHANNEL_HALF_WIDTH}
                x2="0"
                y2={CHANNEL_HALF_WIDTH}
                stroke="#000000"
                strokeWidth="12"
                strokeDasharray="14 14"
              />

              {/* Finish Gate Posts with Flags */}
              <g transform={`translate(0, ${-CHANNEL_HALF_WIDTH - 10})`}>
                <rect x="-8" y="-12" width="16" height="30" rx="4" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
                <text x="0" y="8" textAnchor="middle" fontSize="16">🏁</text>
              </g>
              <g transform={`translate(0, ${CHANNEL_HALF_WIDTH + 10})`}>
                <rect x="-8" y="-12" width="16" height="30" rx="4" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
                <text x="0" y="8" textAnchor="middle" fontSize="16">🏁</text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
