import React from 'react';
import { PlayerColor } from '../types';
import { CAR_COLORS } from '../constants';

interface DragCarProps {
  color?: PlayerColor;
  name: string;
  isHuman?: boolean;
  progress: number; // 0.0 (start) to 1.0 (finish)
  laneIndex: number; // 0, 1, 2, 3
  isBoosting?: boolean;
}

export const DragCar: React.FC<DragCarProps> = ({
  color = 'blue',
  name,
  isHuman = false,
  progress = 0,
  laneIndex = 0,
  isBoosting = false,
}) => {
  const c = CAR_COLORS[color] || CAR_COLORS.blue;

  // 1. Natural Perspective Track Progression:
  // At progress = 0 (Start line): Y = 70% (comfortably sitting on the asphalt road)
  // At progress = 1 (Finish line): Y = 22% (near the horizon)
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const startY = 70;
  const finishY = 22;
  const currentY = startY - clampedProgress * (startY - finishY);

  // 2. Perspective Lane Convergence along the Trapezoid Road:
  // At Start (Y = 70%): Base Lane X positions = [17%, 39%, 61%, 83%] (road width is 0% to 100%)
  // At Horizon (Y = 22%): Horizon Lane X positions = [35%, 45%, 55%, 65%] (road width is 22% to 78%)
  const verticalT = (startY - currentY) / (startY - finishY); // 0 at start, 1 at finish
  const baseLanes = [17, 39, 61, 83];
  const horizonLanes = [35, 45, 55, 65];
  const currentX =
    baseLanes[laneIndex] + (horizonLanes[laneIndex] - baseLanes[laneIndex]) * verticalT;

  // 3. Perspective Scaling:
  // Cars are big and grounded at the start line (scale 1.0) and smoothly scale down to 0.38 at horizon
  const scale = 1.0 - verticalT * 0.62;

  return (
    <div
      className="absolute transition-all duration-700 ease-out flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: `translate(-50%, -65%) scale(${scale})`,
        zIndex: Math.floor(100 - verticalT * 50),
      }}
    >
      {/* Subtle Engine Vibration / Road Rumble */}
      <div className="relative flex flex-col items-center animate-[dragRumble_0.25s_infinite_alternate]">
        {/* Nitrous Flame / Turbo Boost on Correct Answer */}
        {isBoosting && (
          <div className="absolute -bottom-8 flex items-center justify-center animate-pulse z-0 pointer-events-none">
            <svg viewBox="0 0 60 90" className="w-12 sm:w-16 h-16 sm:h-20 drop-shadow-[0_0_18px_#38bdf8]">
              <path
                d="M 30 0 C 12 25, 5 55, 30 90 C 55 55, 48 25, 30 0 Z"
                fill="url(#nitroBoostFlame)"
              />
              <path
                d="M 30 15 C 20 35, 16 60, 30 75 C 44 60, 40 35, 30 15 Z"
                fill="#ffffff"
              />
              <defs>
                <linearGradient id="nitroBoostFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Authentic Low-Slung 3D Dragster SVG (Exact Match to Image 1) */}
        <svg
          viewBox="0 0 260 170"
          className="w-36 sm:w-44 md:w-48 h-auto overflow-visible"
        >
          <defs>
            {/* Body Aerodynamic Gradient */}
            <linearGradient id={`carBodyGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={c.highlight} />
              <stop offset="30%" stopColor={c.primary} />
              <stop offset="80%" stopColor={c.secondary} />
              <stop offset="100%" stopColor={c.dark} />
            </linearGradient>

            {/* Rear Spoiler Wing Gradient */}
            <linearGradient id={`spoilerGrad_${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c.primary} />
              <stop offset="35%" stopColor={c.highlight} />
              <stop offset="65%" stopColor={c.spoiler} />
              <stop offset="100%" stopColor={c.primary} />
            </linearGradient>

            {/* Massive Rear Slicks Rubber Gradient */}
            <linearGradient id="rearTireRubber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0a0f18" />
              <stop offset="20%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="80%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0a0f18" />
            </linearGradient>

            {/* Front Tires Gradient */}
            <linearGradient id="frontTireRubber" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Exhaust Turbine Metal Ring Gradient */}
            <radialGradient id={`exhaustMetalRim_${color}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#030712" />
              <stop offset="65%" stopColor="#1e293b" />
              <stop offset="84%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>

          {/* 1. Ground Contact Asphalt Shadow (Grounded Directly Underneath Tires) */}
          <ellipse cx="44" cy="154" rx="34" ry="10" fill="#000000" opacity="0.65" />
          <ellipse cx="216" cy="154" rx="34" ry="10" fill="#000000" opacity="0.65" />
          <ellipse cx="130" cy="154" rx="65" ry="8" fill="#000000" opacity="0.5" />

          {/* 2. Front Wheels (Extended forward in perspective) */}
          {/* Front Left Wheel */}
          <g transform="translate(38, 70)">
            <rect x="0" y="0" width="22" height="48" rx="8" fill="url(#frontTireRubber)" stroke="#090d16" strokeWidth="2.5" />
            <ellipse cx="11" cy="24" rx="5" ry="14" fill="#475569" />
          </g>

          {/* Front Right Wheel */}
          <g transform="translate(200, 70)">
            <rect x="0" y="0" width="22" height="48" rx="8" fill="url(#frontTireRubber)" stroke="#090d16" strokeWidth="2.5" />
            <ellipse cx="11" cy="24" rx="5" ry="14" fill="#475569" />
          </g>

          {/* 3. Aerodynamic Nose & Hood Body Shell (Extending Forward) */}
          <path
            d="M 98 42 Q 130 20 162 42 L 180 96 Q 130 90 80 96 Z"
            fill={c.secondary}
            stroke={c.dark}
            strokeWidth="3"
          />

          {/* 4. Rear Massive Racing Slicks (Left & Right Foreground) */}
          {/* Left Rear Tire */}
          <g transform="translate(18, 80)">
            <rect
              x="0"
              y="0"
              width="54"
              height="74"
              rx="16"
              fill="url(#rearTireRubber)"
              stroke="#090d16"
              strokeWidth="4"
            />
            <path d="M 14 12 Q 14 37 14 62" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 42 12 Q 42 37 42 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Right Rear Tire */}
          <g transform="translate(188, 80)">
            <rect
              x="0"
              y="0"
              width="54"
              height="74"
              rx="16"
              fill="url(#rearTireRubber)"
              stroke="#090d16"
              strokeWidth="4"
            />
            <path d="M 12 12 Q 12 37 12 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 40 12 Q 40 37 40 62" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* 5. Main Rear Body Chassis & Oval Exhaust Turbine */}
          <g>
            {/* Low-slung Wide Body Tub */}
            <path
              d="M 68 86 C 68 54, 192 54, 192 86 C 196 130, 184 150, 130 152 C 76 150, 64 130, 68 86 Z"
              fill={`url(#carBodyGrad_${color})`}
              stroke={c.dark}
              strokeWidth="4"
            />

            {/* Specular Cockpit Canopy Sheen */}
            <path
              d="M 82 82 Q 130 56 178 82"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />

            {/* Central Oval Exhaust Jet Turbine (Matching Image 1) */}
            <g transform="translate(130, 120)">
              {/* Outer Metallic Chrome Rim */}
              <ellipse cx="0" cy="0" rx="38" ry="24" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />
              {/* Inner Jet Nozzle Port */}
              <ellipse cx="0" cy="0" rx="33" ry="19" fill={`url(#exhaustMetalRim_${color})`} />
              {/* Deep Exhaust Core Hole */}
              <ellipse cx="0" cy="0" rx="18" ry="10" fill={isBoosting ? '#38bdf8' : '#090d16'} />
            </g>
          </g>

          {/* 6. Elevated Rear Spoiler Struts */}
          <rect x="88" y="44" width="7" height="34" fill="#1e293b" rx="2" />
          <rect x="165" y="44" width="7" height="34" fill="#1e293b" rx="2" />

          {/* 7. Elevated Rear Spoiler Wing (Segmented Acrylic Wing Matching Image 1) */}
          <g transform="translate(54, 34)">
            {/* Main Spoiler Blade */}
            <polygon
              points="0,24 152,24 164,0 -12,0"
              fill={`url(#spoilerGrad_${color})`}
              stroke={c.dark}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Multi-Panel Acrylic Divider Lines */}
            <line x1="42" y1="0" x2="38" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.75" />
            <line x1="76" y1="0" x2="76" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" />
            <line x1="112" y1="0" x2="116" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.75" />

            {/* Wing Side Endplates */}
            <polygon points="-16,-6 -10,30 -2,28 -8,-6" fill={c.dark} />
            <polygon points="160,-6 166,30 158,28 152,-6" fill={c.dark} />

            {/* Top Gloss Highlight */}
            <line x1="-8" y1="3" x2="160" y2="3" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          </g>
        </svg>

        {/* Clean White Player Name underneath (Matching Image 1: Clean drop shadow, NO box) */}
        <div className="mt-1 flex items-center justify-center">
          <span className="font-extrabold text-xs sm:text-sm md:text-base text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
};
