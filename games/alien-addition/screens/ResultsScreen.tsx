'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameStats, Missed, AlienAdditionLeaderboardEntry } from '../types';
import { ChevronButton } from '../components/ChevronButton';
import { soundManager } from '@/core/audio/soundManager';

interface ResultsScreenProps {
  stats: GameStats;
  playerName: string;
  onRetry: () => void;
  onMenu: () => void;
}

export function ResultsScreen({
  stats,
  playerName,
  onRetry,
  onMenu,
}: ResultsScreenProps) {
  const router = useRouter();

  const totalAttempts = stats.hits + stats.misses;
  const accuracy =
    totalAttempts > 0 ? (stats.hits / totalAttempts) * 100 : 100;
  const rate = stats.hits; // in 60s, hits = hits/min

  // Silently save run to leaderboard
  useEffect(() => {
    try {
      const STORAGE_KEY = 'arcade:leaderboard:alien-addition';
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: AlienAdditionLeaderboardEntry[] = raw ? JSON.parse(raw) : [];

      const currentEntry: AlienAdditionLeaderboardEntry = {
        id: `score_${Date.now()}`,
        name: playerName,
        hits: stats.hits,
        misses: stats.misses,
        accuracy: Math.round(accuracy),
        rate: Math.round(rate),
        date: new Date().toLocaleDateString(),
      };

      list = [currentEntry, ...list].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage fallback
    }
  }, [stats.hits, stats.misses, accuracy, rate, playerName]);

  const handleEndGame = () => {
    soundManager.playClick();
    router.push('/');
  };

  const darkBtn =
    'bg-black px-5 py-2.5 text-base sm:text-lg font-black tracking-wide text-white hover:bg-zinc-900 border border-white/20 transition-colors cursor-pointer rounded-xs';

  const isGrandWin = stats.isGrandVictory || stats.stagesCompleted === 6;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-[4%] select-none z-20">
      {/* Grand Victory Header */}
      {isGrandWin && (
        <div className="mb-2 text-center animate-in zoom-in-95 duration-300">
          <div className="inline-block px-6 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wider text-amber-300 drop-shadow-[0_2px_6px_rgba(251,191,36,0.6)]">
              🎉 CONGRATULATIONS! 🎉
            </h1>
            <p className="text-sm sm:text-base font-bold text-emerald-300">
              You Won All 6 Stages! Excellent Job!
            </p>
          </div>
        </div>
      )}

      {/* 2 Dark Translucent Panels */}
      <div className="grid flex-1 grid-cols-2 gap-[4%] min-h-0">
        {/* Left Panel: Score */}
        <section className="rounded-lg bg-black/60 backdrop-blur-sm p-5 sm:p-6 text-white border border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl font-semibold tracking-wide">
              Score
            </h2>
            <div className="space-y-3 text-lg sm:text-xl font-normal">
              {stats.stagesCompleted ? (
                <p>
                  Stages Cleared:{' '}
                  <b className="ml-1 font-black text-amber-300">
                    {stats.stagesCompleted} / 6
                  </b>
                </p>
              ) : null}
              <p>
                Accuracy:{' '}
                <b className="ml-1 font-black text-white">
                  {Math.round(accuracy)}%
                </b>
              </p>
              <p>
                Rate:{' '}
                <b className="ml-1 font-black text-white">
                  {Math.round(rate)}/min
                </b>
              </p>
            </div>
          </div>
        </section>

        {/* Right Panel: Missed Questions */}
        <section className="flex min-h-0 flex-col rounded-lg bg-black/60 backdrop-blur-sm p-5 sm:p-6 text-white border border-white/10">
          <h2 className="mb-3 text-2xl sm:text-3xl font-semibold tracking-wide">
            Missed Questions
          </h2>
          <div className="grid grid-cols-2 px-2 text-base sm:text-lg underline font-semibold text-slate-200 pb-1">
            <span>Correct Answer</span>
            <span className="text-center">Your Answer</span>
          </div>
          <ul className="mt-2 min-h-0 flex-1 overflow-y-auto space-y-1.5 pr-1">
            {stats.missed.length === 0 ? (
              <li className="text-emerald-300 font-bold py-6 text-center text-base">
                🌟 Perfect round! Zero misses!
              </li>
            ) : (
              stats.missed.map((m: Missed, i: number) => (
                <li
                  key={i}
                  className="grid grid-cols-2 px-2 py-1 text-base sm:text-lg font-medium text-slate-100 bg-white/5 rounded-xs"
                >
                  <span>
                    {m.a} + {m.b} = {m.a + m.b}
                  </span>
                  <span className="text-center font-bold text-amber-300">
                    {m.yourAnswer ?? '—'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {/* Bottom Buttons Bar */}
      <div className="mt-4 flex items-center justify-between">
        <button className={darkBtn} onClick={onMenu}>
          MAIN MENU
        </button>

        {/* Chevron REPLAY Button */}
        <ChevronButton onClick={onRetry} size="lg">
          REPLAY
        </ChevronButton>

        <button className={darkBtn} onClick={handleEndGame}>
          END GAME
        </button>
      </div>
    </div>
  );
}
