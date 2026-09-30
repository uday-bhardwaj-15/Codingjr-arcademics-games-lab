'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { getGameManifest } from '@/lib/gameRegistry';
import { LobbyView } from '@/core/components/Lobby/LobbyView';

const AlienAdditionGame = dynamic(
  () =>
    import('@/games/alien-addition/AlienAdditionGame').then(
      (mod) => mod.AlienAdditionGame
    ),
  { ssr: false }
);

const DragRaceGame = dynamic(
  () =>
    import('@/games/drag-race/DragRaceGame').then(
      (mod) => mod.DragRaceGame
    ),
  { ssr: false }
);

export default function GameLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = (params?.gameId as string) || 'jumping-chicks';

  const manifest = getGameManifest(gameId);

  if (!manifest) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <h1 className="text-3xl font-black">Game Not Found</h1>
        <p className="text-slate-400">The game &quot;{gameId}&quot; is not registered in the arcade registry.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-amber-500 text-amber-950 font-black cursor-pointer"
        >
          Back to Arcade Hub
        </button>
      </div>
    );
  }

  // Games with integrated title/lobby/play flow
  if (gameId === 'drag-race') {
    return <DragRaceGame />;
  }

  if (manifest.mode === 'solo' || gameId === 'alien-addition') {
    return <AlienAdditionGame />;
  }

  return <LobbyView manifest={manifest} />;
}
