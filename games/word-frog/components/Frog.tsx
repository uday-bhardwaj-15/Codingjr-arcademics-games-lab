import React from 'react';

interface FrogProps {
  promptWord: string;
  categoryLabel: string;
  status: 'idle' | 'shooting' | 'chewing' | 'miss';
  targetPosition?: { x: number; y: number } | null;
  tongueProgress?: number; // 0 to 1
  isWrongLocked?: boolean;
}

export const Frog: React.FC<FrogProps> = ({
  promptWord,
  categoryLabel,
  status = 'idle',
  targetPosition = null,
  tongueProgress = 0,
  isWrongLocked = false,
}) => {
  // Exact Geometric Center of Stage
  const frogCenterX = 505;
  const frogCenterY = 240;

  // Exact Visual Mouth Coordinate (inside frog face, above prompt word card)
  const mouthX = frogCenterX;
  const mouthY = 185;

  // Compute tongue tip position during shooting
  let tongueTipX = mouthX;
  let tongueTipY = mouthY;
  if (targetPosition && status === 'shooting') {
    tongueTipX = mouthX + (targetPosition.x - mouthX) * tongueProgress;
    tongueTipY = mouthY + (targetPosition.y - mouthY) * tongueProgress;
  }

  // Calculate eye look angle toward target fly
  let lookAngleDeg = 0;
  if (targetPosition) {
    lookAngleDeg = (Math.atan2(targetPosition.y - mouthY, targetPosition.x - mouthX) * 180) / Math.PI;
  }

  return (
    <>
      <style>{`
        @keyframes frogBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02, 0.98); }
        }
        @keyframes chewMouth {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
        .frog-idle {
          animation: frogBreath 3s ease-in-out infinite;
        }
        .frog-chew {
          animation: chewMouth 0.22s ease-in-out 4;
        }
      `}</style>

      {/* 1. Animated Elastic Pink Tongue / Laser Ray (Shoots strictly from Frog Mouth at 505, 185) */}
      {status === 'shooting' && targetPosition && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
          <defs>
            <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <radialGradient id="tongueTipGlow" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </radialGradient>
          </defs>

          {/* Glowing laser aura */}
          <line
            x1={mouthX}
            y1={mouthY}
            x2={tongueTipX}
            y2={tongueTipY}
            stroke="#fb7185"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Elastic curved tongue stroke */}
          <line
            x1={mouthX}
            y1={mouthY}
            x2={tongueTipX}
            y2={tongueTipY}
            stroke="url(#tongueGrad)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Inner tongue core line */}
          <line
            x1={mouthX}
            y1={mouthY}
            x2={tongueTipX}
            y2={tongueTipY}
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Sticky suction tip droplet */}
          <circle
            cx={tongueTipX}
            cy={tongueTipY}
            r="12"
            fill="url(#tongueTipGlow)"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="drop-shadow-lg"
          />
        </svg>
      )}

      {/* 2. Unified Centered Lily Pad & Frog Group (Anchored at exact center 505, 240) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-10 flex flex-col items-center justify-center w-[340px] h-[340px]"
        style={{ left: `${frogCenterX}px`, top: `${frogCenterY}px` }}
      >
        {/* A. Large Green Lily Pad Leaf (Centered in 340x340 box) */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
        >
          <defs>
            <radialGradient id="lilyPadGrad" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="65%" stopColor="#65a30d" />
              <stop offset="90%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#365314" />
            </radialGradient>
          </defs>

          {/* Main Leaf with V-cutout notch */}
          <path
            d="M 160 160 L 305 125 A 150 150 0 1 0 305 195 Z"
            fill="url(#lilyPadGrad)"
            stroke="#365314"
            strokeWidth="6"
          />

          {/* Radial leaf veins */}
          <path d="M 160 160 L 45 60" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 25 160" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 50 260" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 160 305" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 260 270" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 160 15" stroke="#bef264" strokeWidth="3" opacity="0.45" />
          <path d="M 160 160 L 260 45" stroke="#bef264" strokeWidth="3" opacity="0.45" />
        </svg>

        {/* B. Frog Character & Question Card Container */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center -mt-6 ${
            status === 'chewing' ? 'frog-chew' : 'frog-idle'
          } ${isWrongLocked ? 'animate-shake' : ''}`}
        >
          {/* Frog SVG Character */}
          <div className="relative w-44 h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible drop-shadow-lg">
              <defs>
                <linearGradient id="frogSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="55%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              {/* Back Legs Webbed Feet */}
              <ellipse cx="36" cy="118" rx="24" ry="13" fill="#15803d" stroke="#14532d" strokeWidth="2.5" transform="rotate(-20 36 118)" />
              <ellipse cx="164" cy="118" rx="24" ry="13" fill="#15803d" stroke="#14532d" strokeWidth="2.5" transform="rotate(20 164 118)" />

              {/* Main Frog Body */}
              <ellipse cx="100" cy="85" rx="68" ry="48" fill="url(#frogSkinGrad)" stroke="#14532d" strokeWidth="3.5" />

              {/* Spots on Skin */}
              <circle cx="65" cy="72" r="6.5" fill="#15803d" opacity="0.6" />
              <circle cx="135" cy="72" r="6.5" fill="#15803d" opacity="0.6" />
              <circle cx="80" cy="106" r="4.5" fill="#15803d" opacity="0.5" />
              <circle cx="120" cy="106" r="4.5" fill="#15803d" opacity="0.5" />

              {/* Big Expressive Frog Eyeballs */}
              {/* Left Eye */}
              <g transform="translate(68, 32)">
                <circle cx="0" cy="0" r="22" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx={Math.cos((lookAngleDeg * Math.PI) / 180) * 5} cy={Math.sin((lookAngleDeg * Math.PI) / 180) * 5} r="8" fill="#0f172a" />
                <circle cx={Math.cos((lookAngleDeg * Math.PI) / 180) * 5 - 2.5} cy={Math.sin((lookAngleDeg * Math.PI) / 180) * 5 - 2.5} r="2.8" fill="#ffffff" />
              </g>

              {/* Right Eye */}
              <g transform="translate(132, 32)">
                <circle cx="0" cy="0" r="22" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx={Math.cos((lookAngleDeg * Math.PI) / 180) * 5} cy={Math.sin((lookAngleDeg * Math.PI) / 180) * 5} r="8" fill="#0f172a" />
                <circle cx={Math.cos((lookAngleDeg * Math.PI) / 180) * 5 - 2.5} cy={Math.sin((lookAngleDeg * Math.PI) / 180) * 5 - 2.5} r="2.8" fill="#ffffff" />
              </g>

              {/* Cute Rosy Cheeks */}
              <ellipse cx="55" cy="76" rx="8" ry="5" fill="#f43f5e" opacity="0.5" />
              <ellipse cx="145" cy="76" rx="8" ry="5" fill="#f43f5e" opacity="0.5" />

              {/* Frog Mouth (Mouth Opening located at top-center of face) */}
              {status === 'shooting' ? (
                <ellipse cx="100" cy="62" rx="20" ry="14" fill="#881337" stroke="#14532d" strokeWidth="2.5" />
              ) : status === 'chewing' ? (
                <ellipse cx="100" cy="62" rx="14" ry="7" fill="#881337" stroke="#14532d" strokeWidth="2" />
              ) : (
                <path d="M 68 64 Q 100 84 132 64" fill="none" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
              )}
            </svg>
          </div>

          {/* C. Glossy Blue Question Prompt Card (Directly below frog mouth & chin) */}
          <div
            className="relative -mt-4 z-20 px-6 py-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[200px] pointer-events-auto overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a5fd0 0%, #0d3fb0 100%)',
              border: '3px solid #c8f5ff',
              boxShadow: '0 0 24px #8be8f7, 0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Top gloss highlight curve */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

            {/* Category Tag: ANTONYMS / SYNONYMS */}
            <span className="text-[11px] font-black text-[#bcd8ff] tracking-widest uppercase mb-0.5">
              {categoryLabel}
            </span>

            {/* Prompt Word */}
            <span className="text-2xl sm:text-3xl font-black text-white tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {promptWord}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

