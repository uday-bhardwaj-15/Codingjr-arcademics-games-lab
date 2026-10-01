import React from 'react';
import { PlayerColor } from '../types';
import { POD_COLORS } from '../constants';

interface PodProps {
  color?: PlayerColor;
  name: string;
  isHuman?: boolean;
  heading?: number; // radians
  boostRatio?: number; // 0 (idle drift) to 1 (full boost)
  gapSteps?: number; // +2 steps ahead or -1 step behind
  status?: 'countdown' | 'racing' | 'sputtering' | 'finished';
  className?: string;
}

export const Pod: React.FC<PodProps> = ({
  color = 'blue',
  name,
  isHuman = false,
  heading = 0,
  boostRatio = 0,
  gapSteps = 0,
  status = 'racing',
  className = '',
}) => {
  const c = POD_COLORS[color] || POD_COLORS.blue;
  const isSputtering = status === 'sputtering';

  // Flame scale and boost effects
  const flameScale = isSputtering ? 0.3 : 0.7 + boostRatio * 1.0;
  const deg = (heading * 180) / Math.PI;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        transform: `rotate(${deg}deg)`,
      }}
    >
      {/* Color-Matched Ambient Engine Underglow */}
      <div
        className="absolute w-28 h-14 rounded-full blur-lg opacity-45 pointer-events-none -translate-x-3"
        style={{ backgroundColor: c.glow }}
      />

      {/* Dynamic Animated Thruster Afterburner Flame at Exhaust (-X direction) */}
      <div
        className="absolute -left-10 sm:-left-12 flex items-center justify-center pointer-events-none transition-transform duration-100"
        style={{
          transform: `scale(${flameScale})`,
          transformOrigin: 'right center',
        }}
      >
        <svg viewBox="0 0 80 40" className="w-14 sm:w-20 h-7 sm:h-9 overflow-visible drop-shadow-[0_0_12px_#38bdf8]">
          <defs>
            <linearGradient id={`flameOuter_${color}`} x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>

            <linearGradient id={`flameCore_${color}`} x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e0f2fe" />
              <stop offset="80%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Outer Blazing Fire Plasma Plume */}
          <path
            d="M 65 20 C 50 34, 15 30, 0 20 C 15 10, 50 6, 65 20 Z"
            fill={`url(#flameOuter_${color})`}
            className="animate-pulse"
          />

          {/* Inner High-Heat White Hot Diamond Core */}
          <path
            d="M 65 20 C 52 27, 30 25, 14 20 C 30 15, 52 13, 65 20 Z"
            fill={`url(#flameCore_${color})`}
          />

          {/* Plasma Shock Rings */}
          <ellipse cx="48" cy="20" rx="3" ry="5" fill="#ffffff" opacity="0.8" />
          <ellipse cx="32" cy="20" rx="2" ry="3.5" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>

      {/* Sputter Sparks (Triggered on wrong answers) */}
      {isSputtering && (
        <div className="absolute -left-6 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90 animate-ping" />
          <div className="w-3 h-3 rounded-full bg-rose-500 opacity-80 animate-bounce -ml-2" />
        </div>
      )}

      {/* Premium Spaceship Pod SVG (Side View) */}
      <svg
        viewBox="0 0 170 110"
        className="w-22 sm:w-28 md:w-32 h-auto overflow-visible drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
      >
        <defs>
          {/* Multi-Stop Glossy Hull Gradient */}
          <linearGradient id={`hullGrad_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.highlight} />
            <stop offset="20%" stopColor={c.primary} />
            <stop offset="70%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>

          {/* Specular Top Reflection Sheen */}
          <linearGradient id="topSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Crystal Glass Porthole Dome Gradient */}
          <radialGradient id="portholeGlass" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#bae6fd" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </radialGradient>

          {/* Metal Bezel Rim Gradient */}
          <linearGradient id="metalBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Hull Clipping Path for Crisp Stripes */}
          <clipPath id={`podClip_${color}`}>
            <ellipse cx="85" cy="55" rx="64" ry="36" />
          </clipPath>
        </defs>

        {/* 1. Rear Metallic Exhaust Nozzle */}
        <g>
          <path
            d="M 24 38 L 10 33 L 10 77 L 24 72 Z"
            fill="url(#metalBezel)"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          {/* Engine Exhaust Ring Ribs */}
          <line x1="16" y1="35" x2="16" y2="75" stroke="#475569" strokeWidth="2" />
          <ellipse cx="10" cy="55" rx="3.5" ry="21" fill="#0f172a" />
        </g>

        {/* 2. Aerodynamic Stabilizer Top & Bottom Fins */}
        {/* Top Fin */}
        <path
          d="M 62 20 Q 82 2 108 20 Z"
          fill={c.dark}
          stroke="#091428"
          strokeWidth="2"
        />
        <path d="M 68 18 Q 84 7 102 18" stroke={c.highlight} strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* Bottom Fin */}
        <path
          d="M 62 90 Q 82 108 108 90 Z"
          fill={c.dark}
          stroke="#091428"
          strokeWidth="2"
        />

        {/* 3. Main Capsule Pod Hull Body */}
        <ellipse
          cx="85"
          cy="55"
          rx="64"
          ry="36"
          fill={`url(#hullGrad_${color})`}
          stroke={c.dark}
          strokeWidth="4"
        />

        {/* 4. Glossy Diagonal Speed Stripes (Exact reference match) */}
        <g clipPath={`url(#podClip_${color})`}>
          <polygon points="52,10 74,10 42,100 20,100" fill={c.stripe} opacity="0.38" />
          <polygon points="94,10 116,10 84,100 62,100" fill={c.stripe} opacity="0.38" />
          <polygon points="136,10 158,10 126,100 104,100" fill={c.stripe} opacity="0.38" />

          {/* Top Specular Arc Curve */}
          <ellipse cx="85" cy="40" rx="55" ry="18" fill="url(#topSheen)" opacity="0.65" />
        </g>

        {/* 5. Sleek Porthole Cockpit Window with Pilot Face */}
        <g transform="translate(100, 55)">
          {/* Metallic Porthole Outer Bezel */}
          <circle cx="0" cy="0" r="22" fill="url(#metalBezel)" stroke="#091428" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="18" fill="url(#portholeGlass)" stroke="#0f172a" strokeWidth="2" />

          {/* Pilot Character Face Inside Porthole */}
          {/* Left Eye */}
          <circle cx="-6" cy="-2" r="3.5" fill="#0f172a" />
          <circle cx="-5" cy="-3.5" r="1.3" fill="#ffffff" />

          {/* Right Eye */}
          <circle cx="6" cy="-2" r="3.5" fill="#0f172a" />
          <circle cx="7" cy="-3.5" r="1.3" fill="#ffffff" />

          {/* Cheerful Smile */}
          <path
            d="M -6 4 Q 0 9 6 4"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Glass Crescent Specular Glint */}
          <ellipse
            cx="-6"
            cy="-7"
            rx="7"
            ry="3.5"
            fill="#ffffff"
            opacity="0.8"
            transform="rotate(-25 -6 -7)"
          />
        </g>

        {/* 6. Aerodynamic Nose Cone Chrome Highlight */}
        <path
          d="M 136 43 Q 149 55 136 67"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </svg>

      {/* Opponent Gap Pill (▲ 2 or ▼ 1) */}
      {!isHuman && gapSteps !== 0 && (
        <div
          className="absolute -top-7 px-2 py-0.5 rounded-full text-[10px] font-black border shadow-lg flex items-center gap-0.5 pointer-events-none transition-transform"
          style={{
            backgroundColor: gapSteps > 0 ? '#16a34a' : '#dc2626',
            color: '#ffffff',
            borderColor: '#ffffff',
            transform: `rotate(${-deg}deg)`,
          }}
        >
          <span>{gapSteps > 0 ? `▲ ${gapSteps}` : `▼ ${Math.abs(gapSteps)}`}</span>
        </div>
      )}
    </div>
  );
};
