'use client';

import React, { useState, useEffect } from 'react';
import { ChevronButton } from '../components/ChevronButton';
import { ArcadeStorage } from '@/core/state/storage';
import { soundManager } from '@/core/audio/soundManager';

interface NameScreenProps {
  onNext: (name: string) => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = ArcadeStorage.getPlayerProfile();
    if (profile?.name) {
      setName(profile.name);
    } else {
      const randNum = Math.floor(100 + Math.random() * 900);
      setName(`Player${randNum}`);
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = name.trim() || 'Player1';
    soundManager.playClick();

    // Save to arcade persistent profile
    const existing = ArcadeStorage.getPlayerProfile();
    ArcadeStorage.savePlayerProfile({
      id: existing?.id || `usr_${Date.now()}`,
      name: cleanName,
      color: (existing?.color as any) || 'blue',
      isBot: false,
    });

    onNext(cleanName);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 select-none font-sans">
      {/* Translucent Black Modal Panel (Matching Screenshot 1) */}
      <div className="w-full max-w-lg bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-8 sm:p-10 shadow-2xl relative flex flex-col justify-between min-h-[300px]">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black italic text-white tracking-wide">
            Player Name
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Make up a fun and friendly name.
          </p>

          <form onSubmit={handleSubmit} className="pt-2">
            <input
              type="text"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 text-xl font-bold bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-3 focus:ring-amber-400 border border-slate-300"
              placeholder="Enter name"
            />
          </form>
        </div>

        {/* Bottom Right: Authentic Chevron NEXT Button */}
        <div className="flex justify-end pt-6">
          <ChevronButton onClick={() => handleSubmit()} disabled={!name.trim()}>
            NEXT
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
