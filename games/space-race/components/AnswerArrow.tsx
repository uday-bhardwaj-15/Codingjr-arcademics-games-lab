'use client';

import React from 'react';
import { AnswerArrowItem } from '../types';

interface AnswerArrowProps {
  arrow: AnswerArrowItem;
  disabled?: boolean;
  onSelect: (lane: number) => void;
}

export function AnswerArrow({
  arrow,
  disabled = false,
  onSelect,
}: AnswerArrowProps) {
  const isSelectedCorrect = arrow.status === 'selected_correct';
  const isSelectedWrong = arrow.status === 'selected_wrong';
  const isExpired = arrow.status === 'expired';

  if (isExpired) return null;

  return (
    <div
      className="absolute z-30 select-none cursor-pointer transform-gpu"
      style={{
        transform: `translate3d(${arrow.x}px, ${arrow.y}px, 0) translate(-100%, -50%) scale(${arrow.blipScale || 1.0})`,
        width: '178px',
        height: '71px',
        willChange: 'transform',
        pointerEvents: disabled || isSelectedCorrect || isSelectedWrong ? 'none' : 'auto',
      }}
      onClick={() => onSelect(arrow.lane)}
    >
      <svg
        viewBox="0 0 180 75"
        className={`w-full h-full overflow-visible transition-transform duration-100 active:scale-95 ${
          isSelectedCorrect
            ? 'animate-ping'
            : isSelectedWrong
            ? 'opacity-60 grayscale'
            : 'hover:brightness-110'
        }`}
      >
        <defs>
          {/* Chevron Red/Orange Gradient */}
          <linearGradient id={`arrowGrad_${arrow.lane}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="35%" stopColor={arrow.isUrgent ? '#ea580c' : '#c2410c'} />
            <stop offset="100%" stopColor={arrow.isUrgent ? '#fbbf24' : '#f59e0b'} />
          </linearGradient>

          {/* Dark Red Glow Trail */}
          <linearGradient id={`glowTrail_${arrow.lane}`} x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor={arrow.isUrgent ? '#ea580c' : '#dc2626'} stopOpacity="0.85" />
            <stop offset="50%" stopColor="#991b1b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Red Glow Trail trailing to the left */}
        <path
          d="M 10 38 L -65 10 L -65 66 Z"
          fill={`url(#glowTrail_${arrow.lane})`}
        />

        {/* 2. Outer Chevron Body pointing right */}
        <path
          d="M 10 8 L 130 8 L 175 38 L 130 68 L 10 68 L 40 38 Z"
          fill={`url(#arrowGrad_${arrow.lane})`}
          stroke="#78350f"
          strokeWidth="3.5"
        />

        {/* 3. Inner White Accent Chevron Outline */}
        <path
          d="M 22 14 L 124 14 L 163 38 L 124 62 L 22 62 L 48 38 Z"
          fill="none"
          stroke={arrow.isUrgent ? '#fed7aa' : '#fef08a'}
          strokeWidth="2"
          opacity="0.85"
        />

        {/* 4. Dark Maroon Number Plate */}
        <rect
          x="35"
          y="15"
          width="85"
          height="46"
          rx="6"
          fill="#1c0a0a"
          stroke={arrow.isUrgent ? '#f97316' : '#991b1b'}
          strokeWidth="2"
        />

        {/* 5. Option Number Value */}
        <text
          x="77"
          y="48"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="36"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {arrow.value}
        </text>
      </svg>
    </div>
  );
}
