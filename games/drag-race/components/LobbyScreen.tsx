import React, { useState } from 'react';
import { DragCarAvatar } from './DragCarAvatar';
import { PlayerColor } from '../types';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2 } from 'lucide-react';

interface LobbyScreenProps {
  playerName: string;
  playerColor?: PlayerColor;
  onStart: () => void;
  onLeave: () => void;
  onUpdateName?: (name: string) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  playerName,
  playerColor = 'blue',
  onStart,
  onLeave,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(playerName);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (onUpdateName && currentName.trim()) {
      onUpdateName(currentName.trim());
    }
  };

  const handleStartRace = () => {
    soundManager.playClick();
    soundManager.playCountdown(false);
    onStart();
  };

  const handleLeaveLobby = () => {
    soundManager.playClick();
    onLeave();
  };

  const roster: Array<{ name: string; color: PlayerColor; isHuman: boolean }> = [
    { name: currentName, color: playerColor, isHuman: true },
    { name: 'Computer 2', color: 'yellow', isHuman: false },
    { name: 'Computer 3', color: 'red', isHuman: false },
    { name: 'Computer 4', color: 'orange', isHuman: false },
  ];

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-4 sm:p-8 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Title Bar (Matches Screenshot 2) */}
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

        {/* Main Arcade Frame (Exact Match to Screenshot 2) */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-xl flex flex-col justify-between overflow-hidden border border-amber-300/60 bg-[#2d7a31]">
          {/* Diagonal Split Background */}
          <div className="absolute inset-0 z-0">
            <svg
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <polygon points="0,0 1000,0 1000,600 0,600" fill="#2d7a31" />
              <polygon points="380,0 1000,0 1000,600 200,600" fill="#3f4854" />
              <line x1="380" y1="0" x2="200" y2="600" stroke="#cbd5e1" strokeWidth="4" />
            </svg>
          </div>

          {/* Top Bar inside Canvas */}
          <div className="relative z-10 w-full flex items-center justify-between pl-6 sm:pl-8">
            {/* Left: Player Game Title (e.g. "Player396's Game") */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={currentName}
                  maxLength={16}
                  autoFocus
                  onBlur={handleNameBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
                  onChange={(e) => setCurrentName(e.target.value)}
                  className="text-2xl sm:text-4xl font-extrabold italic text-slate-900 bg-white/90 px-3 py-1 rounded shadow-inner outline-none"
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-2xl sm:text-4xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:underline flex items-center gap-2 text-left cursor-pointer"
                  title="Click to rename"
                >
                  <span>{currentName}&apos;s Game</span>
                </button>
              )}
            </div>

            {/* Right: Status box + START Chevron + LEAVE */}
            <div className="flex items-stretch bg-black/70 rounded-none shadow-md">
              {/* Ready status */}
              <div className="px-5 py-2.5 flex flex-col items-center justify-center text-white bg-black/80">
                <span className="text-lg sm:text-xl font-bold tracking-tight">0 / 1</span>
                <span className="text-[10px] sm:text-xs text-white/80 font-medium">players ready</span>
              </div>

              {/* Authentic Arcademics Angled Orange START button */}
              <div className="relative flex items-center">
                <button
                  onClick={handleStartRace}
                  className="relative px-7 sm:px-10 py-3 bg-[#ff9a00] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-lg sm:text-2xl flex items-center justify-center gap-1 shadow-md transition-transform cursor-pointer"
                  style={{
                    clipPath: 'polygon(0% 0%, 86% 0%, 100% 50%, 86% 100%, 0% 100%)',
                    paddingRight: '2.5rem',
                  }}
                >
                  <span>START</span>
                </button>
                {/* Dark Chevron Cap piece matching screenshot */}
                <div
                  className="w-4 h-full bg-[#2e431f] -ml-2"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)',
                  }}
                />
              </div>

              {/* Dark LEAVE button */}
              <button
                onClick={handleLeaveLobby}
                className="px-5 sm:px-8 py-3 bg-black hover:bg-zinc-900 text-white font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
              >
                LEAVE
              </button>
            </div>
          </div>

          {/* 4 Player Drag Cars Row (Matching Screenshot 2) */}
          <div className="relative z-10 flex-1 w-full grid grid-cols-4 items-center pb-6 sm:pb-8 px-4 sm:px-8 gap-4 sm:gap-6">
            {roster.map((p) => {
              return (
                <div
                  key={p.name}
                  className={`relative flex flex-col items-center justify-center transition-all ${
                    p.isHuman
                      ? 'h-[290px] sm:h-[330px] bg-black/40 shadow-2xl backdrop-blur-xs rounded-none border border-white/10 py-6'
                      : 'h-[290px] sm:h-[330px] py-6'
                  }`}
                >
                  {/* Avatar Sprite */}
                  <div
                    className={`transform-gpu transition-transform hover:scale-105 flex items-center justify-center ${
                      p.isHuman ? 'scale-115 sm:scale-130 mb-4' : 'scale-95 sm:scale-105 mb-2'
                    }`}
                  >
                    <DragCarAvatar color={p.color} size="lg" />
                  </div>

                  {/* Player Name Tag underneath */}
                  <div className="mt-2 text-center">
                    <span
                      className={`font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate max-w-[150px] block ${
                        p.isHuman ? 'text-base sm:text-xl' : 'text-sm sm:text-base'
                      }`}
                    >
                      {p.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
