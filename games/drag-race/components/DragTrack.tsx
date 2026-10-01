'use client';

import React from 'react';

interface DragTrackProps {
  children?: React.ReactNode;
  isRacing?: boolean;
}

export const DragTrack: React.FC<DragTrackProps> = ({ children, isRacing = true }) => {
  // 8 Dash segments for flowing perspective road lines
  const dashCount = 8;
  const dashDelays = [-0, -0.3, -0.6, -0.9, -1.2, -1.5, -1.8, -2.1];

  return (
    <div className="relative w-[1010px] h-[577px] overflow-hidden select-none bg-[#7EC8FF] font-sans">
      {/* ── LAYER 1: Sky Gradient & Drifting Fluffy Clouds ── */}
      <div
        className="absolute inset-0 h-[220px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #6BC0FF 0%, #BFE7FF 70%, #E2F5FF 100%)',
        }}
      >
        {/* Cloud 1 (Large) */}
        <div
          className="absolute top-3 w-40 h-16 pointer-events-none opacity-90"
          style={{
            animation: isRacing ? 'cloudDrift 75s linear infinite -10s' : 'none',
            left: '-160px',
          }}
        >
          <svg viewBox="0 0 160 70" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="50" cy="45" rx="35" ry="20" />
            <ellipse cx="85" cy="35" rx="38" ry="26" />
            <ellipse cx="120" cy="45" rx="30" ry="18" />
            <rect x="25" y="42" width="105" height="22" rx="10" />
          </svg>
        </div>

        {/* Cloud 2 (Medium) */}
        <div
          className="absolute top-10 w-32 h-14 pointer-events-none opacity-85"
          style={{
            animation: isRacing ? 'cloudDrift 85s linear infinite -45s' : 'none',
            left: '-160px',
          }}
        >
          <svg viewBox="0 0 140 60" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="40" cy="38" rx="28" ry="18" />
            <ellipse cx="75" cy="30" rx="32" ry="22" />
            <ellipse cx="105" cy="38" rx="24" ry="16" />
            <rect x="20" y="36" width="90" height="18" rx="8" />
          </svg>
        </div>

        {/* Cloud 3 (Right Small) */}
        <div
          className="absolute top-6 w-28 h-12 pointer-events-none opacity-80"
          style={{
            animation: isRacing ? 'cloudDrift 65s linear infinite -28s' : 'none',
            left: '-160px',
          }}
        >
          <svg viewBox="0 0 120 50" className="w-full h-full fill-white drop-shadow-sm">
            <ellipse cx="35" cy="32" rx="24" ry="14" />
            <ellipse cx="65" cy="24" rx="28" ry="18" />
            <ellipse cx="90" cy="32" rx="20" ry="12" />
            <rect x="18" y="28" width="75" height="16" rx="8" />
          </svg>
        </div>
      </div>

      {/* ── LAYER 2: Mountains & Lake ── */}
      <div className="absolute top-[35px] inset-x-0 h-[100px] pointer-events-none">
        <svg
          viewBox="0 0 1010 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Back Mountain Blue Gradient */}
            <linearGradient id="backMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#75A6E8" />
              <stop offset="100%" stopColor="#5B8DCB" />
            </linearGradient>

            {/* Front Mountain Blue Gradient */}
            <linearGradient id="frontMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8EB6EE" />
              <stop offset="60%" stopColor="#6E9BD8" />
              <stop offset="100%" stopColor="#5584C2" />
            </linearGradient>

            {/* Turquoise Lake Gradient */}
            <linearGradient id="lakeWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4FB6E8" />
              <stop offset="50%" stopColor="#6ED0F2" />
              <stop offset="100%" stopColor="#8ED8F5" />
            </linearGradient>
          </defs>

          {/* 1. Back Mountain Peaks */}
          <path
            d="M 0 65 Q 120 20 250 48 Q 380 15 505 50 Q 620 18 760 45 Q 890 10 1010 60 L 1010 100 L 0 100 Z"
            fill="url(#backMtnGrad)"
            opacity="0.75"
          />

          {/* 2. Front Mountain Peaks */}
          <path
            d="M 0 72 Q 180 32 340 60 Q 480 30 640 64 Q 820 28 1010 68 L 1010 100 L 0 100 Z"
            fill="url(#frontMtnGrad)"
          />

          {/* 3. Green Foothills */}
          <path
            d="M 0 78 Q 200 62 420 76 Q 600 60 820 74 Q 930 66 1010 76 L 1010 100 L 0 100 Z"
            fill="#5FA840"
            opacity="0.85"
          />

          {/* 4. Turquoise Lake Band (y ≈ 74 to 105) */}
          <rect x="0" y="74" width="1010" height="32" fill="url(#lakeWaterGrad)" />

          {/* Water Sparkle Glints */}
          <ellipse cx="220" cy="84" rx="28" ry="1.5" fill="#FFFFFF" opacity="0.7" />
          <ellipse cx="380" cy="80" rx="35" ry="1.8" fill="#FFFFFF" opacity="0.85" />
          <ellipse cx="610" cy="86" rx="40" ry="1.5" fill="#FFFFFF" opacity="0.7" />
          <ellipse cx="780" cy="81" rx="30" ry="1.6" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="910" cy="85" rx="22" ry="1.4" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </div>

      {/* ── LAYER 3: Rolling Green Hills, Trees, Fence, Rocks & Flowers ── */}
      <div className="absolute top-[88px] inset-x-0 bottom-0 pointer-events-none">
        <svg
          viewBox="0 0 1010 490"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Lush Hill Grass Gradient */}
            <linearGradient id="hillGrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7CD450" />
              <stop offset="40%" stopColor="#5DBE35" />
              <stop offset="100%" stopColor="#3C9E26" />
            </linearGradient>

            {/* Tree Canopy Radial */}
            <radialGradient id="treeCanopy1" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#8BE65E" />
              <stop offset="50%" stopColor="#48B832" />
              <stop offset="100%" stopColor="#256B1A" />
            </radialGradient>
          </defs>

          {/* 1. Rolling Hillside Base Lawns */}
          <rect x="0" y="0" width="1010" height="490" fill="url(#hillGrassGrad)" />

          {/* 2. Left Side Clustered Trees & Bushes */}
          {/* Top-Left Distant Tree */}
          <g transform="translate(45, 8)">
            <rect x="18" y="24" width="8" height="22" rx="2" fill="#784218" />
            <circle cx="22" cy="18" r="18" fill="url(#treeCanopy1)" />
          </g>
          {/* Left Large Bushy Tree */}
          <g transform="translate(10, -4)">
            <rect x="28" y="36" width="12" height="32" rx="3" fill="#6B3A14" />
            <circle cx="34" cy="26" r="28" fill="url(#treeCanopy1)" />
            <circle cx="20" cy="34" r="20" fill="url(#treeCanopy1)" />
            <circle cx="48" cy="32" r="22" fill="url(#treeCanopy1)" />
          </g>
          {/* Mid-Left Bush */}
          <circle cx="120" cy="46" r="18" fill="#4CAF38" />
          <circle cx="140" cy="52" r="14" fill="#66BB48" />

          {/* 3. Right Side Trees */}
          <g transform="translate(860, 4)">
            <rect x="36" y="32" width="12" height="28" rx="3" fill="#6B3A14" />
            <circle cx="42" cy="22" r="26" fill="url(#treeCanopy1)" />
            <circle cx="22" cy="30" r="18" fill="url(#treeCanopy1)" />
            <circle cx="62" cy="28" r="20" fill="url(#treeCanopy1)" />
          </g>
          <g transform="translate(940, -8)">
            <rect x="22" y="38" width="10" height="34" rx="2" fill="#784218" />
            <circle cx="27" cy="24" r="24" fill="url(#treeCanopy1)" />
          </g>

          {/* 4. Right Side Brown Wooden Farm Fence (Matching Image) */}
          <g transform="translate(830, 22)">
            {/* Fence Post 1 */}
            <rect x="0" y="8" width="10" height="38" rx="2" fill="#9A6431" stroke="#663E18" strokeWidth="1.5" />
            {/* Fence Post 2 */}
            <rect x="55" y="16" width="11" height="44" rx="2" fill="#9A6431" stroke="#663E18" strokeWidth="1.5" />
            {/* Fence Post 3 */}
            <rect x="120" y="24" width="12" height="50" rx="2" fill="#9A6431" stroke="#663E18" strokeWidth="1.5" />
            {/* Horizontal Rails */}
            <polygon points="-5,16 135,32 135,38 -5,22" fill="#B2783E" stroke="#663E18" strokeWidth="1.2" />
            <polygon points="-5,28 135,46 135,54 -5,36" fill="#A46D37" stroke="#663E18" strokeWidth="1.2" />
          </g>

          {/* 5. Smooth Grey Rocks on Grass */}
          {/* Left Rock */}
          <g transform="translate(200, 48)">
            <ellipse cx="14" cy="10" rx="14" ry="9" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
            <ellipse cx="10" cy="7" rx="7" ry="3.5" fill="#E2E8F0" opacity="0.8" />
          </g>
          {/* Right Rocks */}
          <g transform="translate(760, 44)">
            <ellipse cx="16" cy="12" rx="16" ry="10" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
            <ellipse cx="12" cy="8" rx="9" ry="4" fill="#E2E8F0" opacity="0.85" />
            <ellipse cx="32" cy="15" rx="10" ry="7" fill="#64748B" stroke="#334155" strokeWidth="1" />
          </g>
          <g transform="translate(870, 78)">
            <ellipse cx="22" cy="14" rx="20" ry="13" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <ellipse cx="16" cy="9" rx="11" ry="5" fill="#CBD5E1" opacity="0.9" />
          </g>

          {/* 6. Scattered Little Flowers on Grass (Daisies, Pink, Yellow) */}
          {/* Left Grass Flowers */}
          <g transform="translate(75, 70)">
            <circle cx="0" cy="0" r="3" fill="#FFD700" />
            <circle cx="0" cy="-4" r="2.5" fill="#FFFFFF" />
            <circle cx="4" cy="0" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="4" r="2.5" fill="#FFFFFF" />
            <circle cx="-4" cy="0" r="2.5" fill="#FFFFFF" />
          </g>
          <g transform="translate(115, 88)">
            <circle cx="0" cy="0" r="3" fill="#FFD700" />
            <circle cx="0" cy="-4" r="2.5" fill="#FFFFFF" />
            <circle cx="4" cy="0" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="4" r="2.5" fill="#FFFFFF" />
            <circle cx="-4" cy="0" r="2.5" fill="#FFFFFF" />
          </g>
          <g transform="translate(42, 110)">
            <circle cx="0" cy="0" r="3" fill="#FFD700" />
            <circle cx="0" cy="-4" r="2.5" fill="#FFFFFF" />
            <circle cx="4" cy="0" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="4" r="2.5" fill="#FFFFFF" />
            <circle cx="-4" cy="0" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Right Grass Flowers */}
          <g transform="translate(830, 85)">
            <circle cx="0" cy="0" r="2.5" fill="#FF9E00" />
            <circle cx="0" cy="-3.5" r="2.5" fill="#FFE55C" />
            <circle cx="3.5" cy="0" r="2.5" fill="#FFE55C" />
            <circle cx="0" cy="3.5" r="2.5" fill="#FFE55C" />
            <circle cx="-3.5" cy="0" r="2.5" fill="#FFE55C" />
          </g>
          <g transform="translate(920, 115)">
            <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="-3.5" r="2.5" fill="#FF85A2" />
            <circle cx="3.5" cy="0" r="2.5" fill="#FF85A2" />
            <circle cx="0" cy="3.5" r="2.5" fill="#FF85A2" />
            <circle cx="-3.5" cy="0" r="2.5" fill="#FF85A2" />
          </g>
        </svg>
      </div>

      {/* ── LAYER 4: Wide Perspective Asphalt Highway (Exact Match to Mock) ── */}
      <svg
        viewBox="0 0 1010 577"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          {/* Smooth Asphalt Perspective Gradient */}
          <linearGradient id="perspectiveRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8E9AAE" />
            <stop offset="30%" stopColor="#717E94" />
            <stop offset="70%" stopColor="#5C687D" />
            <stop offset="100%" stopColor="#4D586B" />
          </linearGradient>

          {/* Road Edge Curb Gradient */}
          <linearGradient id="roadCurbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B8C4D8" />
            <stop offset="100%" stopColor="#8A96AA" />
          </linearGradient>
        </defs>

        {/* 1. Road Concrete Curb Shoulders (Trapezoid from horizon x:430 to 580 down to x:-20 to 1030) */}
        <polygon
          points="435,102 575,102 1030,577 -20,577"
          fill="url(#roadCurbGrad)"
        />

        {/* 2. Main Asphalt Road Bed (Horizon top at y=105 from x=442 to x=568, Bottom at y=577 from x=0 to x=1010) */}
        <polygon
          points="442,105 568,105 1010,577 0,577"
          fill="url(#perspectiveRoadGrad)"
        />

        {/* 3. Solid White Outer Edge Boundary Lines */}
        <polygon points="441,105 447,105 28,577 14,577" fill="#FFFFFF" opacity="0.95" />
        <polygon points="563,105 569,105 996,577 982,577" fill="#FFFFFF" opacity="0.95" />
      </svg>

      {/* ── Perspective Flowing Center Dashed Road Lines ── */}
      <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-4 bottom-0 pointer-events-none overflow-hidden">
        {isRacing ? (
          dashDelays.map((del, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-3.5 h-12 bg-white rounded-xs opacity-90"
              style={{
                animation: `roadDashFlow 2.4s linear infinite ${del}s`,
                transformOrigin: 'top center',
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="w-1.5 h-6 bg-white opacity-80" />
            <div className="w-2 h-10 bg-white opacity-85" />
            <div className="w-3 h-14 bg-white opacity-90" />
            <div className="w-3.5 h-20 bg-white opacity-95" />
          </div>
        )}
      </div>

      {/* ── CHILDREN LAYER (Cars, Sign, Progress Rail, Foreground Foliage, Question Panel) ── */}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
};
