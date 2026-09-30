'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSubjectGroups, SubjectGroup } from '@/lib/subjects';
import { soundManager } from '@/core/audio/soundManager';
import {
  ChevronDown,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [subjectsDropdownOpen, setSubjectsDropdownOpen] = useState(false);
  const [gradesDropdownOpen, setGradesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const subjectsRef = useRef<HTMLDivElement>(null);
  const gradesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubjectGroups(getSubjectGroups());
    setIsMuted(soundManager.getMuted());
  }, []);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectsRef.current && !subjectsRef.current.contains(e.target as Node)) {
        setSubjectsDropdownOpen(false);
      }
      if (gradesRef.current && !gradesRef.current.contains(e.target as Node)) {
        setGradesDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubjectsDropdownOpen(false);
        setGradesDropdownOpen(false);
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
    setSubjectsDropdownOpen(false);
    setGradesDropdownOpen(false);
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

  const gradesList = [
    { grade: 'Grade K - 1', desc: 'Counting: Jumping Chicks', href: '/games/jumping-chicks' },
    { grade: 'Grade 1 - 3', desc: 'Addition: Alien Addition', href: '/games/alien-addition' },
    { grade: 'Grade 2 - 4', desc: 'Subtraction: Island Chase', href: '/games/island-chase' },
    { grade: 'Grade 3 - 5', desc: 'Multiplication: Space Race', href: '/games/space-race' },
    { grade: 'Grade 3 - 6', desc: 'Division: Drag Race Division', href: '/games/drag-race' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-amber-200/60 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo (Without Arcademics name) */}
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Math Arcade Home"
          >
            <div className="flex items-center text-[#f26522] font-black text-2xl tracking-tighter">
              <span className="text-[#f26522] flex items-center gap-1">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M4 18L10 12L4 6H8L14 12L8 18H4ZM11 18L17 12L11 6H15L21 12L15 18H11Z" />
                </svg>
                <span className="font-black italic text-2xl tracking-tight text-[#f26522]">
                  MATH ARCADE
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* 1. Grades Dropdown */}
            <div className="relative" ref={gradesRef}>
              <button
                type="button"
                onClick={() => {
                  setGradesDropdownOpen(!gradesDropdownOpen);
                  setSubjectsDropdownOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                  gradesDropdownOpen
                    ? 'text-[#f26522]'
                    : 'text-slate-700 hover:text-[#f26522]'
                }`}
              >
                <span>Grades</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    gradesDropdownOpen ? 'rotate-180 text-[#f26522]' : 'text-slate-400'
                  }`}
                />
              </button>

              {gradesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-amber-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-amber-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Browse By Grade Level
                  </div>
                  <div className="p-1">
                    {gradesList.map((g) => (
                      <Link
                        key={g.grade}
                        href={g.href}
                        onClick={() => {
                          soundManager.playClick();
                          setGradesDropdownOpen(false);
                        }}
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-[#f26522] transition-colors"
                      >
                        <span className="font-bold text-sm">{g.grade}</span>
                        <span className="text-[11px] text-slate-400">{g.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Subjects Dropdown */}
            <div className="relative" ref={subjectsRef}>
              <button
                type="button"
                onClick={() => {
                  setSubjectsDropdownOpen(!subjectsDropdownOpen);
                  setGradesDropdownOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                  subjectsDropdownOpen || pathname.startsWith('/games')
                    ? 'text-[#f26522]'
                    : 'text-slate-700 hover:text-[#f26522]'
                }`}
              >
                <span>Subjects</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    subjectsDropdownOpen ? 'rotate-180 text-[#f26522]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {subjectsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-amber-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 border-b border-amber-100 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Subjects & Games
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#f26522]" />
                  </div>

                  <div className="max-h-[380px] overflow-y-auto py-1 divide-y divide-amber-50">
                    {subjectGroups.map((group) => (
                      <div key={group.id} className="p-2 space-y-1">
                        <div className="px-2 py-1 text-xs font-black text-[#f26522] uppercase tracking-wider flex items-center justify-between">
                          <span>{group.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {group.games.length} {group.games.length === 1 ? 'game' : 'games'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          {group.games.map((game) => {
                            const active = isGameActive(game.routes.lobby);

                            return (
                              <Link
                                key={game.id}
                                href={game.routes.lobby}
                                onClick={() => {
                                  soundManager.playClick();
                                  setSubjectsDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                                  active
                                    ? 'bg-amber-100 text-[#f26522]'
                                    : 'text-slate-800 hover:bg-amber-50 hover:text-[#f26522]'
                                }`}
                              >
                                <div className="flex flex-col">
                                  <span>{game.title}</span>
                                  <span className="text-[10px] font-medium text-slate-400">
                                    {game.category} • {game.gradeLevel}
                                  </span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-500 opacity-60 group-hover:opacity-100" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Game Links */}
            <Link
              href="/games/drag-race"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/drag-race')
                  ? 'bg-amber-100 border-amber-300 text-[#f26522]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#f26522]'
              }`}
            >
              Division
            </Link>

            <Link
              href="/games/space-race"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/space-race')
                  ? 'bg-amber-100 border-amber-300 text-[#f26522]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#f26522]'
              }`}
            >
              Multiplication
            </Link>

            <Link
              href="/games/island-chase"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/island-chase')
                  ? 'bg-amber-100 border-amber-300 text-[#f26522]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#f26522]'
              }`}
            >
              Subtraction
            </Link>

            <Link
              href="/games/alien-addition"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/alien-addition')
                  ? 'bg-amber-100 border-amber-300 text-[#f26522]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#f26522]'
              }`}
            >
              Addition
            </Link>

            <Link
              href="/games/jumping-chicks"
              onClick={() => soundManager.playClick()}
              className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-colors ${
                isGameActive('/games/jumping-chicks')
                  ? 'bg-amber-100 border-amber-300 text-[#f26522]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300 hover:text-[#f26522]'
              }`}
            >
              Counting
            </Link>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg hover:bg-amber-50 text-slate-600 hover:text-[#f26522] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              )}
            </button>
          </nav>

          {/* Right Actions: Mobile Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-amber-50 text-slate-700 hover:text-[#f26522]"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-amber-50 text-slate-800"
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
            className={`block px-4 py-2.5 rounded-xl font-bold text-sm ${
              pathname === '/' ? 'bg-amber-100 text-[#f26522]' : 'text-slate-800'
            }`}
          >
            All Games
          </Link>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">
              Subjects & Games
            </div>

            {subjectGroups.map((group) => (
              <div key={group.id} className="bg-amber-50/60 rounded-2xl p-3 border border-amber-100">
                <div className="text-xs font-black text-[#f26522] uppercase tracking-wider mb-2">
                  {group.name}
                </div>

                <div className="space-y-1.5">
                  {group.games.map((game) => {
                    const active = isGameActive(game.routes.lobby);

                    return (
                      <Link
                        key={game.id}
                        href={game.routes.lobby}
                        onClick={() => {
                          soundManager.playClick();
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold ${
                          active
                            ? 'bg-amber-200 text-[#f26522]'
                            : 'bg-white text-slate-800 shadow-xs'
                        }`}
                      >
                        <span>{game.title}</span>
                        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Play
                        </span>
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
