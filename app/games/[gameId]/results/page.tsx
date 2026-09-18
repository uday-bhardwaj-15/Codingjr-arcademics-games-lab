'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchStore } from '@/core/state/useMatchStore';
import { ArcadeStorage } from '@/core/state/storage';
import { LeaderboardView } from '@/core/components/Leaderboard/LeaderboardView';
import { MatchResult } from '@/core/types/match';

export default function GameResultsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = (params?.gameId as string) || 'jumping-chicks';
  const { lastMatchResult, resetMatch } = useMatchStore();

  let activeResult: MatchResult | null = lastMatchResult;

  if (!activeResult) {
    const history = ArcadeStorage.getLeaderboard(gameId);
    if (history.length > 0) {
      activeResult = history[0];
    }
  }

  if (!activeResult) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <h1 className="text-3xl font-black">No Recent Match Found</h1>
        <p className="text-slate-400">Play a match first to view leaderboard results.</p>
        <button
          onClick={() => router.push(`/games/${gameId}`)}
          className="px-6 py-3 rounded-xl bg-amber-500 text-amber-950 font-black cursor-pointer"
        >
          Enter Game Lobby
        </button>
      </div>
    );
  }

  const handlePlayAgain = () => {
    resetMatch();
    router.push(`/games/${gameId}/play`);
  };

  return <LeaderboardView result={activeResult} onPlayAgain={handlePlayAgain} />;
}
