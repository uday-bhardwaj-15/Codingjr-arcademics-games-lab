import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, OptionFly } from '../types';
import { FLY_POSITIONS } from '../constants';
import { Frog } from './Frog';
import { Fly } from './Fly';

interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface StarParticle {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PondSceneProps {
  question: Question | null;
  frogStatus: 'idle' | 'shooting' | 'retracting' | 'chewing' | 'miss';
  targetPosition: { x: number; y: number } | null;
  tongueProgress: number;
  isWrongLocked: boolean;
  eatenFlyIndex: number | null;
  wrongFlyIndex: number | null;
  scorePopups?: ScorePopup[];
  onSelectFly: (option: OptionFly, index: number) => void;
  disabled?: boolean;
}

export const PondScene: React.FC<PondSceneProps> = ({
  question,
  frogStatus,
  targetPosition,
  tongueProgress,
  isWrongLocked,
  eatenFlyIndex,
  wrongFlyIndex,
  scorePopups = [],
  onSelectFly,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [starParticles, setStarParticles] = useState<StarParticle[]>([]);
  const [showKillAura, setShowKillAura] = useState(false);

  // Trigger kid-friendly celebratory screen FX whenever a fly is eaten
  useEffect(() => {
    if (frogStatus === 'chewing' && eatenFlyIndex !== null) {
      setShowKillAura(true);
      const flyPos = FLY_POSITIONS[eatenFlyIndex] || { x: 505, y: 240 };

      // Spawn 8 magical celebratory stars bursting outward
      const chars = ['⭐', '✨', '🌟', '💫', '⚡', '🌟', '✨', '⭐'];
      const newParticles: StarParticle[] = chars.map((char, i) => {
        const angle = (i / chars.length) * Math.PI * 2 + (Math.random() - 0.5);
        const speed = 40 + Math.random() * 50;
        return {
          id: Date.now() + i,
          char,
          x: flyPos.x,
          y: flyPos.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });

      setStarParticles(newParticles);

      const auraTimer = setTimeout(() => setShowKillAura(false), 450);
      const particleTimer = setTimeout(() => setStarParticles([]), 700);

      return () => {
        clearTimeout(auraTimer);
        clearTimeout(particleTimer);
      };
    }
  }, [frogStatus, eatenFlyIndex]);

  // Track mouse coordinates across the 1010 x 577 stage
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const scaleX = 1010 / rect.width;
    const scaleY = 577 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setMousePos({ x, y });
  };

  const handlePointerLeave = () => {
    setMousePos(null);
  };

  const handleFlyClick = useCallback(
    (idx: number) => {
      if (disabled || isWrongLocked || !question) return;
      const opt = question.options[idx];
      if (!opt) return;
      onSelectFly(opt, idx);
    },
    [disabled, isWrongLocked, question, onSelectFly]
  );

  // Keyboard number keys 1, 2, 3, 4, 5, 6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || isWrongLocked || !question) return;
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        handleFlyClick(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, isWrongLocked, question, handleFlyClick]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full overflow-hidden select-none bg-[#74b9d8] cursor-crosshair"
    >
      <style>{`
        @keyframes waterGlimmer {
          0%, 100% { opacity: 0.2; transform: translateY(0px) scale(1); }
          50% { opacity: 0.45; transform: translateY(-3px) scale(1.03); }
        }
        @keyframes reedSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes floatUpFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.6);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -40px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60px) scale(0.9);
          }
        }
        @keyframes starBurstFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(1.3) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--vx) * 1.5), calc(-50% + var(--vy) * 1.5 - 20px)) scale(0.4) rotate(90deg);
          }
        }
        @keyframes catchShockwave {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
        }
        .water-glimmer-anim {
          animation: waterGlimmer 6s ease-in-out infinite alternate;
        }
        .reed-sway-1 {
          animation: reedSway 5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .reed-sway-2 {
          animation: reedSway 4.2s ease-in-out infinite reverse;
          transform-origin: bottom center;
        }
        .score-popup-anim {
          animation: floatUpFade 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        .star-burst-anim {
          animation: starBurstFloat 0.65s cubic-bezier(0.2, 0.9, 0.4, 1) forwards;
        }
        .catch-shockwave-anim {
          animation: catchShockwave 0.5s ease-out forwards;
        }
      `}</style>

      {/* 1. Calm Pond Water Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#5aa6c9] via-[#6dbad9] to-[#8fd4eb] pointer-events-none" />

      {/* 2. Soft Ambient Water Ripples */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35 water-glimmer-anim">
        <defs>
          <pattern id="pondRipples" width="180" height="140" patternUnits="userSpaceOnUse">
            <path
              d="M 15 30 C 40 20, 80 20, 110 32 C 140 44, 165 40, 175 35 M 30 95 C 60 85, 95 85, 125 98 C 150 110, 170 105, 180 98"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pondRipples)" />
      </svg>

      {/* 3. Shoreline Reeds & Water Lilies (Swaying ambient nature) */}
      <div className="absolute top-3 left-4 pointer-events-none reed-sway-1 opacity-70">
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <circle cx="40" cy="40" r="30" fill="#a3e635" opacity="0.45" />
          <circle cx="40" cy="40" r="22" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
          <path d="M 40 40 L 70 20" stroke="#bef264" strokeWidth="2" />
          <circle cx="40" cy="40" r="6" fill="#fef08a" />
        </svg>
      </div>

      <div className="absolute top-5 right-8 pointer-events-none reed-sway-2 opacity-65">
        <svg viewBox="0 0 60 60" className="w-12 h-12">
          <circle cx="30" cy="30" r="22" fill="#a3e635" opacity="0.45" />
          <circle cx="30" cy="30" r="15" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="5" fill="#fef08a" />
        </svg>
      </div>

      {/* Bottom Reeds */}
      <div className="absolute bottom-20 left-6 pointer-events-none reed-sway-2 opacity-50">
        <svg viewBox="0 0 50 60" className="w-10 h-14">
          <path d="M 10 60 Q 15 25 35 5" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
          <path d="M 25 60 Q 28 30 45 15" fill="none" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Screen-Wide Celebratory Catch/Kill Aura Pulse (Emerald & Gold Glow, NO RED) */}
      {showKillAura && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            boxShadow: 'inset 0 0 70px rgba(52, 211, 153, 0.45), inset 0 0 35px rgba(250, 204, 21, 0.35)',
          }}
        />
      )}

      {/* 5. Center Frog & Lily Pad with Mouse Tracking */}
      <Frog
        promptWord={question ? question.prompt : '...'}
        categoryLabel={question ? question.categoryLabel : 'Antonyms'}
        status={frogStatus}
        targetPosition={targetPosition}
        mousePosition={mousePos}
        tongueProgress={tongueProgress}
        isWrongLocked={isWrongLocked}
      />

      {/* 6. 6 Surrounding Dragonfly Flies */}
      {question?.options.map((opt, idx) => {
        const pos = FLY_POSITIONS[idx] || { x: 505, y: 275, keyNum: idx + 1 };
        const isThisFlyEaten = eatenFlyIndex === idx;
        const isBeingDragged = frogStatus === 'retracting' && isThisFlyEaten;
        const isWrongHit = wrongFlyIndex === idx;

        return (
          <Fly
            key={opt.id}
            word={opt.word}
            keyNum={pos.keyNum}
            positionIndex={idx}
            x={pos.x}
            y={pos.y}
            isEaten={isThisFlyEaten && frogStatus !== 'retracting'}
            isBeingDragged={isBeingDragged}
            dragProgress={tongueProgress}
            mouthPosition={{ x: 505, y: 185 }}
            isWrongHit={isWrongHit}
            isLocked={isWrongLocked || disabled}
            onClick={() => handleFlyClick(idx)}
          />
        );
      })}

      {/* 7. Celebratory Catch Shockwave Ring & Sparkle Starbursts (NO RED) */}
      {eatenFlyIndex !== null && frogStatus === 'chewing' && (
        <div
          className="absolute pointer-events-none z-35 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${FLY_POSITIONS[eatenFlyIndex]?.x ?? 505}px`,
            top: `${FLY_POSITIONS[eatenFlyIndex]?.y ?? 240}px`,
          }}
        >
          {/* Water Splash Shockwave Rings */}
          <div className="w-24 h-24 rounded-full border-4 border-cyan-300 catch-shockwave-anim" />
          <div className="w-24 h-24 rounded-full border-2 border-amber-300 catch-shockwave-anim" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Floating Sparkle Stars */}
      {starParticles.map((p) => (
        <div
          key={p.id}
          className="absolute z-40 pointer-events-none select-none star-burst-anim text-2xl drop-shadow-md"
          style={
            {
              left: `${p.x}px`,
              top: `${p.y}px`,
              '--vx': `${p.vx}px`,
              '--vy': `${p.vy}px`,
            } as React.CSSProperties
          }
        >
          {p.char}
        </div>
      ))}

      {/* 8. Floating Score Popups (Gold & Emerald) */}
      {scorePopups.map((popup) => (
        <div
          key={popup.id}
          className="absolute z-40 pointer-events-none select-none score-popup-anim font-black text-amber-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] text-3xl tracking-wider flex items-center gap-1"
          style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
        >
          <span>{popup.text}</span>
          <span className="text-xl">✨</span>
        </div>
      ))}
    </div>
  );
};
