'use client';

import React, { useEffect } from 'react';
import { CompetitionResultItem, MissedQuestionItem } from '../types';
import { SpaceShipAvatar } from './SpaceShipAvatar';

interface ResultsScreenProps {
  results: CompetitionResultItem[];
  humanId: string;
  accuracy: number;
  ratePerMin: number;
  missedQuestions: MissedQuestionItem[];
  totalQuestionsAnswered: number;
  onPlayAgain: () => void;
  onEndGame: () => void;
}

export function ResultsScreen({
  results,
  humanId,
  accuracy,
  ratePerMin,
  missedQuestions,
  totalQuestionsAnswered,
  onPlayAgain,
  onEndGame,
}: ResultsScreenProps) {
  // Keyboard shortcuts (Enter: Play Again, Esc: End Game)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onPlayAgain();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onEndGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayAgain, onEndGame]);

  return (
    <div className="relative w-full h-full select-none bg-[#091524] overflow-hidden flex font-sans">
      {/* Deep Space Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1010 577" preserveAspectRatio="none">
          <circle cx="200" cy="150" r="180" fill="#1e3a8a" filter="blur(60px)" />
          <circle cx="800" cy="400" r="220" fill="#0369a1" filter="blur(70px)" />
        </svg>
      </div>

      {/* LEFT PANEL: Results List (x 0 to 605, ~60% width) */}
      <div className="relative w-[60%] h-full flex flex-col pt-6 pb-4 px-8 z-10">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-4xl font-black italic tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
            Results
          </h2>
        </div>

        {/* 4 Player Rows */}
        <div className="flex-1 flex flex-col justify-between py-1">
          {results.map((item) => {
            const isHuman = item.id === humanId;

            return (
              <div
                key={item.id}
                className={`relative flex items-center h-[96px] px-4 rounded-xl transition-all ${
                  isHuman
                    ? 'bg-white/20 shadow-lg ring-2 ring-cyan-400/60 border border-white/40'
                    : 'bg-black/30 border border-white/10'
                }`}
              >
                {/* 1. Medal / Trophy SVG */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center mr-3">
                  {item.rank === 1 && (
                    <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-md">
                      <path d="M 22 36 L 12 58 L 24 50 L 32 58 L 28 36 Z" fill="#dc2626" />
                      <path d="M 42 36 L 52 58 L 40 50 L 32 58 L 36 36 Z" fill="#b91c1c" />
                      <circle cx="32" cy="24" r="20" fill="url(#spaceGoldGrad)" stroke="#b45309" strokeWidth="2.5" />
                      <circle cx="32" cy="24" r="16" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="32" y="30" textAnchor="middle" fill="#78350f" fontSize="18" fontWeight="900">
                        1
                      </text>
                      <defs>
                        <linearGradient id="spaceGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  {item.rank === 2 && (
                    <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-md">
                      <path d="M 22 36 L 12 58 L 24 50 L 32 58 L 28 36 Z" fill="#2563eb" />
                      <path d="M 42 36 L 52 58 L 40 50 L 32 58 L 36 36 Z" fill="#1d4ed8" />
                      <circle cx="32" cy="24" r="20" fill="url(#spaceSilverGrad)" stroke="#475569" strokeWidth="2.5" />
                      <circle cx="32" cy="24" r="16" fill="none" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="32" y="30" textAnchor="middle" fill="#1e293b" fontSize="18" fontWeight="900">
                        2
                      </text>
                      <defs>
                        <linearGradient id="spaceSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="50%" stopColor="#cbd5e1" />
                          <stop offset="100%" stopColor="#94a3b8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  {item.rank === 3 && (
                    <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-md">
                      <path d="M 22 36 L 12 58 L 24 50 L 32 58 L 28 36 Z" fill="#059669" />
                      <path d="M 42 36 L 52 58 L 40 50 L 32 58 L 36 36 Z" fill="#047857" />
                      <circle cx="32" cy="24" r="20" fill="url(#spaceBronzeGrad)" stroke="#78350f" strokeWidth="2.5" />
                      <circle cx="32" cy="24" r="16" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="32" y="30" textAnchor="middle" fill="#451a03" fontSize="18" fontWeight="900">
                        3
                      </text>
                      <defs>
                        <linearGradient id="spaceBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fed7aa" />
                          <stop offset="50%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#92400e" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  {item.rank > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400/40 bg-slate-900/50 flex items-center justify-center text-slate-200 font-bold text-lg">
                      {item.rank}
                    </div>
                  )}
                </div>

                {/* 2. Place Text & Finish Time */}
                <div className="w-32 flex-shrink-0 flex flex-col justify-center">
                  <span className="text-2xl font-black text-white leading-tight drop-shadow">
                    {item.placeText}:
                  </span>
                  <span className="text-lg font-black text-[#f0466e] tracking-tight drop-shadow-sm">
                    {item.finishTimeFormatted}
                  </span>
                </div>

                {/* 3. Spaceship Avatar */}
                <div className="w-24 h-16 flex-shrink-0 flex items-center justify-center">
                  <SpaceShipAvatar color={item.color} size="sm" className="scale-110" />
                </div>

                {/* 4. Player Name */}
                <div className="flex-1 ml-4 min-w-0 flex items-center">
                  <span className="text-xl font-bold text-white truncate drop-shadow">
                    {item.name}
                  </span>
                  {isHuman && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-yellow-950 font-black text-xs uppercase tracking-wider shadow">
                      YOU
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Stats & Missed Questions (x 605 to 1010, ~40% width) */}
      <div className="relative w-[40%] h-full bg-[#0a1829]/95 border-l-2 border-white/20 flex flex-col p-6 z-10 backdrop-blur-md">
        {/* Stats Line */}
        <div className="flex items-center justify-between pb-3 border-b border-white/20 text-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-cyan-300">Accuracy:</span>
            <span className="text-xl font-black text-white">{accuracy}%</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-cyan-300">Rate:</span>
            <span className="text-xl font-black text-white">{ratePerMin}/min</span>
          </div>
        </div>

        {/* Missed Questions Title */}
        <div className="mt-4 mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 tracking-wide">
            Missed Questions
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            ({missedQuestions.length} missed)
          </span>
        </div>

        {/* Missed Questions Scrollable List */}
        <div className="flex-1 bg-black/40 rounded-xl border border-white/10 p-3 overflow-y-auto space-y-2 max-h-[300px]">
          {missedQuestions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-cyan-100">
              {totalQuestionsAnswered > 0 ? (
                <>
                  <span className="text-2xl mb-1">🚀</span>
                  <p className="font-bold text-base text-emerald-300">No missed questions!</p>
                  <p className="text-xs text-slate-300 mt-0.5">100% precision on all multiplication equations!</p>
                </>
              ) : (
                <p className="text-sm text-slate-300">No questions answered</p>
              )}
            </div>
          ) : (
            missedQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="flex items-center justify-between bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm"
              >
                <div className="font-black text-white text-base tracking-wide">
                  {q.questionText}
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="text-emerald-400 flex items-center gap-1">
                    <span>Correct:</span>
                    <span className="font-bold text-sm bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-600/40">
                      {q.correctAnswer}
                    </span>
                  </div>
                  <div className="text-rose-400 flex items-center gap-1">
                    <span>Yours:</span>
                    <span className="font-bold text-sm bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-600/40">
                      {q.chosenAnswer}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-white/15" />

        {/* Bottom Buttons */}
        <div className="flex items-center justify-end gap-3">
          {/* PLAY AGAIN Button (Orange Chevron Style) */}
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-black text-sm tracking-wide shadow-lg border-2 border-amber-300/80 transition-all cursor-pointer"
          >
            <span>PLAY AGAIN</span>
            <span className="text-base">➔</span>
          </button>

          {/* END GAME Button */}
          <button
            onClick={onEndGame}
            className="px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 shadow-md transition-all cursor-pointer"
          >
            END GAME
          </button>
        </div>
      </div>
    </div>
  );
}
