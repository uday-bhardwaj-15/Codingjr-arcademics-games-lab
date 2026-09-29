'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSubjectGroups, SubjectGroup } from '@/lib/subjects';
import { soundManager } from '@/core/audio/soundManager';
import {
  Gamepad2,
  ChevronDown,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubjectGroups(getSubjectGroups());
    setIsMuted(soundManager.getMuted());
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const isGameActive = (route: string) => {
    return pathname.startsWith(route);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-t-4 border-t-[#f59e1b] border-b border-amber-200/60 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Arcade Logo */}
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Arcademics Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f59e1b] to-amber-300 flex items-center justify-center text-amber-950 shadow-md group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-[#c05a00] transition-colors">
                  ARCADEMICS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#f59e1b]/15 text-[#c05a00] text-[10px] font-black uppercase tracking-wider">
                  GAMES
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Educational Math Arcade
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              onClick={() => soundManager.playClick()}
              className={`text-sm font-black px-3 py-2 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-[#c05a00] bg-amber-50'
                  : 'text-slate-700 hover:text-[#c05a00] hover:bg-amber-50/60'
              }`}
            >
              Arcade Hub
            </Link>

            {/* Subjects Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 text-sm font-black px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  dropdownOpen || pathname.startsWith('/games')
                    ? 'text-[#c05a00] bg-amber-50 ring-1 ring-amber-300/60'
                    : 'text-slate-700 hover:text-[#c05a00] hover:bg-amber-50/60'
                }`}
              >
                <span>Subjects</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-[#c05a00]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-amber-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-amber-100 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Browse by Subject
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#f59e1b]" />
                  </div>

                  <div className="max-h-[380px] overflow-y-auto py-1 divide-y divide-amber-50">
                    {subjectGroups.map((group) => {
                      return (
                        <div key={group.id} className="p-2 space-y-1">
                          <div className="px-2 py-1 text-xs font-black text-[#c05a00] uppercase tracking-wider flex items-center justify-between">
                            <span>{group.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {group.games.length} {group.games.length === 1 ? 'game' : 'games'}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            {group.games.map((game) => {
                              const active = isGameActive(game.routes.lobby);
                              const isPlayable =
                                game.id === 'jumping-chicks' || game.id === 'alien-addition';

                              return (
                                <Link
                                  key={game.id}
                                  href={isPlayable ? game.routes.lobby : '#'}
                                  onClick={() => {
                                    if (isPlayable) {
                                      soundManager.playClick();
                                      setDropdownOpen(false);
                                    }
                                  }}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-extrabold transition-colors ${
                                    active
                                      ? 'bg-amber-100 text-[#c05a00]'
                                      : isPlayable
                                      ? 'text-slate-800 hover:bg-amber-50 hover:text-[#c05a00]'
                                      : 'text-slate-400 cursor-not-allowed opacity-70'
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span>{game.title}</span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                      {game.gradeLevel}
                                    </span>
                                  </div>

                                  {isPlayable ? (
                                    <ArrowRight className="w-4 h-4 text-amber-500 opacity-60 group-hover:opacity-100" />
                                  ) : (
                                    <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                      Soon
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Subject Shortcuts */}
            <Link
              href="/games/jumping-chicks"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-2.5 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/jumping-chicks')
                  ? 'bg-amber-100 border-amber-300 text-[#c05a00]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#c05a00]'
              }`}
            >
              Counting: Jumping Chicks
            </Link>

            <Link
              href="/games/alien-addition"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-2.5 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/alien-addition')
                  ? 'bg-amber-100 border-amber-300 text-[#c05a00]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#c05a00]'
              }`}
            >
              Addition: Alien Addition
            </Link>
          </nav>

          {/* Right Actions: Sound + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-[#c05a00] border border-amber-200 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-amber-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(false);
            }}
            className={`block px-4 py-2.5 rounded-xl font-black text-sm ${
              pathname === '/' ? 'bg-amber-100 text-[#c05a00]' : 'text-slate-800'
            }`}
          >
            Arcade Hub
          </Link>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">
              Subjects & Games
            </div>

            {subjectGroups.map((group) => (
              <div key={group.id} className="bg-amber-50/60 rounded-2xl p-3 border border-amber-100">
                <div className="text-xs font-black text-[#c05a00] uppercase tracking-wider mb-2">
                  {group.name}
                </div>

                <div className="space-y-1.5">
                  {group.games.map((game) => {
                    const isPlayable =
                      game.id === 'jumping-chicks' || game.id === 'alien-addition';
                    const active = isGameActive(game.routes.lobby);

                    return (
                      <Link
                        key={game.id}
                        href={isPlayable ? game.routes.lobby : '#'}
                        onClick={() => {
                          if (isPlayable) {
                            soundManager.playClick();
                            setMobileMenuOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold ${
                          active
                            ? 'bg-amber-200 text-[#c05a00]'
                            : isPlayable
                            ? 'bg-white text-slate-800 shadow-xs'
                            : 'bg-white/50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>{game.title}</span>
                        {isPlayable ? (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Play
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
