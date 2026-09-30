import React from 'react';
import { DragCarAvatar } from './DragCarAvatar';
import { DragTree } from './DragTree';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2 } from 'lucide-react';

interface TitleScreenProps {
  onPlay: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onPlay }) => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleStartPlay = () => {
    soundManager.playClick();
    onPlay();
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-4 sm:p-8 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Title Bar */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">
              Drag Race Division
            </h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">
              Math Games, Division Games
            </p>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#c2580b] hover:bg-amber-200/50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* Main Arcade Frame (Exact Match to Screenshot 4) */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-xl flex flex-col justify-between overflow-hidden border border-amber-300/60 bg-[#4b58b8]">
          {/* 1. Sky & Horizon */}
          <div className="absolute top-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#3a47a7] to-[#5865c8] z-0" />

          {/* 2. Side Grass Lawns */}
          <div className="absolute top-[26%] bottom-0 left-0 right-0 bg-[#169d3e] z-0" />

          {/* 3. Horizon Bushes */}
          <svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="absolute top-[24%] left-0 right-0 w-full h-8 z-0 text-[#297843]"
          >
            <path
              d="M 0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40 T 900 40 T 1000 40 L 1000 60 L 0 60 Z"
              fill="#3b8852"
            />
          </svg>

          {/* 4. Trees on Left and Right Lawns */}
          <div className="absolute top-[28%] left-[8%] w-14 sm:w-18 h-auto z-0 pointer-events-none drop-shadow-md">
            <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
              <rect x="44" y="65" width="12" height="60" rx="3" fill="#854d0e" />
              <circle cx="50" cy="45" r="35" fill="#4ade80" />
              <circle cx="35" cy="35" r="25" fill="#86efac" />
              <circle cx="65" cy="40" r="26" fill="#22c55e" />
            </svg>
          </div>

          <div className="absolute top-[28%] right-[8%] w-14 sm:w-18 h-auto z-0 pointer-events-none drop-shadow-md">
            <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
              <rect x="44" y="65" width="12" height="60" rx="3" fill="#854d0e" />
              <circle cx="50" cy="45" r="35" fill="#4ade80" />
              <circle cx="35" cy="35" r="25" fill="#86efac" />
              <circle cx="65" cy="40" r="26" fill="#22c55e" />
            </svg>
          </div>

          {/* 5. Perspective Highway */}
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full z-1 pointer-events-none"
          >
            <polygon points="400,160 600,160 960,600 40,600" fill="#4b5563" />
            <polygon points="398,160 403,160 52,600 40,600" fill="#ffffff" />
            <polygon points="597,160 602,160 960,600 948,600" fill="#ffffff" />
            <line x1="500" y1="160" x2="500" y2="600" stroke="#ffffff" strokeWidth="12" strokeDasharray="40 30" />
          </svg>

          {/* 6. Starting Christmas Tree in Center */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-10 scale-90 sm:scale-105 pointer-events-none">
            <DragTree stage="green" />
          </div>

          {/* 7. Yellow Header Title Banner (DRAG RACE DIVISION) */}
          <div className="relative z-20 pt-6 sm:pt-8 flex flex-col items-center justify-center">
            {/* Yellow Ribbon */}
            <div className="relative bg-[#facc15] px-10 sm:px-16 py-2.5 sm:py-3 shadow-2xl border-y-4 border-[#ca8a04]">
              {/* Ribbon Left/Right swallow tails */}
              <div
                className="absolute -left-6 top-0 bottom-0 w-6 bg-[#eab308]"
                style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }}
              />
              <div
                className="absolute -right-6 top-0 bottom-0 w-6 bg-[#eab308]"
                style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
              />
              <h2 className="text-3xl sm:text-5xl font-black text-[#1e3a8a] tracking-wider italic drop-shadow-sm">
                DRAG RACE <span className="text-base sm:text-xl align-super">©</span>
              </h2>
            </div>

            {/* Subtitle: DIVISION with speed wing bars */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex flex-col gap-1">
                <div className="w-6 h-0.5 bg-white shadow-xs" />
                <div className="w-4 h-0.5 bg-white shadow-xs self-end" />
                <div className="w-2 h-0.5 bg-white shadow-xs self-end" />
              </div>
              <span className="text-2xl sm:text-3xl font-black italic tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                DIVISION
              </span>
              <div className="flex flex-col gap-1">
                <div className="w-6 h-0.5 bg-white shadow-xs" />
                <div className="w-4 h-0.5 bg-white shadow-xs" />
                <div className="w-2 h-0.5 bg-white shadow-xs" />
              </div>
            </div>
          </div>

          {/* 8. Smiling Pink and Purple Drag Cars facing forward */}
          <div className="relative z-20 flex items-end justify-between px-6 sm:px-14 pb-8 sm:pb-10 flex-1">
            {/* Pink Smiling Car (Left) with smoke puff */}
            <div className="relative flex items-center justify-center">
              {/* Smoke puff cloud */}
              <div className="absolute -left-12 -top-10 w-36 h-36 opacity-70 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-200">
                  <circle cx="50" cy="50" r="30" />
                  <circle cx="30" cy="40" r="22" />
                  <circle cx="70" cy="45" r="24" />
                  <circle cx="45" cy="25" r="20" />
                </svg>
              </div>
              <div className="transform -rotate-6 scale-110 sm:scale-135">
                <DragCarAvatar color="pink" size="lg" eyesClosed={true} />
              </div>
            </div>

            {/* Center: Big Chevron PLAY Button */}
            <div className="flex flex-col items-center mb-2 z-30">
              <button
                onClick={handleStartPlay}
                className="relative px-12 sm:px-16 py-4 bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#f59e0b] hover:brightness-110 active:scale-95 text-white font-black italic text-2xl sm:text-3xl tracking-widest flex items-center justify-center shadow-2xl border-2 border-yellow-300 rounded-sm transition-transform cursor-pointer group"
                style={{
                  clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
                  paddingRight: '3.5rem',
                }}
              >
                <span>PLAY</span>
              </button>
            </div>

            {/* Purple Smiling Car (Right) */}
            <div className="relative transform rotate-6 scale-110 sm:scale-135">
              <DragCarAvatar color="purple" size="lg" eyesClosed={false} />
            </div>
          </div>

          {/* Footer inside canvas */}
          <div className="absolute bottom-2 left-4 text-xs font-bold text-white/80 drop-shadow z-20">
            © 2026 Arcademics
          </div>
        </div>
      </div>
    </div>
  );
};
