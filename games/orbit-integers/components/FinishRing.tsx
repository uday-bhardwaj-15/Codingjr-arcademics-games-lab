import React from 'react';

export const FinishRing: React.FC<{ x: number; y: number; angle: number }> = ({
  x,
  y,
  angle,
}) => {
  const deg = (angle * 180) / Math.PI;

  return (
    <div
      className="absolute pointer-events-none select-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
        zIndex: 6,
      }}
    >
      <svg viewBox="0 0 100 240" className="w-20 sm:w-24 h-auto overflow-visible drop-shadow-[0_0_25px_#38bdf8]">
        {/* Outer Ring Arc */}
        <ellipse cx="50" cy="120" rx="42" ry="110" fill="none" stroke="#38bdf8" strokeWidth="8" opacity="0.9" />
        {/* Inner Neon Core */}
        <ellipse cx="50" cy="120" rx="36" ry="100" fill="none" stroke="#ffffff" strokeWidth="3" />
        {/* Checkered Ring Nodes */}
        {[-90, -45, 0, 45, 90].map((dy, i) => (
          <g key={i} transform={`translate(50, ${120 + dy})`}>
            <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#ca8a04" strokeWidth="2" className="animate-pulse" />
          </g>
        ))}
      </svg>
    </div>
  );
};
