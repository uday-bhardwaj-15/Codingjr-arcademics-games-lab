'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchStore } from '@/core/state/useMatchStore';
import { PlayerMatchScore } from '@/core/types/match';
import { soundManager } from '@/core/audio/soundManager';
import { PlatformCluster } from './PlatformCluster';
import { FinishPlatform } from './FinishPlatform';
import { Chick } from './Chick';
import { NumberBanner } from './NumberBanner';
import { ProgressRail } from './ProgressRail';
import { SplashFX } from './SplashFX';
import { usePlayerRound } from '../hooks/usePlayerRound';
import { useBotRunner } from '../hooks/useBotRunner';
import { PlayerProfile } from '@/core/types/player';
import { PlayerRunState, PlatformOption } from '../types';
import { Maximize2, Trophy } from 'lucide-react';

interface FinishedRecord {
  playerId: string;
  finishTimeMs: number;
  correctCount: number;
  wrongCount: number;
}

export const JumpingChicksGame: React.FC = () => {
  const router = useRouter();
  const {
    humanPlayer,
    players,
    targetRounds,
    status,
    countdownValue,
    startCountdown,
    recordFinishedMatch,
  } = useMatchStore();

  const matchStartRef = useRef<number>(0);
  const finishRecordsRef = useRef<FinishedRecord[]>([]);
  const hasEndedRef = useRef(false);

  // Guarantee 3 bot profiles — fallback if store not hydrated yet
  const botProfiles: PlayerProfile[] = players.filter((p: PlayerProfile) => p.isBot);
  const effectiveBotProfiles: PlayerProfile[] =
    botProfiles.length >= 3
      ? botProfiles
      : [
          { id: 'bot_1', name: 'ChickChamp', color: 'yellow', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
          { id: 'bot_2', name: 'FeatherFast', color: 'red',    isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
          { id: 'bot_3', name: 'PeckMaster',  color: 'orange', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
        ];

  const isActive = status === 'in-progress';

  // 1. Reveal Animation: Pan from Finish Podium down to Start Platform
  const [isRevealingTrack, setIsRevealingTrack] = useState(true);
  const [cameraPanOffset, setCameraPanOffset] = useState(-320);

  // 2. Standing petal count (updates on each correct hop)
  const [standingLeafCount, setStandingLeafCount] = useState(8);

  // 3. Which petal index user clicked (for slide/fade animation)
  const [selectedHopIndex, setSelectedHopIndex] = useState<number | null>(null);

  // 4. Round key to trigger smooth entrance animation of newly unlocked petals
  const [roundKey, setRoundKey] = useState(0);

  // 5. Victory overlay
  const [showFinishCelebration, setShowFinishCelebration] = useState(false);

  // ── Finalize match → results page ──────────────────────────────────────────
  const finalizeMatch = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    const allRecords = finishRecordsRef.current;
    const allPlayers = players.length > 0 ? players : [humanPlayer, ...effectiveBotProfiles];

    const finalScores: PlayerMatchScore[] = allPlayers.map((p: PlayerProfile) => {
      const rec = allRecords.find((r: FinishedRecord) => r.playerId === p.id);
      const correct = rec ? rec.correctCount : targetRounds;
      const wrong = rec ? rec.wrongCount : 0;
      const finishTime = rec ? rec.finishTimeMs : Date.now() - matchStartRef.current;
      const totalAttempts = correct + wrong;
      const accuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 100;

      return {
        playerId: p.id,
        name: p.name,
        color: p.color,
        isBot: p.isBot,
        rank: 0,
        correctCount: correct,
        wrongCount: wrong,
        finishTimeMs: finishTime,
        accuracy,
      };
    });

    finalScores.sort((a, b) => {
      if (a.finishTimeMs !== b.finishTimeMs) return a.finishTimeMs - b.finishTimeMs;
      return a.wrongCount - b.wrongCount;
    });
    finalScores.forEach((s, idx) => { s.rank = idx + 1; });

    recordFinishedMatch(finalScores);
    setTimeout(() => {
      router.push('/games/jumping-chicks/results');
    }, 1500);
  }, [players, humanPlayer, effectiveBotProfiles, targetRounds, recordFinishedMatch, router]);

  const handlePlayerFinished = useCallback(
    (playerId: string, correct: number, wrong: number) => {
      const elapsed = Date.now() - matchStartRef.current;
      if (!finishRecordsRef.current.some((r) => r.playerId === playerId)) {
        finishRecordsRef.current.push({ playerId, finishTimeMs: elapsed, correctCount: correct, wrongCount: wrong });
      }

      const allPlayers = players.length > 0 ? players : [humanPlayer, ...effectiveBotProfiles];

      if (playerId === humanPlayer.id) {
        soundManager.playVictory();
        setShowFinishCelebration(true);
        setTimeout(() => finalizeMatch(), 2200);
      } else if (finishRecordsRef.current.length >= allPlayers.length) {
        finalizeMatch();
      }
    },
    [humanPlayer, players, effectiveBotProfiles, finalizeMatch]
  );

  // ── Player round hook ───────────────────────────────────────────────────────
  const { playerState, activeSplashIndex, handleSelectPlatform } = usePlayerRound({
    playerId: humanPlayer.id,
    name: humanPlayer.name,
    color: humanPlayer.color,
    targetRounds,
    onPlayerFinish: handlePlayerFinished,
  });

  // ── Bot runner hook ─────────────────────────────────────────────────────────
  const { botStates } = useBotRunner({
    bots: effectiveBotProfiles,
    targetRounds,
    isActive,
    onBotFinish: handlePlayerFinished,
  });

  // ── Human choose platform (memoized with useCallback) ──────────────────────
  const onHumanChoosePlatform = useCallback(
    (idx: number, opt: PlatformOption) => {
      if (selectedHopIndex !== null) return; // block double-click during jump
      setSelectedHopIndex(idx);

      if (opt.isCorrect) {
        setTimeout(() => {
          setStandingLeafCount(opt.count);
          setSelectedHopIndex(null);
          setRoundKey((k) => k + 1); // trigger animation for newly unlocked petals
        }, 460);
      } else {
        setTimeout(() => {
          setSelectedHopIndex(null);
        }, 780);
      }
      handleSelectPlatform(idx, opt);
    },
    [selectedHopIndex, handleSelectPlatform]
  );

  // ── Game-Start Reveal Animation ─────────────────────────────────────────────
  useEffect(() => {
    finishRecordsRef.current = [];
    hasEndedRef.current = false;
    setShowFinishCelebration(false);
    setIsRevealingTrack(true);
    setCameraPanOffset(-320);

    const panTimer = setTimeout(() => setCameraPanOffset(0), 150);
    const revealTimer = setTimeout(() => {
      setIsRevealingTrack(false);
      startCountdown(() => { matchStartRef.current = Date.now(); });
    }, 1950);

    return () => {
      clearTimeout(panTimer);
      clearTimeout(revealTimer);
    };
  }, [startCountdown]);

  // ── Countdown beeps ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'countdown') soundManager.playCountdown(countdownValue === 0);
  }, [status, countdownValue]);

  // ── Keyboard navigation (1-4) ───────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isRevealingTrack) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 4) {
        const opt = playerState.currentRound.options[keyNum - 1];
        if (opt) onHumanChoosePlatform(keyNum - 1, opt);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isRevealingTrack, playerState.currentRound.options, onHumanChoosePlatform]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const allRunners: PlayerRunState[] = [playerState, ...botStates];
  const isRoundZero = playerState.correctCount === 0;
  const isFinalHop  = playerState.correctCount === targetRounds - 1;

  // ── Layout constants ────────────────────────────────────────────────────────
  // 4 petal cluster positions spread across middle choice row
  const targetPlatformPositions = [
    { left: '12.5%', top: '40%' },
    { left: '37.5%', top: '40%' },
    { left: '62.5%', top: '40%' },
    { left: '87.5%', top: '40%' },
  ];

  // Slot positions for ALL 4 chicks on starting platform at Round 0
  const startingPlatformSlots = [
    { left: '30%', bottom: '64px' }, // Human (Blue)
    { left: '43%', bottom: '74px' }, // Bot 1 (Yellow)
    { left: '57%', bottom: '74px' }, // Bot 2 (Red)
    { left: '70%', bottom: '64px' }, // Bot 3 (Orange)
  ];

  // Base horizontal lane slots for the 3 bots
  const botLaneLefts = ['18%', '50%', '82%'];

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-3 sm:p-6 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">

        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">Jumping Chicks</h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">Math Games, Counting Games</p>
          </div>
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-[#c2580b] hover:bg-amber-200/50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
        </div>

        {/* ── Main 16:9 Arena ────────────────────────────────────────────────── */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] bg-gradient-to-b from-[#5ed4c8] via-[#7de0d4] to-[#b8f2eb] rounded-sm shadow-xl overflow-hidden border border-teal-400">

          {/* Camera pan container */}
          <div
            className="relative w-full h-full transition-transform duration-[1800ms] ease-in-out"
            style={{ transform: `translateY(${cameraPanOffset}px)` }}
          >
            {/* ── Finish Platform (top, panned in at start) ── */}
            <div className="absolute -top-72 inset-x-0 flex justify-center pointer-events-none z-20">
              <FinishPlatform />
            </div>

            {/* ── Background decorative petal clusters (top row) ── */}
            <div className="absolute top-0 inset-x-0 h-24 pointer-events-none opacity-75 z-0">
              {[
                { left: '14%', count: 4 },
                { left: '38%', count: 2 },
                { left: '62%', count: 6 },
                { left: '86%', count: 3 },
              ].map((slot, i) => (
                <div
                  key={i}
                  className="absolute top-1 transform scale-[0.54] origin-top -translate-x-1/2"
                  style={{ left: slot.left }}
                >
                  <PlatformCluster count={slot.count} index={-10 - i} disabled />
                </div>
              ))}
            </div>

            {/* ── Middle Row: 4 Clickable Petal Options (New Petals) ── */}
            <div
              key={roundKey}
              className="relative w-full flex-1 flex items-center justify-between px-2 sm:px-4 pt-6 sm:pt-8 z-10 h-full transition-all duration-300"
            >
              {playerState.currentRound.options.map((opt: PlatformOption, idx: number) => {
                const isSelected       = selectedHopIndex === idx;
                const isJumpingHere    = isSelected && playerState.status === 'jumping';
                const isFallingHere    = isSelected && playerState.status === 'falling';
                const isOtherSelected  = selectedHopIndex !== null && !isSelected;
                const isThisFinishPodium = isFinalHop && opt.isCorrect;

                return (
                  <div
                    key={opt.id}
                    className={`relative flex-1 flex flex-col items-center justify-center transition-all duration-350 ease-out ${
                      isJumpingHere
                        ? 'scale-110 translate-y-2 z-30'
                        : isOtherSelected
                        ? 'opacity-0 scale-75 translate-y-8 pointer-events-none'
                        : 'scale-100 opacity-100'
                    }`}
                  >
                    <PlatformCluster
                      count={opt.count}
                      index={idx}
                      onClick={() => onHumanChoosePlatform(idx, opt)}
                      disabled={!isActive || playerState.status === 'finished' || isRevealingTrack}
                      highlightCorrect={isJumpingHere}
                      isWrongSelected={isFallingHere}
                      isFinishPodium={isThisFinishPodium}
                    />

                    {/* Splash FX on wrong hop */}
                    {activeSplashIndex === idx && (
                      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <SplashFX />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Bottom: Starting Platform OR Standing Petals ── */}
            {isRoundZero ? (
              /* Giant green dome — all 4 chicks start here */
              <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-10">
                <svg viewBox="0 0 1000 240" className="w-full h-36 sm:h-52 overflow-visible">
                  <defs>
                    <linearGradient id="start-dome-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5eb832" />
                      <stop offset="50%" stopColor="#469924" />
                      <stop offset="100%" stopColor="#2e7314" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="500" cy="255" rx="530" ry="215"
                    fill="url(#start-dome-grad)" stroke="#1c4e0d" strokeWidth="3.5" />
                  {/* Radial veins */}
                  <path d="M500,40 L500,240"       stroke="#256612" strokeWidth="3"   fill="none" />
                  <path d="M500,40 Q340,110 80,200" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M500,40 Q660,110 920,200" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M500,40 Q400,180 260,250" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M500,40 Q600,180 740,250" stroke="#256612" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
            ) : (
              /* Round 1+: 3 standing petals in bottom row aligned with exact positions */
              <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none z-10 opacity-95">
                <div className="absolute bottom-2 left-[16%] -translate-x-1/2 transform scale-90 origin-bottom">
                  <PlatformCluster count={4} index={-1} disabled />
                </div>
                {/* Center petal — human stands here */}
                <div className="absolute bottom-0 left-[50%] -translate-x-1/2 transform scale-115 origin-bottom">
                  <PlatformCluster count={standingLeafCount} index={-1} disabled />
                </div>
                <div className="absolute bottom-2 left-[84%] -translate-x-1/2 transform scale-90 origin-bottom">
                  <PlatformCluster count={5} index={-1} disabled />
                </div>
              </div>
            )}

            {/* ── Bot Opponent Chicks (Positioned directly on petal surfaces) ── */}
            {botStates.map((bot: PlayerRunState, botIdx: number) => {
              const botCorrect = bot.correctCount;
              const playerCorrect = playerState.correctCount;
              const isPlayerAtStart = playerCorrect === 0;

              /* If both bot and player are at the very start (0 correct) */
              if (botCorrect === 0 && isPlayerAtStart) {
                const startSlot = startingPlatformSlots[botIdx + 1] ?? startingPlatformSlots[1];
                return (
                  <div
                    key={bot.playerId}
                    className="absolute z-20 transition-all duration-300 -translate-x-1/2"
                    style={{ left: startSlot.left, bottom: startSlot.bottom }}
                  >
                    <Chick color={bot.color} facing="back" status={bot.status} size="lg" />
                  </div>
                );
              }

              // Progress difference relative to human player
              const scoreDiff = botCorrect - playerCorrect;

              /* Bot is 3+ rounds ahead or 2+ rounds behind -> hidden off screen */
              if (scoreDiff >= 3 || scoreDiff <= -2) {
                return null;
              }

              // Determine exact coordinate on existing shared petals based on scoreDiff
              let botLeft = '16%';
              let botTop: string | undefined = undefined;
              let botBottom: string | undefined = undefined;
              let chickSize: 'sm' | 'md' | 'lg' = 'lg';

              if (scoreDiff === 1) {
                if (isPlayerAtStart) {
                  // Player is at start, bot has jumped to choice petals in middle row
                  const choiceSlots = ['12.5%', '37.5%', '62.5%', '87.5%'];
                  botLeft = choiceSlots[(botIdx + 1) % choiceSlots.length];
                  botTop = '34%';
                  chickSize = 'md';
                } else {
                  // Player is on pond, bot is 1 step ahead on top background petals
                  const topSlots = ['14%', '38%', '62%', '86%'];
                  botLeft = topSlots[botIdx % topSlots.length];
                  botTop = '12px';
                  chickSize = 'sm';
                }
              } else if (scoreDiff === 2) {
                // 2 steps ahead: on top background petals
                const topSlots = ['14%', '38%', '62%', '86%'];
                botLeft = topSlots[botIdx % topSlots.length];
                botTop = '12px';
                chickSize = 'sm';
              } else if (scoreDiff === 0) {
                // On the same stage as player: standing on left/right/side bottom petals
                const sideSlots = ['16%', '84%', '42%'];
                botLeft = sideSlots[botIdx % sideSlots.length];
                botBottom = '56px';
                chickSize = 'lg';
              } else if (scoreDiff === -1) {
                // 1 step behind player: on lower edge of bottom petals
                const behindSlots = ['16%', '84%', '38%'];
                botLeft = behindSlots[botIdx % behindSlots.length];
                botBottom = '26px';
                chickSize = 'md';
              }

              return (
                <div
                  key={bot.playerId}
                  className={`absolute z-20 transition-all duration-500 -translate-x-1/2 ${
                    bot.status === 'jumping' ? 'animate-chick-jump' : ''
                  }`}
                  style={{
                    left: botLeft,
                    top: botTop,
                    bottom: botBottom,
                  }}
                >
                  {bot.status === 'falling' ? (
                    <div className="relative">
                      <Chick color={bot.color} facing="back" status="falling" size={chickSize} />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <SplashFX />
                      </div>
                    </div>
                  ) : (
                    <Chick color={bot.color} facing="back" status={bot.status} size={chickSize} />
                  )}
                </div>
              );
            })}

            {/* ── Human Chick ─────────────────────────────────────────────── */}
            {(() => {
              /* Jumping to selected petal */
              if (
                playerState.status === 'jumping' &&
                selectedHopIndex !== null &&
                targetPlatformPositions[selectedHopIndex]
              ) {
                const pos = targetPlatformPositions[selectedHopIndex];
                return (
                  <div
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2 animate-chick-jump"
                    style={{ left: pos.left, top: pos.top }}
                  >
                    <Chick
                      color={playerState.color}
                      facing="back"
                      status={isFinalHop ? 'celebrate' : 'jumping'}
                      size="lg"
                    />
                  </div>
                );
              }

              /* Falling into water — SplashFX replaces chick */
              if (playerState.status === 'falling') {
                const pos = selectedHopIndex !== null ? targetPlatformPositions[selectedHopIndex] : null;
                return pos ? (
                  <div
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: pos.left, top: pos.top }}
                  >
                    <SplashFX />
                  </div>
                ) : null;
              }

              /* Round 0: on start platform */
              if (isRoundZero) {
                return (
                  <div
                    className="absolute z-30 -translate-x-1/2 transition-all duration-300"
                    style={{ left: startingPlatformSlots[0].left, bottom: startingPlatformSlots[0].bottom }}
                  >
                    <Chick color={playerState.color} facing="back" status={playerState.status} size="lg" />
                  </div>
                );
              }

              /* Round 1+: standing on center bottom petal */
              return (
                <div
                  className="absolute z-30 -translate-x-1/2 transition-all duration-300"
                  style={{ left: '50%', bottom: '56px' }}
                >
                  <Chick color={playerState.color} facing="back" status={playerState.status} size="lg" />
                </div>
              );
            })()}

            {/* ── Number Banner ─────────────────────────────────────────────── */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex justify-center z-30 pointer-events-none">
              {isActive && !isRevealingTrack && !showFinishCelebration && (
                <NumberBanner targetNumber={playerState.currentRound.targetNumber} />
              )}
            </div>

            {/* ── Progress Rail ─────────────────────────────────────────────── */}
            <ProgressRail players={allRunners} targetRounds={targetRounds} />
          </div>

          {/* ── Victory Celebration Overlay ─────────────────────────────────── */}
          {showFinishCelebration && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none animate-fade-in-up bg-black/20">
              <div className="px-8 py-4 rounded-3xl bg-amber-400 border-4 border-yellow-200 text-amber-950 font-black text-2xl sm:text-3xl shadow-2xl flex items-center gap-3 animate-bounce">
                <Trophy className="w-8 h-8 fill-current" />
                <span>RACE COMPLETED! YOU WIN!</span>
              </div>
            </div>
          )}

          {/* ── Countdown Overlay ───────────────────────────────────────────── */}
          {status === 'countdown' && !isRevealingTrack && (
            <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <span
                className={`font-black text-7xl sm:text-9xl drop-shadow-2xl animate-bounce ${
                  countdownValue === 0 ? 'text-[#ff9a00]' : 'text-white'
                }`}
              >
                {countdownValue === 0 ? 'GO!' : countdownValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
