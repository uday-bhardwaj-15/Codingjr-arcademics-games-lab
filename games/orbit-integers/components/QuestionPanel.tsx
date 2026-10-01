import React, { useEffect, useCallback } from 'react';
import { Question, PlayerColor, PodState } from '../types';
import { PodAvatar } from './PodAvatar';
import { TrackMiniMap } from './TrackMiniMap';

interface QuestionPanelProps {
  question: Question | null;
  questionNumber: number;
  playerName: string;
  playerColor: PlayerColor;
  onAnswer: (optionIndex: number, value: number, isCorrect: boolean) => void;
  isLocked: boolean;
  selectedOptionIndex: number | null;
  correctOptionIndex: number | null;
  disabled?: boolean;
  pods: PodState[];
  correctCount: number;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  questionNumber,
  playerName,
  playerColor,
  onAnswer,
  isLocked,
  selectedOptionIndex,
  correctOptionIndex,
  disabled = false,
  pods,
  correctCount,
}) => {
  const handleSelect = useCallback(
    (index: number) => {
      if (disabled || isLocked || !question) return;
      const opt = question.options[index];
      if (!opt) return;
      onAnswer(index, opt.value, opt.isCorrect);
    },
    [disabled, isLocked, question, onAnswer]
  );

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || isLocked || !question) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        handleSelect(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, isLocked, question, handleSelect]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[174px] z-25 px-4 pb-3 flex items-end justify-between select-none pointer-events-none">
      {/* 1. Left: Player Pod Avatar + Navy Name Pill */}
      <div className="relative z-10 flex flex-col items-center justify-end w-[130px] pb-1 pointer-events-auto">
        <div className="transition-transform duration-200 hover:scale-105 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
          <PodAvatar color={playerColor} size="md" />
        </div>
        <div className="mt-1 px-4 py-1 rounded-full bg-[#14336f] border-2 border-[#38bdf8]/70 shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <span className="font-extrabold text-sm text-white tracking-wide truncate max-w-[100px] block text-center">
            {playerName}
          </span>
        </div>
      </div>

      {/* 2. Center: Glossy Blue Question Panel (584 x 156) */}
      <div
        className="relative z-10 w-[584px] h-[156px] mx-auto rounded-[24px] p-2.5 flex flex-col justify-between pointer-events-auto"
        style={{
          background: 'linear-gradient(180deg, #1a5fd0 0%, #0d3fb0 100%)',
          border: '3px solid #c8f5ff',
          boxShadow: '0 0 24px #8be8f7, 0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Top: Dark Navy Question Header */}
        <div
          className="relative h-[48px] w-full rounded-xl flex items-center justify-center px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a2a72 0%, #123f98 100%)',
            border: '1px solid rgba(190, 225, 255, 0.4)',
          }}
        >
          {/* Top gloss highlight on header */}
          <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* "QUESTION n" small top-left badge */}
          <span className="absolute top-2 left-3 text-[11px] font-black uppercase tracking-wider text-[#bcd8ff]">
            QUESTION {questionNumber}
          </span>

          {/* Centered Equation / Feedback */}
          {isLocked && correctOptionIndex !== null ? (
            <span className="text-2xl sm:text-3xl font-black text-rose-400 animate-bounce tracking-wide">
              Oops! Try again
            </span>
          ) : (
            <span className="text-3xl sm:text-4xl font-extrabold tracking-widest text-white">
              {question ? question.prompt : '...'}
            </span>
          )}
        </div>

        {/* Bottom: 4 Glossy Blue Answer Buttons */}
        <div className="grid grid-cols-4 gap-2.5 h-[66px]">
          {question?.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isTargetCorrect = correctOptionIndex === idx || (isLocked && opt.isCorrect);
            const isWrongSelection = isSelected && !opt.isCorrect;

            let btnBg = 'linear-gradient(180deg, #2f7ff5 0%, #1352cc 100%)';
            let btnBorder = '2px solid rgba(190, 225, 255, 0.9)';
            let btnShadow = '0 4px 10px rgba(0, 0, 0, 0.35)';

            if (isWrongSelection) {
              btnBg = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
              btnBorder = '2px solid #fca5a5';
              btnShadow = '0 0 16px rgba(231, 76, 60, 0.8)';
            } else if (isTargetCorrect && isLocked) {
              btnBg = 'linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)';
              btnBorder = '2px solid #a3f7bf';
              btnShadow = '0 0 16px rgba(46, 204, 113, 0.8)';
            }

            return (
              <button
                key={opt.id || idx}
                disabled={disabled || isLocked}
                onClick={() => handleSelect(idx)}
                style={{
                  background: btnBg,
                  border: btnBorder,
                  boxShadow: btnShadow,
                }}
                className="relative rounded-xl text-white font-black flex items-center justify-center transition-all duration-150 cursor-pointer disabled:cursor-default disabled:opacity-60 active:translate-y-0.5 hover:brightness-105 overflow-hidden"
              >
                {/* Top Gloss Highlight curve */}
                <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none" />

                {/* "1." to "4." Key Indicator top-left */}
                <span className="absolute top-1.5 left-2 text-[11px] font-bold text-[#bcd8ff]">
                  {idx + 1}.
                </span>

                {/* Big Crisp White Answer Number */}
                <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {opt.value < 0 ? `−${Math.abs(opt.value)}` : opt.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right: Floating Minimap Card */}
      <div className="relative z-10 flex items-center justify-center pr-1 pb-1 pointer-events-auto">
        <TrackMiniMap pods={pods} correctCount={correctCount} />
      </div>
    </div>
  );
};
