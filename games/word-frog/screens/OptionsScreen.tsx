'use client';

import React, { useState } from 'react';
import { WordFrogSettings, WordCategory, GameSpeed } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';
import { ArcadeStorage } from '@/core/state/storage';

interface OptionsScreenProps {
  onNext: (settings: WordFrogSettings) => void;
}

export const OptionsScreen: React.FC<OptionsScreenProps> = ({ onNext }) => {
  const [settings, setSettings] = useState<WordFrogSettings>(() => {
    try {
      const saved = ArcadeStorage.getGameSettings<WordFrogSettings>('word-frog', DEFAULT_SETTINGS);
      return saved || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const handleCategorySelect = (cat: WordCategory) => {
    soundManager.playClick();
    setSettings((prev) => ({ ...prev, category: cat }));
  };

  const handleSpeedSelect = (spd: GameSpeed) => {
    soundManager.playClick();
    setSettings((prev) => ({ ...prev, speed: spd }));
  };

  const handleDurationSelect = (dur: number) => {
    soundManager.playClick();
    setSettings((prev) => ({ ...prev, durationSeconds: dur }));
  };

  const handleSubmit = () => {
    soundManager.playClick();
    ArcadeStorage.saveGameSettings('word-frog', settings);
    onNext(settings);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 select-none font-sans bg-[#0c1f28]/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black/85 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between min-h-[440px]">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐸</span>
              <h2 className="text-2xl sm:text-3xl font-black italic text-white tracking-wide">
                Game Options
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Language Arts
            </span>
          </div>

          {/* 1. Category Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300">
              Word Concept
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'antonyms' as WordCategory, label: 'Antonyms', desc: 'Opposites' },
                { id: 'synonyms' as WordCategory, label: 'Synonyms', desc: 'Same meaning' },
                { id: 'homophones' as WordCategory, label: 'Homophones', desc: 'Sound-alike' },
                { id: 'mixed' as WordCategory, label: 'Mixed', desc: 'All concepts' },
              ].map((item) => {
                const active = settings.category === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCategorySelect(item.id)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-b from-emerald-600 to-green-800 border-emerald-300 text-white shadow-[0_0_15px_#22c55e]'
                        : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <span className="font-extrabold text-sm sm:text-base">{item.label}</span>
                    <span className="text-[10px] text-slate-200/80">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Round Time Limit */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300">
              Round Timer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 60, label: '60s' },
                { id: 90, label: '90s' },
                { id: 120, label: '120s' },
                { id: 0, label: 'Practice (∞)' },
              ].map((item) => {
                const active = settings.durationSeconds === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleDurationSelect(item.id)}
                    className={`py-2 px-3 rounded-lg border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-300 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Speed Setting */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300">
              Pacing Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slow' as GameSpeed, label: 'Relaxed' },
                { id: 'normal' as GameSpeed, label: 'Normal' },
                { id: 'fast' as GameSpeed, label: 'Fast Rush' },
              ].map((item) => {
                const active = settings.speed === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSpeedSelect(item.id)}
                    className={`py-2 px-3 rounded-lg border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-b from-cyan-600 to-blue-700 border-cyan-300 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-white/15">
          <ChevronButton onClick={handleSubmit}>
            START GAME
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
