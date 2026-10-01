'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer } from 'lucide-react';
import { PodState } from '../types';
import { PodAvatar } from '../components/PodAvatar';
import { ArcadeStorage } from '@/core/state/storage';
import { MatchResult } from '@/core/types/match';
import { soundManager } from '@/core/audio/soundManager';

interface ResultsScreenProps {
  pods: PodState[];
  totalTimeMs: number;
  onPlayAgain: () => void;
}

// Authentic 3D Trophy matching reference screenshot
const SkillTrophy: React.FC<{ rank: number }> = ({ rank }) => {
  return (
    <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center select-none shrink-0">
      <svg viewBox="0 0 60 70" className="w-full h-full overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id={`trophyGold_${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff085" />
            <stop offset="45%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Big Number "1" on top */}
        <text
          x="30"
          y="32"
          textAnchor="middle"
          fill={`url(#trophyGold_${rank})`}
          stroke="#854d0e"
          strokeWidth="1.5"
          fontSize="34"
          fontWeight="900"
          fontStyle="italic"
        >
          {rank}
        </text>

        {/* Gold Ribbon Banner with "SKILL" */}
        <g transform="translate(30, 42)">
          <polygon points="-26,-7 26,-7 22,7 -22,7" fill="#facc15" stroke="#a16207" strokeWidth="1" />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fill="#713f12"
            fontSize="8"
            fontWeight="900"
            letterSpacing="1"
          >
            SKILL
          </text>
        </g>

        {/* Lower Green Ribbon Badge with "GOOD JOB!" */}
        <g transform="translate(30, 56)">
          <rect x="-24" y="-5" width="48" height="10" rx="1" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1" />
          <text
            x="0"
            y="2.5"
            textAnchor="middle"
            fill="#14532d"
            fontSize="6.5"
            fontWeight="900"
          >
            GOOD JOB!
          </text>
        </g>
      </svg>
    </div>
  );
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  pods,
  totalTimeMs,
  onPlayAgain,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Human player statistics
  const humanPod = pods.find((p) => p.isHuman) || pods[0];
  const totalQuestions = humanPod.correctCount + humanPod.wrongCount;
  const accuracyPct =
    totalQuestions > 0 ? Math.round((humanPod.correctCount / totalQuestions) * 100) : 0;
  const totalMinutes = Math.max(0.05, totalTimeMs / 60000);
  const correctRate = Math.round(humanPod.correctCount / totalMinutes);

  useEffect(() => {
    setMounted(true);
    soundManager.playVictory();

    // Save match result to arcade storage
    try {
      const result: MatchResult = {
        matchId: `match_orbit_${Date.now()}`,
        gameId: 'orbit-integers',
        gameTitle: 'Orbit Integers',
        playedAt: new Date().toISOString(),
        targetRounds: 15,
        players: pods.map((p) => ({
          playerId: p.playerId,
          name: p.name,
          color: p.color,
          isBot: p.isBot,
          rank: p.rank || 1,
          correctCount: p.correctCount,
          wrongCount: p.wrongCount,
          finishTimeMs: p.finishedAtMs || p.projectedFinishTimeMs || totalTimeMs,
          accuracy:
            p.correctCount + p.wrongCount > 0
              ? Math.round((p.correctCount / (p.correctCount + p.wrongCount)) * 100)
              : 0,
        })),
      };
      ArcadeStorage.recordMatchResult(result);
    } catch {
      // storage save
    }
  }, [pods, totalTimeMs]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 bg-black flex select-none z-50 overflow-hidden font-sans">
      {/* LEFT SECTION (~60% width): Deep Royal Blue with Standings Rows */}
      <div className="w-[60%] bg-[#001042] bg-[radial-gradient(ellipse_at_top_left,#0a2b85,#000d38)] flex flex-col justify-between py-6 px-6 sm:px-8 border-r border-blue-950">
        {/* Top Header: "Results" + Print Icon */}
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white drop-shadow-md">
            Results
          </h1>
          <button
            onClick={() => window.print()}
            className="p-1.5 bg-black/50 hover:bg-black/80 border border-white/20 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Print Results"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Standings Rows */}
        <div className="flex flex-col justify-around flex-1 py-1">
          {pods.map((pod, idx) => {
            const timeMs = pod.finishedAtMs || pod.projectedFinishTimeMs || totalTimeMs;
            const timeSec = (timeMs / 1000).toFixed(2);
            const isHuman = pod.isHuman;
            const rankStr = idx === 0 ? '1st:' : idx === 1 ? '2nd:' : idx === 2 ? '3rd:' : '4th:';

            return (
              <div
                key={pod.id}
                className={`relative flex items-center justify-between px-3 py-1.5 my-0.5 rounded-sm transition-all ${
                  isHuman
                    ? 'bg-[#223d78]/80 border-y border-blue-400/40 shadow-lg -mx-4 px-7'
                    : 'bg-transparent'
                }`}
              >
                {/* 1. Skill Trophy */}
                <SkillTrophy rank={idx + 1} />

                {/* 2. Rank & Finish Time in Pink-Red */}
                <div className="w-24 flex flex-col justify-center text-left pl-2">
                  <span className="text-white font-bold text-base sm:text-lg tracking-wide">
                    {rankStr}
                  </span>
                  <span className="text-[#f03c6e] font-bold text-sm sm:text-base font-mono tracking-tight">
                    {timeSec} sec
                  </span>
                </div>

                {/* 3. Saucer Avatar */}
                <div className="w-28 flex items-center justify-center">
                  <PodAvatar color={pod.color} size="md" />
                </div>

                {/* 4. Racer Name */}
                <div className="flex-1 text-left pl-3">
                  <span
                    className={`font-bold text-base sm:text-lg tracking-wide ${
                      isHuman ? 'text-blue-100 font-extrabold' : 'text-white'
                    }`}
                  >
                    {pod.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION (~40% width): Jet Black Background with Missed Questions & Controls */}
      <div className="w-[40%] bg-black flex flex-col justify-between py-6 px-6 sm:px-8">
        {/* Top Header: Accuracy % and Rate/min */}
        <div className="flex items-center gap-6 text-white text-base sm:text-lg tracking-tight mb-4">
          <span>
            Accuracy: <strong className="font-bold">{accuracyPct}%</strong>
          </span>
          <span>
            Rate: <strong className="font-bold">{correctRate}/min</strong>
          </span>
        </div>

        {/* Missed Questions */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <h2 className="text-base font-normal text-slate-300 mb-3">
            Missed Questions ({humanPod.missed.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {humanPod.missed.length === 0 ? (
              <p className="text-xs text-slate-500 italic">None</p>
            ) : (
              humanPod.missed.map((m, i) => (
                <div
                  key={i}
                  className="text-sm font-mono text-slate-200 py-0.5 flex items-center justify-between"
                >
                  <div>
                    <span>{m.prompt} = </span>
                    <span className="text-white font-bold">{m.correctAnswer}</span>
                  </div>
                  {m.userAnswer !== undefined && (
                    <span className="text-xs text-rose-400 font-sans font-medium">
                      (You: {m.userAnswer})
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Right Controls: Authentic PLAY AGAIN Chevron + END GAME Button */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-900 mt-2">
          {/* Authentic Angled PLAY AGAIN Button with Chevron Cap */}
          <div className="relative flex items-center flex-1">
            <button
              onClick={onPlayAgain}
              className="relative w-full py-3 bg-[#ff9a00] hover:bg-[#ffaa22] active:scale-95 text-white font-black italic text-base sm:text-lg flex items-center justify-center shadow-md transition-transform cursor-pointer"
              style={{
                clipPath: 'polygon(0% 0%, 86% 0%, 100% 50%, 86% 100%, 0% 100%)',
                paddingRight: '2rem',
              }}
            >
              <span>PLAY AGAIN</span>
            </button>
            {/* Dark Chevron Cap piece */}
            <div
              className="w-4 h-full bg-[#2e431f] -ml-2"
              style={{
                clipPath: 'polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%, 50% 50%)',
              }}
            />
          </div>

          {/* Solid Black END GAME Button */}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-black hover:bg-zinc-900 border border-white/20 text-white font-black text-sm tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-95"
          >
            END GAME
          </button>
        </div>
      </div>
    </div>
  );
};
