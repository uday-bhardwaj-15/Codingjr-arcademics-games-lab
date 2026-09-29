'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSubjectGroups, SubjectGroup } from '@/lib/subjects';
import { ArcadeStorage } from '@/core/state/storage';
import { PlayerProfile, PlayerColor } from '@/core/types/player';
import { soundManager } from '@/core/audio/soundManager';
import { Chick } from '@/games/jumping-chicks/components/Chick';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
  Play,
  Flame,
  Zap,
  Star,
  Layers,
  ArrowRight,
  Award
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

  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  useEffect(() => {
    const saved = ArcadeStorage.getPlayerProfile();
    setProfile(saved);
    setSubjectGroups(getSubjectGroups());

    // Calculate aggregated stats across games
    const jumpingChicksHistory = ArcadeStorage.getLeaderboard('jumping-chicks');
    const alienAdditionHistory = ArcadeStorage.getLeaderboard('alien-addition');
    const islandChaseHistory = ArcadeStorage.getLeaderboard('island-chase');
    const allMatches = [...jumpingChicksHistory, ...alienAdditionHistory, ...islandChaseHistory];

    const wins = allMatches.filter((m) => {
      const humanScore = m.players?.find((p) => !p.isBot);
      return humanScore?.rank === 1;
    }).length;

    setTotalMatches(allMatches.length);
    setTotalWins(wins);
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

  return (
    <div className="min-h-full w-full bg-[#fbf7dc] text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950">
      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-1">
        {/* Featured Games Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Game 1: Alien Addition (New!) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120524] via-[#240e44] to-[#451268] p-6 sm:p-8 text-white shadow-xl border border-purple-500/40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-fuchsia-400/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 bg-[#f59e1b] text-amber-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  New Game #2
                </div>
                <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/30 text-purple-200">
                  Subject: Addition
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight drop-shadow-md">
                  Alien Addition
                </h2>
                <p className="text-xs sm:text-sm text-purple-100/90 font-medium mt-1 leading-relaxed">
                  Defend the galaxy against invading alien saucers! Move your laser turret, solve the addition problems on the saucers, and zap the correct match before time runs out!
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-purple-100">
                  🛸 5 Flying Saucers
                </span>
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-purple-100">
                  ⚡ Laser Turret Target Match
                </span>
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-amber-300">
                  ⏱️ 60s Timed Arcade Solo
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center gap-3">
              <Link
                href="/games/alien-addition"
                onClick={() => soundManager.playClick()}
                className="flex-1 py-3.5 rounded-2xl bg-[#f59e1b] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-base sm:text-lg shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform border-b-4 border-amber-600 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PLAY ALIEN ADDITION</span>
              </Link>
            </div>
          </div>

          {/* Featured Game 2: Jumping Chicks */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b6b55] via-[#2a8b72] to-[#48caaa] p-6 sm:p-8 text-white shadow-xl border border-teal-300/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Game #1
                </div>
                <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/30 text-teal-100">
                  Subject: Counting
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight drop-shadow-md">
                  Jumping Chicks
                </h2>
                <p className="text-xs sm:text-sm text-teal-50/90 font-medium mt-1 leading-relaxed">
                  Count the lily petals on each water lily pad, leap onto matching number platforms, and race across the pond to the golden trophy nest!
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-teal-100">
                  🐣 4 Racing Chicks
                </span>
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-teal-100">
                  🌸 Number Recognition
                </span>
                <span className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20 font-bold text-amber-300">
                  🏆 Trophy Nest Finish
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center gap-3">
              <Link
                href="/games/jumping-chicks"
                onClick={() => soundManager.playClick()}
                className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black italic text-base sm:text-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform border-b-4 border-amber-600 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PLAY JUMPING CHICKS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Player Customization & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Player Profile Card */}
          <div className="md:col-span-6 lg:col-span-5 rounded-3xl bg-white p-6 border border-amber-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#c05a00] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Your Player Profile</h3>
                <p className="text-xs font-bold text-slate-500">Shared across all arcade games</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center shadow-inner">
                <div className="transform scale-90">
                  <Chick color={profile.color} size="sm" showShadow={false} />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Racer Name
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={profile.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-1.5 text-sm font-extrabold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f59e1b] text-slate-900"
                    placeholder="Enter nickname"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                    Color Theme
                  </label>
                  <div className="flex items-center gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleColorChange(c.id)}
                        className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
                          profile.color === c.id
                            ? 'scale-125 ring-4 ring-amber-400 shadow-md'
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
          <div className="md:col-span-6 lg:col-span-7 rounded-3xl bg-white p-6 border border-amber-200/80 shadow-md flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#c05a00] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Career Match Records</h3>
                <p className="text-xs font-bold text-slate-500">Saved in browser localStorage</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 my-2">
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70 text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalMatches}</span>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-1">
                  Matches Played
                </p>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70 text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#c05a00]">{totalWins}</span>
                <p className="text-[11px] font-bold text-[#c05a00] uppercase tracking-wider mt-1">
                  1st Place Wins
                </p>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70 text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0}%
                </span>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-1">
                  Win Rate
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400">
                Pure Client-Side Architecture • Instant Play
              </span>
            </div>
          </div>
        </div>

        {/* Games Grouped by Subject Sections */}
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between border-b border-amber-300 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#c05a00] text-white flex items-center justify-center font-black">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#c05a00] tracking-tight">
                  Arcade Games by Subject
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Explore racing games organized by mathematical learning domains
                </p>
              </div>
            </div>
          </div>

          {subjectGroups.map((group) => (
            <section key={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e1b]" />
                    {group.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{group.description}</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-amber-200">
                  {group.games.length} {group.games.length === 1 ? 'Game' : 'Games'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {group.games.map((game) => {
                  const isPlayable =
                    game.id === 'jumping-chicks' ||
                    game.id === 'alien-addition' ||
                    game.id === 'island-chase';

                  return (
                    <div
                      key={game.id}
                      className={`relative rounded-3xl p-6 border transition-all flex flex-col justify-between bg-white ${
                        isPlayable
                          ? 'border-amber-300 shadow-lg hover:shadow-xl hover:border-[#f59e1b]'
                          : 'border-slate-200 opacity-70 bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-[#c05a00] border border-amber-200">
                            {game.category}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isPlayable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isPlayable ? 'Ready to Play' : game.badge}
                          </span>
                        </div>

                        <h4 className="text-xl sm:text-2xl font-black text-slate-900">{game.title}</h4>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                          {game.description}
                        </p>

                        <div className="text-xs font-bold text-slate-500 flex items-center gap-3 pt-1">
                          <span>Grade: {game.gradeLevel}</span>
                          <span>•</span>
                          <span>
                            {game.mode === 'solo'
                              ? '1 Player (Arcade Solo)'
                              : `${game.minPlayers} Players (1 Human + 3 Bots)`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6">
                        {isPlayable ? (
                          <Link
                            href={game.routes.lobby}
                            onClick={() => soundManager.playClick()}
                            className="w-full py-3 rounded-2xl bg-[#f59e1b] hover:bg-[#ffaa22] text-white font-black italic text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform border-b-2 border-amber-600 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{game.mode === 'solo' ? 'PLAY GAME' : 'ENTER GAME LOBBY'}</span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full py-3 rounded-2xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Arcade Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-amber-200/80 text-center text-xs font-bold text-slate-500">
        Arcademics Arcade Platform • Scalable Subject-Driven Game Modules • Pure Client-Side Architecture
      </footer>
    </div>
  );
}
