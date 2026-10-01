'use client';

import React from 'react';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';

interface LobbyScreenProps {
  playerName: string;
  categoryLabel: string;
  onStart: () => void;
  onBack: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  playerName,
  categoryLabel,
  onStart,
  onBack,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none font-sans bg-[#0c1f28]/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-black/85 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-8 sm:p-10 shadow-2xl relative flex flex-col justify-between min-h-[340px]">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl animate-bounce">🐸</span>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black italic text-white tracking-wide">
                Word Frog
              </h2>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {categoryLabel} Practice
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Player</span>
              <span className="text-sm font-black text-white">{playerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Mission</span>
              <span className="text-sm font-black text-emerald-300">
                Zap the matching {categoryLabel}!
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Click on the correct dragonfly or press keys <strong className="text-white">1 - 6</strong> to shoot the frog&apos;s tongue and eat the matching words!
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/15">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-600 transition-colors cursor-pointer"
          >
            Options
          </button>

          <ChevronButton
            onClick={() => {
              soundManager.playClick();
              onStart();
            }}
          >
            PLAY NOW
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
