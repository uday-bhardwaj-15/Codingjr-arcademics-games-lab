'use client';

import React from 'react';
import { PlayerColor } from '../../types/player';
import { User, Bot } from 'lucide-react';

interface PlayerBadgeProps {
  name: string;
  color: PlayerColor;
  isBot?: boolean;
  isReady?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rank?: number;
}

const COLOR_CLASSES: Record<PlayerColor, { bg: string; ring: string; text: string; badge: string; gradient: string }> = {
  blue: {
    bg: 'bg-sky-500',
    ring: 'ring-sky-400',
    text: 'text-sky-950',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    gradient: 'from-sky-400 to-blue-600'
  },
  yellow: {
    bg: 'bg-amber-400',
    ring: 'ring-amber-300',
    text: 'text-amber-950',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    gradient: 'from-amber-300 to-yellow-500'
  },
  red: {
    bg: 'bg-rose-500',
    ring: 'ring-rose-400',
    text: 'text-rose-950',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    gradient: 'from-rose-400 to-red-600'
  },
  orange: {
    bg: 'bg-orange-500',
    ring: 'ring-orange-400',
    text: 'text-orange-950',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    gradient: 'from-orange-400 to-amber-600'
  }
};

export const PlayerBadge: React.FC<PlayerBadgeProps> = ({
  name,
  color,
  isBot = false,
  isReady = true,
  size = 'md',
  rank
}) => {
  const theme = COLOR_CLASSES[color] || COLOR_CLASSES.blue;

  const sizeClasses = {
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-sm py-1.5 px-3.5 gap-2',
    lg: 'text-base py-2.5 px-4 gap-3'
  }[size];

  const avatarSizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-11 h-11 text-base'
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 font-bold transition-transform duration-200 ${sizeClasses}`}
    >
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-sm ring-2 ${theme.ring} ${avatarSizes}`}
      >
        {isBot ? <Bot className="w-4 h-4 opacity-90" /> : <User className="w-4 h-4" />}
        {rank !== undefined && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold shadow">
            {rank}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-800 truncate max-w-[130px] font-extrabold">{name}</span>
          {isBot ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
              Bot
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
              YOU
            </span>
          )}
        </div>
      </div>

      {isReady && (
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse ml-auto" />
      )}
    </div>
  );
};
