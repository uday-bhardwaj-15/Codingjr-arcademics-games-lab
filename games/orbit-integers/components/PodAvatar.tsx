import React from 'react';
import { PlayerColor } from '../types';
import { POD_COLORS } from '../constants';

interface PodAvatarProps {
  color?: PlayerColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PodAvatar: React.FC<PodAvatarProps> = ({
  color = 'blue',
  size = 'lg',
  className = '',
}) => {
  const c = POD_COLORS[color] || POD_COLORS.blue;

  const sizeMap = {
    sm: 'w-14 h-12',
    md: 'w-22 h-18',
    lg: 'w-34 h-26',
    xl: 'w-48 h-36',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 140"
        className="w-full h-full overflow-visible drop-shadow-2xl"
      >
        <defs>
          {/* Saucer Hull Gradient */}
          <linearGradient id={`saucerHull_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.highlight} />
            <stop offset="35%" stopColor={c.primary} />
            <stop offset="75%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>

          {/* Dome Glass Gradient */}
          <radialGradient id={`domeGlass_${color}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#bae6fd" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </radialGradient>

          {/* Diagonal Stripe Clip Path */}
          <clipPath id={`saucerClip_${color}`}>
            <ellipse cx="100" cy="85" rx="88" ry="38" />
          </clipPath>
        </defs>

        {/* Soft Drop Shadow */}
        <ellipse cx="100" cy="126" rx="72" ry="12" fill="#000000" opacity="0.45" />

        {/* Dome (Cockpit with Antenna) */}
        <g transform="translate(0, -2)">
          {/* Antenna Rod & Glowing Ball */}
          <line x1="100" y1="36" x2="100" y2="18" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="100" cy="16" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="2" className="animate-pulse" />
          <circle cx="98" cy="14" r="1.5" fill="#ffffff" />

          {/* Glass Dome */}
          <path
            d="M 60 70 C 60 26, 140 26, 140 70 Z"
            fill={`url(#domeGlass_${color})`}
            stroke="#64748b"
            strokeWidth="3"
          />
          {/* Dome Specular Highlight Reflection */}
          <ellipse cx="85" cy="45" rx="15" ry="8" fill="#ffffff" opacity="0.75" transform="rotate(-18 85 45)" />
        </g>

        {/* Main Saucer Hull */}
        <g>
          {/* Base Saucer Ellipse */}
          <ellipse
            cx="100"
            cy="85"
            rx="88"
            ry="38"
            fill={`url(#saucerHull_${color})`}
            stroke={c.dark}
            strokeWidth="4"
          />

          {/* Diagonal Stripes across Hull (Exact match to reference) */}
          <g clipPath={`url(#saucerClip_${color})`}>
            <polygon points="30,35 55,35 25,135 0,135" fill={c.stripe} opacity="0.38" />
            <polygon points="75,35 100,35 70,135 45,135" fill={c.stripe} opacity="0.38" />
            <polygon points="120,35 145,35 115,135 90,135" fill={c.stripe} opacity="0.38" />
            <polygon points="165,35 190,35 160,135 135,135" fill={c.stripe} opacity="0.38" />
          </g>

          {/* Saucer Rim Highlight Ring */}
          <ellipse
            cx="100"
            cy="82"
            rx="82"
            ry="32"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.4"
          />
        </g>

        {/* Big Expressive Cartoon Eyes */}
        <g transform="translate(0, 0)">
          {/* Left Eye */}
          <ellipse cx="84" cy="56" rx="10.5" ry="14.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="86" cy="56" r="6" fill="#0f172a" />
          <circle cx="84" cy="53" r="2.5" fill="#ffffff" />
          <circle cx="88" cy="58" r="1.2" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="116" cy="56" rx="10.5" ry="14.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="114" cy="56" r="6" fill="#0f172a" />
          <circle cx="112" cy="53" r="2.5" fill="#ffffff" />
          <circle cx="116" cy="58" r="1.2" fill="#ffffff" />
        </g>

        {/* Cheerful Smile */}
        <g transform="translate(100, 93)">
          <path
            d="M -26 -2 Q 0 26 26 -2 Z"
            fill="#dc2626"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
          {/* Tongue */}
          <path
            d="M -11 9 Q 0 2 11 9 Q 0 22 -11 9 Z"
            fill="#fb7185"
          />
          {/* Smile Dimples */}
          <circle cx="-26" cy="-2" r="2.5" fill="#0f172a" />
          <circle cx="26" cy="-2" r="2.5" fill="#0f172a" />
        </g>
      </svg>
    </div>
  );
};
