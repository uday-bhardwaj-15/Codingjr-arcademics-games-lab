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

  // Guarantee 3 bot profiles are present
  const botProfiles: PlayerProfile[] = players.filter((p: PlayerProfile) => p.isBot);
  const effectiveBotProfiles: PlayerProfile[] =
    botProfiles.length >= 3
      ? botProfiles
      : [
          { id: 'bot_1', name: 'ChickChamp', color: 'yellow', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
          { id: 'bot_2', name: 'FeatherFast', color: 'red', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
          { id: 'bot_3', name: 'PeckMaster', color: 'orange', isBot: true, botConfig: { reactionMsRange: [2800, 5200], accuracy: 0.78 } },
        ];

  const isActive = status === 'in-progress';

  // 1. Reveal Animation: Pan from Finish Podium down to Start Platform
  const [isRevealingTrack, setIsRevealingTrack] = useState(true);
  const [cameraPanOffset, setCameraPanOffset] = useState(-320); // Top view with Finish Podium

  // 2. Active Foothold Petal leaf count (after Round 0)
  const [standingLeafCount, setStandingLeafCount] = useState(8);
  const [selectedHopIndex, setSelectedHopIndex] = useState<number | null>(null);
  const [showFinishCelebration, setShowFinishCelebration] = useState(false);

  // Finalize match and navigate to results when all finish
  const finalizeMatch = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    const allRecords = finishRecordsRef.current;
    const finalScores: PlayerMatchScore[] = players.map((p: PlayerProfile) => {
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

    finalScores.forEach((s, idx) => {
      s.rank = idx + 1;
    });

    recordFinishedMatch(finalScores);
    setTimeout(() => {
      router.push('/games/jumping-chicks/results');
    }, 1500);
  }, [players, targetRounds, recordFinishedMatch, router]);

  const handlePlayerFinished = useCallback(
    (playerId: string, correct: number, wrong: number) => {
      const elapsed = Date.now() - matchStartRef.current;
      if (!finishRecordsRef.current.some((r) => r.playerId === playerId)) {
        finishRecordsRef.current.push({
          playerId,
          finishTimeMs: elapsed,
          correctCount: correct,
          wrongCount: wrong,
        });
      }

      if (playerId === humanPlayer.id) {
        soundManager.playVictory();
        setShowFinishCelebration(true);
        setTimeout(() => {
          finalizeMatch();
        }, 2200);
      } else if (finishRecordsRef.current.length >= players.length) {
        finalizeMatch();
      }
    },
    [humanPlayer.id, players.length, finalizeMatch]
  );

  // Human round hook
  const { playerState, activeSplashIndex, handleSelectPlatform } = usePlayerRound({
    playerId: humanPlayer.id,
    name: humanPlayer.name,
    color: humanPlayer.color,
    targetRounds,
    onPlayerFinish: handlePlayerFinished,
  });

  // Bot runners hook (Independent 70% success / 30% fail rolls per turn)
  const { botStates } = useBotRunner({
    bots: effectiveBotProfiles,
    targetRounds,
    isActive,
    onBotFinish: handlePlayerFinished,
  });

  // Human select platform
  const onHumanChoosePlatform = (idx: number, opt: PlatformOption) => {
    if (selectedHopIndex !== null) return;
    setSelectedHopIndex(idx);

    if (opt.isCorrect) {
      setTimeout(() => {
        setStandingLeafCount(opt.count);
        setSelectedHopIndex(null);
      }, 450);
    } else {
      setTimeout(() => {
        setSelectedHopIndex(null);
      }, 750);
    }
    handleSelectPlatform(idx, opt);
  };

  // Game-Start Reveal Animation (Finish Line -> Start Platform Camera Pan)
  useEffect(() => {
    finishRecordsRef.current = [];
    hasEndedRef.current = false;
    setShowFinishCelebration(false);
    setIsRevealingTrack(true);
    setCameraPanOffset(-320); // Start view showing Finish Line Podium at top

    // Over 1.8s, smoothly pan camera down to START position
    const panTimer = setTimeout(() => {
      setCameraPanOffset(0);
    }, 150);

    const revealTimer = setTimeout(() => {
      setIsRevealingTrack(false);
      startCountdown(() => {
        matchStartRef.current = Date.now();
      });
    }, 1950);

    return () => {
      clearTimeout(panTimer);
      clearTimeout(revealTimer);
    };
  }, [startCountdown]);

  // Audio countdown beep effects
  useEffect(() => {
    if (status === 'countdown') {
      soundManager.playCountdown(countdownValue === 0);
    }
  }, [status, countdownValue]);

  // Keyboard navigation support (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isRevealingTrack) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 4) {
        const optionIndex = keyNum - 1;
        const opt = playerState.currentRound.options[optionIndex];
        if (opt) {
          onHumanChoosePlatform(optionIndex, opt);
        }
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
  const isFinalHop = playerState.correctCount === targetRounds - 1;

  // 4 Target Petal Cluster Slot Positions (All 4 clearly visible across middle row)
  const targetPlatformPositions = [
    { left: '12.5%', top: '38%' },
    { left: '37.5%', top: '38%' },
    { left: '62.5%', top: '38%' },
    { left: '87.5%', top: '38%' },
  ];

  // Starting Platform slots where ALL 4 chicks start side-by-side
  const startingPlatformSlots = [
    { left: '30%', bottom: '66px' }, // Blue (Human)
    { left: '43%', bottom: '76px' }, // Yellow (Bot 1)
    { left: '57%', bottom: '76px' }, // Red (Bot 2)
    { left: '70%', bottom: '66px' }, // Orange (Bot 3)
  ];

  return (
    <div className="min-h-screen w-full bg-[#fbf7dc] text-slate-800 p-3 sm:p-6 flex flex-col items-center justify-center font-sans select-none">
      <div className="w-full max-w-5xl space-y-2">
        {/* Top Header */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#c2580b] tracking-tight">
              Jumping Chicks
            </h1>
            <p className="text-xs sm:text-sm text-[#c2580b]/90 font-medium">
              Math Games, Counting Games
            </p>
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

        {/* Main 16:9 Game Arena Canvas */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] bg-gradient-to-b from-[#76ded4] via-[#8ae6dc] to-[#bcf7ef] rounded-none sm:rounded-sm shadow-xl flex flex-col justify-between overflow-hidden border border-teal-400">
          {/* Vertical Camera Panning Container: Panning from Finish Line to Start Platform */}
          <div
            className="relative w-full h-full flex flex-col justify-between overflow-hidden transition-transform duration-[1800ms] ease-in-out"
            style={{ transform: `translateY(${cameraPanOffset}px)` }}
          >
            {/* Top Finish Line Platform (Revealed during Start Pan, and at the end of the race) */}
            <div className="absolute -top-72 inset-x-0 flex justify-center pointer-events-none z-20">
              <FinishPlatform />
            </div>

            {/* Top Horizon Petals Row */}
            <div className="absolute top-2 inset-x-4 flex justify-between items-center pointer-events-none opacity-80 z-0">
              <div className="transform scale-65 origin-top">
                <PlatformCluster count={4} index={-1} disabled />
              </div>
              <div className="transform scale-65 origin-top">
                <PlatformCluster count={7} index={-1} disabled />
              </div>
              <div className="transform scale-65 origin-top">
                <PlatformCluster count={1} index={-1} disabled />
              </div>
              <div className="transform scale-65 origin-top">
                <PlatformCluster count={6} index={-1} disabled />
              </div>
            </div>

            {/* Middle Row: ALL 4 Clickable Petal Options clearly visible on screen */}
            <div className="relative w-full flex-1 flex items-center justify-between px-2 sm:px-6 pt-6 sm:pt-10 z-10">
              {playerState.currentRound.options.map((opt: PlatformOption, idx: number) => {
                const isSelected = selectedHopIndex === idx;
                const isJumpingHere = isSelected && playerState.status === 'jumping';
                const isFallingHere = isSelected && playerState.status === 'falling';
                const isThisFinishPodium = isFinalHop && opt.isCorrect;
                const isAnotherSelected = selectedHopIndex !== null && selectedHopIndex !== idx;

                return (
                  <div
                    key={opt.id}
                    className={`relative flex-1 flex flex-col items-center justify-center transition-all duration-350 ${
                      isJumpingHere
                        ? 'scale-110 translate-y-3 z-30'
                        : isAnotherSelected
                        ? 'opacity-20 scale-90 translate-y-4 pointer-events-none'
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

                    {/* Splash Ripple if human jumped wrong */}
                    {activeSplashIndex === idx && (
                      <div className="absolute inset-0 flex items-center justify-center z-30">
                        <SplashFX />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: Starting Platform (Round 0) OR Standing Petals (Round 1+) */}
            {isRoundZero ? (
              /* Round 0: Giant Green Starting Platform where ALL 4 chicks start together */
              <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-10">
                <svg viewBox="0 0 1000 240" className="w-full h-36 sm:h-52 overflow-visible">
                  <defs>
                    <linearGradient id="starting-dome-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5eb832" />
                      <stop offset="50%" stopColor="#469924" />
                      <stop offset="100%" stopColor="#2e7314" />
                    </linearGradient>
                  </defs>
                  <ellipse
                    cx="500"
                    cy="255"
                    rx="530"
                    ry="215"
                    fill="url(#starting-dome-grad)"
                    stroke="#1c4e0d"
                    strokeWidth="3.5"
                  />
                  <path d="M 500,40 L 500,240" stroke="#256612" strokeWidth="3" fill="none" />
                  <path d="M 500,40 Q 340,110 80,200" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M 500,40 Q 660,110 920,200" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M 500,40 Q 400,180 260,250" stroke="#256612" strokeWidth="2.5" fill="none" />
                  <path d="M 500,40 Q 600,180 740,250" stroke="#256612" strokeWidth="2.5" fill="none" />
                </svg>
              </div>
            ) : (
              /* Round 1+: Platform Removed. Big Standing Petals */
              <div className="absolute inset-x-0 bottom-1 flex justify-between items-end px-4 sm:px-12 pointer-events-none z-10 opacity-95">
                {/* Left Petal */}
                <div className="transform scale-95 origin-bottom">
                  <PlatformCluster count={4} index={-1} disabled />
                </div>

                {/* Center Standing Petal under Human Chick */}
                <div className="transform scale-110 origin-bottom -mb-1">
                  <PlatformCluster count={standingLeafCount} index={-1} disabled />
                </div>

                {/* Right Petal */}
                <div className="transform scale-95 origin-bottom">
                  <PlatformCluster count={5} index={-1} disabled />
                </div>
              </div>
            )}

            {/* Render Bot Opponent Chicks */}
            {botStates.map((bot: PlayerRunState, botIdx: number) => {
              // Round 0: ALL bots start side-by-side with human on starting platform
              if (isRoundZero) {
                const startSlot = startingPlatformSlots[botIdx + 1] || startingPlatformSlots[1];
                return (
                  <div
                    key={bot.playerId}
                    className="absolute z-20 transition-all duration-300 transform-gpu -translate-x-1/2"
                    style={{ left: startSlot.left, bottom: startSlot.bottom }}
                  >
                    <Chick color={bot.color} facing="back" status={bot.status} size="md" />
                  </div>
                );
              }

              // Round 1+: Compute relative progress vs player
              const scoreDiff = bot.correctCount - playerState.correctCount;

              // If bot is far ahead (diff >= 2) and jumped, show animation hopping off the canvas
              if (scoreDiff >= 2 && bot.status !== 'falling') {
                if (bot.status === 'jumping') {
                  return (
                    <div
                      key={bot.playerId}
                      className="absolute z-20 transition-all duration-500 transform-gpu -translate-x-1/2 -top-12 opacity-0 animate-chick-jump"
                      style={{ left: `${25 + botIdx * 25}%` }}
                    >
                      <Chick color={bot.color} facing="back" status="jumping" size="sm" />
                    </div>
                  );
                }
                return null;
              }

              // Position bot on pond petals (nearby / visible or when failing)
              const botSlotPositions = [
                { left: '22%', top: '24%', count: 3 }, // Bot 1 (Yellow)
                { left: '50%', top: '22%', count: 4 }, // Bot 2 (Red)
                { left: '78%', top: '24%', count: 2 }, // Bot 3 (Orange)
              ];
              const slot = botSlotPositions[botIdx] || botSlotPositions[0];

              return (
                <div
                  key={bot.playerId}
                  className={`absolute z-20 transition-all duration-300 transform-gpu -translate-x-1/2 -translate-y-1/2 ${
                    bot.status === 'jumping' ? 'animate-chick-jump' : ''
                  }`}
                  style={{ left: slot.left, top: slot.top }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Bot standing petal */}
                    <div className="pointer-events-none transform scale-80">
                      <PlatformCluster count={slot.count} index={-1} disabled />
                    </div>
                    {/* Bot Chick Sprite or Splash */}
                    <div className="absolute top-1 z-10">
                      {bot.status === 'falling' ? (
                        <div className="relative">
                          <Chick color={bot.color} facing="back" status="falling" size="md" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <SplashFX />
                          </div>
                        </div>
                      ) : (
                        <Chick color={bot.color} facing="back" status={bot.status} size="md" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Render Human Chick (Blue) - Single bounce on load, jumps, stands on petal */}
            {(() => {
              // Jumping forward to active middle petal
              if (
                playerState.status === 'jumping' &&
                selectedHopIndex !== null &&
                targetPlatformPositions[selectedHopIndex]
              ) {
                const targetPos = targetPlatformPositions[selectedHopIndex];
                return (
                  <div
                    className="absolute z-30 transition-all duration-400 transform-gpu -translate-x-1/2 -translate-y-1/2 animate-chick-jump"
                    style={{ left: targetPos.left, top: targetPos.top }}
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

              if (playerState.status === 'falling') {
                return null;
              }

              // Round 0 position on starting platform
              if (isRoundZero) {
                return (
                  <div
                    className="absolute z-30 transition-all duration-300 transform-gpu -translate-x-1/2"
                    style={{ left: startingPlatformSlots[0].left, bottom: startingPlatformSlots[0].bottom }}
                  >
                    <Chick color={playerState.color} facing="back" status={playerState.status} size="lg" />
                  </div>
                );
              }

              // Round 1+ position on center standing petal
              return (
                <div
                  className="absolute z-30 transition-all duration-300 transform-gpu -translate-x-1/2"
                  style={{ left: '50%', bottom: '58px' }}
                >
                  <Chick color={playerState.color} facing="back" status={playerState.status} size="lg" />
                </div>
              );
            })()}

            {/* Bottom Center: Royal Blue Target Number Box */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex justify-center z-30 pointer-events-none">
              {isActive && !isRevealingTrack && !showFinishCelebration && (
                <NumberBanner targetNumber={playerState.currentRound.targetNumber} />
              )}
            </div>

            {/* Bottom Right: Slim Vertical Progress Gauge */}
            <ProgressRail players={allRunners} targetRounds={targetRounds} />
          </div>

          {/* Finish Podium Victory Celebration */}
          {showFinishCelebration && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none animate-fade-in-up bg-black/20">
              <div className="px-8 py-4 rounded-3xl bg-amber-400 border-4 border-yellow-200 text-amber-950 font-black text-2xl sm:text-3xl shadow-2xl flex items-center gap-3 animate-bounce">
                <Trophy className="w-8 h-8 fill-current" />
                <span>RACE COMPLETED! YOU WIN!</span>
              </div>
            </div>
          )}

          {/* Countdown Overlay */}
          {status === 'countdown' && !isRevealingTrack && (
            <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center pointer-events-none">
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

