'use client';

import React, { useState, useEffect } from 'react';
import { GamePhase, GameOptions, GameStats } from './types';
import { DEFAULT_OPTIONS } from './constants';
import { GameWindow } from '@/core/components/GameWindow/GameWindow';
import { SpaceBackground } from './components/SpaceBackground';
import { TitleScreen } from './screens/TitleScreen';
import { NameScreen } from './screens/NameScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { OptionsScreen } from './screens/OptionsScreen';
import { PlayScreen } from './screens/PlayScreen';
import { ResultsScreen } from './screens/ResultsScreen';

export const AlienAdditionGame: React.FC = () => {
  // Phase always starts as 'title' on mount/refresh (never persisted)
  const [phase, setPhase] = useState<GamePhase>('title');
  const [playerName, setPlayerName] = useState<string>('Player873');
  const [options, setOptions] = useState<GameOptions>(DEFAULT_OPTIONS);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  // Load saved player profile and options in useEffect (client-side only, zero hydration mismatch)
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem('arcade:playerProfile');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed?.data?.name) {
          setPlayerName(parsed.data.name);
        } else if (parsed?.name) {
          setPlayerName(parsed.name);
        }
      }

      const rawOptions = localStorage.getItem('arcade:settings:alien-addition:v1.4');
      if (rawOptions) {
        const parsedOpt = JSON.parse(rawOptions);
        const opt = parsedOpt?.data || parsedOpt;
        // Validate saved options (sums rule)
        if (
          opt &&
          typeof opt.from === 'number' &&
          typeof opt.to === 'number' &&
          opt.from >= 1 &&
          opt.to <= 20 &&
          opt.to >= Math.max(opt.from, 2) + 2
        ) {
          setOptions({
            from: opt.from,
            to: opt.to,
            speed: opt.speed || 'normal',
            soundOn: opt.soundOn ?? true,
          });
        } else {
          setOptions(DEFAULT_OPTIONS);
        }
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const handleNameNext = (name: string) => {
    setPlayerName(name);
    try {
      const profile = { id: 'player_human', name, color: 'blue', isBot: false };
      localStorage.setItem('arcade:playerProfile', JSON.stringify({ version: 'v1.0', data: profile }));
    } catch {
      // ignore
    }
    setPhase('instructions');
  };

  const handleOptionsNext = (savedOptions: GameOptions) => {
    setOptions(savedOptions);
    try {
      localStorage.setItem(
        'arcade:settings:alien-addition:v1.4',
        JSON.stringify({ version: 'v1.4', data: savedOptions })
      );
    } catch {
      // ignore
    }
    setPhase('play');
  };

  const handlePlayFinish = (stats: GameStats) => {
    setLastStats(stats);
    setPhase('results');
  };

  const handleRetry = () => {
    setPhase('play');
  };

  const handleMenu = () => {
    setPhase('title');
  };

  return (
    <div className="min-h-screen w-full bg-[#FEFCBF] text-slate-900 p-2 sm:p-4 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-[63.125rem] flex flex-col items-center space-y-2">
        {/* Top Header Bar (Using rem sizing) */}
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#C05A00] tracking-tight">
              Alien Addition
            </h1>
            <p className="text-xs sm:text-sm text-[#C05A00]/90 font-medium">
              Math Games, Addition Games
            </p>
          </div>
        </div>

        {/* 1010x577 Scaled Game Window Container with integrated Fullscreen Button */}
        <GameWindow>
          <SpaceBackground>
            {phase === 'title' && (
              <TitleScreen onPlay={() => setPhase('name')} />
            )}

            {phase === 'name' && (
              <NameScreen
                initialName={playerName}
                onNext={handleNameNext}
              />
            )}

            {phase === 'instructions' && (
              <InstructionsScreen onNext={() => setPhase('options')} />
            )}

            {phase === 'options' && (
              <OptionsScreen
                initialOptions={options}
                onNext={handleOptionsNext}
              />
            )}

            {phase === 'play' && (
              <PlayScreen
                options={options}
                playerName={playerName || 'Player 1'}
                onFinishGame={handlePlayFinish}
                onMenu={handleMenu}
              />
            )}

            {phase === 'results' && lastStats && (
              <ResultsScreen
                stats={lastStats}
                playerName={playerName || 'Player 1'}
                onRetry={handleRetry}
                onMenu={handleMenu}
              />
            )}
          </SpaceBackground>
        </GameWindow>
      </div>
    </div>
  );
};
