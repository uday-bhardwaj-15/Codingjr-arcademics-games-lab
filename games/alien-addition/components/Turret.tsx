'use client';

import React, { useEffect, useState } from 'react';

interface TurretProps {
  x: number; // design px (81 - 929)
  target: number;
  isFiring?: boolean;
  isFizzling?: boolean;
  isDragging?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export function Turret({
  x,
  target,
  isFiring = false,
  isFizzling = false,
  isDragging = false,
  onPointerDown,
}: TurretProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  // Animate target flip on target value update
  useEffect(() => {
    setIsFlipping(true);
    const t = setTimeout(() => setIsFlipping(false), 260);
    return () => clearTimeout(t);
  }, [target]);

  return (
    <>
      <style>{`
        .target-flip {
          animation: targetFlipAnim 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes targetFlipAnim {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
      `}</style>
      <div
        onPointerDown={onPointerDown}
        className={`absolute left-0 top-0 select-none pointer-events-auto touch-none z-25 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          transform: `translate3d(${x}px, 436px, 0) translate(-50%, 0)`,
          willChange: 'transform',
        }}
        title="Drag to aim laser"
      >
        <div className="flex flex-col items-center group">
          {/* 1. Glowing Yellow Energy Ball */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-6 h-6 rounded-full bg-[#FFD91A] border-2 border-yellow-100 shadow-[0_0_16px_#ffd91a] transition-all duration-100 ${
                isFiring ? 'scale-125 shadow-[0_0_26px_#38bdf8] bg-cyan-200' : ''
              }`}
            />

            {/* Fizzle effect when shooting at empty sky */}
            {isFizzling && (
              <div className="absolute inset-0 -top-2 flex items-center justify-center pointer-events-none">
                <span className="animate-ping inline-flex h-9 w-9 rounded-full bg-cyan-400/70" />
                <div className="absolute text-xs text-cyan-200 font-black -top-4">⚡</div>
              </div>
            )}
          </div>

          {/* 2. Turret Glass Bowl with Cyan Ring Layers */}
          <div className="relative w-18 h-12 -mt-1 flex flex-col items-center">
            <svg viewBox="0 0 60 45" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="turretBowlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Bowl shape */}
              <path
                d="M 6 10 C 6 36, 54 36, 54 10 C 48 8, 12 8, 6 10 Z"
                fill="url(#turretBowlGrad)"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />

              {/* Cyan glowing energy rings */}
              <ellipse cx="30" cy="16" rx="17" ry="3.5" fill="none" stroke="#3CC8D8" strokeWidth="2" opacity="0.9" />
              <ellipse cx="30" cy="23" rx="13" ry="3" fill="none" stroke="#3CC8D8" strokeWidth="2" opacity="0.8" />
              <ellipse cx="30" cy="29" rx="9" ry="2.5" fill="none" stroke="#3CC8D8" strokeWidth="2" opacity="0.7" />
            </svg>
          </div>

          {/* 3. Dark Target Number Display Box with flip animation */}
          <div
            className={`w-18 h-11 bg-[#282828] border-2 border-[#121212] rounded-xs shadow-2xl flex items-center justify-center -mt-2 group-hover:border-amber-400/70 transition-colors ${
              isFlipping ? 'target-flip' : ''
            }`}
          >
            <span className="text-2xl font-black text-white tracking-wider font-sans drop-shadow-sm">
              {target}
            </span>
          </div>

          {/* 4. Cyan Base Plate */}
          <div className="w-22 h-2.5 bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#0284C7] border-t border-cyan-200/60 rounded-xs shadow-md" />
        </div>
      </div>
    </>
  );
}
