import React from 'react';

interface DragTrackProps {
  children?: React.ReactNode;
  isRacing?: boolean;
}

export const DragTrack: React.FC<DragTrackProps> = ({ children, isRacing = true }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#4b58b8]">
      {/* 1. Deep Blue Sky with Horizon Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[22%] bg-gradient-to-b from-[#3b47aa] to-[#5563c6] z-0" />

      {/* 2. Side Grass Lawns */}
      <div className="absolute top-[20%] bottom-0 left-0 right-0 bg-[#169d3e] z-0" />

      {/* 3. Horizon Bushes / Tree Line */}
      <svg
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        className="absolute top-[18%] left-0 right-0 w-full h-8 z-0 text-[#297843]"
      >
        <path
          d="M 0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40 T 900 40 T 1000 40 L 1000 60 L 0 60 Z"
          fill="#3b8852"
        />
        <path
          d="M 0 50 Q 40 25, 80 50 T 160 50 T 240 50 T 320 50 T 400 50 T 480 50 T 560 50 T 640 50 T 720 50 T 800 50 T 880 50 T 960 50 T 1000 50 L 1000 60 L 0 60 Z"
          fill="#2f6c41"
        />
      </svg>

      {/* 4. Moving Trees on Left & Right Grass Lawns (Gentle Parallax Scrolling) */}
      {/* Left Tree 1 */}
      <div
        className="absolute top-[20%] left-[3%] w-12 sm:w-16 h-auto z-0 pointer-events-none drop-shadow-md"
        style={isRacing ? { animation: 'grassTreeScroll 6.5s linear infinite' } : {}}
      >
        <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
          <rect x="44" y="65" width="12" height="60" rx="3" fill="#854d0e" />
          <circle cx="50" cy="45" r="35" fill="#4ade80" />
          <circle cx="35" cy="35" r="25" fill="#86efac" />
          <circle cx="65" cy="40" r="26" fill="#22c55e" />
        </svg>
      </div>

      {/* Right Tree 1 */}
      <div
        className="absolute top-[20%] right-[3%] w-12 sm:w-16 h-auto z-0 pointer-events-none drop-shadow-md"
        style={isRacing ? { animation: 'grassTreeScroll 6.0s linear infinite -1.8s' } : {}}
      >
        <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
          <rect x="44" y="65" width="12" height="60" rx="3" fill="#854d0e" />
          <circle cx="50" cy="45" r="35" fill="#4ade80" />
          <circle cx="35" cy="35" r="25" fill="#86efac" />
          <circle cx="65" cy="40" r="26" fill="#22c55e" />
        </svg>
      </div>

      {/* 5. Main WIDE Perspective Asphalt Highway (Exact Match to Image 1) */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-1 pointer-events-none"
      >
        <defs>
          <linearGradient id="asphaltRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#222832" />
            <stop offset="35%" stopColor="#313a47" />
            <stop offset="100%" stopColor="#3d4654" />
          </linearGradient>
        </defs>

        {/* Wide Asphalt Road Trapezoid (Horizon top at y=120 from x=220 to x=780, Bottom at y=600 from x=0 to x=1000) */}
        <polygon
          points="220,120 780,120 1000,600 0,600"
          fill="url(#asphaltRoadGrad)"
        />

        {/* Solid White Outer Road Shoulder Lines */}
        <polygon points="216,120 224,120 14,600 0,600" fill="#ffffff" />
        <polygon points="776,120 784,120 1000,600 986,600" fill="#ffffff" />

        {/* Single Center Dashed White Road Line */}
        <line
          x1="500"
          y1="120"
          x2="500"
          y2="600"
          stroke="#ffffff"
          strokeWidth="16"
          strokeDasharray="50 40"
          style={isRacing ? { animation: 'roadDashScroll 1.6s linear infinite' } : {}}
        />
      </svg>

      {/* 6. Children Layer (Racers, Tree, HUD) */}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
};
