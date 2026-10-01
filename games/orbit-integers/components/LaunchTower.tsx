import React from 'react';

export const LaunchTower: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      className="absolute pointer-events-none select-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}px`, top: `${y}px`, zIndex: 5 }}
    >
      <svg viewBox="0 0 140 460" className="w-24 sm:w-28 h-auto overflow-visible drop-shadow-2xl">
        {/* Main White Vertical Tower Mast */}
        <rect
          x="35"
          y="15"
          width="26"
          height="420"
          rx="4"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="3"
        />

        {/* Steel Girders & Cross Bracing Pattern */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`translate(35, ${25 + i * 35})`}>
            <line x1="0" y1="0" x2="26" y2="35" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="26" y1="0" x2="0" y2="35" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="0" y1="0" x2="26" y2="0" stroke="#94a3b8" strokeWidth="2" />
          </g>
        ))}

        {/* 4 Docking Clamps / Extendable Arms matching [-114, -38, 38, 114] */}
        {[-114, -38, 38, 114].map((offset, i) => {
          const armY = 225 + offset;
          return (
            <g key={i} transform={`translate(61, ${armY})`}>
              {/* Clamp Hydraulic Arm */}
              <rect x="0" y="-6" width="24" height="12" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
              {/* Clamp Magnetic Pad */}
              <path d="M 24 -12 L 34 -8 L 34 8 L 24 12 Z" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
              {/* Status Light */}
              <circle cx="12" cy="0" r="2.5" fill="#22c55e" className="animate-pulse" />
            </g>
          );
        })}

        {/* Base Support Truss */}
        <polygon points="12,440 84,440 68,420 28,420" fill="#64748b" stroke="#334155" strokeWidth="2" />
        {/* Top Warning Beacon */}
        <circle cx="48" cy="10" r="6" fill="#ef4444" className="animate-ping" />
        <circle cx="48" cy="10" r="4" fill="#ef4444" />
      </svg>
    </div>
  );
};
