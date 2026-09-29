'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';

const JumpingChicksGame = dynamic(
  () =>
    import('@/games/jumping-chicks/components/JumpingChicksGame').then(
      (mod) => mod.JumpingChicksGame
    ),
  { ssr: false }
);

const AlienAdditionGame = dynamic(
  () =>
    import('@/games/alien-addition/AlienAdditionGame').then(
      (mod) => mod.AlienAdditionGame
    ),
  { ssr: false }
);

export default function GamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = (params?.gameId as string) || 'jumping-chicks';

  if (gameId === 'jumping-chicks') {
    return <JumpingChicksGame />;
  }

  if (gameId === 'alien-addition') {
    return <AlienAdditionGame />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
      <h1 className="text-3xl font-black">Game Engine Coming Soon</h1>
      <p className="text-slate-400">Game &quot;{gameId}&quot; is currently in development.</p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 rounded-xl bg-amber-500 text-amber-950 font-black cursor-pointer"
      >
        Back to Arcade Hub
      </button>
    </div>
  );
}
