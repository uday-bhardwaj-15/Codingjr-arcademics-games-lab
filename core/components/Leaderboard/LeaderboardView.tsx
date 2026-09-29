'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { MatchResult, PlayerMatchScore } from '../../types/match';
import { soundManager } from '@/core/audio/soundManager';
import { Chick } from '@/games/jumping-chicks/components/Chick';
import { JetSkiAvatar } from '@/games/island-chase/components/JetSkiAvatar';
import { Maximize2, Printer } from 'lucide-react';

interface LeaderboardViewProps {
  result: MatchResult;
  onPlayAgain?: () => void;
  sidePanel?: React.ReactNode;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ result, onPlayAgain, sidePanel }) => {
  const router = useRouter();

  useEffect(() => {
    soundManager.playVictory();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#ef4444', '#10b981', '#ffffff'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handlePlayAgain = () => {
    soundManager.playClick();
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      router.push(`/games/${result.gameId}/play`);
    }
  };

  const handleEndGame = () => {
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

  const sortedPlayers = [...result.players].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.finishTimeMs - b.finishTimeMs;
  });

  const human = sortedPlayers.find((p) => !p.isBot) || sortedPlayers[0];
  const humanAccuracy = human ? human.accuracy : 100;
  const humanTimeSec = human ? human.finishTimeMs / 1000 : 0;
  const humanRate = humanTimeSec > 0 ? Math.round((human.correctCount / (humanTimeSec / 60))) : 0;

  const formatSeconds = (ms: number) => (ms / 1000).toFixed(2) + ' sec';

  const isJetSkiGame = result.gameId === 'island-chase';

  // Badge icons for 1st, 2nd, 3rd, 4th
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 border border-amber-600 shadow-md flex items-center justify-center text-amber-950 font-black text-xl">
            1
          </div>
          <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-200 px-1 rounded-xs mt-0.5">
            SKILL
          </span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border border-slate-500 shadow-md flex items-center justify-center text-slate-800 font-black text-xl">
            2
          </div>
          <span className="text-[9px] font-black uppercase text-slate-800 bg-slate-200 px-1 rounded-xs mt-0.5">
            SKILL
          </span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 border border-amber-900 shadow-md flex items-center justify-center text-amber-100 font-black text-xl">
            3
          </div>
          <span className="text-[9px] font-black uppercase text-amber-200 bg-amber-900 px-1 rounded-xs mt-0.5">
            SKILL
          </span>
        </div>
      );
    }
    return (
      <span className="text-xl font-black text-white ml-2">4th:</span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-3 sm:p-6 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">
              {result.gameTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">
              Math Games, {isJetSkiGame ? 'Subtraction Games' : 'Counting Games'}
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

        {/* Main Results Canvas */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] bg-[#56e2ca] border-teal-400 rounded-none sm:rounded-sm shadow-xl flex flex-row overflow-hidden border">
          {/* Left Column: Results & Ranked Players List */}
          <div className="w-[54%] h-full p-4 sm:p-6 flex flex-col justify-between">
            {/* Top Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl sm:text-4xl font-black italic text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                Results
              </h2>

              <button
                onClick={() => window.print()}
                className="p-2 rounded bg-teal-800/80 hover:bg-teal-900 text-white shadow transition-colors cursor-pointer"
                title="Print Results"
                aria-label="Print Results"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Ranked Player Rows */}
            <div className="space-y-2.5 my-auto">
              {sortedPlayers.map((p: PlayerMatchScore) => {
                const isHumanPlayer = !p.isBot;

                return (
                  <div
                    key={p.playerId}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-none transition-all ${
                      isHumanPlayer
                        ? 'bg-white/30 ring-1 ring-white/50 shadow-inner'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div className="w-12 flex items-center justify-center">
                        {renderRankBadge(p.rank)}
                      </div>

                      {/* Rank Label & Time */}
                      <div className="flex flex-col">
                        {p.rank !== 4 && (
                          <span className="text-sm sm:text-base font-extrabold text-white">
                            {p.rank === 1 ? '1st:' : p.rank === 2 ? '2nd:' : '3rd:'}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-black text-[#F03C6E]">
                          {p.finishTimeMs > 0 ? formatSeconds(p.finishTimeMs) : '--.-- sec'}
                        </span>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="transform-gpu scale-75">
                        {isJetSkiGame ? (
                          <JetSkiAvatar color={p.color} size="sm" />
                        ) : (
                          <Chick color={p.color} facing="front" size="sm" showShadow={false} />
                        )}
                      </div>

                      {/* Player Name */}
                      <span className="font-extrabold text-sm sm:text-base text-white truncate max-w-[130px]">
                        {p.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Accuracy, Rate, Missed Questions, Buttons */}
          <div className="w-[46%] h-full bg-[#265952] border-teal-600/60 p-5 sm:p-8 flex flex-col justify-between text-white border-l-2">
            {sidePanel ? (
              sidePanel
            ) : (
              /* Default Stats & Missed Questions */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm sm:text-base font-extrabold border-b border-white/20 pb-3">
                  <div>
                    <span className="text-white/80">Accuracy: </span>
                    <span className="text-white font-black text-lg">{humanAccuracy}%</span>
                  </div>
                  <div>
                    <span className="text-white/80">Rate: </span>
                    <span className="text-white font-black text-lg">{humanRate}/min</span>
                  </div>
                </div>

                {/* Missed Questions Section */}
                <div className="pt-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white/90 mb-1">
                    Missed Questions
                  </h3>
                  <div className="mt-2 text-xs text-white/70">
                    {human.wrongCount === 0 ? (
                      <span className="text-emerald-300 font-bold">None! Perfect Hop Race! 🎉</span>
                    ) : (
                      <span>{human.wrongCount} wrong lily pad hops</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Orange Angled PLAY AGAIN + Dark END GAME */}
            <div className="flex items-stretch gap-2 pt-4 border-t border-white/20">
              <button
                onClick={handlePlayAgain}
                className="flex-1 py-3 bg-[#ff9a00] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-base sm:text-xl shadow-md transition-transform cursor-pointer border-l border-amber-600 flex items-center justify-center"
                style={{
                  clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                }}
              >
                <span>PLAY AGAIN</span>
              </button>

              <button
                onClick={handleEndGame}
                className="px-5 py-3 bg-[#111820] hover:bg-[#1a232e] text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
              >
                END GAME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
