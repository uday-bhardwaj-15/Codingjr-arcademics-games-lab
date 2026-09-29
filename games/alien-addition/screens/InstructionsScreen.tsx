'use client';

import React, { useEffect } from 'react';
import { ChevronButton } from '../components/ChevronButton';
import { UfoSvg } from '../components/Ufo';
import { soundManager } from '@/core/audio/soundManager';
import { Hand } from 'lucide-react';

interface InstructionsScreenProps {
  onNext: () => void;
}

export function InstructionsScreen({ onNext }: InstructionsScreenProps) {
  const handleNext = () => {
    soundManager.playClick();
    onNext();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 select-none">
      {/* Translucent Black Modal Panel */}
      <div className="w-full max-w-2xl bg-black/70 backdrop-blur-md border border-white/15 rounded-xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between min-h-[360px]">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Instructions
          </h2>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            Drag your laser (or use the arrow keys) under a spaceship. Then press the SPACEBAR, or click the spaceship, to burst it.
          </p>

          {/* Controls Diagram */}
          <div className="pt-4 pb-2 grid grid-cols-3 gap-6 items-center justify-items-center">
            {/* 1. Drag / Move Keys */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-10 bg-[#1E222B] border-2 border-slate-500 rounded-sm flex items-center justify-center text-white font-black text-lg shadow-md">
                  ←
                </div>
                <div className="w-10 h-10 bg-[#1E222B] border-2 border-slate-500 rounded-sm flex items-center justify-center text-white font-black text-lg shadow-md">
                  →
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-300">
                <Hand className="w-3.5 h-3.5 text-amber-400" />
                <span>Drag / Move</span>
              </div>
            </div>

            {/* 2. Strike Keys (Up / Spacebar) */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-300">
                <span>Strike</span>
                <div className="w-6 h-6 bg-[#1E222B] border-2 border-slate-500 rounded-xs flex items-center justify-center text-white font-bold text-xs">
                  ↑
                </div>
              </div>

              <div className="px-4 py-1.5 bg-[#1E222B] border-2 border-slate-500 rounded-sm text-white font-black text-xs sm:text-sm tracking-wider shadow-md uppercase">
                SPACEBAR
              </div>
            </div>

            {/* 3. Mouse Click on Saucer using standard UfoSvg */}
            <div className="relative flex flex-col items-center">
              <div className="w-24 sm:w-28 aspect-[180/100]">
                <UfoSvg a={4} b={2} color="red" />
              </div>

              {/* White Mouse Cursor Icon */}
              <div className="absolute -bottom-1 -right-1">
                <svg className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z" stroke="#000000" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: NEXT Button */}
        <div className="flex justify-end pt-4">
          <ChevronButton onClick={handleNext}>
            NEXT
          </ChevronButton>
        </div>
      </div>
    </div>
  );
}
