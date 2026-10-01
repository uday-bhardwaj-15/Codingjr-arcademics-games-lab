import React from 'react';

interface FlyProps {
  word: string;
  keyNum: number;
  positionIndex: number;
  x: number;
  y: number;
  isEaten?: boolean;
  isWrongHit?: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export const Fly: React.FC<FlyProps> = ({
  word,
  keyNum,
  positionIndex,
  x,
  y,
  isEaten = false,
  isWrongHit = false,
  isLocked = false,
  onClick,
}) => {
  // Stagger animation timing so all 6 flies flutter slightly out of phase
  const animDelay = (positionIndex * 0.25).toFixed(2);

  if (isEaten) {
    return (
      <div
        className="absolute pointer-events-none select-none -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center animate-ping-once"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-300/80 animate-ping" />
        <span className="absolute text-emerald-300 font-black text-xs animate-bounce">
          ✨ Gulp!
        </span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes wingFlutter_${positionIndex} {
          0%, 100% { transform: scaleY(1) rotate(0deg); }
          50% { transform: scaleY(0.25) rotate(4deg); }
        }
        @keyframes flyBob_${positionIndex} {
          0%, 100% { transform: translate(-50%, -50%) translateY(-3px); }
          50% { transform: translate(-50%, -50%) translateY(3px); }
        }
        .fly-bob-${positionIndex} {
          animation: flyBob_${positionIndex} 2.4s ease-in-out infinite alternate;
          animation-delay: ${animDelay}s;
        }
        .wing-flutter-${positionIndex} {
          animation: wingFlutter_${positionIndex} 0.12s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      <div
        onClick={() => {
          if (!isLocked) onClick();
        }}
        className={`absolute z-20 select-none cursor-pointer flex flex-col items-center justify-center fly-bob-${positionIndex} transition-transform duration-150 active:scale-95 group ${
          isLocked ? 'cursor-not-allowed' : ''
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {/* Dragonfly SVG Art with Fluttering Wings */}
        <div className="relative w-28 h-20 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 160 110" className="w-full h-full overflow-visible drop-shadow-md">
            <defs>
              {/* Wing Translucent Cyan Gradient */}
              <linearGradient id={`wingGrad_${positionIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>

              {/* Fly Body Gradient */}
              <linearGradient id="flyBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
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
            <line x1="74" y1="42" x2="86" y2="42" stroke="#475569" strokeWidth="1.5" />
            <line x1="73" y1="52" x2="87" y2="52" stroke="#475569" strokeWidth="1.5" />
            <line x1="74" y1="62" x2="86" y2="62" stroke="#475569" strokeWidth="1.5" />
            <line x1="76" y1="72" x2="84" y2="72" stroke="#475569" strokeWidth="1.5" />

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

        {/* Glossy Blue Word Box Card (Matching Signature Game UI Style from Island Chase & Orbit Integers) */}
        <div
          className={`-mt-1 px-4 py-2 min-w-[135px] sm:min-w-[155px] max-w-[185px] rounded-xl flex items-center justify-center relative shadow-xl transition-all duration-150 overflow-hidden ${
            isWrongHit
              ? 'animate-shake'
              : 'group-hover:scale-105'
          }`}
          style={{
            background: isWrongHit
              ? 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)'
              : 'linear-gradient(180deg, #2f7ff5 0%, #1352cc 100%)',
            border: isWrongHit ? '2.5px solid #fca5a5' : '2.5px solid #c8f5ff',
            boxShadow: isWrongHit
              ? '0 0 20px #f43f5e, 0 6px 14px rgba(0,0,0,0.5)'
              : '0 0 16px rgba(100, 200, 255, 0.45), 0 6px 14px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top gloss highlight curve */}
          <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-xl pointer-events-none" />

          {/* Keyboard Shortcut Number Indicator */}
          <span className="absolute top-1 left-2 text-[11px] font-black text-[#bcd8ff] drop-shadow-sm">
            {keyNum}.
          </span>

          {/* Word Label */}
          <span className="font-black text-lg sm:text-xl text-white tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pl-2">
            {word}
          </span>
        </div>
      </div>
    </>
  );
};

