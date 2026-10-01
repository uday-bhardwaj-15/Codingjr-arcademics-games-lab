'use client';

import React, { useState, useEffect } from 'react';
import { RaceCarFaceAvatar } from './RaceCarFaceAvatar';

export interface QuestionOptionItem {
  id: string;
  value: number;
  label?: string | number;
}

export interface QuestionPanelProps {
  playerName: string;
  questionNumber: number;
  expression: string;
  options: QuestionOptionItem[];
  onAnswer: (value: number, index: number) => void;
  disabled?: boolean;
  feedback?: { correctIndex?: number; wrongIndex?: number } | null;
  className?: string;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  playerName = 'Player396',
  questionNumber = 1,
  expression = '20 ÷ 2',
  options = [
    { id: 'opt_1', value: 12 },
    { id: 'opt_2', value: 8 },
    { id: 'opt_3', value: 13 },
    { id: 'opt_4', value: 10 },
  ],
  onAnswer,
  disabled = false,
  feedback = null,
  className = '',
}) => {
  // Pressed state for keyboard hotkeys (1, 2, 3, 4)
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  // Keyboard shortcut listener for active button visual feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const keyIdx = parseInt(e.key, 10) - 1;
      if (keyIdx >= 0 && keyIdx < options.length) {
        setPressedIndex(keyIdx);
      }
    };

    const handleKeyUp = () => {
      setPressedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, options.length]);

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-[14px] z-40 select-none ${className}`}
      style={{
        width: '648px',
        height: '160px',
      }}
    >
      {/* ── Navy Glass Shell Frame (648 × 160 px, radius 28px, glowing blue border) ── */}
      <div
        className="relative w-full h-full rounded-[28px] p-3 flex items-center shadow-2xl border-[3px] border-[#4ea1ff]"
        style={{
          background: 'linear-gradient(180deg, #0E3A8C 0%, #081C55 100%)',
          boxShadow: '0 0 28px rgba(47, 140, 255, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.25)',
        }}
      >
        {/* Top Edge Specular White Highlight Crescent */}
        <div className="absolute top-1 inset-x-8 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full pointer-events-none" />

        {/* ── Left Block: Cute Blue Car Avatar + Player Name ── */}
        <div className="w-[108px] h-full flex flex-col items-center justify-center shrink-0 pr-1">
          <div className="transform transition-transform hover:scale-105">
            <RaceCarFaceAvatar />
          </div>
          <span className="font-fredoka text-[15px] font-bold text-white tracking-wide truncate max-w-[100px] text-center drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] -mt-0.5">
            {playerName}
          </span>
        </div>

        {/* ── Right Block: Question Inset + 4 Answer Buttons ── */}
        <div className="flex-1 h-full flex flex-col justify-between pl-1">
          {/* Top: Question Inset Box (Darker navy, radius 18px) */}
          <div
            className="relative w-full h-[62px] rounded-[18px] px-4 flex items-center justify-between border border-[#4a8eff]/35"
            style={{
              background: 'linear-gradient(180deg, #0A2260 0%, #07174A 100%)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Top-Left: Question Label & Number */}
            <div className="flex flex-col items-start leading-none font-fredoka shrink-0">
              <span className="text-[11px] font-bold tracking-[2px] text-[#7FB8FF] uppercase">
                QUESTION
              </span>
              <span className="text-[22px] font-bold text-white drop-shadow-sm mt-0.5">
                {questionNumber}
              </span>
            </div>

            {/* Center: Math Expression (e.g. 20 ÷ 2) */}
            <div className="flex-1 text-center font-fredoka text-[38px] font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {expression}
            </div>

            {/* Spacer to balance question label on left */}
            <div className="w-[60px] shrink-0" />
          </div>

          {/* Bottom: 4 Candy Answer Buttons (124 × 58 px, gap 8px) */}
          <div className="grid grid-cols-4 gap-2 w-full h-[58px]">
            {options.map((opt, idx) => {
              const isCorrectFeedback = feedback?.correctIndex === idx;
              const isWrongFeedback = feedback?.wrongIndex === idx;
              const isPressed = pressedIndex === idx;

              return (
                <button
                  key={opt.id || `btn_${idx}`}
                  onClick={() => !disabled && onAnswer(opt.value, idx)}
                  disabled={disabled}
                  className={`group relative h-[58px] rounded-[16px] flex items-center justify-center font-fredoka transition-all cursor-pointer select-none overflow-hidden ${
                    isWrongFeedback
                      ? 'animate-[buttonShake_0.4s_ease-in-out]'
                      : isCorrectFeedback
                      ? 'scale-105 animate-[correctPop_0.4s_ease-out]'
                      : ''
                  }`}
                  style={{
                    background: isCorrectFeedback
                      ? 'linear-gradient(180deg, #5BE37D 0%, #1FAE4B 100%)'
                      : isWrongFeedback
                      ? 'linear-gradient(180deg, #FF7A7A 0%, #D93636 100%)'
                      : 'linear-gradient(180deg, #52B0FF 0%, #2F85F0 50%, #1B5CD1 100%)',
                    border: isCorrectFeedback
                      ? '2px solid #A3F5B8'
                      : isWrongFeedback
                      ? '2px solid #FFA3A3'
                      : '2px solid #9AD0FF',
                    boxShadow: isPressed
                      ? '0 1px 0 #0F3F9E, 0 2px 4px rgba(0,0,0,0.4)'
                      : isCorrectFeedback
                      ? '0 4px 0 #15803D, 0 0 16px rgba(34, 197, 94, 0.7)'
                      : isWrongFeedback
                      ? '0 4px 0 #991B1B, 0 0 16px rgba(239, 68, 68, 0.7)'
                      : '0 4px 0 #0F3F9E, 0 8px 14px rgba(0, 0, 0, 0.35)',
                    transform: isPressed ? 'translateY(3px)' : 'translateY(0)',
                    opacity: disabled && !isCorrectFeedback && !isWrongFeedback ? 0.7 : 1,
                  }}
                >
                  {/* Top 40% Glossy Highlight Curve */}
                  <div
                    className="absolute top-0 inset-x-0 h-[40%] bg-white/25 rounded-t-[14px] pointer-events-none"
                    style={{
                      clipPath: 'ellipse(70% 100% at 50% 0%)',
                    }}
                  />

                  {/* Hotkey Indicator in Top-Left (e.g. "1.", "2.") */}
                  <span className="absolute top-1.5 left-2.5 text-[12px] font-bold text-[#D0E8FF] drop-shadow-sm leading-none">
                    {idx + 1}.
                  </span>

                  {/* Large Bold Answer Value Centered (26px) */}
                  <span className="text-[26px] font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform leading-none mt-1">
                    {opt.label ?? opt.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
