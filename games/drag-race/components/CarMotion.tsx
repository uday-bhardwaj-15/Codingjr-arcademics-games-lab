'use client';

import React, { useEffect, useRef } from 'react';
import { PlayerColor } from '../types';
import { OldDragCarSvg } from './OldDragCarSvg';
import { GapPill } from './GapPill';
import { calculateCarPosition } from '../engine/raceMath';

interface CarMotionProps {
  color: PlayerColor;
  name: string;
  isHuman?: boolean;
  lane: number;
  theirSteps: number;
  yourSteps: number;
  state?: 'idle' | 'boost' | 'sputter' | 'finished';
  isBoosting?: boolean;
  className?: string;
}

export const CarMotion: React.FC<CarMotionProps> = ({
  color = 'blue',
  name,
  isHuman = false,
  lane = 0,
  theirSteps = 0,
  yourSteps = 0,
  state = 'idle',
  isBoosting = false,
  className = '',
}) => {
  // Target perspective placement
  const placement = calculateCarPosition(lane, theirSteps, yourSteps, isHuman);

  // Smooth Y, X, scale, and opacity tracking (0.22s smoothing)
  const currentYRef = useRef<number>(placement.y);
  const currentScaleRef = useRef<number>(placement.scale);
  const currentXRef = useRef<number>(placement.x);
  const currentOpacityRef = useRef<number>(placement.opacity);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const smoothStep = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      // Exponential smoothing filter (~4.5 rate)
      const alpha = 1 - Math.exp(-dt * 4.5);

      currentYRef.current += (placement.y - currentYRef.current) * alpha;
      currentScaleRef.current += (placement.scale - currentScaleRef.current) * alpha;
      currentXRef.current += (placement.x - currentXRef.current) * alpha;
      currentOpacityRef.current += (placement.opacity - currentOpacityRef.current) * alpha;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(-50%, -60%, 0) scale(${currentScaleRef.current})`;
        containerRef.current.style.left = `${currentXRef.current}px`;
        containerRef.current.style.top = `${currentYRef.current}px`;
        containerRef.current.style.opacity = String(currentOpacityRef.current);
      }

      const diffY = Math.abs(placement.y - currentYRef.current);
      const diffScale = Math.abs(placement.scale - currentScaleRef.current);
      const diffX = Math.abs(placement.x - currentXRef.current);
      const diffOpacity = Math.abs(placement.opacity - currentOpacityRef.current);

      if (diffY > 0.1 || diffScale > 0.005 || diffX > 0.1 || diffOpacity > 0.01) {
        animId = requestAnimationFrame(smoothStep);
      }
    };

    animId = requestAnimationFrame(smoothStep);
    return () => cancelAnimationFrame(animId);
  }, [placement.x, placement.y, placement.scale, placement.opacity]);

  return (
    <div
      ref={containerRef}
      className={`absolute flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        left: `${placement.x}px`,
        top: `${placement.y}px`,
        transform: `translate3d(-50%, -60%, 0) scale(${placement.scale})`,
        opacity: placement.opacity,
        zIndex: isHuman ? 45 : Math.floor(40 + (1 - placement.p) * 10),
      }}
    >
      {/* Dynamic State Motion Wrapper */}
      <div
        className={`relative flex flex-col items-center ${
          state === 'idle'
            ? 'animate-[carIdleVibe_0.4s_ease-in-out_infinite_alternate]'
            : state === 'boost' || isBoosting
            ? 'animate-[carBoostLunge_0.5s_ease-out]'
            : state === 'sputter'
            ? 'animate-[carSputterWobble_0.3s_linear_infinite]'
            : state === 'finished'
            ? 'animate-[carCelebration_0.8s_ease-in-out_infinite]'
            : ''
        }`}
      >
        {/* Old Unedited Vector Dragster Art */}
        <OldDragCarSvg color={color} isBoosting={state === 'boost' || isBoosting} />

        {/* ── Name Pill & Gap Pill Underneath (Scales with car to avoid overlap) ── */}
        <div className="relative -mt-2 flex items-center gap-1.5 z-20">
          {/* Name Pill (Rounded capsule with gradient) */}
          <div
            className={`flex items-center justify-center px-3 py-1 rounded-full border shadow-md font-fredoka transition-all ${
              isHuman
                ? 'bg-gradient-to-b from-[#4da8ff] to-[#146de0] border-[#99d0ff] shadow-[0_0_16px_rgba(46,139,255,0.75)]'
                : color === 'yellow'
                ? 'bg-gradient-to-b from-[#ffd747] to-[#e69d00] border-[#ffe88a] shadow-[0_0_10px_rgba(255,198,26,0.45)]'
                : color === 'red'
                ? 'bg-gradient-to-b from-[#ff6b77] to-[#d42234] border-[#ffa3ab] shadow-[0_0_10px_rgba(240,58,71,0.45)]'
                : 'bg-gradient-to-b from-[#ffa347] to-[#e06809] border-[#ffcd8a] shadow-[0_0_10px_rgba(255,138,31,0.45)]'
            }`}
            style={{
              minWidth: '104px',
              height: '28px',
            }}
          >
            <span className="text-[14px] font-bold text-white tracking-wide truncate max-w-[100px] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.6)]">
              {name}
            </span>
          </div>

          {/* Gap Pill for Computer Bots */}
          {!isHuman && <GapPill gap={placement.gap} />}
        </div>
      </div>
    </div>
  );
};
