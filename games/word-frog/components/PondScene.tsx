import React, { useEffect, useCallback } from 'react';
import { Question, OptionFly } from '../types';
import { FLY_POSITIONS } from '../constants';
import { Frog } from './Frog';
import { Fly } from './Fly';

interface PondSceneProps {
  question: Question | null;
  frogStatus: 'idle' | 'shooting' | 'chewing' | 'miss';
  targetPosition: { x: number; y: number } | null;
  tongueProgress: number;
  isWrongLocked: boolean;
  eatenFlyIndex: number | null;
  wrongFlyIndex: number | null;
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
  onSelectFly,
  disabled = false,
}) => {
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
    <div className="relative w-full h-full overflow-hidden select-none bg-[#74b9d8]">
      {/* 1. Calm Pond Water Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#62aed0] via-[#74b9d8] to-[#8fd4eb] pointer-events-none" />

      {/* 2. Soft Ambient Water Ripples */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
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

      {/* 3. Shoreline Reeds & Water Lilies (Aesthetic details on edges) */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-60">
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <circle cx="40" cy="40" r="30" fill="#a3e635" opacity="0.4" />
          <circle cx="40" cy="40" r="22" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute top-6 right-8 pointer-events-none opacity-50">
        <svg viewBox="0 0 60 60" className="w-12 h-12">
          <circle cx="30" cy="30" r="20" fill="#a3e635" opacity="0.4" />
          <circle cx="30" cy="30" r="14" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 4. Center Frog & Lily Pad */}
      <Frog
        promptWord={question ? question.prompt : '...'}
        categoryLabel={question ? question.categoryLabel : 'Antonyms'}
        status={frogStatus}
        targetPosition={targetPosition}
        tongueProgress={tongueProgress}
        isWrongLocked={isWrongLocked}
      />

      {/* 5. 6 Surrounding Dragonfly Flies */}
      {question?.options.map((opt, idx) => {
        const pos = FLY_POSITIONS[idx] || { x: 505, y: 275, keyNum: idx + 1 };
        const isEaten = eatenFlyIndex === idx;
        const isWrongHit = wrongFlyIndex === idx;

        return (
          <Fly
            key={opt.id}
            word={opt.word}
            keyNum={pos.keyNum}
            positionIndex={idx}
            x={pos.x}
            y={pos.y}
            isEaten={isEaten}
            isWrongHit={isWrongHit}
            isLocked={isWrongLocked || disabled}
            onClick={() => handleFlyClick(idx)}
          />
        );
      })}
    </div>
  );
};
