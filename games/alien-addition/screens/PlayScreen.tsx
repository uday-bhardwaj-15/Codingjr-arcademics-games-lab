"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { GameOptions, RoundState, UfoState, GameStats, Missed } from "../types";
import { StageScale } from "@/core/components/GameWindow/GameWindow";
import {
  generateRound,
  generateReplacementDistractor,
  reRollShipAsTarget,
} from "../engine/questionGenerator";
import {
  STAGE,
  COLUMNS_X,
  SPAWN_Y,
  DANGER_Y,
  stepUfos,
  waveLanded,
  isNearDanger,
  ufoAbove,
  pickNextTarget,
} from "../engine/ufoMotion";
import { Ufo, COLOR_HEX } from "../components/Ufo";
import { Turret } from "../components/Turret";
import { Platform } from "../components/Platform";
import { LaserBolt } from "../components/LaserBolt";
import { Explosion, ExplosionHandle } from "../components/Explosion";
import { TimeDial } from "../components/TimeDial";
import { RateGauge } from "../components/RateGauge";
import { HitMissBox } from "../components/HitMissBox";
import { TryAgainOverlay } from "../components/TryAgainOverlay";
import { STAGES, TOTAL_STAGES, FIRE_COOLDOWN_MS } from "../constants";
import { soundManager } from "@/core/audio/soundManager";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface PlayScreenProps {
  options: GameOptions;
  playerName: string;
  onFinishGame: (stats: GameStats) => void;
  onMenu: () => void;
}

interface ActiveLaser {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  options,
  playerName: _playerName,
  onFinishGame,
  onMenu,
}) => {
  // Stage progression state (0 to 5 for Stage 1 to 6)
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [stageClearedNotice, setStageClearedNotice] = useState<{
    clearedStage: number;
    nextStage: number;
    nextSeconds: number;
  } | null>(null);

  const currentStage = STAGES[currentStageIdx] || STAGES[0];
  const stageTotalSeconds = currentStage.seconds;

  // Match stats
  const [secondsLeft, setSecondsLeft] = useState<number>(stageTotalSeconds);
  const [hits, setHits] = useState<number>(0);
  const [stageHits, setStageHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [missedShots, setMissedShots] = useState<Missed[]>([]);
  const [round, setRound] = useState<RoundState | null>(null);
  const [totalElapsedSec, setTotalElapsedSec] = useState<number>(0);

  // Turret X coordinate in design stage pixels (clamped 81px to 929px)
  const [turretX, setTurretX] = useState<number>(505);

  // FX & interaction state
  const [laser, setLaser] = useState<ActiveLaser | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [isFizzling, setIsFizzling] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [cameraShake, setCameraShake] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // DOM container ref for pointer math
  const containerRef = useRef<HTMLDivElement>(null);

  // Explosion ref
  const boomRef = useRef<ExplosionHandle>(null);

  // Live state refs (prevents stale closure issues)
  const turretXRef = useRef<number>(505);
  turretXRef.current = turretX;

  const roundRef = useRef<RoundState | null>(null);
  roundRef.current = round;

  const stepAccRef = useRef<{ current: number }>({ current: 0 });
  const lastTimeRef = useRef<number>(0);
  const lastFireTimeRef = useRef<number>(0);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const reqAnimRef = useRef<number | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  // Start/Restart fresh full 6-stage run
  const startFreshMatch = useCallback(() => {
    setCurrentStageIdx(0);
    setSecondsLeft(STAGES[0].seconds);
    setHits(0);
    setStageHits(0);
    setMisses(0);
    setMissedShots([]);
    setTotalElapsedSec(0);
    setIsTryAgain(false);
    setStageClearedNotice(null);
    hasFinishedRef.current = false;
    stepAccRef.current.current = 0;
    const initialRound = generateRound(options.from, options.to);
    setRound(initialRound);
  }, [options.from, options.to]);

  // Initial round generation after mount (Hydration-safe)
  useEffect(() => {
    startFreshMatch();
  }, [startFreshMatch]);

  // Handle sound mute toggle
  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundManager.playClick();
  };

  // Timer countdown (paused during Try Again or Stage Cleared notice)
  useEffect(() => {
    if (isTryAgain || stageClearedNotice) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setTotalElapsedSec((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTryAgain, stageClearedNotice]);

  // Handle stage completion when timer reaches 0
  useEffect(() => {
    if (
      secondsLeft === 0 &&
      !hasFinishedRef.current &&
      !isTryAgain &&
      !stageClearedNotice
    ) {
      // If player scored 0 hits in this stage (idle or did not answer), show Try Again
      if (stageHits === 0) {
        soundManager.playSplash();
        setIsTryAgain(true);
        return;
      }

      if (currentStageIdx < TOTAL_STAGES - 1) {
        // Stage Complete -> advance to next stage!
        soundManager.playCorrect();
        const nextIdx = currentStageIdx + 1;
        const nextStageConfig = STAGES[nextIdx];

        setStageClearedNotice({
          clearedStage: currentStageIdx + 1,
          nextStage: nextIdx + 1,
          nextSeconds: nextStageConfig.seconds,
        });

        setTimeout(() => {
          setCurrentStageIdx(nextIdx);
          setSecondsLeft(nextStageConfig.seconds);
          setStageHits(0);
          setStageClearedNotice(null);
          setRound(generateRound(options.from, options.to));
        }, 1600);
      } else {
        // Grand Victory! Beat all 6 stages!
        hasFinishedRef.current = true;
        soundManager.playVictory();

        const finalStats: GameStats = {
          hits,
          misses,
          secondsLeft: 0,
          missed: missedShots,
          stagesCompleted: 6,
          isGrandVictory: true,
        };

        setTimeout(() => {
          onFinishGame(finalStats);
        }, 700);
      }
    }
  }, [
    secondsLeft,
    stageHits,
    currentStageIdx,
    hits,
    misses,
    missedShots,
    isTryAgain,
    stageClearedNotice,
    options.from,
    options.to,
    onFinishGame,
  ]);

  // Camera shake trigger (120ms, ±3px decaying)
  const triggerCameraShake = () => {
    const start = performance.now();
    const shakeLoop = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 120) {
        const decay = 1 - elapsed / 120;
        const sx = (Math.random() * 6 - 3) * decay;
        const sy = (Math.random() * 6 - 3) * decay;
        setCameraShake({ x: sx, y: sy });
        requestAnimationFrame(shakeLoop);
      } else {
        setCameraShake({ x: 0, y: 0 });
      }
    };
    requestAnimationFrame(shakeLoop);
  };

  // Fire laser and burst ship
  const executeBurstAtShip = useCallback(
    (targetUfo: UfoState) => {
      if (secondsLeft <= 0 || isTryAgain || stageClearedNotice) return;

      const now = Date.now();
      if (now - lastFireTimeRef.current < FIRE_COOLDOWN_MS) return;
      lastFireTimeRef.current = now;

      const startX = turretXRef.current;
      const startY = 436;
      const endX = targetUfo.x;
      const endY = targetUfo.y;

      soundManager.playHop();

      setLaser({
        id: `laser_${now}`,
        startX,
        startY,
        endX,
        endY,
      });
      setTimeout(() => setLaser(null), 140);

      const colorHex = COLOR_HEX[targetUfo.color] || "#F5911B";

      if (targetUfo.isCorrect) {
        // CORRECT HIT!
        soundManager.playBoom();
        soundManager.playCorrect();
        setHits((h) => h + 1);
        setStageHits((sh) => sh + 1);
        triggerCameraShake();

        // Trigger realistic explosion canvas
        boomRef.current?.burst(targetUfo.x, targetUfo.y, colorHex, 1);

        setRound((prev) => {
          if (!prev) return prev;

          // 1. Remove hit ship
          const remaining = prev.ufos.filter(
            (u) => u.id !== targetUfo.id && u.status === "flying",
          );

          // 2. Pick new target from ships still on screen
          let nextTarget = pickNextTarget(remaining, prev.target);

          let updatedRemaining = [...remaining];
          if (nextTarget === null && updatedRemaining.length > 0) {
            const lo = Math.max(options.from, 2);
            const hi = Math.max(lo + 2, options.to);
            let chosenTarget = prev.target + 1;
            if (chosenTarget > hi) chosenTarget = lo;

            const { a, b } = reRollShipAsTarget(
              chosenTarget,
              options.from,
              options.to,
              updatedRemaining,
              0,
            );
            updatedRemaining[0] = { ...updatedRemaining[0], a, b };
            nextTarget = a + b;
          } else if (nextTarget === null) {
            nextTarget = prev.target;
          }

          // 3. Spawn ONE replacement ship at top in same column
          const repl = generateReplacementDistractor(
            nextTarget,
            options.from,
            options.to,
            updatedRemaining,
            targetUfo.slot,
          );

          // 4. Update isCorrect on all ships
          const finalUfos = [...updatedRemaining, repl].map((u) => ({
            ...u,
            isCorrect: u.a + u.b === nextTarget,
          }));

          return {
            target: nextTarget,
            ufos: finalUfos,
          };
        });
      } else {
        // WRONG HIT!
        soundManager.playBoom();
        soundManager.playSplash();
        setMisses((m) => m + 1);

        setMissedShots((prev) => [
          ...prev,
          {
            a: targetUfo.a,
            b: targetUfo.b,
            yourAnswer: targetUfo.a + targetUfo.b,
          },
        ]);

        boomRef.current?.burst(targetUfo.x, targetUfo.y, colorHex, 0.75);

        setRound((prev) => {
          if (!prev) return prev;

          const remaining = prev.ufos.filter(
            (u) => u.id !== targetUfo.id && u.status === "flying",
          );

          const repl = generateReplacementDistractor(
            prev.target,
            options.from,
            options.to,
            remaining,
            targetUfo.slot,
          );

          const finalUfos = [...remaining, repl].map((u) => ({
            ...u,
            isCorrect: u.a + u.b === prev.target,
          }));

          return {
            target: prev.target,
            ufos: finalUfos,
          };
        });
      }
    },
    [secondsLeft, isTryAgain, stageClearedNotice, options.from, options.to],
  );

  // Main Fire Trigger
  const handleFireFromTurret = useCallback(() => {
    if (secondsLeft <= 0 || isTryAgain || stageClearedNotice) return;

    const currentUfos = roundRef.current?.ufos || [];
    const locked = ufoAbove(turretXRef.current, currentUfos);

    if (locked) {
      executeBurstAtShip(locked);
    } else {
      const now = Date.now();
      if (now - lastFireTimeRef.current < FIRE_COOLDOWN_MS) return;
      lastFireTimeRef.current = now;

      soundManager.playClick();
      setIsFizzling(true);
      setTimeout(() => setIsFizzling(false), 200);
    }
  }, [secondsLeft, isTryAgain, stageClearedNotice, executeBurstAtShip]);

  // Click on a specific ship
  const handleShipClick = useCallback(
    (ufo: UfoState) => {
      if (secondsLeft <= 0 || isTryAgain || stageClearedNotice) return;
      if (ufo.status !== "flying") return;

      setTurretX(ufo.x);
      turretXRef.current = ufo.x;

      setTimeout(() => {
        executeBurstAtShip(ufo);
      }, 90);
    },
    [secondsLeft, isTryAgain, stageClearedNotice, executeBurstAtShip],
  );

  // Keyboard controls
  useKeyboardControls(
    !isTryAgain && !stageClearedNotice && secondsLeft > 0,
    handleFireFromTurret,
    keysRef,
  );

  // Main animation frame loop
  useEffect(() => {
    if (isTryAgain || stageClearedNotice) return;

    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dtMs = currentTime - lastTimeRef.current;
      const dtSec = dtMs / 1000;
      lastTimeRef.current = currentTime;

      // 1. Smooth Turret sliding via Arrow keys
      if (keysRef.current.left) {
        setTurretX((prev) => {
          const next = Math.max(81, prev - 605 * Math.min(dtSec, 0.05));
          turretXRef.current = next;
          return next;
        });
      }
      if (keysRef.current.right) {
        setTurretX((prev) => {
          const next = Math.min(929, prev + 605 * Math.min(dtSec, 0.05));
          turretXRef.current = next;
          return next;
        });
      }

      // 2. Step UFO positions downward
      setRound((prevRound) => {
        if (!prevRound) return prevRound;

        const steppedUfos = stepUfos(
          prevRound.ufos,
          stepAccRef.current,
          dtMs,
          options.speed,
        );

        if (waveLanded(steppedUfos)) {
          soundManager.playSplash();
          setIsTryAgain(true);
          return { ...prevRound, ufos: steppedUfos };
        }

        return { ...prevRound, ufos: steppedUfos };
      });

      reqAnimRef.current = requestAnimationFrame(loop);
    };

    reqAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [options.speed, isTryAgain, stageClearedNotice]);

  const stageScale = useContext(StageScale);

  // Pointer Dragging for Turret
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTryAgain || stageClearedNotice || secondsLeft <= 0) return;
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;

    const scale = stageScale > 0 ? stageScale : rect.width / STAGE.w;
    const rawStageX = (e.clientX - rect.left) / scale;
    const clampedX = Math.max(81, Math.min(929, rawStageX));
    setTurretX(clampedX);
    turretXRef.current = clampedX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      setIsDragging(false);
    }
  };

  // Lock-on calculation
  const currentUfos = round?.ufos || [];
  const lockedUfo = ufoAbove(turretX, currentUfos);
  const correctUfo = currentUfos.find((u) => u.isCorrect);
  const showNearDangerLine = isNearDanger(currentUfos);

  // Rate calculation (hits / total elapsed minutes)
  const currentRate = totalElapsedSec > 0 ? hits / (totalElapsedSec / 60) : 0;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full select-none overflow-hidden touch-none"
      style={{
        transform: `translate3d(${cameraShake.x}px, ${cameraShake.y}px, 0)`,
        willChange: "transform",
      }}
    >
      {/* 1. Danger Warning Red Line (Visible across playfield, glows intensely when ships approach) */}
      <div
        className={`absolute inset-x-8 top-[400px] h-[2px] transition-all duration-300 pointer-events-none z-15 ${
          showNearDangerLine
            ? "bg-rose-500 shadow-[0_0_18px_#f43f5e] opacity-100 animate-pulse"
            : "bg-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)] opacity-80"
        }`}
      />

      {/* 2. Laser Beam Effect */}
      {laser && (
        <LaserBolt
          startX={laser.startX}
          startY={laser.startY}
          endX={laser.endX}
          endY={laser.endY}
        />
      )}

      {/* 3. Realistic Explosion Canvas Layer */}
      <Explosion ref={boomRef} />

      {/* 4. Flying Saucers Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {round?.ufos.map((ufo) => {
          const isThisLocked = lockedUfo?.id === ufo.id;
          const isRevealedOnTryAgain = isTryAgain && ufo.isCorrect;

          return (
            <Ufo
              key={ufo.id}
              ufo={ufo}
              isLocked={isThisLocked}
              isRevealed={isRevealedOnTryAgain}
              onClick={() => handleShipClick(ufo)}
            />
          );
        })}
      </div>

      {/* 5. Turret Entity */}
      {round && (
        <Turret
          x={turretX}
          target={round.target}
          isFiring={laser !== null}
          isFizzling={isFizzling}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
        />
      )}

      {/* 6. Platform Slab & Support Legs */}
      <Platform />

      {/* 7. Bottom HUD Bar (54px high) */}
      <div className="absolute bottom-0 inset-x-0 h-[54px] z-35 px-8 flex items-center justify-between pointer-events-auto">
        {/* Left: TIME Dial + Speaker Icon */}
        <div className="flex items-center gap-3">
          <TimeDial secondsLeft={secondsLeft} total={stageTotalSeconds} />

          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-white/20 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>

        {/* Center: Stage Progress Indicator */}
        {/* <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/60 border border-amber-400/40 text-xs font-black tracking-wider text-amber-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>STAGE {currentStageIdx + 1} / {TOTAL_STAGES}</span>
          <span className="text-white/60 font-bold ml-1">({stageTotalSeconds}s)</span>
        </div> */}

        {/* Right: HIT / MISS Dark Boxes + RATE Half-Dial */}
        <div className="flex items-center gap-4">
          <HitMissBox hits={hits} misses={misses} />
          <RateGauge rate={currentRate} max={20} />
        </div>
      </div>

      {/* 8. Stage Cleared Intermission Banner */}
      {stageClearedNotice && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="bg-[#140624]/95 border-2 border-amber-400/80 rounded-2xl px-10 py-6 text-center space-y-3 shadow-2xl">
            <h3 className="text-3xl font-black italic text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.6)]">
              Stage {stageClearedNotice.clearedStage} Cleared!
            </h3>
            <p className="text-lg font-bold text-amber-300">
              Next: Stage {stageClearedNotice.nextStage} (
              {stageClearedNotice.nextSeconds}s Timer)
            </p>
          </div>
        </div>
      )}

      {/* 9. Try Again Overlay (When all ships touch red line) */}
      {isTryAgain && round && (
        <TryAgainOverlay
          target={round.target}
          correctA={correctUfo?.a ?? 1}
          correctB={correctUfo?.b ?? Math.max(1, round.target - 1)}
          onTryAgain={startFreshMatch}
          onMenu={onMenu}
        />
      )}
    </div>
  );
};
