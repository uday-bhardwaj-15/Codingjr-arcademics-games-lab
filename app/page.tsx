'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { gameRegistry } from '../lib/gameRegistry';
import { ArcadeStorage } from '../core/state/storage';
import { PlayerProfile, PlayerColor } from '../core/types/player';
import { soundManager } from '../core/audio/soundManager';
import { Chick } from '../games/jumping-chicks/components/Chick';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
  Play,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  Star
} from 'lucide-react';

const COLORS: { id: PlayerColor; label: string; bg: string }[] = [
  { id: 'blue', label: 'Blue', bg: 'bg-sky-500' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-amber-400' },
  { id: 'red', label: 'Red', bg: 'bg-rose-500' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-500' },
];

export default function ArcadeHub() {
  const [profile, setProfile] = useState<PlayerProfile>({
    id: 'player_human',
    name: 'Player 1',
    color: 'blue',
    isBot: false,
  });

  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [matchHistory, setMatchHistory] = useState(() => ArcadeStorage.getLeaderboard('jumping-chicks'));

  useEffect(() => {
    const saved = ArcadeStorage.getPlayerProfile();
    setProfile(saved);
    setMatchHistory(ArcadeStorage.getLeaderboard('jumping-chicks'));
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...profile, name: e.target.value || 'Player 1' };
    setProfile(updated);
    ArcadeStorage.savePlayerProfile(updated);
  };

  const handleColorChange = (color: PlayerColor) => {
    soundManager.playClick();
    const updated = { ...profile, color };
    setProfile(updated);
    ArcadeStorage.savePlayerProfile(updated);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const totalMatches = matchHistory.length;
  const totalWins = matchHistory.filter(m => {
    const humanScore = m.players.find(p => !p.isBot);
    return humanScore?.rank === 1;
  }).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 text-white font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950">
      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-950 shadow-lg shadow-amber-400/30">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              ARCADEMICS <span className="text-amber-400">ARCADE</span>
            </h1>
            <p className="text-[11px] font-bold text-sky-300/80 uppercase tracking-wider">
              Educational Multiplayer Racing
            </p>
          </div>
        </div>

        {/* Global Sound & Profile Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label="Toggle sound"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8 flex-1">
        {/* Hero Section: Featured Game Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 p-6 sm:p-10 shadow-2xl border border-white/20">
          {/* Subtle background glow circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                <Flame className="w-4 h-4 fill-current" />
                Featured Game #1
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                Jumping Chicks
              </h2>

              <p className="text-sm sm:text-base text-sky-100 font-semibold max-w-xl leading-relaxed">
                Count the water lily petals, leap to the correct platform, and race 3 lively AI chicks across the pond to reach the golden trophy nest!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-white/30">
                  <Users className="w-4 h-4 text-sky-200" />
                  <span>4 Players (1 Human + 3 Bots)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-white/30">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>No Waiting • Non-Stop Rounds</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/games/jumping-chicks"
                  onClick={() => soundManager.playClick()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-lg shadow-xl shadow-amber-400/30 flex items-center gap-3 transition-transform active:scale-95 border-b-4 border-amber-600"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>PLAY NOW</span>
                </Link>

                <Link
                  href="/games/jumping-chicks"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-base border border-white/30 transition-colors"
                >
                  Game Lobby
                </Link>
              </div>
            </div>

            {/* Right Hero Mascot & Chick Preview */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <Chick color="blue" size="md" />
                  <Chick color="yellow" size="lg" status="celebrate" />
                  <Chick color="red" size="md" />
                </div>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider mt-2">
                  Ready to Hop!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Player Customization & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Player Profile Card */}
          <div className="md:col-span-6 lg:col-span-5 rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Your Player Card</h3>
                <p className="text-xs font-bold text-sky-200/70">Persists across all arcade games</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Chick color={profile.color} size="md" />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[11px] font-black uppercase text-sky-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={profile.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-1.5 text-sm font-bold rounded-xl bg-white/15 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-white/40"
                    placeholder="Enter nickname"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-sky-300 mb-1">
                    Chick Color
                  </label>
                  <div className="flex items-center gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleColorChange(c.id)}
                        className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
                          profile.color === c.id
                            ? 'scale-125 ring-4 ring-white shadow-lg'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Career Stats */}
          <div className="md:col-span-6 lg:col-span-7 rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/15 shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <Trophy className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Arcade Statistics</h3>
                <p className="text-xs font-bold text-sky-200/70">Client-side saved match history</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 my-2">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{totalMatches}</span>
                <p className="text-xs font-bold text-sky-300 uppercase tracking-wider mt-1">
                  Matches Played
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{totalWins}</span>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-1">
                  1st Place Wins
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0}%
                </span>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-1">
                  Win Rate
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-sky-300/60">
                Data saved in browser localStorage (v1.0)
              </span>
            </div>
          </div>
        </div>

        {/* All Games Grid from Registry */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">All Arcade Games</h2>
            </div>
            <span className="text-xs font-black text-sky-300 bg-sky-900/60 px-3 py-1 rounded-full border border-sky-400/30">
              {gameRegistry.length} Titles in Registry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameRegistry.map((game) => {
              const isPlayable = game.id === 'jumping-chicks';

              return (
                <div
                  key={game.id}
                  className={`relative rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                    isPlayable
                      ? 'bg-gradient-to-br from-white/15 to-white/5 border-amber-400/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/10'
                      : 'bg-white/5 border-white/10 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {game.category}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isPlayable
                            ? 'bg-emerald-400 text-emerald-950 font-black'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {game.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white">{game.title}</h3>
                    <p className="text-xs font-bold text-sky-200/80 leading-relaxed">
                      {game.description}
                    </p>

                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 pt-1">
                      <span>Grade: {game.gradeLevel}</span>
                      <span>•</span>
                      <span>{game.minPlayers} Players</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    {isPlayable ? (
                      <Link
                        href={game.routes.lobby}
                        onClick={() => soundManager.playClick()}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-transform border-b-2 border-emerald-700"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>ENTER LOBBY</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 rounded-2xl bg-white/10 text-slate-400 font-bold text-xs cursor-not-allowed border border-white/10"
                      >
                        Coming in Next Update
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Arcade Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 text-center text-xs font-bold text-sky-300/60">
        Arcademics Next.js Arcade Platform • Pure Client-Side Architecture • Scalable Game Module System
      </footer>
    </div>
  );
}
