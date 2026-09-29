'use client';

import React, { useState, useEffect } from 'react';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';

interface NameScreenProps {
  initialName?: string;
  onNext: (name: string) => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ initialName, onNext }) => {
  const [name, setName] = useState(initialName || '');

  // Hydration safe: Generate default name in useEffect only
  useEffect(() => {
    if (!name) {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setName(`Player${randomNum}`);
    }
  }, [name]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = name.trim() || 'Player1';
    soundManager.playClick();
    onNext(cleanName);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none">
      {/* Translucent Black Modal Panel */}
      <div className="w-full max-w-lg bg-black/65 backdrop-blur-md border border-white/15 rounded-xl p-6 sm:p-10 shadow-2xl relative flex flex-col justify-between min-h-[300px]">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Player Name
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Choose a name for the leaderboards.
          </p>

          <form onSubmit={handleSubmit} className="pt-2">
            <input
              type="text"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 text-lg sm:text-xl font-bold bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-3 focus:ring-amber-400 border border-slate-300"
              placeholder="Enter name"
            />
          </form>
        </div>

        {/* Bottom Right: NEXT Button */}
        <div className="flex justify-end pt-6">
          <ChevronButton onClick={() => handleSubmit()} disabled={!name.trim()}>
            NEXT
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
