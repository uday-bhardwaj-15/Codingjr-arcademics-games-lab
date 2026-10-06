import React from 'react';

interface FlyProps {
  word: string;
  keyNum: number;
  positionIndex: number;
  x: number;
  y: number;
  isEaten?: boolean;
  isBeingDragged?: boolean;
  dragProgress?: number; // 1 down to 0
  mouthPosition?: { x: number; y: number };
  isWrongHit?: boolean;
  isLocked?: boolean;
  isHighlighted?: boolean;
  isDull?: boolean;
  onClick: () => void;
}

export const Fly: React.FC<FlyProps> = ({
  word,
  keyNum,
  positionIndex,
  x,
  y,
  isEaten = false,
  isBeingDragged = false,
  dragProgress = 1,
  mouthPosition = { x: 505, y: 185 },
  isWrongHit = false,
  isLocked = false,
  isHighlighted = false,
  isDull = false,
  onClick,
}) => {
  // Stagger animation timing so each fly hovers uniquely
  const animDelay = (positionIndex * 0.35).toFixed(2);

  // If currently being dragged back along tongue into frog mouth (Cyan & Gold suction glow, NO RED)
  if (isBeingDragged) {
    const curX = mouthPosition.x + (x - mouthPosition.x) * dragProgress;
    const curY = mouthPosition.y + (y - mouthPosition.y) * dragProgress;
    const curScale = Math.max(0.15, 0.2 + 0.8 * dragProgress);
    const curRotate = (1 - dragProgress) * 60 * (positionIndex % 2 === 0 ? 1 : -1);

    return (
      <div
        className="absolute pointer-events-none select-none z-30 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${curX}px`,
          top: `${curY}px`,
          transform: `translate(-50%, -50%) scale(${curScale}) rotate(${curRotate}deg)`,
          opacity: Math.max(0.2, dragProgress),
          transition: 'none',
        }}
      >
        {/* Snatched Fly with Golden/Cyan Suction Glow */}
        <div className="relative w-20 h-14 flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full bg-cyan-400/50 animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-pulse" />
          <span className="text-2xl">🪰</span>
        </div>
        <div
          className="px-3 py-1 rounded-lg text-white font-black text-sm shadow-xl"
          style={{
            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
            border: '2px solid #bae6fd',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
          }}
        >
          {word}
        </div>
      </div>
    );
  }

  // If already eaten and swallowed
  if (isEaten) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes wingFlutter_${positionIndex} {
          0%, 100% { transform: scaleY(1) rotate(0deg); }
          50% { transform: scaleY(0.2) rotate(6deg); }
        }
        @keyframes flyFloat_${positionIndex} {
          0% {
            transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(-50%, -50%) translate(2.5px, -2.5px) rotate(0.8deg);
          }
          50% {
            transform: translate(-50%, -50%) translate(-2px, 2.5px) rotate(-0.8deg);
          }
          75% {
            transform: translate(-50%, -50%) translate(-2.5px, -1.5px) rotate(-1deg);
          }
          100% {
            transform: translate(-50%, -50%) translate(0px, 0px) rotate(0deg);
          }
        }
        @keyframes flySpawn {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.06);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes targetHighlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 3px #fde047, 0 0 26px rgba(250, 204, 21, 0.9), 0 8px 24px rgba(0,0,0,0.6);
            transform: scale(1.04);
          }
          50% {
            box-shadow: 0 0 0 5px #facc15, 0 0 38px rgba(250, 204, 21, 1), 0 10px 28px rgba(0,0,0,0.7);
            transform: scale(1.09);
          }
        }
        .fly-float-${positionIndex} {
          animation: flyFloat_${positionIndex} 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          animation-delay: ${animDelay}s;
        }
        .wing-flutter-${positionIndex} {
          animation: wingFlutter_${positionIndex} 0.11s ease-in-out infinite;
          transform-origin: center center;
        }
        .fly-spawn-anim {
          animation: flySpawn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .target-highlight-anim {
          animation: targetHighlightPulse 1.4s ease-in-out infinite;
        }
      `}</style>

      <div
        onClick={() => {
          if (!isLocked) onClick();
        }}
        className={`absolute z-20 select-none cursor-pointer flex flex-col items-center justify-center fly-float-${positionIndex} group transition-all duration-300 ${
          isDull
            ? 'opacity-30 grayscale-[70%] scale-95 pointer-events-auto'
            : isHighlighted
            ? 'z-40 scale-105'
            : isLocked
            ? 'cursor-not-allowed opacity-90'
            : 'hover:z-30'
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <div className={`flex flex-col items-center justify-center fly-spawn-anim transition-transform duration-200 ${
          !isHighlighted ? 'group-hover:scale-105 active:scale-95' : ''
        }`}>
          {/* Dragonfly SVG Art with Fluttering Wings (Neat and Compact) */}
          <div className="relative w-24 h-16 flex items-center justify-center pointer-events-none drop-shadow-md">
            <svg viewBox="0 0 160 110" className="w-full h-full overflow-visible">
              <defs>
                {/* Wing Translucent Cyan Gradient */}
                <linearGradient id={`wingGrad_${positionIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                </linearGradient>

                {/* Fly Body Gradient */}
                <linearGradient id="flyBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>

              {/* Left Wings */}
              <g className={`wing-flutter-${positionIndex}`}>
                {/* Top-Left Wing */}
                <ellipse
                  cx="50"
                  cy="32"
                  rx="36"
                  ry="11"
                  fill={`url(#wingGrad_${positionIndex})`}
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  transform="rotate(-28 50 32)"
                />
                <line x1="20" y1="20" x2="75" y2="46" stroke="#0369a1" strokeWidth="0.8" opacity="0.6" />

                {/* Bottom-Left Wing */}
                <ellipse
                  cx="52"
                  cy="68"
                  rx="34"
                  ry="10"
                  fill={`url(#wingGrad_${positionIndex})`}
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  transform="rotate(22 52 68)"
                />
                <line x1="22" y1="78" x2="75" y2="58" stroke="#0369a1" strokeWidth="0.8" opacity="0.6" />
              </g>

              {/* Right Wings */}
              <g className={`wing-flutter-${positionIndex}`}>
                {/* Top-Right Wing */}
                <ellipse
                  cx="110"
                  cy="32"
                  rx="36"
                  ry="11"
                  fill={`url(#wingGrad_${positionIndex})`}
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  transform="rotate(28 110 32)"
                />
                <line x1="140" y1="20" x2="85" y2="46" stroke="#0369a1" strokeWidth="0.8" opacity="0.6" />

                {/* Bottom-Right Wing */}
                <ellipse
                  cx="108"
                  cy="68"
                  rx="34"
                  ry="10"
                  fill={`url(#wingGrad_${positionIndex})`}
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  transform="rotate(-22 108 68)"
                />
                <line x1="138" y1="78" x2="85" y2="58" stroke="#0369a1" strokeWidth="0.8" opacity="0.6" />
              </g>

              {/* Dragonfly Head & Body */}
              {/* Long Abdomen Tail */}
              <ellipse cx="80" cy="55" rx="8" ry="32" fill="url(#flyBodyGrad)" stroke="#091428" strokeWidth="1.5" />
              {/* Segment Rings on Tail */}
              <line x1="74" y1="42" x2="86" y2="42" stroke="#64748b" strokeWidth="1.5" />
              <line x1="73" y1="52" x2="87" y2="52" stroke="#64748b" strokeWidth="1.5" />
              <line x1="74" y1="62" x2="86" y2="62" stroke="#64748b" strokeWidth="1.5" />
              <line x1="76" y1="72" x2="84" y2="72" stroke="#64748b" strokeWidth="1.5" />

              {/* Head */}
              <circle cx="80" cy="22" r="10" fill="#0f172a" stroke="#091428" strokeWidth="1.5" />
              {/* Big Shiny Eyes */}
              <circle cx="75" cy="19" r="4.5" fill="#38bdf8" />
              <circle cx="74" cy="18" r="1.5" fill="#ffffff" />
              <circle cx="85" cy="19" r="4.5" fill="#38bdf8" />
              <circle cx="84" cy="18" r="1.5" fill="#ffffff" />

              {/* Antennae */}
              <path d="M 76 13 Q 70 4 64 6" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 84 13 Q 90 4 96 6" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Glossy Blue Word Box Card */}
          <div
            className={`-mt-1 px-4 py-2 min-w-[130px] sm:min-w-[145px] max-w-[185px] rounded-xl flex items-center justify-center relative shadow-xl transition-all duration-200 overflow-visible ${
              isHighlighted
                ? 'target-highlight-anim'
                : isWrongHit
                ? 'animate-shake'
                : 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.7)] group-hover:border-cyan-200'
            }`}
            style={{
              background: isHighlighted
                ? 'linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)'
                : isWrongHit
                ? 'linear-gradient(180deg, #d97706 0%, #b45309 100%)'
                : 'linear-gradient(180deg, #2b7af0 0%, #114ec4 100%)',
              border: isHighlighted
                ? '3.5px solid #facc15'
                : isWrongHit
                ? '2.5px solid #fde68a'
                : '2.5px solid #c8f5ff',
              boxShadow: isHighlighted
                ? undefined // handled by keyframes
                : isWrongHit
                ? '0 0 22px rgba(245, 158, 11, 0.7), 0 6px 14px rgba(0,0,0,0.5)'
                : '0 0 16px rgba(100, 200, 255, 0.45), 0 6px 14px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top gloss highlight curve */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-xl pointer-events-none" />

            {/* Keyboard Shortcut Number Indicator */}
            <span className={`absolute top-1 left-2 text-[11px] font-black drop-shadow-sm ${
              isHighlighted ? 'text-amber-300' : 'text-[#bcd8ff]'
            }`}>
              {keyNum}.
            </span>

            {/* Word Label */}
            <span className="font-black text-lg sm:text-xl text-white tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pl-2">
              {word}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
