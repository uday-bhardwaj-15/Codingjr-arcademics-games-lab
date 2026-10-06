'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { soundManager } from '@/core/audio/soundManager';
import {
  Sparkles,
  Gamepad2,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  shortTitle: string;
  subject: string;
  subjectLabel: string;
  grade: string;
  tagline: string;
  href: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  renderArt: () => React.ReactNode;
}

export default function ArcadeHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeGames: GameItem[] = [
    {
      id: 'space-race',
      title: 'Space Race Multiplication',
      shortTitle: 'Space Race',
      subject: 'multiplication',
      subjectLabel: 'Multiplication',
      grade: 'Grade 2 - 5',
      tagline: 'Multiplication Fast Facts • 3-Lap Lunar Derby',
      href: '/games/space-race',
      accentColor: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.45)',
      badgeBg: 'bg-blue-500/15 text-blue-700 border-blue-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="spaceSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050a1d" />
              <stop offset="50%" stopColor="#0b1638" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <radialGradient id="nebulaGlow" cx="60%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#050a1d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="moonSurfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="25%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#03456b" />
            </linearGradient>
            <linearGradient id="blueShipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="60%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="goldShipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="engineFlame" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Deep Space & Nebula */}
          <rect width="320" height="220" fill="url(#spaceSkyGrad)" />
          <rect width="320" height="220" fill="url(#nebulaGlow)" />

          {/* Twinkling Stars */}
          <circle cx="35" cy="30" r="1.5" fill="#ffffff" opacity="0.9" />
          <circle cx="95" cy="20" r="1" fill="#93c5fd" opacity="0.7" />
          <circle cx="160" cy="45" r="1.8" fill="#ffffff" opacity="0.9" />
          <circle cx="280" cy="35" r="1.2" fill="#ffffff" opacity="0.8" />
          <circle cx="230" cy="70" r="1" fill="#bae6fd" opacity="0.6" />
          <circle cx="50" cy="85" r="1.2" fill="#ffffff" opacity="0.75" />

          {/* Distant Ringed Planet */}
          <g transform="translate(265, 45)">
            <ellipse cx="0" cy="0" rx="22" ry="7" fill="none" stroke="#a5b4fc" strokeWidth="2.5" opacity="0.6" transform="rotate(-20)" />
            <circle cx="0" cy="0" r="12" fill="#6366f1" />
            <ellipse cx="0" cy="0" rx="22" ry="7" fill="none" stroke="#e0e7ff" strokeWidth="1.2" opacity="0.9" transform="rotate(-20)" strokeDasharray="30 20" />
          </g>

          {/* Cratered Lunar Horizon */}
          <ellipse cx="160" cy="330" rx="220" ry="140" fill="url(#moonSurfGrad)" />
          <ellipse cx="70" cy="200" rx="30" ry="8" fill="#0369a1" opacity="0.6" />
          <ellipse cx="230" cy="205" rx="35" ry="9" fill="#0369a1" opacity="0.6" />
          <ellipse cx="150" cy="215" rx="20" ry="5" fill="#0284c7" opacity="0.7" />

          {/* Speed / Laser grid track line */}
          <path d="M 0 185 Q 160 170 320 185" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="12 8" opacity="0.6" fill="none" />

          {/* Blue Spaceship (Top Racer) */}
          <g transform="translate(30, 45) scale(0.95)">
            {/* Engine Trail */}
            <polygon points="15,62 0,58 0,66" fill="url(#engineFlame)" opacity="0.85" />
            <ellipse cx="105" cy="38" rx="32" ry="24" fill="#93c5fd" opacity="0.7" />
            <path d="M 20 62 C 20 32, 105 28, 205 62 C 105 96, 20 92, 20 62 Z" fill="url(#blueShipGrad)" stroke="#1e40af" strokeWidth="3" />
            {/* Cockpit Dome */}
            <ellipse cx="105" cy="46" rx="26" ry="18" fill="#dbeafe" opacity="0.85" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Eyes */}
            <ellipse cx="98" cy="46" rx="8" ry="10" fill="#ffffff" /><circle cx="101" cy="46" r="4.5" fill="#0f172a" /><circle cx="103" cy="44" r="1.8" fill="#ffffff" />
            <ellipse cx="116" cy="46" rx="8" ry="10" fill="#ffffff" /><circle cx="119" cy="46" r="4.5" fill="#0f172a" /><circle cx="121" cy="44" r="1.8" fill="#ffffff" />
          </g>

          {/* Yellow Spaceship (Lead Racer) */}
          <g transform="translate(95, 95) scale(1.05)">
            {/* Engine Trail */}
            <polygon points="15,62 -10,56 -10,68" fill="#fbbf24" opacity="0.9" />
            <ellipse cx="105" cy="38" rx="32" ry="24" fill="#fef08a" opacity="0.6" />
            <path d="M 20 62 C 20 32, 105 28, 205 62 C 105 96, 20 92, 20 62 Z" fill="url(#goldShipGrad)" stroke="#854d0e" strokeWidth="3.5" />
            {/* Cockpit Dome */}
            <ellipse cx="105" cy="46" rx="26" ry="18" fill="#fef9c3" opacity="0.9" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Eyes */}
            <ellipse cx="98" cy="46" rx="8" ry="10" fill="#ffffff" /><circle cx="101" cy="46" r="4.5" fill="#0f172a" /><circle cx="103" cy="44" r="1.8" fill="#ffffff" />
            <ellipse cx="116" cy="46" rx="8" ry="10" fill="#ffffff" /><circle cx="119" cy="46" r="4.5" fill="#0f172a" /><circle cx="121" cy="44" r="1.8" fill="#ffffff" />
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
      tagline: 'Division Speedway • High-Octane Dragsters',
      href: '/games/drag-race',
      accentColor: '#f97316',
      glowColor: 'rgba(249, 115, 22, 0.45)',
      badgeBg: 'bg-orange-500/15 text-orange-700 border-orange-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="35%" stopColor="#4f46e5" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Sunset Horizon */}
          <rect width="320" height="110" fill="url(#sunsetSky)" />
          {/* Distant Hills */}
          <ellipse cx="60" cy="110" rx="90" ry="25" fill="#15803d" />
          <ellipse cx="260" cy="110" rx="100" ry="28" fill="#166534" />
          <ellipse cx="160" cy="112" rx="60" ry="18" fill="#15803d" />

          {/* Perspective Asphalt Speedway */}
          <polygon points="125,105 195,105 320,220 0,220" fill="url(#roadGrad)" />
          {/* Lane Dashes */}
          <line x1="160" y1="105" x2="160" y2="220" stroke="#facc15" strokeWidth="4" strokeDasharray="16 12" />
          <line x1="130" y1="105" x2="60" y2="220" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
          <line x1="190" y1="105" x2="260" y2="220" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

          {/* Start / Finish Overhead Light Tree at Horizon */}
          <g transform="translate(145, 60)">
            <rect x="13" y="10" width="4" height="35" fill="#334155" />
            <rect x="5" y="10" width="20" height="24" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <circle cx="10" cy="16" r="3" fill="#ef4444" />
            <circle cx="20" cy="16" r="3" fill="#ef4444" />
            <circle cx="10" cy="22" r="3" fill="#eab308" />
            <circle cx="20" cy="22" r="3" fill="#eab308" />
            <circle cx="15" cy="28" r="3.5" fill="#22c55e" className="animate-pulse" />
          </g>

          {/* Pink Cute Dragster (Left Lane) */}
          <g transform="translate(25, 115) scale(0.9)">
            {/* Exhaust Puff */}
            <circle cx="-6" cy="65" r="8" fill="#ffffff" opacity="0.6" />
            <circle cx="-16" cy="60" r="12" fill="#cbd5e1" opacity="0.4" />
            <ellipse cx="55" cy="55" rx="45" ry="30" fill="#ec4899" stroke="#9d174d" strokeWidth="3" />
            {/* Wheels */}
            <rect x="-2" y="62" width="20" height="28" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="92" y="62" width="20" height="28" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            {/* Happy Eyes */}
            <ellipse cx="44" cy="45" rx="10" ry="13" fill="#ffffff" /><circle cx="47" cy="45" r="5" fill="#0f172a" /><circle cx="49" cy="43" r="2" fill="#ffffff" />
            <ellipse cx="68" cy="45" rx="10" ry="13" fill="#ffffff" /><circle cx="71" cy="45" r="5" fill="#0f172a" /><circle cx="73" cy="43" r="2" fill="#ffffff" />
            <path d="M 45 62 Q 56 75 67 62" stroke="#9d174d" strokeWidth="3.5" fill="#dc2626" strokeLinecap="round" />
          </g>

          {/* Blue Smiling Hot-Rod (Lead Right Lane) */}
          <g transform="translate(165, 120) scale(1.05)">
            {/* Exhaust Fire */}
            <polygon points="-8,62 -24,56 -16,68" fill="#f97316" />
            <ellipse cx="55" cy="55" rx="46" ry="30" fill="#2563eb" stroke="#1e3a8a" strokeWidth="3.5" />
            {/* Big Tires */}
            <rect x="-2" y="62" width="22" height="30" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="90" y="62" width="22" height="30" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            {/* Chrome Racing Stripes */}
            <rect x="50" y="26" width="10" height="58" fill="#ffffff" opacity="0.9" />
            {/* Wide Expressive Eyes */}
            <ellipse cx="42" cy="45" rx="11" ry="14" fill="#ffffff" /><circle cx="46" cy="45" r="5.5" fill="#0f172a" /><circle cx="48" cy="43" r="2.2" fill="#ffffff" />
            <ellipse cx="68" cy="45" rx="11" ry="14" fill="#ffffff" /><circle cx="72" cy="45" r="5.5" fill="#0f172a" /><circle cx="74" cy="43" r="2.2" fill="#ffffff" />
            {/* Cheerful Smile */}
            <path d="M 44 64 C 48 76, 66 76, 70 64 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
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
      tagline: 'Subtraction Wave Derby • Tropical Island Sprint',
      href: '/games/island-chase',
      accentColor: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      badgeBg: 'bg-cyan-500/15 text-cyan-700 border-cyan-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="80%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Tropical Sky & Ocean */}
          <rect width="320" height="70" fill="#bae6fd" />
          {/* Sun */}
          <circle cx="50" cy="40" r="22" fill="#fde047" opacity="0.9" />
          <circle cx="50" cy="40" r="30" fill="#fef08a" opacity="0.4" />

          {/* Ocean */}
          <rect y="70" width="320" height="150" fill="url(#oceanGrad)" />

          {/* Wave Ridges */}
          <path d="M 0 110 Q 80 95 160 110 T 320 110 L 320 220 L 0 220 Z" fill="#0284c7" opacity="0.8" />
          <path d="M 0 150 Q 90 135 180 150 T 360 150 L 360 220 L 0 220 Z" fill="#0369a1" opacity="0.7" />

          {/* Tropical Finish Island with Palm Trees */}
          <g transform="translate(230, 45)">
            {/* Island Sand Mound */}
            <ellipse cx="40" cy="45" rx="55" ry="18" fill="url(#sandGrad)" stroke="#ca8a04" strokeWidth="2" />
            {/* Palm Trunk */}
            <path d="M 40 45 Q 32 20 48 -5" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            {/* Palm Fronds */}
            <ellipse cx="48" cy="-5" rx="28" ry="12" fill="#22c55e" transform="rotate(-30 48 -5)" />
            <ellipse cx="48" cy="-5" rx="28" ry="12" fill="#16a34a" transform="rotate(35 48 -5)" />
            <ellipse cx="48" cy="-5" rx="26" ry="10" fill="#15803d" transform="rotate(85 48 -5)" />
            <ellipse cx="48" cy="-5" rx="26" ry="10" fill="#22c55e" transform="rotate(-85 48 -5)" />
            {/* Coconuts */}
            <circle cx="46" cy="-2" r="4" fill="#451a03" />
            <circle cx="51" cy="0" r="3.5" fill="#451a03" />
          </g>

          {/* Pink Speedboat (Competitor) */}
          <g transform="translate(20, 85) scale(0.9)">
            {/* Spray Wake */}
            <ellipse cx="20" cy="55" rx="35" ry="8" fill="#ffffff" opacity="0.75" />
            {/* Racer Character */}
            <ellipse cx="70" cy="22" rx="16" ry="18" fill="#ec4899" stroke="#9d174d" strokeWidth="2" />
            <circle cx="68" cy="20" r="4" fill="#ffffff" /><circle cx="70" cy="20" r="2" fill="#000" />
            {/* Boat Hull */}
            <path d="M 20 45 L 140 45 L 120 70 L 40 70 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="3" />
            <rect x="40" y="45" width="70" height="6" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Cyan / Blue Speedboat (Player Lead) */}
          <g transform="translate(85, 125) scale(1.05)">
            {/* Massive Water Foam Wake */}
            <ellipse cx="25" cy="58" rx="45" ry="10" fill="#ffffff" opacity="0.85" />
            {/* Racer Pilot */}
            <ellipse cx="72" cy="20" rx="17" ry="19" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="70" cy="18" r="5" fill="#ffffff" /><circle cx="72" cy="18" r="2.5" fill="#000" /><circle cx="74" cy="16" r="1" fill="#fff" />
            {/* Sporty Speedboat Hull */}
            <path d="M 15 45 L 150 45 L 125 72 L 40 72 Z" fill="#0284c7" stroke="#075985" strokeWidth="3.5" />
            <polygon points="120,45 150,45 125,72" fill="#38bdf8" />
            <rect x="40" y="45" width="75" height="7" fill="#facc15" />
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
      tagline: 'Addition Laser Turret • Invader Saucer Defense',
      href: '/games/alien-addition',
      accentColor: '#8b5cf6',
      glowColor: 'rgba(139, 92, 246, 0.45)',
      badgeBg: 'bg-purple-500/15 text-purple-700 border-purple-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="alienSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="60%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
            <radialGradient id="alienGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
            <linearGradient id="laserBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Deep Violet Starfield */}
          <rect width="320" height="220" fill="url(#alienSky)" />
          <circle cx="30" cy="25" r="1.5" fill="#fff" />
          <circle cx="120" cy="15" r="1" fill="#fff" opacity="0.8" />
          <circle cx="280" cy="30" r="1.8" fill="#fff" />
          <circle cx="210" cy="65" r="1.2" fill="#c084fc" />
          <circle cx="65" cy="80" r="1" fill="#fff" />

          {/* Glowing Alien Saucer 1 (Green) */}
          <g transform="translate(45, 30)">
            <ellipse cx="50" cy="45" rx="42" ry="16" fill="url(#alienGlow)" stroke="#166534" strokeWidth="2.5" />
            <circle cx="50" cy="32" r="18" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
            {/* Cute Alien Pilot */}
            <circle cx="44" cy="30" r="4.5" fill="#0f172a" /><circle cx="45" cy="28" r="1.8" fill="#fff" />
            <circle cx="56" cy="30" r="4.5" fill="#0f172a" /><circle cx="57" cy="28" r="1.8" fill="#fff" />
            <path d="M 46 38 Q 50 42 54 38" stroke="#166534" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Saucer Lights */}
            <circle cx="20" cy="46" r="3" fill="#fef08a" />
            <circle cx="35" cy="50" r="3.5" fill="#38bdf8" />
            <circle cx="50" cy="52" r="4" fill="#fef08a" />
            <circle cx="65" cy="50" r="3.5" fill="#38bdf8" />
            <circle cx="80" cy="46" r="3" fill="#fef08a" />
          </g>

          {/* Glowing Alien Saucer 2 (Yellow Leader) */}
          <g transform="translate(180, 50)">
            <ellipse cx="50" cy="45" rx="42" ry="16" fill="#eab308" stroke="#854d0e" strokeWidth="2.5" />
            <circle cx="50" cy="32" r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Alien Pilot */}
            <circle cx="44" cy="30" r="4.5" fill="#0f172a" /><circle cx="45" cy="28" r="1.8" fill="#fff" />
            <circle cx="56" cy="30" r="4.5" fill="#0f172a" /><circle cx="57" cy="28" r="1.8" fill="#fff" />
            <path d="M 46 38 Q 50 43 54 38" stroke="#854d0e" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Saucer Lights */}
            <circle cx="20" cy="46" r="3" fill="#f43f5e" />
            <circle cx="35" cy="50" r="3.5" fill="#4ade80" />
            <circle cx="50" cy="52" r="4" fill="#f43f5e" />
            <circle cx="65" cy="50" r="3.5" fill="#4ade80" />
            <circle cx="80" cy="46" r="3" fill="#f43f5e" />
          </g>

          {/* Defense Laser Cannon & Glowing Beam */}
          <line x1="160" y1="210" x2="95" y2="85" stroke="url(#laserBeamGrad)" strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="210" x2="95" y2="85" stroke="#ffffff" strokeWidth="2" opacity="0.9" strokeLinecap="round" />
          <circle cx="95" cy="85" r="10" fill="#f43f5e" opacity="0.75" />

          {/* Turret Base */}
          <g transform="translate(130, 165)">
            <polygon points="30,55 0,55 10,25 20,25" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <polygon points="30,55 60,55 50,25 40,25" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <circle cx="30" cy="25" r="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
            <rect x="26" y="0" width="8" height="25" rx="3" fill="#0f172a" />
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
      tagline: 'Counting Pond Hop • Golden Nest Trophy',
      href: '/games/jumping-chicks',
      accentColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="chickPondGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="30%" stopColor="#16a34a" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <radialGradient id="lilyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="70%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>

          {/* Pond Garden Background */}
          <rect width="320" height="220" fill="url(#chickPondGrad)" />

          {/* Water Ripples */}
          <ellipse cx="80" cy="150" rx="45" ry="14" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
          <ellipse cx="230" cy="165" rx="55" ry="16" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

          {/* Lily Pads */}
          <ellipse cx="65" cy="150" rx="45" ry="24" fill="url(#lilyGrad)" stroke="#14532d" strokeWidth="2.5" />
          <ellipse cx="160" cy="165" rx="50" ry="26" fill="url(#lilyGrad)" stroke="#14532d" strokeWidth="2.5" />
          <ellipse cx="260" cy="145" rx="42" ry="22" fill="url(#lilyGrad)" stroke="#14532d" strokeWidth="2.5" />

          {/* Water Lotus Flower */}
          <g transform="translate(255, 125)">
            <ellipse cx="0" cy="0" rx="10" ry="6" fill="#f43f5e" />
            <ellipse cx="-6" cy="-4" rx="8" ry="12" fill="#fda4af" />
            <ellipse cx="6" cy="-4" rx="8" ry="12" fill="#fda4af" />
            <ellipse cx="0" cy="-6" rx="6" ry="14" fill="#ffffff" />
            <circle cx="0" cy="0" r="4" fill="#fef08a" />
          </g>

          {/* Leap Trajectory Arc */}
          <path d="M 65 130 Q 115 50 160 130" stroke="#facc15" strokeWidth="3" strokeDasharray="8 6" fill="none" opacity="0.8" />

          {/* Leaping Fluffy Chick (Center Hero) */}
          <g transform="translate(125, 55) scale(1.1)">
            {/* Wing in Flight */}
            <ellipse cx="12" cy="38" rx="14" ry="9" fill="#eab308" transform="rotate(-30 12 38)" />
            {/* Chick Body */}
            <circle cx="36" cy="38" r="26" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
            {/* Head */}
            <circle cx="48" cy="22" r="18" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
            {/* Cute Big Eye */}
            <ellipse cx="54" cy="18" rx="6" ry="8" fill="#ffffff" /><circle cx="56" cy="18" r="3.8" fill="#0f172a" /><circle cx="58" cy="16" r="1.5" fill="#ffffff" />
            {/* Rosy Cheek */}
            <circle cx="46" cy="26" r="4" fill="#fb7185" opacity="0.6" />
            {/* Orange Beak */}
            <polygon points="62,20 74,24 62,28" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            {/* Little Feet */}
            <line x1="28" y1="62" x2="24" y2="72" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="62" x2="44" y2="72" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      ),
    },
    {
      id: 'orbit-integers',
      title: 'Orbit Integers',
      shortTitle: 'Orbit Integers',
      subject: 'integers',
      subjectLabel: 'Integers',
      grade: 'Grade 5 - 8',
      tagline: 'Integer Addition & Subtraction • Deep Cosmos Wormhole',
      href: '/games/orbit-integers',
      accentColor: '#6366f1',
      glowColor: 'rgba(99, 102, 241, 0.45)',
      badgeBg: 'bg-indigo-500/15 text-indigo-700 border-indigo-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="cosmosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <radialGradient id="wormholeCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="40%" stopColor="#7c3aed" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>

          {/* Deep Cosmos */}
          <rect width="320" height="220" fill="url(#cosmosGrad)" />

          {/* Star Cluster */}
          <circle cx="45" cy="35" r="1.5" fill="#fff" />
          <circle cx="110" cy="20" r="1" fill="#fff" opacity="0.8" />
          <circle cx="290" cy="40" r="1.8" fill="#fff" />
          <circle cx="240" cy="180" r="1.2" fill="#c084fc" />
          <circle cx="70" cy="170" r="1" fill="#fff" />

          {/* Giant Orbit Ring Vortex Gate */}
          <g transform="translate(200, 100)">
            <ellipse cx="0" cy="0" rx="75" ry="38" fill="url(#wormholeCenter)" opacity="0.85" />
            <ellipse cx="0" cy="0" rx="85" ry="42" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.7" />
            <ellipse cx="0" cy="0" rx="98" ry="48" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="16 10" />
          </g>

          {/* Cyan High-Tech Hyperspace Pod */}
          <g transform="translate(50, 75) scale(1.15)">
            {/* Plasma Trail */}
            <path d="M 0 50 Q -30 45 -45 50 Q -30 55 0 50" fill="#38bdf8" opacity="0.8" />
            <ellipse cx="75" cy="50" rx="60" ry="28" fill="#2563eb" stroke="#1e3a8a" strokeWidth="3" />
            <ellipse cx="75" cy="50" rx="45" ry="18" fill="#38bdf8" opacity="0.7" />
            {/* Cockpit Canopy */}
            <circle cx="95" cy="50" r="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <circle cx="98" cy="48" r="6" fill="#0f172a" /><circle cx="100" cy="46" r="2" fill="#fff" />
            {/* Ion Thrusters */}
            <rect x="12" y="38" width="12" height="24" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          </g>
        </svg>
      ),
    },
    {
      id: 'word-frog',
      title: 'Word Frog',
      shortTitle: 'Word Frog',
      subject: 'language-arts',
      subjectLabel: 'Language Arts',
      grade: 'Grade 2 - 5',
      tagline: 'Antonyms, Synonyms & Homophones • Hungry Frog',
      href: '/games/word-frog',
      accentColor: '#16a34a',
      glowColor: 'rgba(22, 163, 74, 0.45)',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-300/60',
      renderArt: () => (
        <svg viewBox="0 0 320 220" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="frogPondGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5aa6c9" />
              <stop offset="45%" stopColor="#6dbad9" />
              <stop offset="100%" stopColor="#8fd4eb" />
            </linearGradient>
            <radialGradient id="frogSkin" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
            <radialGradient id="largeLily" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="70%" stopColor="#65a30d" />
              <stop offset="100%" stopColor="#365314" />
            </radialGradient>
          </defs>

          {/* Sunlit Pond Water */}
          <rect width="320" height="220" fill="url(#frogPondGrad)" />

          {/* Ambient Ripples */}
          <ellipse cx="160" cy="160" rx="120" ry="40" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          <ellipse cx="160" cy="160" rx="145" ry="48" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />

          {/* Giant Green Lily Pad with V-notch */}
          <g transform="translate(60, 85)">
            <ellipse cx="100" cy="75" rx="85" ry="48" fill="url(#largeLily)" stroke="#365314" strokeWidth="3" />
            <polygon points="100,75 185,60 185,90" fill="url(#frogPondGrad)" />
            <path d="M 100 75 L 30 35" stroke="#bef264" strokeWidth="2" opacity="0.5" />
            <path d="M 100 75 L 30 115" stroke="#bef264" strokeWidth="2" opacity="0.5" />
            <path d="M 100 75 L 100 120" stroke="#bef264" strokeWidth="2" opacity="0.5" />
          </g>

          {/* Dragonfly Flying (Left) */}
          <g transform="translate(30, 35) scale(0.75)">
            <ellipse cx="30" cy="20" rx="24" ry="7" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="1" transform="rotate(-20 30 20)" />
            <ellipse cx="30" cy="35" rx="22" ry="6" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="1" transform="rotate(20 30 35)" />
            <ellipse cx="45" cy="28" rx="6" ry="20" fill="#0f172a" />
            <circle cx="45" cy="10" r="7" fill="#0f172a" />
            <circle cx="43" cy="8" r="3" fill="#38bdf8" />
          </g>

          {/* Dragonfly Flying (Right) */}
          <g transform="translate(230, 45) scale(0.75)">
            <ellipse cx="30" cy="20" rx="24" ry="7" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="1" transform="rotate(20 30 20)" />
            <ellipse cx="30" cy="35" rx="22" ry="6" fill="#bae6fd" opacity="0.85" stroke="#0284c7" strokeWidth="1" transform="rotate(-20 30 35)" />
            <ellipse cx="15" cy="28" rx="6" ry="20" fill="#0f172a" />
            <circle cx="15" cy="10" r="7" fill="#0f172a" />
            <circle cx="17" cy="8" r="3" fill="#38bdf8" />
          </g>

          {/* Cute Big-Eyed Frog Hero */}
          <g transform="translate(115, 80) scale(0.95)">
            {/* Back Feet */}
            <ellipse cx="20" cy="65" rx="16" ry="9" fill="#15803d" stroke="#14532d" strokeWidth="2" transform="rotate(-20 20 65)" />
            <ellipse cx="70" cy="65" rx="16" ry="9" fill="#15803d" stroke="#14532d" strokeWidth="2" transform="rotate(20 70 65)" />
            {/* Body */}
            <ellipse cx="45" cy="48" rx="38" ry="28" fill="url(#frogSkin)" stroke="#14532d" strokeWidth="2.5" />
            {/* Left Big Eye */}
            <g transform="translate(26, 18)">
              <circle cx="0" cy="0" r="14" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
              <circle cx="2" cy="0" r="5" fill="#0f172a" /><circle cx="4" cy="-2" r="1.8" fill="#ffffff" />
            </g>
            {/* Right Big Eye */}
            <g transform="translate(64, 18)">
              <circle cx="0" cy="0" r="14" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
              <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
              <circle cx="2" cy="0" r="5" fill="#0f172a" /><circle cx="4" cy="-2" r="1.8" fill="#ffffff" />
            </g>
            {/* Cheeks */}
            <ellipse cx="24" cy="46" rx="5" ry="3.5" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="66" cy="46" rx="5" ry="3.5" fill="#f43f5e" opacity="0.6" />
            {/* Happy Smile */}
            <path d="M 28 42 Q 45 56 62 42" fill="none" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      ),
    },
  ];

  const categories = [
    { id: 'all', label: 'All Games', icon: '🌟' },
    { id: 'language-arts', label: 'Language Arts', icon: '🐸' },
    { id: 'integers', label: 'Integers', icon: '🪐' },
    { id: 'division', label: 'Division', icon: '🏎️' },
    { id: 'multiplication', label: 'Multiplication', icon: '🚀' },
    { id: 'subtraction', label: 'Subtraction', icon: '🚤' },
    { id: 'addition', label: 'Addition', icon: '👾' },
    { id: 'counting', label: 'Counting', icon: '🐥' },
  ];

  const filteredGames =
    selectedCategory === 'all'
      ? activeGames
      : activeGames.filter((g) => g.subject === selectedCategory);

  return (
    <div className="min-h-full w-full bg-[#fbf7dc] text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-amber-950">
      {/* 1. Hero Banner Section */}
      <section className="w-full bg-[#171515] overflow-hidden relative border-b-4 border-[#f26522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Hero Content */}
          <div className="w-full lg:w-1/2 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Multiplayer Educational Arcade</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
              Arcade <span className="text-[#f26522]">+</span> Academics
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-lg">
              Boost student engagement and master core math & language arts facts with fast-paced, real-time racing games!
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="#games-grid"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#f59e1b] via-[#ea580c] to-[#d97706] hover:brightness-110 active:scale-95 text-white font-black italic text-lg sm:text-xl tracking-wider shadow-2xl border-2 border-yellow-300 transition-all cursor-pointer group"
              >
                <span className="text-yellow-200 group-hover:-translate-x-1 transition-transform mr-2">««</span>
                <span>EXPLORE ALL GAMES</span>
                <span className="text-yellow-200 group-hover:translate-x-1 transition-transform ml-2">»»</span>
              </a>
            </div>
          </div>

          {/* Right Hero Artwork */}
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

              {/* Speed Burst */}
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

      {/* 2. Games Grid Section */}
      <main id="games-grid" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 flex-1">
        {/* Category Pills Bar */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-1.5 bg-amber-100/70 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-inner">
            {categories.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCategory(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#f26522] to-[#ea580c] text-white shadow-lg scale-105 border border-yellow-300/60'
                      : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#f26522] border border-amber-200/60 hover:shadow-xs'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7 Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              onClick={() => soundManager.playClick()}
              className="group relative flex flex-col rounded-3xl bg-white border-2 border-amber-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2.5 overflow-hidden focus:outline-none cursor-pointer select-none"
              style={{
                boxShadow: undefined,
              }}
            >
              {/* Card Illustration Window */}
              <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden border-b-2 border-amber-200/60">
                {/* SVG Artwork */}
                <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-108">
                  {game.renderArt()}
                </div>

                {/* Top Floating Subject Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white shadow-lg text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: game.accentColor }} />
                  <span>{game.subjectLabel}</span>
                </div>

                {/* Top-Right Grade Badge */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-amber-200 shadow-lg text-[10px] font-extrabold tracking-wide">
                  {game.grade}
                </div>

                {/* Sleek Interactive PLAY Button Overlay (Appears effortlessly at bottom of image) */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-center">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f59e1b] via-[#ea580c] to-[#f59e1b] border border-yellow-200/80 shadow-xl flex items-center justify-center gap-2 group-hover:brightness-110 group-hover:scale-[1.02] transition-all">
                    <span className="text-yellow-200 font-black text-xs tracking-tighter">««</span>
                    <span className="font-black italic text-white text-sm tracking-widest drop-shadow-sm">
                      PLAY NOW
                    </span>
                    <span className="text-yellow-200 font-black text-xs tracking-tighter">»»</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Body */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-gradient-to-b from-white to-amber-50/50 space-y-3">
                <div className="space-y-1 text-left">
                  <h3 className="font-black text-lg sm:text-xl text-slate-800 group-hover:text-[#ea580c] transition-colors leading-snug">
                    {game.shortTitle}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed line-clamp-2">
                    {game.tagline}
                  </p>
                </div>

                {/* Footer Tag Chips */}
                <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[#ea580c]">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Real-Time Race</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <Users className="w-3.5 h-3.5" />
                    <span>1-4 Players</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-amber-200 py-8 text-center text-xs font-bold text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#f26522] font-black text-base italic">
            <span>MATH ARCADE</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="text-xs text-slate-500 font-bold not-italic">
              Multiplayer Math & Language Arts Racing Games
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Free Educational Games for Grades K–8 • Practice & Learn
          </div>
        </div>
      </footer>
    </div>
  );
}
