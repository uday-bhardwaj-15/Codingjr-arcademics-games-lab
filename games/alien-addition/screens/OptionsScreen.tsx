'use client';

import React, { useState } from 'react';
import { GameOptions, Speed } from '../types';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';

interface OptionsScreenProps {
  initialOptions: GameOptions;
  onNext: (options: GameOptions) => void;
}

export const OptionsScreen: React.FC<OptionsScreenProps> = ({
  initialOptions,
  onNext,
}) => {
  const [from, setFrom] = useState<number>(initialOptions.from);
  const [to, setTo] = useState<number>(initialOptions.to);
  const [speed, setSpeed] = useState<Speed>(initialOptions.speed);

  const minRequiredTo = Math.max(from, 2) + 2;

  // Validation rules: whole numbers, From >= 1, To <= 20, To >= max(From, 2) + 2
  const isValid =
    !isNaN(from) &&
    !isNaN(to) &&
    from >= 1 &&
    to <= 20 &&
    to >= minRequiredTo;

  let validationError = '';
  if (from < 1) validationError = 'From must be at least 1.';
  else if (to > 20) validationError = 'To cannot exceed 20.';
  else if (to < minRequiredTo)
    validationError = `To must be at least ${minRequiredTo} (From + 2) to allow distinct answers.`;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid) return;

    soundManager.playClick();
    onNext({
      from,
      to,
      speed,
      soundOn: initialOptions.soundOn,
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 select-none">
      {/* Translucent Black Modal Panel */}
      <div className="w-full max-w-2xl bg-black/70 backdrop-blur-md border border-white/15 rounded-xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[360px]">
        <div className="space-y-5">
          <h2 className="text-3xl font-black text-white tracking-wide">
            Options
          </h2>

          <div className="grid grid-cols-2 gap-8 items-start pt-1">
            {/* Column 1: Content Range */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  Content Range
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Answers on the spaceships will be between From and To.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm sm:text-base font-bold text-slate-200">
                    From
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={isNaN(from) ? '' : from}
                    onChange={(e) => setFrom(parseInt(e.target.value, 10))}
                    className="w-20 px-3 py-1.5 text-center font-black text-lg bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm sm:text-base font-bold text-slate-200">
                    To
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={20}
                    value={isNaN(to) ? '' : to}
                    onChange={(e) => setTo(parseInt(e.target.value, 10))}
                    className="w-20 px-3 py-1.5 text-center font-black text-lg bg-white text-slate-900 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Game Speed */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  Game Speed
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Controls how fast the alien saucers descend.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(['slow', 'normal', 'fast'] as Speed[]).map((spd) => (
                  <label
                    key={spd}
                    className="flex items-center gap-3 text-base font-bold text-slate-200 cursor-pointer capitalize hover:text-white transition-colors"
                  >
                    <input
                      type="radio"
                      name="gameSpeed"
                      checked={speed === spd}
                      onChange={() => setSpeed(spd)}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600"
                    />
                    <span>{spd}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="text-xs text-rose-400 font-bold bg-rose-950/70 border border-rose-800 px-3.5 py-2 rounded">
              {validationError}
            </div>
          )}
        </div>

        {/* Bottom Right: NEXT Button */}
        <div className="flex justify-end pt-4">
          <ChevronButton onClick={() => handleSubmit()} disabled={!isValid}>
            NEXT
          </ChevronButton>
        </div>
      </div>
    </div>
  );
};
