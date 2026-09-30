import React, { useState } from 'react';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2 } from 'lucide-react';

interface NameScreenProps {
  initialName?: string;
  onNext: (name: string) => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({
  initialName = 'Player396',
  onNext,
}) => {
  const [name, setName] = useState(initialName);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onNext(name.trim() || 'Player396');
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

        {/* Main Arcade Frame (Exact Match to Screenshot 3) */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-xl flex items-center justify-center overflow-hidden border border-amber-300/60 bg-[#2f7d32]">
          {/* Diagonal Split Background: Top-Left Green Grass, Bottom-Right Dark Grey Track */}
          <div className="absolute inset-0 z-0">
            <svg
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {/* Green Top-Left Half */}
              <polygon points="0,0 1000,0 1000,600 0,600" fill="#2d7a31" />
              {/* Diagonal Asphalt Slice */}
              <polygon
                points="380,0 1000,0 1000,600 200,600"
                fill="#3f4854"
              />
              {/* White divider line */}
              <line
                x1="380"
                y1="0"
                x2="200"
                y2="600"
                stroke="#cbd5e1"
                strokeWidth="4"
              />
            </svg>
          </div>

          {/* Translucent Dark Grey Name Card (Centered) */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-md bg-black/75 backdrop-blur-md rounded-none sm:rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black italic text-white tracking-wide">
                Player Name
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
                Make up a fun and friendly name.
              </p>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={name}
              maxLength={16}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold text-lg sm:text-xl px-4 py-3 rounded-none outline-none shadow-inner border border-slate-300 focus:border-amber-500"
            />

            {/* Chevron NEXT Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="relative px-8 sm:px-12 py-3 bg-[#f59e0b] hover:bg-[#ea580c] active:scale-95 text-white font-black italic text-xl sm:text-2xl tracking-wider flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                style={{
                  clipPath: 'polygon(0% 0%, 86% 0%, 100% 50%, 86% 100%, 0% 100%)',
                  paddingRight: '2.5rem',
                }}
              >
                <span>NEXT</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
