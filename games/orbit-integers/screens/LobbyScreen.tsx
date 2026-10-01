'use client';

import React from 'react';
import { PodAvatar } from '../components/PodAvatar';
import { BOT_CONFIGS } from '../constants';

interface LobbyScreenProps {
  playerName: string;
  onStart: () => void;
  onLeave: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  playerName,
  onStart,
  onLeave,
}) => {
  return (
    <div className="absolute inset-0 bg-[#060913] flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* Space Backdrop Gradient & Subtle Stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_20%,rgba(14,55,140,0.5),rgba(2,8,46,0.95))] pointer-events-none" />

      {/* Top Header Row (Matching Screenshot 1 & Arcademics Platform Standards) */}
      <div className="relative z-10 w-full flex items-center justify-between pl-6 sm:pl-8">
        {/* Left: Player Game Title (e.g. "Player622's Game") */}
        <h1 className="text-2xl sm:text-4xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {playerName}&apos;s Game
        </h1>

        {/* Right: Status box + START Chevron + LEAVE */}
        <div className="flex items-stretch bg-black/80 rounded-none shadow-md">
          {/* Ready Status */}
          <div className="px-5 py-2.5 flex flex-col items-center justify-center text-white bg-black/90 border-r border-white/10">
            <span className="text-lg sm:text-xl font-bold tracking-tight">0 / 1</span>
            <span className="text-[10px] sm:text-xs text-white/80 font-medium">players ready</span>
          </div>

          {/* Authentic Arcademics Angled Orange START Button */}
          <div className="relative flex items-center">
            <button
              onClick={onStart}
              className="relative px-7 sm:px-10 py-3 bg-[#ff9a00] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-lg sm:text-2xl flex items-center justify-center gap-1 shadow-md transition-transform cursor-pointer"
              style={{
                clipPath: 'polygon(0% 0%, 86% 0%, 100% 50%, 86% 100%, 0% 100%)',
                paddingRight: '2.5rem',
              }}
            >
              <span>START</span>
            </button>
            {/* Dark Chevron Cap Piece */}
            <div
              className="w-4 h-full bg-[#2e431f] -ml-2"
              style={{
                clipPath: 'polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)',
              }}
            />
          </div>

          {/* Dark LEAVE Button */}
          <button
            onClick={onLeave}
            className="px-5 sm:px-8 py-3 bg-black hover:bg-zinc-900 text-white font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
          >
            LEAVE
          </button>
        </div>
      </div>

      {/* 4 Player Seats Row (Matching Screenshot 1) */}
      <div className="relative z-10 flex-1 w-full grid grid-cols-4 items-center pb-6 sm:pb-8 px-4 sm:px-8 gap-4 sm:gap-6">
        {/* Seat 1: Human Player (Tall translucent blue highlight panel) */}
        <div className="relative flex flex-col items-center justify-center h-[320px] sm:h-[350px] bg-[#283248]/75 shadow-2xl backdrop-blur-sm border border-white/10 rounded-sm py-6">
          <div className="transform-gpu transition-transform hover:scale-105 flex items-center justify-center scale-110 sm:scale-115 mb-3">
            <PodAvatar color="blue" size="xl" />
          </div>
          <div className="mt-3 text-center">
            <span className="font-black text-white text-base sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] truncate max-w-[150px] block">
              {playerName}
            </span>
          </div>
        </div>

        {/* Seats 2, 3, 4: Computer Bots */}
        {BOT_CONFIGS.map((bot) => (
          <div
            key={bot.name}
            className="relative flex flex-col items-center justify-center h-[320px] sm:h-[350px] py-6"
          >
            <div className="transform-gpu transition-transform hover:scale-105 flex items-center justify-center mb-2">
              <PodAvatar color={bot.color} size="lg" className="opacity-95" />
            </div>
            <div className="mt-3 text-center">
              <span className="font-bold text-white text-sm sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] truncate max-w-[150px] block">
                {bot.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
