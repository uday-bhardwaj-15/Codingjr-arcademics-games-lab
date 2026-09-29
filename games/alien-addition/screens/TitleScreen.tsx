'use client';

import React from 'react';
import { ChevronButton } from '../components/ChevronButton';
import { UfoSvg } from '../components/Ufo';
import { soundManager } from '@/core/audio/soundManager';

interface TitleScreenProps {
  onPlay: () => void;
}

export function TitleScreen({ onPlay }: TitleScreenProps) {
  const handlePlay = () => {
    soundManager.playClick();
    onPlay();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-8 select-none">
      {/* 1. Orange Ribbon Banner with Dark Maroon Text */}
      <div className="relative mt-6">
        <div
          className="bg-gradient-to-r from-[#F5A623] via-[#FFB71A] to-[#F5911B] px-14 py-4 shadow-2xl border-y-2 border-amber-300"
          style={{
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-wide text-[#4A0E0E] drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] flex items-center gap-1">
            <span>ALIEN ADDITION</span>
            <span className="text-base align-top font-bold">®</span>
          </h1>
        </div>
      </div>

      {/* 2. Floating Saucer Preview (4 + 2) using standard UfoSvg */}
      <div className="relative my-auto flex flex-col items-center animate-bounce duration-1000">
        <div className="w-40 sm:w-44 aspect-[180/100]">
          <UfoSvg a={4} b={2} color="red" />
        </div>
      </div>

      {/* 3. Big PLAY Chevron Button */}
      <div className="mb-6">
        <ChevronButton size="lg" onClick={handlePlay}>
          PLAY
        </ChevronButton>
      </div>

      {/* 4. Footer Copyright */}
      <div className="absolute bottom-4 left-8 text-xs text-white/50 font-bold tracking-wider">
        © 2026 Arcademics
      </div>
    </div>
  );
}
