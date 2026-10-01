'use client';

import React, { useState, useEffect } from 'react';
import { IntegerSettings, IntegerOperation, GameSpeed } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { ChevronButton } from '../components/ChevronButton';
import { ArcadeStorage } from '@/core/state/storage';
import { soundManager } from '@/core/audio/soundManager';

interface OptionsScreenProps {
  onNext: (settings: IntegerSettings) => void;
}

export const OptionsScreen: React.FC<OptionsScreenProps> = ({ onNext }) => {
  const [from, setFrom] = useState<number>(DEFAULT_SETTINGS.from);
  const [to, setTo] = useState<number>(DEFAULT_SETTINGS.to);
  const [operation, setOperation] = useState<IntegerOperation>(DEFAULT_SETTINGS.operation);
  const [speed, setSpeed] = useState<GameSpeed>(DEFAULT_SETTINGS.speed);
  const [soundOn, setSoundOn] = useState<boolean>(DEFAULT_SETTINGS.soundOn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = ArcadeStorage.getGameSettings<IntegerSettings>(
        'orbit-integers',
        DEFAULT_SETTINGS
      );
      if (saved) {
        if (typeof saved.from === 'number') setFrom(saved.from);
        if (typeof saved.to === 'number') setTo(saved.to);
        if (saved.operation) setOperation(saved.operation);
        if (saved.speed) setSpeed(saved.speed);
        if (typeof saved.soundOn === 'boolean') setSoundOn(saved.soundOn);
      }
    } catch {
      // fallback
    }
  }, []);

  // Validation according to Section 5:
  // -20 <= From <= -1, 1 <= To <= 20, To - From >= 5
  const isFromValid = from >= -20 && from <= -1;
  const isToValid = to >= 1 && to <= 20;
  const isSpanValid = to - from >= 5;
  const isValid = isFromValid && isToValid && isSpanValid;

  let validationError = '';
  if (!isFromValid) {
    validationError = 'From must be between −20 and −1.';
  } else if (!isToValid) {
    validationError = 'To must be between 1 and 20.';
  } else if (!isSpanValid) {
    validationError = 'Difference (To − From) must be at least 5.';
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid) return;

    soundManager.playClick();
    const settings: IntegerSettings = {
      from,
      to,
      operation,
      speed,
      soundOn,
    };

    try {
      ArcadeStorage.saveGameSettings('orbit-integers', settings);
    } catch {
      // storage catch
    }

    onNext(settings);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-8 select-none font-sans">
      {/* Translucent Black Modal Panel (Matching Screenshot 2) */}
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[380px]">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black italic text-white tracking-wide">
            Options
          </h2>

          <div className="grid grid-cols-2 gap-8 items-start pt-1">
            {/* Column 1: Content Range & Operation */}
            <div className="space-y-4">
              {/* Content Range */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Content Range
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  All numbers in a question stay between From and To.
                </p>

                <div className="space-y-2 pt-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-bold text-slate-200">From</label>
                    <input
                      type="number"
                      min={-20}
                      max={-1}
                      value={isNaN(from) ? '' : from}
                      onChange={(e) => setFrom(parseInt(e.target.value, 10))}
                      className="w-20 px-3 py-1.5 text-center font-black text-lg bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-300"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-bold text-slate-200">To</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={isNaN(to) ? '' : to}
                      onChange={(e) => setTo(parseInt(e.target.value, 10))}
                      className="w-20 px-3 py-1.5 text-center font-black text-lg bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Operation Selection */}
              <div>
                <h3 className="text-sm font-black text-white mb-1.5">
                  Operation
                </h3>
                <div className="space-y-1.5">
                  {(['add', 'subtract', 'mixed'] as IntegerOperation[]).map((op) => (
                    <label
                      key={op}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-200 cursor-pointer hover:text-white transition-colors"
                    >
                      <input
                        type="radio"
                        name="integerOp"
                        checked={operation === op}
                        onChange={() => setOperation(op)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600 cursor-pointer"
                      />
                      <span>
                        {op === 'add' ? 'Add (+)' : op === 'subtract' ? 'Subtract (−)' : 'Mixed (+ / −)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Game Speed */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Game Speed
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Controls how fast the pods drift forward.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(['slow', 'normal', 'fast'] as GameSpeed[]).map((spd) => (
                  <label
                    key={spd}
                    className="flex items-center gap-3 text-sm sm:text-base font-bold text-slate-200 cursor-pointer capitalize hover:text-white transition-colors"
                  >
                    <input
                      type="radio"
                      name="gameSpeed"
                      checked={speed === spd}
                      onChange={() => setSpeed(spd)}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600 cursor-pointer"
                    />
                    <span>{spd}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="text-xs text-rose-400 font-bold bg-rose-950/70 border border-rose-800 px-3.5 py-1.5 rounded">
              {validationError}
            </div>
          )}
        </div>

        {/* Bottom Right: Authentic Chevron NEXT Button */}
        <div className="flex justify-end pt-4">
          <ChevronButton onClick={() => handleSubmit()} disabled={!isValid}>
            NEXT
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
