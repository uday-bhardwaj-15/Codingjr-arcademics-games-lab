'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchStore } from '../../state/useMatchStore';
import { GameManifest } from '../../types/match';
import { soundManager } from '@/core/audio/soundManager';
import { Chick } from '@/games/jumping-chicks/components/Chick';
import { JetSkiAvatar } from '@/games/island-chase/components/JetSkiAvatar';
import { SpaceShipAvatar } from '@/games/space-race/components/SpaceShipAvatar';
import { Maximize2, Play } from 'lucide-react';

interface LobbyViewProps {
  manifest: GameManifest;
  customSettingsSlot?: React.ReactNode;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ manifest }) => {
  const router = useRouter();
  const {
    players,
    humanPlayer,
    initLobby,
    updateHumanProfile,
  } = useMatchStore();

  const [playerName, setPlayerName] = useState(humanPlayer.name || 'Player852');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    initLobby(manifest.id, manifest.title, manifest.defaultRounds || 10);
  }, [manifest.id, manifest.title, manifest.defaultRounds, initLobby]);

  useEffect(() => {
    if (humanPlayer.name) {
      setPlayerName(humanPlayer.name);
    }
  }, [humanPlayer.name]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    updateHumanProfile({ name: playerName.trim() || 'Player852' });
  };

  const handleStart = () => {
    soundManager.playClick();
    soundManager.playCountdown(false);
    router.push(manifest.routes.play);
  };

  const handleLeave = () => {
    soundManager.playClick();
    router.push('/');
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-4 sm:p-8 flex flex-col items-center justify-center font-sans select-none">
      {/* Container matching standard 4:3 / 16:9 arcade canvas */}
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Title Bar (Matches Screenshot 1 Header) */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">
              {manifest.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">
              Math Games, {manifest.category || 'Arcade Games'}
            </p>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#c2580b] hover:bg-amber-200/50 transition-colors"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* Main Arcade Frame */}
        <div
          className={`relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-xl flex flex-col justify-between overflow-hidden border ${
            manifest.id === 'space-race'
              ? 'bg-[#060913] border-slate-800'
              : 'bg-[#56e2ca] border-teal-400'
          }`}
        >
          {/* Space Race Moon Horizon & Craters Background */}
          {manifest.id === 'space-race' && (
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Subtle twinkling stars */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Green Moon Surface Arc at Bottom */}
              <svg
                viewBox="0 0 1000 200"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-28 text-[#3d7a6e]"
              >
                {/* Moon Horizon Curve */}
                <path
                  d="M 0 60 Q 500 20 1000 60 L 1000 200 L 0 200 Z"
                  fill="#3d7a6e"
                />
                {/* Left Crater */}
                <ellipse cx="340" cy="95" rx="32" ry="12" fill="#29554d" />
                <ellipse cx="340" cy="95" rx="28" ry="9" fill="#1f413a" />

                {/* Right Crater */}
                <ellipse cx="650" cy="100" rx="24" ry="9" fill="#29554d" />
                <ellipse cx="650" cy="100" rx="20" ry="7" fill="#1f413a" />
              </svg>
            </div>
          )}

          {/* Top Bar inside Canvas */}
          <div className="relative z-10 w-full flex items-center justify-between pl-6 sm:pl-8">
            {/* Left: Player Game Title (e.g. "Player451's Game") */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={playerName}
                  maxLength={16}
                  autoFocus
                  onBlur={handleNameBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="text-2xl sm:text-4xl font-extrabold italic text-slate-900 bg-white/90 px-3 py-1 rounded shadow-inner outline-none"
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-2xl sm:text-4xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:underline flex items-center gap-2 text-left"
                  title="Click to rename"
                >
                  <span>{playerName}&apos;s Game</span>
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
                  onClick={handleStart}
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
                onClick={handleLeave}
                className="px-5 sm:px-8 py-3 bg-black hover:bg-zinc-900 text-white font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
              >
                LEAVE
              </button>
            </div>
          </div>

          {/* 4 Player Avatars Row (Side-by-side) */}
          <div className="relative z-10 flex-1 w-full grid grid-cols-4 items-center pb-6 sm:pb-8 px-4 sm:px-8 gap-4 sm:gap-6">
            {players.map((p, idx) => {
              const isHuman = !p.isBot;
              const displayName = isHuman ? playerName : `Computer ${idx + 1}`;
              const isJetSki = manifest.id === 'island-chase';
              const isSpaceRace = manifest.id === 'space-race';

              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col items-center justify-center transition-all ${
                    isHuman
                      ? isSpaceRace
                        ? 'h-[320px] sm:h-[350px] bg-[#283248]/75 shadow-2xl backdrop-blur-sm border border-white/10 rounded-sm py-6'
                        : 'pb-4 pt-8 bg-white/25 shadow-inner'
                      : 'h-[320px] sm:h-[350px] py-6'
                  }`}
                >
                  {/* Host Ribbon Badge for Human Player (in water / island games) */}
                  {isHuman && !isSpaceRace && (
                    <div className="absolute top-4 left-4 flex flex-col items-center z-10 select-none">
                      <div className="w-6 h-12 bg-red-800 border border-red-950 flex flex-col items-center justify-between py-1 shadow-md relative">
                        <span className="text-[10px] text-amber-300">★</span>
                        <div className="absolute -bottom-2.5 left-0 right-0 h-3 bg-red-800 [clip-path:polygon(0_0,100%_0,50%_100%)] border-b border-red-950" />
                      </div>
                      <div className="absolute top-2 w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border border-amber-700 shadow-md flex items-center justify-center text-amber-950 text-base font-black">
                        ★
                      </div>
                    </div>
                  )}

                  {/* Avatar Sprite */}
                  <div className={`transform-gpu transition-transform hover:scale-105 flex items-center justify-center ${
                    isSpaceRace && isHuman ? 'scale-110 sm:scale-115 mb-3' : 'mb-2'
                  }`}>
                    {isSpaceRace ? (
                      <SpaceShipAvatar
                        color={p.color}
                        facing="front"
                        size={isHuman ? 'lg' : 'md'}
                      />
                    ) : isJetSki ? (
                      <JetSkiAvatar
                        color={p.color}
                        size="lg"
                      />
                    ) : (
                      <Chick
                        color={p.color}
                        facing="front"
                        size="lg"
                      />
                    )}
                  </div>

                  {/* Player Name Tag underneath */}
                  <div className="mt-3 text-center">
                    <span className={`font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] truncate max-w-[150px] block ${
                      isSpaceRace && isHuman ? 'text-base sm:text-xl font-black' : 'text-sm sm:text-base font-bold'
                    }`}>
                      {displayName}
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
