'use client';

import React from 'react';
import { ChevronButton } from './ChevronButton';

interface TryAgainOverlayProps {
  target: number;
  correctA: number;
  correctB: number;
  onTryAgain: () => void;
  onMenu: () => void;
}

export function TryAgainOverlay({
  target,
  correctA,
  correctB,
  onTryAgain,
  onMenu,
}: TryAgainOverlayProps) {
  const darkBtn =
    'bg-black px-6 py-3 text-base sm:text-lg font-black tracking-wide text-white hover:bg-zinc-900 border border-white/20 transition-colors cursor-pointer rounded-xs';

  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#140624]/90 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-5">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black italic tracking-wide text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
          Try Again!
        </h2>

        {/* Friendly explanation */}
        <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed max-w-sm">
          The aliens reached your laser! Add the numbers before they land.
        </p>

        {/* Revealed Answer Box */}
        <div className="w-full py-3.5 px-6 rounded-xl bg-purple-950/80 border border-purple-400/40 shadow-inner flex flex-col items-center justify-center space-y-1">
          <span className="text-xs uppercase font-extrabold text-purple-300 tracking-wider">
            Target Solution
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md">
            {correctA} + {correctB} = {target}
          </span>
        </div>

        {/* Buttons */}
        <div className="w-full pt-2 flex items-center justify-between gap-4">
          <button className={darkBtn} onClick={onMenu}>
            MAIN MENU
          </button>

          <ChevronButton size="lg" onClick={onTryAgain}>
            TRY AGAIN
          </ChevronButton>
        </div>
      </div>
    </div>
  );
}
