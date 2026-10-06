import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PondHudProps {
  hits: number;
  misses: number;
  timeLeftSeconds: number;
  totalTimeSeconds: number;
  wordsPerMinute: number;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const PondHud: React.FC<PondHudProps> = ({
  hits,
  misses,
  timeLeftSeconds,
  totalTimeSeconds,
  wordsPerMinute,
  soundOn,
  onToggleSound,
}) => {
  // Compute pie fill percentage for TIME gauge
  const isPractice = totalTimeSeconds <= 0;
  const timeProgress = isPractice
    ? 1
    : Math.max(0, Math.min(1, timeLeftSeconds / totalTimeSeconds));

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeProgress);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-[#334155]/90 backdrop-blur-md border-t-2 border-slate-400/40 z-25 px-4 sm:px-8 flex items-center justify-between select-none pointer-events-auto">
      {/* 1. Left: TIME Pie Gauge & Sound Button */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Circular TIME Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-14 h-14 -rotate-90">
            {/* Background track circle */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="#78716c"
              stroke="#57534e"
              strokeWidth="4"
            />
            {/* Countdown Fill Arc */}
            {!isPractice && (
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
              TIME
            </span>
            <span className="text-xs font-extrabold font-mono text-amber-200 leading-none">
              {isPractice ? '∞' : `${Math.ceil(timeLeftSeconds)}s`}
            </span>
          </div>
        </div>

        {/* Sound Toggle Button */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 border border-slate-500 transition-colors cursor-pointer"
          title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
          aria-label={soundOn ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* 2. Right: HIT, MISS, and RATE Badges */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* HIT Counter */}
        <div className="flex items-center space-x-2 bg-[#0f172a]/90 px-3.5 py-1.5 rounded-md border border-slate-600 shadow-md">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            HIT
          </span>
          <span className="text-lg font-black text-white font-mono min-w-[20px] text-right">
            {hits}
          </span>
        </div>

        {/* MISS Counter */}
        <div className="flex items-center space-x-2 bg-[#0f172a]/90 px-3.5 py-1.5 rounded-md border border-slate-600 shadow-md">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            MISS
          </span>
          <span className="text-lg font-black text-white font-mono min-w-[20px] text-right">
            {misses}
          </span>
        </div>

        {/* RATE Meter */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#0f172a]/90 px-3.5 py-1.5 rounded-md border border-slate-600 shadow-md">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            RATE
          </span>
          <span className="text-sm font-black text-white font-mono">
            {wordsPerMinute} <span className="text-[10px] text-slate-400 font-sans">WPM</span>
          </span>
        </div>
      </div>
    </div>
  );
};
