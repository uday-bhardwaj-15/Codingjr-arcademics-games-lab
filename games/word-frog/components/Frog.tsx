import React, { useState, useEffect } from 'react';

interface FrogProps {
  promptWord: string;
  categoryLabel: string;
  status: 'idle' | 'shooting' | 'retracting' | 'chewing' | 'miss';
  targetPosition?: { x: number; y: number } | null;
  mousePosition?: { x: number; y: number } | null;
  tongueProgress?: number; // 0 to 1
  isWrongLocked?: boolean;
}

export const Frog: React.FC<FrogProps> = ({
  promptWord,
  categoryLabel,
  status = 'idle',
  targetPosition = null,
  mousePosition = null,
  tongueProgress = 0,
  isWrongLocked = false,
}) => {
  // Stage Geometric Center
  const frogCenterX = 505;
  const frogCenterY = 240;

  // Mouth Coordinate
  const mouthX = frogCenterX;
  const mouthY = 185;

  // Eye Blinking State
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Compute tongue tip position
  let tongueTipX = mouthX;
  let tongueTipY = mouthY;
  const isShootingOrRetracting = (status === 'shooting' || status === 'retracting') && targetPosition;

  if (isShootingOrRetracting && targetPosition) {
    tongueTipX = mouthX + (targetPosition.x - mouthX) * tongueProgress;
    tongueTipY = mouthY + (targetPosition.y - mouthY) * tongueProgress;
  }

  // Calculate dynamic whip curve control point for curved bezier tongue
  const midX = (mouthX + tongueTipX) / 2;
  const midY = (mouthY + tongueTipY) / 2;
  const dx = tongueTipX - mouthX;
  const dy = tongueTipY - mouthY;
  const dist = Math.hypot(dx, dy) || 1;
  const perpX = -dy / dist;
  const perpY = dx / dist;
  // Natural whip arc amplitude based on progress sine wave
  const whipAmplitude = Math.sin(tongueProgress * Math.PI) * Math.min(22, dist * 0.08);
  const ctrlX = midX + perpX * whipAmplitude;
  const ctrlY = midY + perpY * whipAmplitude;

  // Calculate eye look angle: prioritizes active target fly, otherwise tracks live mouse cursor!
  let lookAngleDeg = 0;
  let lookDistance = 0;

  if (targetPosition) {
    lookAngleDeg = (Math.atan2(targetPosition.y - mouthY, targetPosition.x - mouthX) * 180) / Math.PI;
    lookDistance = 6.0;
  } else if (mousePosition) {
    const mDx = mousePosition.x - mouthX;
    const mDy = mousePosition.y - (mouthY - 20); // Track slightly above mouth (eye level)
    const mDist = Math.hypot(mDx, mDy);
    lookAngleDeg = (Math.atan2(mDy, mDx) * 180) / Math.PI;
    lookDistance = Math.min(6.5, Math.max(1.5, mDist * 0.022));
  }

  return (
    <>
      <style>{`
        @keyframes frogBreath {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.025, 0.975) translateY(1px);
          }
        }
        @keyframes throatPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08, 1.05);
          }
        }
        @keyframes chewMouth {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(0.4) translateY(-3px);
          }
        }
        @keyframes chewThroat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15, 1.12);
          }
        }
        @keyframes lilyFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(0.6deg);
          }
        }
        @keyframes waterRippleExpand {
          0% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.22);
            opacity: 0;
          }
        }
        @keyframes cardWordPop {
          0% {
            transform: scale(0.92);
            opacity: 0.7;
          }
          60% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes puzzleWobble {
          0%, 100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-5px) rotate(-2.5deg); }
          40% { transform: translateX(5px) rotate(2.5deg); }
          60% { transform: translateX(-3px) rotate(-1.5deg); }
          80% { transform: translateX(3px) rotate(1.5deg); }
        }
        .frog-idle {
          animation: frogBreath 2.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .frog-chew {
          animation: chewMouth 0.18s ease-in-out 4;
        }
        .throat-idle {
          animation: throatPulse 2.6s ease-in-out infinite;
          transform-origin: center 85px;
        }
        .throat-chew {
          animation: chewThroat 0.18s ease-in-out 4;
          transform-origin: center 85px;
        }
        .lily-float {
          animation: lilyFloat 4.2s ease-in-out infinite;
        }
        .water-ripple-1 {
          animation: waterRippleExpand 3.6s ease-out infinite;
        }
        .water-ripple-2 {
          animation: waterRippleExpand 3.6s ease-out infinite 1.8s;
        }
        .card-word-anim {
          animation: cardWordPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .puzzle-wobble-anim {
          animation: puzzleWobble 0.6s ease-in-out;
        }
      `}</style>

      {/* 1. Animated Elastic Bezier Pink Tongue Whip */}
      {isShootingOrRetracting && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
          <defs>
            <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>
            <radialGradient id="tongueTipGlow" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f472b6" />
              <stop offset="85%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#9d174d" />
            </radialGradient>
            <radialGradient id="impactBurstGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Luminous aura blur */}
          <path
            d={`M ${mouthX} ${mouthY} Q ${ctrlX} ${ctrlY} ${tongueTipX} ${tongueTipY}`}
            fill="none"
            stroke="#f472b6"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Elastic curved tongue body */}
          <path
            d={`M ${mouthX} ${mouthY} Q ${ctrlX} ${ctrlY} ${tongueTipX} ${tongueTipY}`}
            fill="none"
            stroke="url(#tongueGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Inner glossy highlight core */}
          <path
            d={`M ${mouthX} ${mouthY} Q ${ctrlX} ${ctrlY} ${tongueTipX} ${tongueTipY}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Sticky suction tip droplet */}
          <circle
            cx={tongueTipX}
            cy={tongueTipY}
            r="13"
            fill="url(#tongueTipGlow)"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="drop-shadow-lg"
          />

          {/* Impact starburst ring when near peak (Golden & Cyan sparkle, no red) */}
          {tongueProgress > 0.88 && (
            <circle
              cx={tongueTipX}
              cy={tongueTipY}
              r={18 + (tongueProgress - 0.88) * 80}
              fill="url(#impactBurstGrad)"
              stroke="#facc15"
              strokeWidth="2"
              opacity={1 - (tongueProgress - 0.88) * 6}
            />
          )}
        </svg>
      )}

      {/* 2. Unified Lily Pad & Frog Group */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-10 flex flex-col items-center justify-center w-[340px] h-[340px]"
        style={{ left: `${frogCenterX}px`, top: `${frogCenterY}px` }}
      >
        {/* Soft Water Ripples radiating beneath Lily Pad */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-[330px] h-[330px] rounded-full border-2 border-white/30 water-ripple-1" />
          <div className="w-[330px] h-[330px] rounded-full border-2 border-emerald-200/30 water-ripple-2" />
        </div>

        {/* Floating Lily Pad Leaf */}
        <div className="absolute inset-0 lily-float">
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full overflow-visible drop-shadow-[0_18px_36px_rgba(0,0,0,0.4)]"
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

            {/* Tiny Dew Drops on Leaf */}
            <circle cx="95" cy="115" r="4.5" fill="#ffffff" opacity="0.55" />
            <circle cx="215" cy="225" r="3.5" fill="#ffffff" opacity="0.5" />
          </svg>
        </div>

        {/* Frog Character & Question Card Container */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center -mt-6 transition-transform duration-200 ${
            status === 'chewing'
              ? 'frog-chew'
              : status === 'miss' || isWrongLocked
              ? 'puzzle-wobble-anim'
              : 'frog-idle'
          }`}
        >
          {/* Frog SVG Character */}
          <div className="relative w-44 h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible drop-shadow-xl">
              <defs>
                <linearGradient id="frogSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="55%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <radialGradient id="frogThroatGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="70%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </radialGradient>
              </defs>

              {/* Back Legs Webbed Feet */}
              <ellipse cx="36" cy="118" rx="24" ry="13" fill="#15803d" stroke="#14532d" strokeWidth="2.5" transform="rotate(-20 36 118)" />
              <ellipse cx="164" cy="118" rx="24" ry="13" fill="#15803d" stroke="#14532d" strokeWidth="2.5" transform="rotate(20 164 118)" />

              {/* Main Frog Body */}
              <ellipse cx="100" cy="85" rx="68" ry="48" fill="url(#frogSkinGrad)" stroke="#14532d" strokeWidth="3.5" />

              {/* Pulsing Throat (Gulp / Breathing) */}
              <ellipse
                cx="100"
                cy="85"
                rx="42"
                ry="28"
                fill="url(#frogThroatGrad)"
                opacity="0.8"
                className={status === 'chewing' ? 'throat-chew' : 'throat-idle'}
              />

              {/* Spots on Skin */}
              <circle cx="65" cy="72" r="6.5" fill="#15803d" opacity="0.6" />
              <circle cx="135" cy="72" r="6.5" fill="#15803d" opacity="0.6" />
              <circle cx="80" cy="106" r="4.5" fill="#15803d" opacity="0.5" />
              <circle cx="120" cy="106" r="4.5" fill="#15803d" opacity="0.5" />

              {/* Big Expressive Frog Eyes with Mouse Cursor Tracking */}
              {/* Left Eye */}
              <g transform="translate(68, 32)">
                <circle cx="0" cy="0" r="22" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

                {/* Left Pupil with Smooth Tracking */}
                {isBlinking ? (
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
                ) : status === 'miss' ? (
                  // Cartoon dizzy spiral/question eyes on miss (no harsh red)
                  <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="0" cy="0" r="5" fill="none" stroke="#6366f1" strokeWidth="2" />
                    <circle cx="0" cy="0" r="2" fill="#0f172a" />
                  </g>
                ) : (
                  <>
                    <circle
                      cx={Math.cos((lookAngleDeg * Math.PI) / 180) * lookDistance}
                      cy={Math.sin((lookAngleDeg * Math.PI) / 180) * lookDistance}
                      r="8"
                      fill="#0f172a"
                      style={{ transition: 'cx 0.05s ease-out, cy 0.05s ease-out' }}
                    />
                    <circle
                      cx={Math.cos((lookAngleDeg * Math.PI) / 180) * lookDistance - 2.5}
                      cy={Math.sin((lookAngleDeg * Math.PI) / 180) * lookDistance - 2.5}
                      r="2.8"
                      fill="#ffffff"
                      style={{ transition: 'cx 0.05s ease-out, cy 0.05s ease-out' }}
                    />
                  </>
                )}
              </g>

              {/* Right Eye */}
              <g transform="translate(132, 32)">
                <circle cx="0" cy="0" r="22" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

                {/* Right Pupil with Smooth Tracking */}
                {isBlinking ? (
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
                ) : status === 'miss' ? (
                  // Cartoon dizzy eyes on miss
                  <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="0" cy="0" r="5" fill="none" stroke="#6366f1" strokeWidth="2" />
                    <circle cx="0" cy="0" r="2" fill="#0f172a" />
                  </g>
                ) : (
                  <>
                    <circle
                      cx={Math.cos((lookAngleDeg * Math.PI) / 180) * lookDistance}
                      cy={Math.sin((lookAngleDeg * Math.PI) / 180) * lookDistance}
                      r="8"
                      fill="#0f172a"
                      style={{ transition: 'cx 0.05s ease-out, cy 0.05s ease-out' }}
                    />
                    <circle
                      cx={Math.cos((lookAngleDeg * Math.PI) / 180) * lookDistance - 2.5}
                      cy={Math.sin((lookAngleDeg * Math.PI) / 180) * lookDistance - 2.5}
                      r="2.8"
                      fill="#ffffff"
                      style={{ transition: 'cx 0.05s ease-out, cy 0.05s ease-out' }}
                    />
                  </>
                )}
              </g>

              {/* Cute Soft Rosy Cheeks */}
              <ellipse cx="55" cy="76" rx="8" ry="5" fill="#f472b6" opacity="0.45" />
              <ellipse cx="145" cy="76" rx="8" ry="5" fill="#f472b6" opacity="0.45" />

              {/* Frog Mouth */}
              {status === 'shooting' || status === 'retracting' ? (
                <ellipse cx="100" cy="62" rx="20" ry="14" fill="#831843" stroke="#14532d" strokeWidth="2.5" />
              ) : status === 'chewing' ? (
                <ellipse cx="100" cy="62" rx="14" ry="7" fill="#831843" stroke="#14532d" strokeWidth="2" />
              ) : status === 'miss' ? (
                // Cartoon curious wavy mouth on miss
                <path d="M 72 72 Q 100 58 128 72" fill="none" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
              ) : (
                <path d="M 68 64 Q 100 84 132 64" fill="none" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
              )}
            </svg>
          </div>

          {/* Glossy Blue Question Prompt Card */}
          <div
            key={promptWord}
            className="card-word-anim relative -mt-4 z-20 px-6 py-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[210px] pointer-events-auto overflow-hidden shadow-2xl transition-all duration-200"
            style={{
              background: 'linear-gradient(180deg, #1d64db 0%, #0d42b5 100%)',
              border: '3px solid #c8f5ff',
              boxShadow: '0 0 24px rgba(139, 232, 247, 0.6), 0 10px 28px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Top gloss highlight curve */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

            {/* Category Tag */}
            <span className="text-[11px] font-black text-[#bcd8ff] tracking-widest uppercase mb-0.5 drop-shadow-sm">
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
