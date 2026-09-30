import React from 'react';

interface DragTreeProps {
  stage: 'idle' | 'yellow1' | 'yellow2' | 'yellow3' | 'green';
  className?: string;
}

export const DragTree: React.FC<DragTreeProps> = ({ stage = 'idle', className = '' }) => {
  const isYellow1 = stage === 'yellow1' || stage === 'yellow2' || stage === 'yellow3' || stage === 'green';
  const isYellow2 = stage === 'yellow2' || stage === 'yellow3' || stage === 'green';
  const isYellow3 = stage === 'yellow3' || stage === 'green';
  const isGreen = stage === 'green';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 120 280" className="w-24 sm:w-28 h-auto drop-shadow-2xl overflow-visible">
        {/* Support Base & Ground Plate */}
        <polygon points="40,280 80,280 65,240 55,240" fill="#334155" />
        <rect x="52" y="30" width="16" height="230" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

        {/* Top Pre-Stage Header Bar */}
        <rect x="25" y="20" width="70" height="14" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <circle cx="42" cy="27" r="4.5" fill="#facc15" className="animate-pulse" />
        <circle cx="78" cy="27" r="4.5" fill="#facc15" className="animate-pulse" />

        {/* Amber Stage 1 Pair */}
        <g transform="translate(0, 48)">
          <line x1="30" y1="14" x2="90" y2="14" stroke="#475569" strokeWidth="4" />
          <circle cx="35" cy="14" r="12" fill={isYellow1 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow1 && <circle cx="35" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
          <circle cx="85" cy="14" r="12" fill={isYellow1 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow1 && <circle cx="85" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
        </g>

        {/* Amber Stage 2 Pair */}
        <g transform="translate(0, 92)">
          <line x1="30" y1="14" x2="90" y2="14" stroke="#475569" strokeWidth="4" />
          <circle cx="35" cy="14" r="12" fill={isYellow2 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow2 && <circle cx="35" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
          <circle cx="85" cy="14" r="12" fill={isYellow2 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow2 && <circle cx="85" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
        </g>

        {/* Amber Stage 3 Pair */}
        <g transform="translate(0, 136)">
          <line x1="30" y1="14" x2="90" y2="14" stroke="#475569" strokeWidth="4" />
          <circle cx="35" cy="14" r="12" fill={isYellow3 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow3 && <circle cx="35" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
          <circle cx="85" cy="14" r="12" fill={isYellow3 ? '#facc15' : '#78350f'} stroke="#0f172a" strokeWidth="2" />
          {isYellow3 && <circle cx="85" cy="14" r="18" fill="#facc15" opacity="0.4" className="animate-ping" />}
        </g>

        {/* Big Green GO Lights Pair */}
        <g transform="translate(0, 185)">
          <line x1="25" y1="16" x2="95" y2="16" stroke="#475569" strokeWidth="5" />
          <circle cx="35" cy="16" r="15" fill={isGreen ? '#22c55e' : '#064e3b'} stroke="#0f172a" strokeWidth="2.5" />
          {isGreen && <circle cx="35" cy="16" r="24" fill="#22c55e" opacity="0.5" className="animate-pulse" />}
          <circle cx="85" cy="16" r="15" fill={isGreen ? '#22c55e' : '#064e3b'} stroke="#0f172a" strokeWidth="2.5" />
          {isGreen && <circle cx="85" cy="16" r="24" fill="#22c55e" opacity="0.5" className="animate-pulse" />}
        </g>
      </svg>
    </div>
  );
};
