'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchStore } from '../../state/useMatchStore';
import { GameManifest } from '../../types/match';
import { soundManager } from '@/core/audio/soundManager';
import { Chick } from '@/games/jumping-chicks/components/Chick';
import { JetSkiAvatar } from '@/games/island-chase/components/JetSkiAvatar';
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

        {/* Main Arcade Frame (Teal cyan / Water background) */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] bg-[#56e2ca] border-teal-400 rounded-none sm:rounded-sm shadow-xl flex flex-col justify-between overflow-hidden border">
          {/* Top Bar inside Canvas */}
          <div className="w-full flex items-center justify-between pl-6 sm:pl-8">
            {/* Left: Player Game Title (e.g. "Player852's Game") */}
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
                  className="text-2xl sm:text-4xl font-black italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:underline flex items-center gap-2 text-left"
                  title="Click to rename"
                >
                  <span>{playerName}&apos;s Game</span>
                </button>
              )}
            </div>

            {/* Right: Status box + START + LEAVE */}
            <div className="flex items-stretch bg-[#285750] rounded-none">
              {/* Ready status */}
              <div className="px-5 py-3 flex flex-col items-center justify-center text-white">
                <span className="text-lg sm:text-xl font-bold tracking-tight">0 / 1</span>
                <span className="text-[10px] sm:text-xs text-white/80 font-medium">players ready</span>
              </div>

              {/* Angled Orange START button */}
              <button
                onClick={handleStart}
                className="relative px-6 sm:px-10 py-3 bg-[#ff9a00] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-lg sm:text-2xl flex items-center justify-center gap-1 shadow-md transition-transform cursor-pointer border-l border-amber-600"
                style={{
                  clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                  paddingLeft: '2rem',
                  paddingRight: '2rem'
                }}
              >
                <span>START</span>
              </button>

              {/* Dark LEAVE button */}
              <button
                onClick={handleLeave}
                className="px-5 sm:px-8 py-3 bg-[#182a27] hover:bg-[#203a36] text-white font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
              >
                LEAVE
              </button>
            </div>
          </div>

          {/* 4 Player Avatars Row (Side-by-side) */}
          <div className="flex-1 w-full grid grid-cols-4 items-end pb-8 sm:pb-12 px-4 sm:px-8 gap-3 sm:gap-6">
            {players.map((p, idx) => {
              const isHuman = !p.isBot;
              const displayName = isHuman ? playerName : `Computer ${idx + 1}`;
              const isJetSki = manifest.id === 'island-chase';

              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col items-center justify-end pb-4 pt-8 rounded-none transition-all ${
                    isHuman
                      ? 'bg-white/25 shadow-inner'
                      : ''
                  }`}
                  style={{ minHeight: '260px' }}
                >
                  {/* Host Ribbon Badge for Human Player */}
                  {isHuman && (
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
                  <div className="transform-gpu transition-transform hover:scale-105">
                    {isJetSki ? (
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
                  <div className="mt-4 text-center">
                    <span className="font-extrabold text-sm sm:text-lg text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] truncate max-w-[140px] block">
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
