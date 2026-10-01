'use client';

import React from 'react';

export const ForegroundFoliage: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-25 overflow-hidden">
      {/* ── Bottom-Left Layered Pointed Leaves Cluster ── */}
      <div
        className="absolute -bottom-4 -left-6 w-60 h-48 pointer-events-none"
        style={{
          transformOrigin: 'bottom left',
          animation: 'foliageSwayLeft 6s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 240 190" className="w-full h-full overflow-visible drop-shadow-md">
          <defs>
            <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F380A" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Deep Base Layer (Green 1: #2E8B2E) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 1 */}
            <g transform="translate(40, 150) rotate(-45)">
              <ellipse cx="0" cy="-45" rx="22" ry="45" fill="#2E8B2E" />
              <line x1="0" y1="-85" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            {/* Leaf 2 */}
            <g transform="translate(100, 160) rotate(-20)">
              <ellipse cx="0" cy="-50" rx="24" ry="50" fill="#2E8B2E" />
              <line x1="0" y1="-95" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            {/* Leaf 3 */}
            <g transform="translate(150, 175) rotate(15)">
              <ellipse cx="0" cy="-45" rx="20" ry="45" fill="#2E8B2E" />
              <line x1="0" y1="-85" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          </g>

          {/* Mid Layer (Green 2: #4CB848) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 4 */}
            <g transform="translate(60, 155) rotate(-30)">
              <ellipse cx="0" cy="-44" rx="20" ry="44" fill="#4CB848" />
              <line x1="0" y1="-82" x2="0" y2="0" stroke="#A6F078" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            </g>
            {/* Leaf 5 */}
            <g transform="translate(115, 165) rotate(0)">
              <ellipse cx="0" cy="-48" rx="22" ry="48" fill="#4CB848" />
              <line x1="0" y1="-90" x2="0" y2="0" stroke="#A6F078" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            </g>
          </g>

          {/* Front Highlight Layer (Green 3: #8BE06A) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 6 */}
            <g transform="translate(85, 160) rotate(-15)">
              <ellipse cx="0" cy="-40" rx="18" ry="40" fill="#8BE06A" />
              <line x1="0" y1="-75" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
            {/* Leaf 7 */}
            <g transform="translate(30, 170) rotate(-55)">
              <ellipse cx="0" cy="-35" rx="16" ry="35" fill="#8BE06A" />
              <line x1="0" y1="-65" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── Bottom-Right Layered Pointed Leaves Cluster ── */}
      <div
        className="absolute -bottom-4 -right-6 w-60 h-48 pointer-events-none"
        style={{
          transformOrigin: 'bottom right',
          animation: 'foliageSwayRight 6.5s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 240 190" className="w-full h-full overflow-visible drop-shadow-md">
          {/* Deep Base Layer (Green 1: #2E8B2E) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 1 */}
            <g transform="translate(200, 150) rotate(45)">
              <ellipse cx="0" cy="-45" rx="22" ry="45" fill="#2E8B2E" />
              <line x1="0" y1="-85" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            {/* Leaf 2 */}
            <g transform="translate(140, 160) rotate(20)">
              <ellipse cx="0" cy="-50" rx="24" ry="50" fill="#2E8B2E" />
              <line x1="0" y1="-95" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
            {/* Leaf 3 */}
            <g transform="translate(90, 175) rotate(-15)">
              <ellipse cx="0" cy="-45" rx="20" ry="45" fill="#2E8B2E" />
              <line x1="0" y1="-85" x2="0" y2="0" stroke="#7ED957" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          </g>

          {/* Mid Layer (Green 2: #4CB848) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 4 */}
            <g transform="translate(180, 155) rotate(30)">
              <ellipse cx="0" cy="-44" rx="20" ry="44" fill="#4CB848" />
              <line x1="0" y1="-82" x2="0" y2="0" stroke="#A6F078" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            </g>
            {/* Leaf 5 */}
            <g transform="translate(125, 165) rotate(0)">
              <ellipse cx="0" cy="-48" rx="22" ry="48" fill="#4CB848" />
              <line x1="0" y1="-90" x2="0" y2="0" stroke="#A6F078" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            </g>
          </g>

          {/* Front Highlight Layer (Green 3: #8BE06A) */}
          <g filter="url(#leafShadow)">
            {/* Leaf 6 */}
            <g transform="translate(155, 160) rotate(15)">
              <ellipse cx="0" cy="-40" rx="18" ry="40" fill="#8BE06A" />
              <line x1="0" y1="-75" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
            {/* Leaf 7 */}
            <g transform="translate(210, 170) rotate(55)">
              <ellipse cx="0" cy="-35" rx="16" ry="35" fill="#8BE06A" />
              <line x1="0" y1="-65" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>

      <style jsx>{`
        @keyframes foliageSwayLeft {
          0% {
            transform: rotate(-1.5deg);
          }
          100% {
            transform: rotate(1.5deg);
          }
        }
        @keyframes foliageSwayRight {
          0% {
            transform: rotate(1.5deg);
          }
          100% {
            transform: rotate(-1.5deg);
          }
        }
      `}</style>
    </div>
  );
};
