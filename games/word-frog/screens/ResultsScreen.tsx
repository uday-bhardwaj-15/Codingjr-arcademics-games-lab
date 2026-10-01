'use client';

import React, { useEffect } from 'react';
import { GameSummary } from '../types';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';

interface ResultsScreenProps {
  summary: GameSummary;
  onPlayAgain: () => void;
  onOptions: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  summary,
  onPlayAgain,
  onOptions,
}) => {
  useEffect(() => {
    soundManager.playVictory();
  }, []);

  // Compute 1-3 Stars rating
  let stars = 1;
  if (summary.accuracy >= 90 && summary.hits >= 10) stars = 3;
  else if (summary.accuracy >= 70 && summary.hits >= 5) stars = 2;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 select-none font-sans bg-[#0c1f28]/70 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-black/90 backdrop-blur-lg border border-emerald-400/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between space-y-6">
        {/* 1. Header Banner & Stars */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-3xl sm:text-4xl animate-bounce">
            <span>{stars >= 1 ? '⭐' : '☆'}</span>
            <span>{stars >= 2 ? '⭐' : '☆'}</span>
            <span>{stars >= 3 ? '⭐' : '☆'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white">
            Round Complete!
          </h2>
          <p className="text-sm font-semibold text-emerald-400">
            Great job catching the antonyms!
          </p>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">HITS</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {summary.hits}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">MISSES</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {summary.misses}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">ACCURACY</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {summary.accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">SPEED</span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {summary.wordsPerMinute} <span className="text-xs text-slate-400 font-sans">WPM</span>
            </span>
          </div>
        </div>

        {/* 3. Missed Words Review Section (if any) */}
        {summary.missed.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Words to Practice ({summary.missed.length})
            </h3>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {summary.missed.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-between text-xs"
                >
                  <span className="font-extrabold text-white">
                    {item.prompt}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-rose-400 line-through">
                      {item.userAnswer}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      → {item.correctAnswer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/15">
          <button
            onClick={() => {
              soundManager.playClick();
              onOptions();
            }}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-600 transition-colors cursor-pointer"
          >
            Options
          </button>

          <ChevronButton
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
          >
            PLAY AGAIN
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
