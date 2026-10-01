"use client";

import React from "react";
import { ANCHOR_X, ANCHOR_Y } from "../constants";
import {
  COURSE_LENGTH,
  pointAt,
  headingAt,
  smoothHeadingAt,
  getCourseSamples,
} from "../engine/course";
import { SCENERY } from "../engine/scenery";
import { UI_THEME } from "../ui/theme";

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

  // Cull range along course: sRef - 800 to sRef + 1600
  const minCullS = sRef - 800;
  const maxCullS = sRef + 1600;

  const courseSamples = getCourseSamples();

  // Helper to build closed polygon between ±lat
  const buildChannelPolygon = (lateral: number) => {
    const leftPts: string[] = [];
    const rightPts: string[] = [];
    for (let i = 0; i < courseSamples.length; i += 3) {
      const smp = courseSamples[i];
      const lx = smp.x + -lateral * -Math.sin(smp.headingRad);
      const ly = smp.y + -lateral * Math.cos(smp.headingRad);
      const rx = smp.x + lateral * -Math.sin(smp.headingRad);
      const ry = smp.y + lateral * Math.cos(smp.headingRad);
      leftPts.push(`${lx.toFixed(1)},${ly.toFixed(1)}`);
      rightPts.unshift(`${rx.toFixed(1)},${ry.toFixed(1)}`);
    }
    return `M ${leftPts.join(" L ")} L ${rightPts.join(" L ")} Z`;
  };

  const LATERAL_OFFSET = 172;
  const channelOuterPath = buildChannelPolygon(LATERAL_OFFSET);
  const channelDeepPath = buildChannelPolygon(115);
  const channelCorePath = buildChannelPolygon(60);

  // Helper to generate a continuous streamline along a specific lateral offset
  const getStreamlinePath = (lat: number) => {
    const pts = courseSamples
      .filter((_, i) => i % 3 === 0)
      .map((smp) => {
        const ex = smp.x + lat * -Math.sin(smp.headingRad);
        const ey = smp.y + lat * Math.cos(smp.headingRad);
        return `${ex.toFixed(1)},${ey.toFixed(1)}`;
      });
    return `M ${pts.join(" L ")}`;
  };

  // Start Line pose at s = 0
  const pStart = pointAt(0);
  const hStart = headingAt(0);
  const startDeg = (hStart * 180) / Math.PI;

  // Finish Line pose at s = COURSE_LENGTH
  const pFinish = pointAt(COURSE_LENGTH);
  const hFinish = headingAt(COURSE_LENGTH);
  const finishDeg = (hFinish * 180) / Math.PI;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#25a9e8]">
      <style>{`
        @keyframes waterFlowAnim {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -120; }
        }
        @keyframes waterSwellAnim {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.75; }
          50% { transform: scale(1.06) translateY(-1.5px); opacity: 0.95; }
        }
        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }
        .water-wave-flow {
          animation: waterFlowAnim 3.8s linear infinite;
        }
        .water-swell-wave {
          animation: waterSwellAnim 2.8s ease-in-out infinite;
        }
        .water-sparkle-1 { animation: sparkleTwinkle 2.8s ease-in-out infinite; }
        .water-sparkle-2 { animation: sparkleTwinkle 3.4s ease-in-out 0.9s infinite; }
        .water-sparkle-3 { animation: sparkleTwinkle 2.2s ease-in-out 1.7s infinite; }
      `}</style>

      {/* 1. Deep & Mid Tropical Water Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1888cc] via-[#25a9e8] to-[#4fc0ee]" />

      {/* 2. Rotating World SVG Group (World Space) */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          {/* Water Soft Ripple Pattern */}
          <pattern
            id="lightRipples"
            width="160"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 25 C 30 18, 60 18, 85 28 C 110 38, 140 38, 155 30 M 20 85 C 45 75, 75 75, 100 85 C 125 95, 145 95, 160 88"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeOpacity="0.22"
              strokeLinecap="round"
            />
            <path
              d="M 50 55 C 70 48, 95 48, 115 56"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeOpacity="0.18"
              strokeLinecap="round"
            />
          </pattern>

          {/* Tropical Island Sand Gradient */}
          <radialGradient id="islandSandGrad" cx="40%" cy="40%" r="55%">
            <stop offset="60%" stopColor={UI_THEME.island.sand} />
            <stop offset="88%" stopColor="#f5d696" />
            <stop offset="100%" stopColor={UI_THEME.island.sandBorder} />
          </radialGradient>

          {/* 3D Red-Orange Buoy Gradient */}
          <radialGradient id="buoySphereGrad" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ff8c66" />
            <stop offset="45%" stopColor={UI_THEME.buoy.body} />
            <stop offset="100%" stopColor="#b32d0c" />
          </radialGradient>
        </defs>

        {/* Global Light Water Ripples Layer */}
        <rect width="100%" height="100%" fill="url(#lightRipples)" />

        <g
          transform={`translate(${anchorX}, ${anchorY}) rotate(${-thetaCamDeg}) translate(${-pRef.x}, ${-pRef.y})`}
        >
          {/* A. Multi-Layer Channel Depth Bands (Underneath floating boats) */}
          {/* Outer Channel Bed */}
          <path
            d={channelOuterPath}
            fill="#1f98d7"
            stroke="#1679b0"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* Medium Deep Channel Trench */}
          <path d={channelDeepPath} fill="#1984be" opacity="0.5" />

          {/* Deep Center Channel Core */}
          <path d={channelCorePath} fill="#1374a8" opacity="0.4" />

          {/* B. Flowing Water Wave Streamlines with 3D Depth Shadows */}
          {[-120, -64, 0, 64, 120].map((lat, sIdx) => {
            const streamPath = getStreamlinePath(lat);
            const shadowStreamPath = getStreamlinePath(lat + 2.5);
            return (
              <g key={`stream_${sIdx}`}>
                {/* 1. Dark Water Trough Shadow */}
                <path
                  d={shadowStreamPath}
                  fill="none"
                  stroke="#083856"
                  strokeWidth={sIdx === 2 ? "3.8" : "3.0"}
                  strokeDasharray="36 48"
                  opacity={sIdx === 2 ? "0.45" : "0.35"}
                  className="water-wave-flow"
                />
                {/* 2. Bright Wave Crest Highlight */}
                <path
                  d={streamPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={sIdx === 2 ? "2.4" : "1.8"}
                  strokeDasharray="36 48"
                  opacity={sIdx === 2 ? "0.4" : "0.3"}
                  className="water-wave-flow"
                />
              </g>
            );
          })}

          {/* B2. Transverse Swell Wave Chop & Ripples with Realistic Depth Shadows */}
          {Array.from({ length: 28 }).map((_, wIdx) => {
            const waveS = Math.floor((minCullS + wIdx * 85) / 85) * 85;
            if (waveS < 0 || waveS > COURSE_LENGTH + 200) return null;
            const pt = pointAt(waveS);
            const head = headingAt(waveS);
            const waveLat = ((waveS * 47) % 130) - 65; // -65 to +65 in center channel
            const wx = pt.x + waveLat * -Math.sin(head);
            const wy = pt.y + waveLat * Math.cos(head);
            const headDeg = (head * 180) / Math.PI;

            return (
              <g
                key={`swell_${waveS}_${wIdx}`}
                transform={`translate(${wx}, ${wy}) rotate(${headDeg})`}
                className="water-swell-wave"
              >
                {/* Under Wave Dark Blue Depth Shadow */}
                <path
                  d="M -16 1.8 Q 0 -4.2 16 1.8"
                  fill="none"
                  stroke="#062d47"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                {/* Bright Wave Crest on top */}
                <path
                  d="M -16 0 Q 0 -6 16 0"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                {/* Subtle secondary water ripple ring */}
                <path
                  d="M -10 3.5 Q 0 0 10 3.5"
                  fill="none"
                  stroke="#e0f7fa"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </g>
            );
          })}

          {/* C. Water Sparkles across the track */}
          <g className="water-sparkle-1">
            <path d="M 200 80 L 204 84 L 200 88 L 196 84 Z" fill="#d9f6ff" />
            <path
              d="M 600 200 L 604 204 L 600 208 L 596 204 Z"
              fill="#d9f6ff"
            />
            <path
              d="M 1200 700 L 1205 705 L 1200 710 L 1195 705 Z"
              fill="#d9f6ff"
            />
            <path
              d="M 1800 1300 L 1804 1304 L 1800 1308 L 1796 1304 Z"
              fill="#d9f6ff"
            />
          </g>
          <g className="water-sparkle-2">
            <path
              d="M 400 120 L 405 125 L 400 130 L 395 125 Z"
              fill="#ffffff"
            />
            <path
              d="M 900 450 L 904 454 L 900 458 L 896 454 Z"
              fill="#ffffff"
            />
            <path
              d="M 1500 1000 L 1505 1005 L 1500 1010 L 1495 1005 Z"
              fill="#ffffff"
            />
            <path
              d="M 2300 1400 L 2304 1404 L 2300 1408 L 2296 1404 Z"
              fill="#ffffff"
            />
          </g>
          <g className="water-sparkle-3">
            <path
              d="M 750 300 L 754 304 L 750 308 L 746 304 Z"
              fill="#d9f6ff"
            />
            <path
              d="M 1350 850 L 1354 854 L 1350 858 L 1346 854 Z"
              fill="#d9f6ff"
            />
            <path
              d="M 2050 1350 L 2055 1355 L 2050 1360 L 2045 1355 Z"
              fill="#d9f6ff"
            />
          </g>

          {/* D. Curved White Dashed Safety Buoy Guide Lines (Top & Bottom) */}
          {[-LATERAL_OFFSET, LATERAL_OFFSET].map((lat, lIdx) => (
            <path
              key={`buoy_rope_${lIdx}`}
              d={getStreamlinePath(lat)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeDasharray="12 8"
              opacity="0.95"
            />
          ))}

          {/* E. Start Area Tropical Islands (Top-Left & Bottom-Left) */}
          {/* Top-Left Island near start line */}
          <g transform="translate(-180, -220)">
            <path
              d="M 0 0 C 120 -30, 220 40, 260 140 C 220 180, 100 160, 0 100 Z"
              fill="#4fc0ee"
              opacity="0.4"
            />
            <path
              d="M 0 0 C 100 -20, 180 30, 220 120 C 180 150, 80 140, 0 80 Z"
              fill="url(#islandSandGrad)"
              stroke={UI_THEME.island.sandBorder}
              strokeWidth="4"
            />
            <path
              d="M 10 10 C 90 -10, 170 40, 210 115"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              opacity="0.85"
            />
            <path
              d="M 0 0 C 60 -10, 130 20, 160 90 C 120 110, 60 100, 0 60 Z"
              fill={UI_THEME.island.palmGreen1}
            />
            <circle cx="60" cy="40" r="38" fill={UI_THEME.island.palmGreen2} />
            <circle cx="110" cy="65" r="32" fill={UI_THEME.island.palmDark} />
            {/* Palm Tree with fronds */}
            <g transform="translate(85, 45)">
              <path
                d="M 0 0 Q 15 -25 25 -45"
                fill="none"
                stroke={UI_THEME.island.trunk}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="25" cy="-45" r="5" fill="#5c2607" />
              <path
                d="M 25 -45 Q 45 -55 60 -45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 25 -45 Q 40 -65 45 -75"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 25 -45 Q 20 -70 10 -80"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 25 -45 Q 5 -60 -10 -65"
                fill="none"
                stroke="#15803d"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 25 -45 Q 10 -40 -5 -35"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Bottom-Left Island near start line */}
          <g transform="translate(-160, 240)">
            <path
              d="M 0 80 C 100 20, 190 60, 230 160 C 150 180, 60 160, 0 140 Z"
              fill="#4fc0ee"
              opacity="0.4"
            />
            <path
              d="M 0 70 C 80 30, 160 60, 190 140 C 130 160, 50 140, 0 120 Z"
              fill="url(#islandSandGrad)"
              stroke={UI_THEME.island.sandBorder}
              strokeWidth="4"
            />
            <path
              d="M 10 75 C 80 40, 150 70, 180 135"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              opacity="0.85"
            />
            <circle cx="70" cy="90" r="35" fill={UI_THEME.island.palmGreen1} />
            <circle
              cx="115"
              cy="110"
              r="28"
              fill={UI_THEME.island.palmGreen2}
            />
            <circle cx="45" cy="100" r="26" fill={UI_THEME.island.palmDark} />
            <circle cx="95" cy="80" r="16" fill="#4ade80" />
            <circle cx="130" cy="105" r="14" fill="#22c55e" />
          </g>

          {/* F. Large Inside Turn Tropical Islands */}
          {SCENERY.islands.map((isl) => {
            if (isl.s < minCullS - 1000 || isl.s > maxCullS + 1000) return null;
            return (
              <g
                key={isl.id}
                transform={`translate(${isl.worldX}, ${isl.worldY})`}
              >
                <circle r={isl.radius + 60} fill="#4fc0ee" opacity="0.35" />
                <circle
                  r={isl.radius}
                  fill="url(#islandSandGrad)"
                  stroke={UI_THEME.island.sandBorder}
                  strokeWidth="6"
                />
                <circle
                  r={isl.radius - 6}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  opacity="0.9"
                />
                <circle r={isl.radius - 35} fill={UI_THEME.island.palmDark} />
                <circle
                  r={isl.radius - 110}
                  fill={UI_THEME.island.palmGreen2}
                />
                <circle
                  r={isl.radius - 230}
                  fill={UI_THEME.island.palmGreen1}
                />

                {/* Palm Trees Clusters */}
                <circle
                  cx="-120"
                  cy="-70"
                  r="55"
                  fill="#14532d"
                  opacity="0.85"
                />
                <circle cx="90" cy="100" r="65" fill="#14532d" opacity="0.85" />
                <circle
                  cx="-50"
                  cy="130"
                  r="50"
                  fill="#14532d"
                  opacity="0.85"
                />
                <circle cx="110" cy="-60" r="45" fill="#166534" opacity="0.9" />
              </g>
            );
          })}

          {/* G. Small Shoreline Islets */}
          {SCENERY.shorelineIslets.map((islet) => {
            if (islet.s < minCullS || islet.s > maxCullS) return null;
            return (
              <g
                key={islet.id}
                transform={`translate(${islet.worldX}, ${islet.worldY})`}
              >
                <circle r={islet.radius + 20} fill="#4fc0ee" opacity="0.35" />
                <circle
                  r={islet.radius}
                  fill="url(#islandSandGrad)"
                  stroke={UI_THEME.island.sandBorder}
                  strokeWidth="3"
                />
                <circle
                  r={islet.radius - 8}
                  fill={UI_THEME.island.palmGreen1}
                />
                <circle r={islet.radius - 18} fill={UI_THEME.island.palmDark} />
                <circle cx="-5" cy="-5" r={islet.radius * 0.4} fill="#166534" />
              </g>
            );
          })}

          {/* H. Glossy 3D Red-Orange Spherical Buoys with White Band */}
          {SCENERY.buoys.map((buoy) => {
            if (buoy.s < minCullS || buoy.s > maxCullS) return null;
            return (
              <g
                key={buoy.id}
                transform={`translate(${buoy.worldX}, ${buoy.worldY})`}
              >
                {/* Water drop shadow */}
                <ellipse
                  rx="13"
                  ry="6.5"
                  fill={UI_THEME.buoy.shadow}
                  cy="3.5"
                />

                {/* Main 3D Orange Spherical Body (about 14px diameter) */}
                <circle
                  r="7.5"
                  fill="url(#buoySphereGrad)"
                  stroke="#7c1f06"
                  strokeWidth="1.2"
                />

                {/* White Center Ring Band */}
                <rect
                  x="-7.2"
                  y="-2"
                  width="14.4"
                  height="4"
                  rx="1.5"
                  fill={UI_THEME.buoy.band}
                  stroke="#cbd5e1"
                  strokeWidth="0.8"
                />

                {/* Top Highlight Dot */}
                <circle
                  cx="-2.5"
                  cy="-3.5"
                  r="1.5"
                  fill={UI_THEME.buoy.highlight}
                />
              </g>
            );
          })}

          {/* I. Start Line at s = 0 */}
          {0 >= minCullS - 200 && 0 <= maxCullS + 200 && (
            <g
              transform={`translate(${pStart.x}, ${pStart.y}) rotate(${startDeg})`}
            >
              <line
                x1="0"
                y1={-LATERAL_OFFSET}
                x2="0"
                y2={LATERAL_OFFSET}
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1={-LATERAL_OFFSET}
                x2="0"
                y2={LATERAL_OFFSET}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="10 8"
              />
              <circle
                cx="0"
                cy={-LATERAL_OFFSET}
                r="10"
                fill="url(#buoySphereGrad)"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle
                cx="0"
                cy={LATERAL_OFFSET}
                r="10"
                fill="url(#buoySphereGrad)"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* J. Finish Line, Beach Island & Checkered Flag Buoy at s = COURSE_LENGTH */}
          {COURSE_LENGTH >= minCullS - 400 && (
            <g
              transform={`translate(${pFinish.x}, ${pFinish.y}) rotate(${finishDeg})`}
            >
              {/* 1. Beach Shoreline Island behind finish line */}
              <path
                d={`M 100 ${-LATERAL_OFFSET - 200} Q 50 0 100 ${LATERAL_OFFSET + 200} L 700 ${LATERAL_OFFSET + 200} L 700 ${-LATERAL_OFFSET - 200} Z`}
                fill="url(#islandSandGrad)"
                stroke={UI_THEME.island.sandBorder}
                strokeWidth="6"
              />
              <path
                d={`M 95 ${-LATERAL_OFFSET - 200} Q 45 0 95 ${LATERAL_OFFSET + 200}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                opacity="0.9"
              />
              <path
                d={`M 160 ${-LATERAL_OFFSET - 160} Q 110 0 160 ${LATERAL_OFFSET + 160} L 700 ${LATERAL_OFFSET + 160} L 700 ${-LATERAL_OFFSET - 160} Z`}
                fill={UI_THEME.island.palmGreen1}
              />
              <circle
                cx="260"
                cy="-120"
                r="50"
                fill={UI_THEME.island.palmDark}
              />
              <circle
                cx="300"
                cy="140"
                r="55"
                fill={UI_THEME.island.palmDark}
              />

              {/* 2. Checkered Finish Line on Water */}
              <line
                x1="0"
                y1={-LATERAL_OFFSET}
                x2="0"
                y2={LATERAL_OFFSET}
                stroke="#ffffff"
                strokeWidth="12"
              />
              <line
                x1="0"
                y1={-LATERAL_OFFSET}
                x2="0"
                y2={LATERAL_OFFSET}
                stroke="#0f172a"
                strokeWidth="12"
                strokeDasharray="14 14"
              />

              {/* 3. Checkered Flag planted in an orange buoy */}
              <g transform={`translate(25, ${-LATERAL_OFFSET + 45})`}>
                <ellipse
                  rx="24"
                  ry="11"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  opacity="0.85"
                />
                <ellipse
                  rx="36"
                  ry="16"
                  fill="none"
                  stroke="#d9f6ff"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <ellipse
                  rx="15"
                  ry="8"
                  fill="url(#buoySphereGrad)"
                  stroke="#7c1f06"
                  strokeWidth="2"
                />
                <ellipse rx="11" ry="4.5" fill="#ffffff" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-52"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="-52" r="3" fill="#facc15" />
                <g transform="translate(0, -52)">
                  <rect
                    x="0"
                    y="0"
                    width="36"
                    height="24"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <rect x="0" y="0" width="9" height="12" fill="#0f172a" />
                  <rect x="18" y="0" width="9" height="12" fill="#0f172a" />
                  <rect x="9" y="12" width="9" height="12" fill="#0f172a" />
                  <rect x="27" y="12" width="9" height="12" fill="#0f172a" />
                </g>
              </g>
            </g>
          )}
        </g>
      </svg>

      {/* 3. Screen-Space Shallows Aqua Band Behind HUD (from y ≈ 392 to bottom) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[190px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #a6ecf8 0%, #7ad6f2 60%, rgba(122, 214, 242, 0) 100%)",
          opacity: 0.85,
        }}
      >
        {/* Soft Wave Crest Line */}
        <svg
          viewBox="0 0 1010 40"
          className="w-full h-10 overflow-visible opacity-50"
        >
          <path
            d="M 0 25 Q 120 10, 250 22 T 500 18 T 750 24 T 1010 15"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
