'use client';

import React from 'react';

interface WakeTrailProps {
  active?: boolean;
  isSurging?: boolean;
}

export function WakeTrail({ active = true, isSurging = false }: WakeTrailProps) {
  if (!active) return null;

  return (
    <div
      className={`absolute right-[88%] top-1/2 -translate-y-1/2 w-44 h-16 pointer-events-none select-none overflow-visible transition-all duration-300 ${
        isSurging ? 'scale-x-130 scale-y-115 opacity-100' : 'opacity-95'
      }`}
    >
      <svg
        viewBox="0 0 170 60"
        className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(14,116,144,0.35)]"
      >
        <defs>
          {/* Main White Foam Gradient (Stern -> Tail) */}
          <linearGradient id="wakePlumeGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#e0f2fe" stopOpacity="0.55" />
            <stop offset="85%" stopColor="#bae6fd" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </linearGradient>

          {/* Jet Stream High Velocity Center Core */}
          <linearGradient id="jetCoreGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          {/* Water Displacement Shadow underneath wake */}
          <linearGradient id="waterDisplaceGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#0891b2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>

          {/* Outer Crest Wave Gradient */}
          <linearGradient id="crestLineGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#7dd3fc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Underlying Water Displacement Shadow (gives depth to the churned water) */}
        <path
          d="M 165 30 Q 110 16, 40 8 L 0 6 L 0 54 L 40 52 Q 110 44, 165 30 Z"
          fill="url(#waterDisplaceGrad)"
        />

        {/* 2. Expanding Hydrodynamic V-Shaped Foam Plume */}
        <path
          d="M 165 30 C 140 22, 90 14, 15 10 C 5 10, 0 14, 0 18 C 30 26, 30 34, 0 42 C 0 46, 5 50, 15 50 C 90 46, 140 38, 165 30 Z"
          fill="url(#wakePlumeGrad)"
        />

        {/* 3. Top Outer Curved Crest Wave Line */}
        <path
          d="M 165 26 C 130 18, 85 13, 0 12"
          fill="none"
          stroke="url(#crestLineGrad)"
          strokeWidth={isSurging ? '4' : '3'}
          strokeLinecap="round"
        />

        {/* 4. Bottom Outer Curved Crest Wave Line */}
        <path
          d="M 165 34 C 130 42, 85 47, 0 48"
          fill="none"
          stroke="url(#crestLineGrad)"
          strokeWidth={isSurging ? '4' : '3'}
          strokeLinecap="round"
        />

        {/* 5. Center High-Pressure Jet Core (Rooster tail stream) */}
        <path
          d="M 168 30 C 135 29, 90 28, 20 30"
          fill="none"
          stroke="url(#jetCoreGrad)"
          strokeWidth={isSurging ? '6.5' : '4.5'}
          strokeLinecap="round"
        />

        {/* 6. Inner Churning Foam Ribbons */}
        <path
          d="M 155 28 C 120 23, 75 22, 35 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 155 32 C 120 37, 75 38, 35 36"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 7. Natural Frothy Micro-Bubbles & Droplet Clusters (Graduating sizes from stern back) */}
        {/* Near nozzle dense clusters */}
        <circle cx="158" cy="27" r="3.2" fill="#ffffff" opacity="0.95" />
        <circle cx="152" cy="33" r="2.8" fill="#ffffff" opacity="0.9" />
        <circle cx="145" cy="28" r="3.5" fill="#ffffff" opacity="0.9" />
        <circle cx="138" cy="34" r="3.2" fill="#e0f2fe" opacity="0.85" />

        {/* Mid-wake dispersed bubbles */}
        <circle cx="120" cy="24" r="3.5" fill="#ffffff" opacity="0.8" />
        <circle cx="112" cy="36" r="3.8" fill="#ffffff" opacity="0.8" />
        <circle cx="95" cy="27" r="4.2" fill="#e0f2fe" opacity="0.75" />
        <circle cx="85" cy="35" r="3.6" fill="#e0f2fe" opacity="0.7" />
        <circle cx="72" cy="22" r="3.2" fill="#bae6fd" opacity="0.65" />
        <circle cx="65" cy="38" r="3.4" fill="#bae6fd" opacity="0.65" />

        {/* Tail dissipating micro droplets */}
        <circle cx="48" cy="26" r="2.8" fill="#bae6fd" opacity="0.5" />
        <circle cx="38" cy="35" r="2.5" fill="#7dd3fc" opacity="0.45" />
        <circle cx="22" cy="29" r="2.2" fill="#7dd3fc" opacity="0.35" />
        <circle cx="10" cy="33" r="1.8" fill="#38bdf8" opacity="0.25" />
      </svg>
    </div>
  );
}
