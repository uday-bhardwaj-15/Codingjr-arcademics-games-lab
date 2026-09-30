import React from 'react';
import { PlayerColor } from '../types';
import { CAR_COLORS } from '../constants';

interface DragCarAvatarProps {
  color?: PlayerColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  eyesClosed?: boolean;
  className?: string;
}

export const DragCarAvatar: React.FC<DragCarAvatarProps> = ({
  color = 'blue',
  size = 'lg',
  eyesClosed = false,
  className = '',
}) => {
  const c = CAR_COLORS[color] || CAR_COLORS.blue;

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 180"
        className="w-full h-full overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Body gradient */}
          <linearGradient id={`carBody_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.highlight} />
            <stop offset="35%" stopColor={c.primary} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>

          {/* Spoiler gradient */}
          <linearGradient id={`carSpoiler_${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.primary} />
            <stop offset="50%" stopColor={c.spoiler} />
            <stop offset="100%" stopColor={c.primary} />
          </linearGradient>

          {/* Tire gradient */}
          <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Rim hub gradient */}
          <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
        </defs>

        {/* Drop Shadow on Floor */}
        <ellipse cx="100" cy="165" rx="85" ry="14" fill="#000000" opacity="0.35" />

        {/* Rear Wheels (Background) */}
        {/* Left Rear Wheel */}
        <g transform="translate(18, 70)">
          <rect x="0" y="0" width="28" height="60" rx="10" fill="url(#tireGrad)" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="14" cy="30" rx="8" ry="18" fill="url(#rimGrad)" />
          <line x1="14" y1="12" x2="14" y2="48" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>

        {/* Right Rear Wheel */}
        <g transform="translate(154, 70)">
          <rect x="0" y="0" width="28" height="60" rx="10" fill="url(#tireGrad)" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="14" cy="30" rx="8" ry="18" fill="url(#rimGrad)" />
          <line x1="14" y1="12" x2="14" y2="48" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>

        {/* Rear Spoiler Struts */}
        <rect x="68" y="32" width="6" height="28" fill="#1e293b" rx="2" />
        <rect x="126" y="32" width="6" height="28" fill="#1e293b" rx="2" />

        {/* Elevated Rear Spoiler Wing */}
        <g transform="translate(40, 20)">
          <path
            d="M 5 18 L 115 18 L 125 0 L -5 0 Z"
            fill={`url(#carSpoiler_${color})`}
            stroke={c.dark}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Spoiler Side Endplates */}
          <polygon points="-8,-4 -2,22 4,20 0,-4" fill={c.dark} />
          <polygon points="120,-4 126,22 132,20 128,-4" fill={c.dark} />
        </g>

        {/* Main Aerodynamic Car Body & Cockpit */}
        {/* Cockpit Canopy Top */}
        <path
          d="M 60 52 Q 100 36 140 52 L 152 95 Q 100 90 48 95 Z"
          fill={c.secondary}
          stroke={c.dark}
          strokeWidth="2.5"
        />

        {/* Front Nose & Rounded Body Shell */}
        <path
          d="M 44 90 C 44 55, 156 55, 156 90 C 160 130, 150 152, 100 154 C 50 152, 40 130, 44 90 Z"
          fill={`url(#carBody_${color})`}
          stroke={c.dark}
          strokeWidth="3.5"
        />

        {/* Glossy Body Highlight Arc */}
        <path
          d="M 54 86 Q 100 62 146 86"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        {/* Front Left Wheel */}
        <g transform="translate(16, 95)">
          <rect x="0" y="0" width="30" height="62" rx="12" fill="url(#tireGrad)" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="15" cy="31" rx="8" ry="18" fill="url(#rimGrad)" />
          <circle cx="15" cy="31" r="4" fill="#f8fafc" />
          <line x1="15" y1="13" x2="15" y2="49" stroke="#94a3b8" strokeWidth="1.5" />
        </g>

        {/* Front Right Wheel */}
        <g transform="translate(154, 95)">
          <rect x="0" y="0" width="30" height="62" rx="12" fill="url(#tireGrad)" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="15" cy="31" rx="8" ry="18" fill="url(#rimGrad)" />
          <circle cx="15" cy="31" r="4" fill="#f8fafc" />
          <line x1="15" y1="13" x2="15" y2="49" stroke="#94a3b8" strokeWidth="1.5" />
        </g>

        {/* Front Windshield / Eye Mask */}
        <ellipse cx="100" cy="82" rx="42" ry="24" fill={c.dark} opacity="0.4" />

        {/* EYES */}
        {eyesClosed ? (
          /* Happy Closed Eyes (like Pink Car in screenshot 4) */
          <g>
            <path
              d="M 72 84 Q 84 66 94 84"
              stroke="#0f172a"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 106 84 Q 116 66 128 84"
              stroke="#0f172a"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          /* Big Friendly Open Eyes (like Blue, Yellow, Red, Orange, Purple cars) */
          <g>
            {/* Left Eye */}
            <g transform="translate(72, 62)">
              {/* White Sclera */}
              <ellipse cx="14" cy="18" rx="15" ry="20" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              {/* Iris & Pupil */}
              <circle cx="16" cy="19" r="8" fill="#0f172a" />
              {/* Eye Catchlight */}
              <circle cx="14" cy="16" r="3.5" fill="#ffffff" />
              <circle cx="18" cy="22" r="1.5" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <g transform="translate(100, 62)">
              {/* White Sclera */}
              <ellipse cx="14" cy="18" rx="15" ry="20" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              {/* Iris & Pupil */}
              <circle cx="16" cy="19" r="8" fill="#0f172a" />
              {/* Eye Catchlight */}
              <circle cx="14" cy="16" r="3.5" fill="#ffffff" />
              <circle cx="18" cy="22" r="1.5" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* SMILE / TOOTHY GRIN GRILL */}
        {eyesClosed ? (
          /* Open Laughing Mouth (Pink Car) */
          <g transform="translate(70, 106)">
            <path
              d="M 0 6 Q 30 40 60 6 Z"
              fill="#dc2626"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Tongue */}
            <path
              d="M 15 22 Q 30 14 45 22 Q 30 38 15 22 Z"
              fill="#fb7185"
            />
          </g>
        ) : (
          /* Wide Toothy Smile Grill (Authentic Arcademics Grin) */
          <g transform="translate(56, 102)">
            {/* Smile Background / Dark mouth */}
            <path
              d="M 4 8 C 12 36, 76 36, 84 8 C 88 2, 0 2, 4 8 Z"
              fill="#0f172a"
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* White Teeth Array */}
            <g>
              <path
                d="M 7 8 C 15 32, 73 32, 81 8 Z"
                fill="#ffffff"
              />
              {/* Tooth divider lines */}
              <line x1="24" y1="8" x2="24" y2="24" stroke="#94a3b8" strokeWidth="2" />
              <line x1="37" y1="8" x2="37" y2="27" stroke="#94a3b8" strokeWidth="2" />
              <line x1="51" y1="8" x2="51" y2="27" stroke="#94a3b8" strokeWidth="2" />
              <line x1="64" y1="8" x2="64" y2="24" stroke="#94a3b8" strokeWidth="2" />
              <line x1="12" y1="16" x2="76" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
