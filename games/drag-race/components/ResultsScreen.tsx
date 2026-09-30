import React from 'react';
import { RacerProgress, RaceRoundResult } from '../types';
import { DragCarAvatar } from './DragCarAvatar';
import { soundManager } from '@/core/audio/soundManager';
import { Maximize2, Printer } from 'lucide-react';

interface ResultsScreenProps {
  racers: RacerProgress[];
  roundResults: RaceRoundResult[];
  humanRacer: RacerProgress;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  racers,
  roundResults,
  humanRacer,
  onPlayAgain,
  onBackToMenu,
}) => {
  // Sort racers by rank / finishTime / progress
  const sortedRacers = [...racers].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.finished && !b.finished) return -1;
    if (!a.finished && b.finished) return 1;
    if (a.finishTimeMs && b.finishTimeMs) return a.finishTimeMs - b.finishTimeMs;
    return b.progress - a.progress;
  });

  const totalQuestions = roundResults.length;
  const correctCount = roundResults.filter((r) => r.isCorrect).length;
  const missedQuestions = roundResults.filter((r) => !r.isCorrect);
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Rate calculation (questions answered per minute)
  const totalDurationMin = humanRacer.finishTimeMs
    ? Math.max(0.1, humanRacer.finishTimeMs / 60000)
    : 1.0;
  const ratePerMin = Math.round(correctCount / totalDurationMin);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-4 sm:p-8 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Header Bar (Exact Match to Reference Screenshot) */}
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

        {/* Main Arcade Frame (Exact Match to Ending Screen Screenshot) */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] rounded-none sm:rounded-sm shadow-2xl flex overflow-hidden border border-amber-300/60 bg-[#1e232d]">
          {/* LEFT PANEL: Finisher Standings with Diagonal Split Background (60% Width) */}
          <div className="relative w-[58%] h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden border-r border-black/40">
            {/* Diagonal Split Background SVG */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <svg viewBox="0 0 600 600" preserveAspectRatio="none" className="w-full h-full">
                <polygon points="0,0 600,0 600,600 0,600" fill="#2d7a31" />
                <polygon points="240,0 600,0 600,600 120,600" fill="#3f4854" />
                <line x1="240" y1="0" x2="120" y2="600" stroke="#cbd5e1" strokeWidth="3" />
              </svg>
            </div>

            {/* Left Header: "Results" Title + Print Button */}
            <div className="relative z-10 flex items-center justify-between">
              <h2 className="text-3xl sm:text-4xl font-black italic text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                Results
              </h2>

              <button
                onClick={handlePrint}
                className="p-2 rounded-xs bg-black/60 hover:bg-black/80 text-white/90 transition-colors cursor-pointer shadow-md"
                title="Print Results"
                aria-label="Print Results"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Finisher Rows */}
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-2 sm:gap-3 py-2">
              {sortedRacers.map((racer, idx) => {
                const rankNum = idx + 1;
                const isHuman = !racer.isBot;
                const timeSec = racer.finishTimeMs
                  ? (racer.finishTimeMs / 1000).toFixed(2)
                  : (58.0 + idx * 0.95).toFixed(2);

                return (
                  <div
                    key={racer.id}
                    className={`relative flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 rounded-none transition-all ${
                      isHuman
                        ? 'bg-white/25 shadow-inner border-y border-white/30 backdrop-blur-xs'
                        : 'hover:bg-black/10'
                    }`}
                  >
                    {/* Rank Trophy Badge & Place Info */}
                    <div className="flex items-center gap-2 sm:gap-3 w-36 sm:w-44 shrink-0">
                      {/* Golden Trophy for 1st Place */}
                      {rankNum === 1 ? (
                        <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-md">
                            {/* Gold Trophy Cup */}
                            <path d="M 12 12 L 48 12 L 42 42 L 18 42 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                            {/* Handles */}
                            <path d="M 12 16 C 2 16, 2 34, 15 34" stroke="#eab308" strokeWidth="3" fill="none" />
                            <path d="M 48 16 C 58 16, 58 34, 45 34" stroke="#eab308" strokeWidth="3" fill="none" />
                            {/* Base */}
                            <rect x="26" y="42" width="8" height="12" fill="#ca8a04" />
                            <polygon points="16,62 44,62 40,54 20,54" fill="#a16207" />
                            {/* #1 text */}
                            <text x="30" y="32" textAnchor="middle" fill="#78350f" fontSize="18" fontWeight="900">1</text>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 flex items-center justify-center">
                          <span className="font-black text-lg sm:text-xl text-white/80">
                            #{rankNum}
                          </span>
                        </div>
                      )}

                      {/* Place & Time Label */}
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-black text-white leading-none drop-shadow">
                          {getRankSuffix(rankNum)}:
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#f43f5e] mt-0.5 leading-none">
                          {timeSec} sec
                        </span>
                      </div>
                    </div>

                    {/* Front Smiling Drag Car Avatar */}
                    <div className="w-14 sm:w-18 shrink-0 flex items-center justify-center">
                      <DragCarAvatar color={racer.color} size="sm" className="scale-105 sm:scale-115" />
                    </div>

                    {/* Racer Name */}
                    <div className="flex-1 text-right pl-2 truncate">
                      <span className="font-black text-sm sm:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate block">
                        {racer.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Stats & Missed Questions (42% Width) */}
          <div className="w-[42%] h-full bg-[#12161c] p-4 sm:p-6 flex flex-col justify-between text-white select-none">
            {/* Top Accuracy & Rate Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-200">
                <div>
                  <span className="text-slate-400">Accuracy: </span>
                  <span className="font-black text-white text-base sm:text-lg">{accuracy}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Rate: </span>
                  <span className="font-black text-white text-base sm:text-lg">{ratePerMin}/min</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-800" />

              {/* Missed Questions Section */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-300">
                  Missed Questions
                </h3>

                {missedQuestions.length === 0 ? (
                  <div className="py-4 text-center text-xs sm:text-sm text-emerald-400 font-bold">
                    ✓ Perfect score! No missed questions!
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/60">
                    {missedQuestions.map((q, idx) => (
                      <div key={idx} className="pt-1.5 flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-bold text-slate-200">
                          {q.prompt} = {q.correctAnswer}
                        </span>
                        <span className="text-rose-400 font-bold">
                          (You: {q.userAnswer})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Buttons: PLAY AGAIN + END GAME */}
            <div className="flex items-center justify-end gap-2 pt-4">
              {/* Orange Angled PLAY AGAIN Chevron Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPlayAgain();
                }}
                className="relative px-6 sm:px-8 py-2.5 bg-[#f59e0b] hover:bg-[#ea580c] active:scale-95 text-white font-black italic text-base sm:text-lg tracking-wider flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                style={{
                  clipPath: 'polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)',
                  paddingRight: '2rem',
                }}
              >
                <span>PLAY AGAIN</span>
              </button>

              {/* Dark END GAME Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBackToMenu();
                }}
                className="px-4 sm:px-6 py-2.5 bg-black hover:bg-zinc-900 active:scale-95 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <span>END GAME</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
