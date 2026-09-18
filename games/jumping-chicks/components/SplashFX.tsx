'use client';

import React from 'react';

/**
 * Fully animated water splash effect:
 * - Expanding oval ripple rings (staggered)
 * - Staggered upward droplet arcs that fade
 * - Central white burst flash
 */
export const SplashFX: React.FC = () => {
  return (
    <div className="relative pointer-events-none flex items-center justify-center select-none">
      <svg viewBox="0 0 120 100" className="w-28 h-20 overflow-visible">
        {/* ── Expanding ripple rings ── */}
        <ellipse
          cx="60" cy="62" rx="30" ry="10"
          fill="none"
          stroke="#5bd8f0"
          strokeWidth="2.5"
          className="animate-splash-ring-1"
        />
        <ellipse
          cx="60" cy="62" rx="20" ry="7"
          fill="none"
          stroke="#3ab8d8"
          strokeWidth="2"
          className="animate-splash-ring-2"
        />
        <ellipse
          cx="60" cy="62" rx="42" ry="14"
          fill="none"
          stroke="#5bd8f0"
          strokeWidth="1.5"
          opacity="0.6"
          className="animate-splash-ring-3"
        />

        {/* ── Central splash burst (white) ── */}
        <ellipse
          cx="60" cy="58" rx="10" ry="14"
          fill="rgba(255,255,255,0.75)"
          className="animate-splash-burst"
        />

        {/* ── Droplet arcs — each with individual animation delay ── */}
        {/* top-center */}
        <circle cx="60" cy="40" r="3.5" fill="#6ee6fa" className="animate-drop-0" />
        {/* top-left */}
        <circle cx="42" cy="32" r="3" fill="#4dcde8" className="animate-drop-1" />
        {/* top-right */}
        <circle cx="78" cy="32" r="3" fill="#4dcde8" className="animate-drop-2" />
        {/* left */}
        <circle cx="28" cy="50" r="2.5" fill="#3ab8d8" className="animate-drop-3" />
        {/* right */}
        <circle cx="92" cy="50" r="2.5" fill="#3ab8d8" className="animate-drop-4" />
        {/* inner-left */}
        <circle cx="48" cy="26" r="2" fill="#aaf0fc" className="animate-drop-5" />
        {/* inner-right */}
        <circle cx="72" cy="26" r="2" fill="#aaf0fc" className="animate-drop-6" />
      </svg>
    </div>
  );
};
