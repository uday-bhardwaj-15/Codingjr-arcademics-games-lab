'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { soundManager } from '@/core/audio/soundManager';

export default function ArcadeHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Exactly the 4 real games we have
  const activeGames = [
    {
      id: 'space-race',
      title: 'Space Race Multiplication',
      shortTitle: 'Space Race',
      subject: 'multiplication',
      subjectLabel: 'Multiplication',
      grade: 'Grade 2 - 5',
      href: '/games/space-race',
      description: '3-lap lunar space race! Solve multiplication facts to surge past rival ships to the finish banner.',
      renderArt: () => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          {/* Deep space & Stars */}
          <rect width="200" height="160" fill="#060e1f" />
          <circle cx="30" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="170" cy="25" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="120" cy="50" r="1.2" fill="#93c5fd" opacity="0.6" />
          {/* Moon Surface at bottom */}
          <circle cx="100" cy="280" r="150" fill="#4f8b8c" />
          <ellipse cx="60" cy="138" rx="14" ry="4" fill="#2c5a5f" />
          <ellipse cx="140" cy="142" rx="18" ry="5" fill="#2c5a5f" />
          {/* Blue & Yellow Spaceships */}
          <g transform="translate(10, 20) scale(0.65)">
            <ellipse cx="95" cy="32" rx="28" ry="22" fill="#93c5fd" opacity="0.85" />
            <path d="M 18 56 C 18 30, 95 26, 186 56 C 95 86, 18 82, 18 56 Z" fill="#1f6bff" stroke="#1244b8" strokeWidth="3" />
            <ellipse cx="90" cy="31" rx="7.5" ry="9" fill="#ffffff" /><circle cx="93" cy="31" r="4" fill="#0f172a" />
            <ellipse cx="106" cy="31" rx="7.5" ry="9" fill="#ffffff" /><circle cx="109" cy="31" r="4" fill="#0f172a" />
          </g>
          <g transform="translate(45, 65) scale(0.75)">
            <ellipse cx="95" cy="32" rx="28" ry="22" fill="#93c5fd" opacity="0.85" />
            <path d="M 18 56 C 18 30, 95 26, 186 56 C 95 86, 18 82, 18 56 Z" fill="#f5c400" stroke="#ba9400" strokeWidth="3" />
            <ellipse cx="90" cy="31" rx="7.5" ry="9" fill="#ffffff" /><circle cx="93" cy="31" r="4" fill="#0f172a" />
            <ellipse cx="106" cy="31" rx="7.5" ry="9" fill="#ffffff" /><circle cx="109" cy="31" r="4" fill="#0f172a" />
          </g>
        </svg>
      ),
    },
    {
      id: 'drag-race',
      title: 'Drag Race Division',
      shortTitle: 'Drag Race',
      subject: 'division',
      subjectLabel: 'Division',
      grade: 'Grade 3 - 6',
      href: '/games/drag-race',
      description: 'High-speed drag racing on the speedway! Solve division facts to accelerate your smiling dragster across the finish line.',
      renderArt: () => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          {/* Sky & Horizon */}
          <rect width="200" height="160" fill="#4b58b8" />
          <rect y="40" width="200" height="120" fill="#169d3e" />
          {/* Horizon Trees */}
          <ellipse cx="40" cy="45" rx="30" ry="10" fill="#3b8852" />
          <ellipse cx="160" cy="45" rx="30" ry="10" fill="#3b8852" />
          {/* Perspective Asphalt Highway */}
          <polygon points="80,45 120,45 190,160 10,160" fill="#4b5563" />
          <line x1="100" y1="45" x2="100" y2="160" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 8" />
          {/* Pink Cute Drag Car */}
          <g transform="translate(25, 65) scale(0.65)">
            <ellipse cx="45" cy="45" rx="35" ry="24" fill="#ec4899" stroke="#9d174d" strokeWidth="2.5" />
            <rect x="0" y="52" width="16" height="24" rx="4" fill="#0f172a" />
            <rect x="74" y="52" width="16" height="24" rx="4" fill="#0f172a" />
            <path d="M 32 38 Q 40 26 48 38" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 52 38 Q 60 26 68 38" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 38 48 Q 50 62 62 48" stroke="#0f172a" strokeWidth="3" fill="#dc2626" />
          </g>
          {/* Blue Smiling Drag Car */}
          <g transform="translate(105, 75) scale(0.7)">
            <ellipse cx="45" cy="45" rx="35" ry="24" fill="#1877f2" stroke="#0c5ec7" strokeWidth="2.5" />
            <rect x="0" y="52" width="16" height="24" rx="4" fill="#0f172a" />
            <rect x="74" y="52" width="16" height="24" rx="4" fill="#0f172a" />
            <ellipse cx="38" cy="38" rx="8" ry="11" fill="#ffffff" /><circle cx="40" cy="38" r="4" fill="#000" />
            <ellipse cx="58" cy="38" rx="8" ry="11" fill="#ffffff" /><circle cx="60" cy="38" r="4" fill="#000" />
            <path d="M 36 50 C 40 60, 60 60, 64 50 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          </g>
        </svg>
      ),
    },
    {
      id: 'island-chase',
      title: 'Island Chase Subtraction',
      shortTitle: 'Island Chase',
      subject: 'subtraction',
      subjectLabel: 'Subtraction',
      grade: 'Grade 1 - 4',
      href: '/games/island-chase',
      description: 'High-speed speedboat race across tropical waters! Subtract quickly to reach the island finish line.',
      renderArt: () => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          {/* Tropical Ocean */}
          <rect width="200" height="160" fill="#0891b2" />
          <path d="M 0 100 Q 50 90, 100 100 T 200 100 L 200 160 L 0 160 Z" fill="#0e7490" />
          <path d="M 0 130 Q 50 120, 100 130 T 200 130 L 200 160 L 0 160 Z" fill="#155e75" />
          {/* Island with Palm Tree */}
          <ellipse cx="165" cy="70" rx="35" ry="12" fill="#fde047" />
          <rect x="162" y="35" width="6" height="35" rx="2" fill="#78350f" />
          <circle cx="165" cy="32" r="18" fill="#22c55e" />
          {/* Speedboats with Racers */}
          <g transform="translate(15, 60) scale(0.65)">
            <ellipse cx="65" cy="30" rx="14" ry="16" fill="#f43f5e" />
            <circle cx="62" cy="28" r="4" fill="#ffffff" /><circle cx="63" cy="28" r="2" fill="#000" />
            <path d="M 20 50 L 140 50 L 120 75 L 40 75 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="3" />
          </g>
          <g transform="translate(50, 90) scale(0.7)">
            <ellipse cx="65" cy="30" rx="14" ry="16" fill="#38bdf8" />
            <circle cx="62" cy="28" r="4" fill="#ffffff" /><circle cx="63" cy="28" r="2" fill="#000" />
            <path d="M 20 50 L 140 50 L 120 75 L 40 75 Z" fill="#0284c7" stroke="#075985" strokeWidth="3" />
          </g>
        </svg>
      ),
    },
    {
      id: 'alien-addition',
      title: 'Alien Addition',
      shortTitle: 'Alien Addition',
      subject: 'addition',
      subjectLabel: 'Addition',
      grade: 'Grade 1 - 3',
      href: '/games/alien-addition',
      description: 'Defend against invading alien saucers! Solve additions and zap matching targets with your laser turret.',
      renderArt: () => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect width="200" height="160" fill="#1e1b4b" />
          <circle cx="40" cy="30" r="1.5" fill="#fff" />
          <circle cx="160" cy="40" r="1.5" fill="#fff" />
          {/* Laser Turret */}
          <polygon points="90,160 110,160 100,120" fill="#38bdf8" />
          <line x1="100" y1="120" x2="100" y2="70" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 3" />
          {/* Flying Saucers */}
          <g transform="translate(20, 30)">
            <ellipse cx="40" cy="30" rx="30" ry="12" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <circle cx="40" cy="20" r="12" fill="#a7f3d0" />
            <circle cx="36" cy="18" r="3" fill="#0f172a" /><circle cx="44" cy="18" r="3" fill="#0f172a" />
          </g>
          <g transform="translate(100, 45)">
            <ellipse cx="40" cy="30" rx="30" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="40" cy="20" r="12" fill="#fef08a" />
            <circle cx="36" cy="18" r="3" fill="#0f172a" /><circle cx="44" cy="18" r="3" fill="#0f172a" />
          </g>
        </svg>
      ),
    },
    {
      id: 'jumping-chicks',
      title: 'Jumping Chicks Counting',
      shortTitle: 'Jumping Chicks',
      subject: 'counting',
      subjectLabel: 'Counting',
      grade: 'Grade K - 2',
      href: '/games/jumping-chicks',
      description: 'Count water lily petals, leap between pads, and race 3 rival chicks to the golden trophy nest!',
      renderArt: () => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          {/* Pond */}
          <rect width="200" height="160" fill="#15803d" />
          <ellipse cx="100" cy="110" rx="90" ry="45" fill="#0284c7" />
          {/* Lily Pads */}
          <circle cx="50" cy="100" r="22" fill="#22c55e" stroke="#166534" strokeWidth="2" />
          <circle cx="110" cy="115" r="25" fill="#22c55e" stroke="#166534" strokeWidth="2" />
          <circle cx="160" cy="95" r="20" fill="#22c55e" stroke="#166534" strokeWidth="2" />
          {/* Cute Yellow Chick */}
          <g transform="translate(85, 55)">
            <circle cx="25" cy="25" r="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="20" cy="20" r="3.5" fill="#0f172a" />
            <polygon points="32,24 40,28 32,32" fill="#f97316" />
          </g>
        </svg>
      ),
    },
  ];

  const filteredGames =
    selectedCategory === 'all'
      ? activeGames
      : activeGames.filter((g) => g.subject === selectedCategory);

  return (
    <div className="min-h-full w-full bg-[#fbf7dc] text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950">
      {/* 1. Hero Banner Section */}
      <section className="w-full bg-[#1b1919] overflow-hidden relative border-b-4 border-[#f26522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="w-full lg:w-1/2 space-y-4 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Arcade + Academics =
            </h2>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
              Fun Learning
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
              Learn math facts quickly and boost student engagement with our free skill-building multiplayer math games & races!
            </p>

            {/* Big Chevron PLAY Button */}
            <div className="pt-3">
              <a
                href="#games-grid"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center justify-center px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#f59e1b] via-[#ea580c] to-[#d97706] hover:brightness-110 active:scale-95 text-white font-black italic text-xl tracking-wider shadow-xl border-2 border-yellow-300 transition-all cursor-pointer group"
              >
                <span className="text-yellow-200 group-hover:-translate-x-1 transition-transform mr-2">««</span>
                <span>PLAY</span>
                <span className="text-yellow-200 group-hover:translate-x-1 transition-transform ml-2">»»</span>
              </a>
            </div>
          </div>

          {/* Right Hero Artwork: Racing Speedway */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <svg viewBox="0 0 540 320" className="w-full max-w-[500px] h-auto drop-shadow-2xl overflow-visible">
              <defs>
                <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="speedRays" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#065f46" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Green Speed Burst */}
              <path d="M 200 0 L 540 0 L 540 320 L 350 320 Z" fill="url(#speedRays)" />

              {/* Curved Racetrack */}
              <path d="M 0 160 C 180 80, 360 80, 540 180 L 540 320 L 0 320 Z" fill="url(#trackGrad)" />
              <path d="M 0 240 C 180 180, 360 180, 540 260" stroke="#facc15" strokeWidth="4" strokeDasharray="16 12" fill="none" />

              {/* Yellow Cute Race Car */}
              <g transform="translate(240, 75) rotate(12)">
                <ellipse cx="65" cy="55" rx="55" ry="38" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
                <rect x="0" y="70" width="22" height="28" rx="6" fill="#0f172a" />
                <rect x="95" y="70" width="22" height="28" rx="6" fill="#0f172a" />
                <ellipse cx="50" cy="42" rx="12" ry="16" fill="#ffffff" stroke="#000" strokeWidth="2" />
                <ellipse cx="52" cy="42" rx="6" ry="8" fill="#000000" />
                <ellipse cx="80" cy="42" rx="12" ry="16" fill="#ffffff" stroke="#000" strokeWidth="2" />
                <ellipse cx="82" cy="42" rx="6" ry="8" fill="#000000" />
                <path d="M 50 68 Q 66 82 82 68" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
              </g>

              {/* Blue Lightning Race Car */}
              <g transform="translate(380, 105) rotate(6)">
                <ellipse cx="55" cy="45" rx="45" ry="32" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
                <rect x="0" y="55" width="18" height="24" rx="5" fill="#0f172a" />
                <rect x="80" y="55" width="18" height="24" rx="5" fill="#0f172a" />
                <ellipse cx="44" cy="35" rx="10" ry="14" fill="#ffffff" stroke="#000" strokeWidth="2" />
                <ellipse cx="45" cy="35" rx="5" ry="7" fill="#000000" />
                <ellipse cx="68" cy="35" rx="10" ry="14" fill="#ffffff" stroke="#000" strokeWidth="2" />
                <ellipse cx="69" cy="35" rx="5" ry="7" fill="#000000" />
              </g>

              {/* Green Smiling Jet Racer */}
              <g transform="translate(260, 0) rotate(18)">
                <ellipse cx="45" cy="35" rx="35" ry="24" fill="#4ade80" stroke="#16a34a" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="8" ry="10" fill="#ffffff" />
                <ellipse cx="54" cy="28" rx="8" ry="10" fill="#ffffff" />
              </g>

              {/* Golden Lightning Bolt */}
              <polygon points="400,20 440,70 420,70 450,130 405,65 425,65" fill="#facc15" className="drop-shadow-lg" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Games Grid Section (Only our real games) */}
      <main id="games-grid" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: 'All Games' },
            { id: 'division', label: 'Division' },
            { id: 'multiplication', label: 'Multiplication' },
            { id: 'subtraction', label: 'Subtraction' },
            { id: 'addition', label: 'Addition' },
            { id: 'counting', label: 'Counting' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(tab.id);
              }}
              className={`px-5 sm:px-6 py-2 rounded-full font-black text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#f26522] text-white shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#f26522] border border-amber-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4 Active Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              onClick={() => soundManager.playClick()}
              className="group flex flex-col items-center space-y-3 focus:outline-none cursor-pointer"
            >
              {/* Card Container with Artwork & Orange PLAY Banner */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-200 border-2 border-amber-300/80 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                {/* Game Artwork */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  {game.renderArt()}
                </div>

                {/* Orange Chevron PLAY Banner across center */}
                <div className="relative z-10 w-[82%] py-2 bg-gradient-to-r from-[#f59e1b] via-[#ea580c] to-[#f59e1b] border-2 border-yellow-300 rounded-md shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="font-black italic text-white text-sm sm:text-base tracking-widest drop-shadow">
                    PLAY
                  </span>
                </div>
              </div>

              {/* Title & Subject Info */}
              <div className="text-center space-y-1">
                <span className="block font-black text-base sm:text-lg text-[#92400e] group-hover:text-[#ea580c] transition-colors leading-tight">
                  {game.shortTitle}
                </span>
                <span className="inline-block text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {game.subjectLabel} • {game.grade}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/70 border-t border-amber-200/80 py-6 text-center text-xs font-bold text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Multiplayer Math Racing & Practice Games
        </div>
      </footer>
    </div>
  );
}
