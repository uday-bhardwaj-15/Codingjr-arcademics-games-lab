'use client';

import React from 'react';
import { PlayerColor } from '../types';
import { CAR_COLORS } from '../constants';

interface OldDragCarSvgProps {
  color?: PlayerColor;
  className?: string;
  isBoosting?: boolean;
}

export const OldDragCarSvg: React.FC<OldDragCarSvgProps> = ({
  color = 'blue',
  className = '',
  isBoosting = false,
}) => {
  const c = CAR_COLORS[color] || CAR_COLORS.blue;

  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}>
      {/* Nitrous Boost Flame underneath tailpipe */}
      {isBoosting && (
        <div className="absolute -bottom-8 flex items-center justify-center animate-pulse z-0 pointer-events-none">
          <svg viewBox="0 0 60 90" className="w-12 sm:w-16 h-16 sm:h-20 drop-shadow-[0_0_18px_#38bdf8]">
            <path
              d="M 30 0 C 12 25, 5 55, 30 90 C 55 55, 48 25, 30 0 Z"
              fill="url(#nitroBoostFlame_old)"
            />
            <path
              d="M 30 15 C 20 35, 16 60, 30 75 C 44 60, 40 35, 30 15 Z"
              fill="#ffffff"
            />
            <defs>
              <linearGradient id="nitroBoostFlame_old" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Authentic Low-Slung 3D Dragster SVG (Original Unedited Art) */}
      <svg
        viewBox="0 0 260 170"
        className="w-36 sm:w-44 md:w-48 h-auto overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Body Aerodynamic Gradient */}
          <linearGradient id={`carBodyGradOld_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.highlight} />
            <stop offset="30%" stopColor={c.primary} />
            <stop offset="80%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>

          {/* Rear Spoiler Wing Gradient */}
          <linearGradient id={`spoilerGradOld_${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.primary} />
            <stop offset="35%" stopColor={c.highlight} />
            <stop offset="65%" stopColor={c.spoiler} />
            <stop offset="100%" stopColor={c.primary} />
          </linearGradient>

          {/* Massive Rear Slicks Rubber Gradient */}
          <linearGradient id="rearTireRubberOld" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a0f18" />
            <stop offset="20%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="80%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0a0f18" />
          </linearGradient>

          {/* Front Tires Gradient */}
          <linearGradient id="frontTireRubberOld" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Exhaust Turbine Metal Ring Gradient */}
          <radialGradient id={`exhaustMetalRimOld_${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#030712" />
            <stop offset="65%" stopColor="#1e293b" />
            <stop offset="84%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>

        {/* 1. Ground Contact Asphalt Shadow */}
        <ellipse cx="44" cy="154" rx="34" ry="10" fill="#000000" opacity="0.65" />
        <ellipse cx="216" cy="154" rx="34" ry="10" fill="#000000" opacity="0.65" />
        <ellipse cx="130" cy="154" rx="65" ry="8" fill="#000000" opacity="0.5" />

        {/* 2. Front Wheels (Extended forward in perspective) */}
        <g transform="translate(38, 70)">
          <rect x="0" y="0" width="22" height="48" rx="8" fill="url(#frontTireRubberOld)" stroke="#090d16" strokeWidth="2.5" />
          <ellipse cx="11" cy="24" rx="5" ry="14" fill="#475569" />
        </g>
        <g transform="translate(200, 70)">
          <rect x="0" y="0" width="22" height="48" rx="8" fill="url(#frontTireRubberOld)" stroke="#090d16" strokeWidth="2.5" />
          <ellipse cx="11" cy="24" rx="5" ry="14" fill="#475569" />
        </g>

        {/* 3. Aerodynamic Nose & Hood Body Shell */}
        <path
          d="M 98 42 Q 130 20 162 42 L 180 96 Q 130 90 80 96 Z"
          fill={c.secondary}
          stroke={c.dark}
          strokeWidth="3"
        />

        {/* 4. Rear Massive Racing Slicks (Left & Right Foreground) */}
        <g transform="translate(18, 80)">
          <rect
            x="0"
            y="0"
            width="54"
            height="74"
            rx="16"
            fill="url(#rearTireRubberOld)"
            stroke="#090d16"
            strokeWidth="4"
          />
          <path d="M 14 12 Q 14 37 14 62" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 42 12 Q 42 37 42 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="translate(188, 80)">
          <rect
            x="0"
            y="0"
            width="54"
            height="74"
            rx="16"
            fill="url(#rearTireRubberOld)"
            stroke="#090d16"
            strokeWidth="4"
          />
          <path d="M 12 12 Q 12 37 12 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 40 12 Q 40 37 40 62" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 5. Main Rear Body Chassis & Oval Exhaust Turbine */}
        <g>
          <path
            d="M 68 86 C 68 54, 192 54, 192 86 C 196 130, 184 150, 130 152 C 76 150, 64 130, 68 86 Z"
            fill={`url(#carBodyGradOld_${color})`}
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

          {/* Central Oval Exhaust Jet Turbine */}
          <g transform="translate(130, 120)">
            <ellipse cx="0" cy="0" rx="38" ry="24" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />
            <ellipse cx="0" cy="0" rx="33" ry="19" fill={`url(#exhaustMetalRimOld_${color})`} />
            <ellipse cx="0" cy="0" rx="18" ry="10" fill={isBoosting ? '#38bdf8' : '#090d16'} />
          </g>
        </g>

        {/* 6. Elevated Rear Spoiler Struts */}
        <rect x="88" y="44" width="7" height="34" fill="#1e293b" rx="2" />
        <rect x="165" y="44" width="7" height="34" fill="#1e293b" rx="2" />

        {/* 7. Elevated Rear Spoiler Wing */}
        <g transform="translate(54, 34)">
          <polygon
            points="0,24 152,24 164,0 -12,0"
            fill={`url(#spoilerGradOld_${color})`}
            stroke={c.dark}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <line x1="42" y1="0" x2="38" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.75" />
          <line x1="76" y1="0" x2="76" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" />
          <line x1="112" y1="0" x2="116" y2="24" stroke="#ffffff" strokeWidth="2.5" opacity="0.75" />
          <polygon points="-16,-6 -10,30 -2,28 -8,-6" fill={c.dark} />
          <polygon points="160,-6 166,30 158,28 152,-6" fill={c.dark} />
          <line x1="-8" y1="3" x2="160" y2="3" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};
