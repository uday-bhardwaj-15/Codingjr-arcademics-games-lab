'use client';

import React from 'react';

interface RaceCarFaceAvatarProps {
  className?: string;
}

export const RaceCarFaceAvatar: React.FC<RaceCarFaceAvatarProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 100 90"
        className="w-[84px] h-[76px] overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Blue Body Gradient */}
          <linearGradient id="avatarCarBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7CC4FF" />
            <stop offset="45%" stopColor="#2E8BFF" />
            <stop offset="100%" stopColor="#1457C7" />
          </linearGradient>

          {/* Spoiler Gradient */}
          <linearGradient id="avatarSpoilerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#99D0FF" />
            <stop offset="100%" stopColor="#1F73E8" />
          </linearGradient>

          {/* Wheel Dark Rubber */}
          <linearGradient id="avatarWheelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111116" />
            <stop offset="50%" stopColor="#2A2B36" />
            <stop offset="100%" stopColor="#111116" />
          </linearGradient>

          {/* Eye Gradient */}
          <radialGradient id="avatarEyePupil" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="70%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* 1. Rear Spoiler Wing Behind Body */}
        <g transform="translate(18, 2)">
          <rect x="0" y="0" width="64" height="10" rx="5" fill="url(#avatarSpoilerGrad)" stroke="#1457C7" strokeWidth="1.5" />
          <rect x="-3" y="-2" width="4" height="14" rx="2" fill="#1457C7" />
          <rect x="63" y="-2" width="4" height="14" rx="2" fill="#1457C7" />
          <line x1="6" y1="3" x2="58" y2="3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* 2. Left and Right Front Wheels */}
        {/* Left Wheel */}
        <rect x="4" y="32" width="16" height="42" rx="7" fill="url(#avatarWheelGrad)" stroke="#090A0F" strokeWidth="2" />
        <line x1="8" y1="38" x2="8" y2="68" stroke="#4E5266" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right Wheel */}
        <rect x="80" y="32" width="16" height="42" rx="7" fill="url(#avatarWheelGrad)" stroke="#090A0F" strokeWidth="2" />
        <line x1="92" y1="38" x2="92" y2="68" stroke="#4E5266" strokeWidth="1.5" strokeLinecap="round" />

        {/* 3. Main Round Blue Face Body */}
        <ellipse
          cx="50"
          cy="48"
          rx="36"
          ry="30"
          fill="url(#avatarCarBodyGrad)"
          stroke="#0F3F9E"
          strokeWidth="2.5"
        />

        {/* Top Gloss Sheen */}
        <ellipse cx="50" cy="28" rx="22" ry="7" fill="#FFFFFF" opacity="0.45" />

        {/* 4. Big Expressive Cartoon Eyes (Matching Mock) */}
        {/* Left Eye */}
        <g transform="translate(37, 38)">
          {/* White Eyeball */}
          <ellipse cx="0" cy="0" rx="9.5" ry="11" fill="#FFFFFF" stroke="#0F3F9E" strokeWidth="1.5" />
          {/* Pupil */}
          <ellipse cx="1" cy="0.5" rx="5.5" ry="6.5" fill="url(#avatarEyePupil)" />
          {/* Eye Specular Highlights */}
          <circle cx="-1" cy="-2.5" r="2.2" fill="#FFFFFF" />
          <circle cx="2.5" cy="2" r="1.1" fill="#FFFFFF" />
        </g>

        {/* Right Eye */}
        <g transform="translate(63, 38)">
          <ellipse cx="0" cy="0" rx="9.5" ry="11" fill="#FFFFFF" stroke="#0F3F9E" strokeWidth="1.5" />
          <ellipse cx="-1" cy="0.5" rx="5.5" ry="6.5" fill="url(#avatarEyePupil)" />
          <circle cx="-3" cy="-2.5" r="2.2" fill="#FFFFFF" />
          <circle cx="0.5" cy="2" r="1.1" fill="#FFFFFF" />
        </g>

        {/* 5. Big Wide Happy Grin with Teeth */}
        <g transform="translate(50, 62)">
          {/* Mouth Cavity */}
          <path
            d="M -18 -3 Q 0 16 18 -3 Z"
            fill="#1E1B4B"
            stroke="#0F3F9E"
            strokeWidth="1.8"
          />
          {/* White Upper Teeth */}
          <path
            d="M -15 -3 Q 0 4 15 -3 L 14 -1 Q 0 6 -14 -1 Z"
            fill="#FFFFFF"
          />
          {/* Pink Tongue */}
          <path
            d="M -8 5 Q 0 3 8 5 Q 4 12 -4 12 Z"
            fill="#F43F5E"
          />
        </g>

        {/* Cheerful Cheek Glows */}
        <ellipse cx="24" cy="56" rx="4" ry="2.5" fill="#60A5FA" opacity="0.6" />
        <ellipse cx="76" cy="56" rx="4" ry="2.5" fill="#60A5FA" opacity="0.6" />
      </svg>
    </div>
  );
};
