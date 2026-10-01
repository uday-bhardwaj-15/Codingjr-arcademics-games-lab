'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  HORIZON_Y,
  BOTTOM_Y,
  VANISH_X,
  Z_NEAR,
  Z_FAR,
  WORLD_SPEED,
  project,
  roadHalf,
  roadSideX,
} from '../engine/worldMath';
import {
  initSceneryPool,
  respawnSceneryItem,
  getBiomeForDistance,
  BIOMES,
  SceneryItem,
  mulberry32,
} from '../engine/scenery';
import { SceneryObjectSvg } from './SceneryObjectSvg';
import { SkyFinishLine } from './SkyFinishLine';

interface RoadWorldProps {
  isRacing?: boolean;
  isFinished?: boolean;
  isSurging?: boolean;
  speedMultiplier?: number;
  humanProgress?: number;
  children?: React.ReactNode;
}

export const RoadWorld: React.FC<RoadWorldProps> = ({
  isRacing = false,
  isFinished = false,
  isSurging = false,
  speedMultiplier = 1,
  humanProgress = 0,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainBackRef = useRef<SVGGElement>(null);
  const mountainFrontRef = useRef<SVGGElement>(null);
  const lakeGlintRef = useRef<SVGGElement>(null);
  const leftGrassRef = useRef<SVGRectElement>(null);
  const rightGrassRef = useRef<SVGRectElement>(null);

  // 60-node Scenery pool
  const [sceneryPool] = useState<SceneryItem[]>(() => initSceneryPool(1337));
  const sceneryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftKerbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightKerbRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Simulation physics refs (Zero React re-renders per frame)
  const distRef = useRef<number>(0);
  const speedFactorRef = useRef<number>(0);
  const prngRef = useRef<() => number>(mulberry32(1337));
  const lastTimeRef = useRef<number>(0);
  const rAFRef = useRef<number | null>(null);

  // Check reduced motion preference
  const isReducedMotion = useRef<boolean>(false);
  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Center Dashes & Kerbs count
  const DASH_COUNT = 14;
  const KERB_COUNT = 20;

  // Track depth Z for road dashes & kerbs
  const dashZ = useRef<number[]>(
    Array.from({ length: DASH_COUNT }, (_, i) => Z_NEAR + (i * (Z_FAR - Z_NEAR)) / DASH_COUNT)
  );
  const kerbZ = useRef<number[]>(
    Array.from({ length: KERB_COUNT }, (_, i) => Z_NEAR + (i * (Z_FAR - Z_NEAR)) / KERB_COUNT)
  );

  useEffect(() => {
    let active = true;

    const loop = (now: number) => {
      if (!active) return;

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const rawDt = (now - lastTimeRef.current) / 1000;
      const dt = Math.min(0.05, Math.max(0.001, rawDt));
      lastTimeRef.current = now;

      // ── 1. Target Speed Easing ──
      let targetSpeed = 0;
      if (isRacing && !isFinished) {
        targetSpeed = isSurging ? 1.25 : 1.0;
      } else if (isFinished) {
        targetSpeed = 0;
      }

      if (isReducedMotion.current) {
        targetSpeed = 0;
      }

      // Smooth acceleration / deceleration
      const easeRate = isFinished ? 1.5 : 2.2;
      speedFactorRef.current += (targetSpeed - speedFactorRef.current) * Math.min(1, dt * easeRate);

      const currentSpeed = speedFactorRef.current * speedMultiplier;
      const stepDist = WORLD_SPEED * currentSpeed * dt;
      distRef.current += stepDist;

      // ── 2. Biome Color Cross-Fading ──
      const { current, next, blend } = getBiomeForDistance(distRef.current);
      const curColors = BIOMES[current];
      const nextColors = BIOMES[next];

      if (leftGrassRef.current && rightGrassRef.current) {
        leftGrassRef.current.style.fill = blend > 0.5 ? nextColors.groundBottom : curColors.groundBottom;
        rightGrassRef.current.style.fill = blend > 0.5 ? nextColors.groundBottom : curColors.groundBottom;
      }

      // ── 3. Parallax Mountain Shift ──
      if (mountainBackRef.current) {
        const backShift = (distRef.current * 0.8) % 1010;
        mountainBackRef.current.style.transform = `translate3d(${-backShift}px, 0, 0)`;
      }
      if (mountainFrontRef.current) {
        const frontShift = (distRef.current * 1.6) % 1010;
        mountainFrontRef.current.style.transform = `translate3d(${-frontShift}px, 0, 0)`;
      }

      // ── 4. Center Dashes Projection ──
      for (let i = 0; i < DASH_COUNT; i++) {
        dashZ.current[i] -= stepDist;
        if (dashZ.current[i] < 0.6) {
          dashZ.current[i] += Z_FAR - Z_NEAR;
        }

        const el = dashRefs.current[i];
        if (el) {
          const z = dashZ.current[i];
          const { p, y } = project(z);
          const scale = p * 1.5;
          const opacity = Math.min(1, Math.max(0, (Z_FAR - z) / 6));
          el.style.transform = `translate3d(-50%, 0, 0) scale(${scale})`;
          el.style.top = `${y}px`;
          el.style.opacity = String(opacity * 0.95);
        }
      }

      // ── 5. Edge Kerbs Projection ──
      for (let i = 0; i < KERB_COUNT; i++) {
        kerbZ.current[i] -= stepDist;
        if (kerbZ.current[i] < 0.6) {
          kerbZ.current[i] += Z_FAR - Z_NEAR;
        }

        const z = kerbZ.current[i];
        const { p, y } = project(z);
        const halfW = roadHalf(p);
        const scale = p * 1.35;
        const opacity = Math.min(1, Math.max(0, (Z_FAR - z) / 5));

        const leftEl = leftKerbRefs.current[i];
        if (leftEl) {
          leftEl.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
          leftEl.style.left = `${VANISH_X - halfW}px`;
          leftEl.style.top = `${y}px`;
          leftEl.style.opacity = String(opacity);
        }

        const rightEl = rightKerbRefs.current[i];
        if (rightEl) {
          rightEl.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
          rightEl.style.left = `${VANISH_X + halfW}px`;
          rightEl.style.top = `${y}px`;
          rightEl.style.opacity = String(opacity);
        }
      }

      // ── 6. 3D Scenery Pool Projection & Recycling ──
      for (let i = 0; i < sceneryPool.length; i++) {
        const item = sceneryPool[i];
        item.z -= stepDist;

        if (item.z < 0.55) {
          respawnSceneryItem(item, distRef.current, prngRef.current);
        }

        const el = sceneryRefs.current[i];
        if (el) {
          const { p, y } = project(item.z);
          const x = roadSideX(item.side, item.offset, p);
          const scale = p * item.baseScale;
          const opacity = Math.min(1, Math.max(0, (Z_FAR - item.z) / 5));
          const zIndex = Math.floor((1 - p) * 100);

          el.style.transform = `translate3d(-50%, -100%, 0) scale(${scale})`;
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(zIndex);
        }
      }

      rAFRef.current = requestAnimationFrame(loop);
    };

    rAFRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isRacing, isFinished, isSurging, speedMultiplier, sceneryPool]);

  return (
    <div
      ref={containerRef}
      className="relative w-[1010px] h-[577px] overflow-hidden select-none bg-[#7EC8FF] font-sans"
    >
      {/* ── 1. SKY & SUN GLOW & DRIFTING CLOUDS (Z-Order: 0) ── */}
      <div
        className="absolute inset-0 h-[220px] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 505px 40px, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255) 55%), linear-gradient(180deg, #7EC8FF 0%, #BBE3FE 60%, #E0F2FE 100%)',
        }}
      >
        {/* Cloud 1 */}
        <div
          className="absolute top-2 w-44 h-16 pointer-events-none opacity-90"
          style={{ animation: isRacing ? 'cloudDrift 65s linear infinite -8s' : 'none', left: '-180px' }}
        >
          <svg viewBox="0 0 160 70" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="50" cy="45" rx="35" ry="20" />
            <ellipse cx="85" cy="35" rx="38" ry="26" />
            <ellipse cx="120" cy="45" rx="30" ry="18" />
            <rect x="25" y="42" width="105" height="22" rx="10" />
          </svg>
        </div>

        {/* Cloud 2 */}
        <div
          className="absolute top-8 w-36 h-14 pointer-events-none opacity-85"
          style={{ animation: isRacing ? 'cloudDrift 80s linear infinite -35s' : 'none', left: '-160px' }}
        >
          <svg viewBox="0 0 140 60" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="40" cy="38" rx="28" ry="18" />
            <ellipse cx="75" cy="30" rx="32" ry="22" />
            <ellipse cx="105" cy="38" rx="24" ry="16" />
            <rect x="20" y="36" width="90" height="18" rx="8" />
          </svg>
        </div>

        {/* Cloud 3 */}
        <div
          className="absolute top-14 w-40 h-15 pointer-events-none opacity-80"
          style={{ animation: isRacing ? 'cloudDrift 95s linear infinite -60s' : 'none', left: '-170px' }}
        >
          <svg viewBox="0 0 150 65" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="45" cy="42" rx="30" ry="18" />
            <ellipse cx="80" cy="32" rx="35" ry="24" />
            <ellipse cx="115" cy="42" rx="26" ry="16" />
            <rect x="22" y="38" width="100" height="20" rx="8" />
          </svg>
        </div>

        {/* Cloud 4 */}
        <div
          className="absolute top-5 w-32 h-12 pointer-events-none opacity-75"
          style={{ animation: isRacing ? 'cloudDrift 70s linear infinite -20s' : 'none', left: '-150px' }}
        >
          <svg viewBox="0 0 130 55" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="38" cy="34" rx="24" ry="15" />
            <ellipse cx="68" cy="26" rx="28" ry="18" />
            <ellipse cx="96" cy="34" rx="22" ry="14" />
            <rect x="18" y="32" width="80" height="15" rx="6" />
          </svg>
        </div>
      </div>

      {/* ── 2. MOUNTAINS, TURQUOISE LAKE BAND & FOOTHILLS (Z-Order: 1) ── */}
      <div className="absolute top-[28px] inset-x-0 h-[115px] pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 2020 115" className="w-[200%] h-full">
          {/* Back Tall Mountain Layer (#6C9BD8) */}
          <g ref={mountainBackRef}>
            <path
              d="M 0 75 Q 120 15 250 45 Q 380 10 505 48 Q 630 12 760 42 Q 890 8 1010 65 Q 1130 15 1260 45 Q 1390 10 1515 48 Q 1640 12 1770 42 Q 1900 8 2020 65 L 2020 115 L 0 115 Z"
              fill="#6C9BD8"
            />
          </g>

          {/* Front Mountain Layer (#8BB4E6) with highlighted facets */}
          <g ref={mountainFrontRef}>
            <path
              d="M 0 82 Q 180 28 340 58 Q 490 25 640 62 Q 820 22 1010 68 Q 1190 28 1350 58 Q 1500 25 1650 62 Q 1830 22 2020 68 L 2020 115 L 0 115 Z"
              fill="#8BB4E6"
            />
            <polygon points="340,58 380,85 300,85" fill="#B3D2F7" opacity="0.6" />
            <polygon points="640,62 690,90 600,90" fill="#B3D2F7" opacity="0.6" />
            <polygon points="1350,58 1390,85 1310,85" fill="#B3D2F7" opacity="0.6" />
            <polygon points="1650,62 1700,90 1610,90" fill="#B3D2F7" opacity="0.6" />
          </g>

          {/* Turquoise Lake Band (#4FB6E8 → #8ED8F5) */}
          <defs>
            <linearGradient id="lakeWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4FB6E8" />
              <stop offset="100%" stopColor="#8ED8F5" />
            </linearGradient>
          </defs>
          <rect x="0" y="78" width="2020" height="27" fill="url(#lakeWaterGrad)" opacity="0.95" />

          {/* Sparkle Glints */}
          <g ref={lakeGlintRef}>
            <ellipse cx="220" cy="88" rx="24" ry="1.5" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="380" cy="84" rx="32" ry="1.8" fill="#FFFFFF" opacity="0.95" />
            <ellipse cx="620" cy="90" rx="36" ry="1.5" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="800" cy="85" rx="28" ry="1.6" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="1230" cy="88" rx="24" ry="1.5" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="1390" cy="84" rx="32" ry="1.8" fill="#FFFFFF" opacity="0.95" />
            <ellipse cx="1630" cy="90" rx="36" ry="1.5" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="1810" cy="85" rx="28" ry="1.6" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Green Foothills in front of lake */}
          <path
            d="M 0 96 Q 160 88 320 94 Q 480 86 640 95 Q 830 87 1010 96 Q 1170 88 1330 94 Q 1490 86 1650 95 Q 1840 87 2020 96 L 2020 115 L 0 115 Z"
            fill="#45A338"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* ── 3. GROUND BASE TERRAIN & GRASS (Z-Order: 2) ── */}
      <svg viewBox="0 0 1010 577" className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="grassGradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6CC24A" />
            <stop offset="100%" stopColor="#3FA33A" />
          </linearGradient>
          <linearGradient id="grassGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6CC24A" />
            <stop offset="100%" stopColor="#3FA33A" />
          </linearGradient>
        </defs>
        <rect ref={leftGrassRef} x="0" y={HORIZON_Y} width="505" height={BOTTOM_Y - HORIZON_Y} fill="url(#grassGradLeft)" />
        <rect ref={rightGrassRef} x="505" y={HORIZON_Y} width="505" height={BOTTOM_Y - HORIZON_Y} fill="url(#grassGradRight)" />
      </svg>

      {/* ── 4. ASPHALT ROAD & CLEAN WHITE EDGE LINES (Z-Order: 3) ── */}
      <svg viewBox="0 0 1010 577" className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="runnerRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8E9AAE" />
            <stop offset="35%" stopColor="#717E94" />
            <stop offset="70%" stopColor="#5E6A7F" />
            <stop offset="100%" stopColor="#566175" />
          </linearGradient>
          <linearGradient id="runnerCurbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BFCBDC" />
            <stop offset="100%" stopColor="#8A97AC" />
          </linearGradient>
        </defs>

        {/* Curb Bed */}
        <polygon points="430,105 580,105 1905,577 -895,577" fill="url(#runnerCurbGrad)" />

        {/* Main Road Bed */}
        <polygon
          points="435,105 575,105 1885,577 -875,577"
          fill="url(#runnerRoadGrad)"
        />

        {/* Clean Solid White Edge Lines */}
        <polygon points="435,105 441,105 -853,577 -875,577" fill="#FFFFFF" opacity="0.95" />
        <polygon points="569,105 575,105 1885,577 1863,577" fill="#FFFFFF" opacity="0.95" />
      </svg>

      {/* ── 5. PROJECTION-DRIVEN CENTER DASHES (Z-Order: 4) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: DASH_COUNT }).map((_, i) => (
          <div
            key={`dash_${i}`}
            ref={(el) => {
              dashRefs.current[i] = el;
            }}
            className="absolute left-1/2 w-4 h-12 bg-white rounded-xs shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            style={{
              willChange: 'transform, top, opacity',
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>

      {/* ── 6. PROJECTION-DRIVEN EDGE KERB BLOCKS (Red/White Alternating, Z-Order: 5) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: KERB_COUNT }).map((_, i) => (
          <React.Fragment key={`kerb_${i}`}>
            <div
              ref={(el) => {
                leftKerbRefs.current[i] = el;
              }}
              className={`absolute w-3.5 h-6 rounded-xs shadow-xs ${i % 2 === 0 ? 'bg-[#EF4444]' : 'bg-[#FFFFFF]'}`}
              style={{ willChange: 'transform, left, top, opacity' }}
            />
            <div
              ref={(el) => {
                rightKerbRefs.current[i] = el;
              }}
              className={`absolute w-3.5 h-6 rounded-xs shadow-xs ${i % 2 === 0 ? 'bg-[#EF4444]' : 'bg-[#FFFFFF]'}`}
              style={{ willChange: 'transform, left, top, opacity' }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* ── 7. PROJECTION-DRIVEN 3D SCENERY POOL (Recycled Side Objects, Z-Order: 10) ── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {sceneryPool.map((item, i) => (
          <div
            key={`scenery_${item.id}`}
            ref={(el) => {
              sceneryRefs.current[i] = el;
            }}
            className="absolute pointer-events-none origin-bottom"
            style={{ willChange: 'transform, left, top, opacity' }}
          >
            <SceneryObjectSvg type={item.type} />
          </div>
        ))}
      </div>

      {/* ── 8. FLOATING SKY FINISH LINE (Shows in air as human gets close) ── */}
      <SkyFinishLine humanProgress={humanProgress} />

      {/* ── 9. RACE CONTENT (Cars, UI, Panel, Overlays, Z-Order: 20+) ── */}
      <div className="absolute inset-0 z-20 pointer-events-auto">{children}</div>
    </div>
  );
};
