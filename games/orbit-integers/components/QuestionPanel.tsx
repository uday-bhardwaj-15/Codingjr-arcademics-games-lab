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
    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[98%] max-w-[980px] h-[160px] bg-[#8892a6]/95 backdrop-blur-md rounded-t-2xl border-t-2 border-x-2 border-white/30 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] z-20 flex items-center justify-between px-4 sm:px-6 select-none">
      {/* 1. Left: Player Avatar & Name */}
      <div className="flex flex-col items-center justify-center w-24 sm:w-28 shrink-0 -mt-2">
        <PodAvatar color={playerColor} size="md" />
        <span className="text-white font-black text-xs sm:text-sm tracking-wide mt-1 drop-shadow-md text-center truncate max-w-[110px]">
          {playerName}
        </span>
      </div>

      {/* 2. Middle: Black Question Box + 4 Blue Answer Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[460px] mx-2 sm:mx-4 space-y-2.5">
        {/* Question Box (Black with neon cyan/blue border) */}
        <div className="relative w-full h-[58px] bg-black/95 rounded-lg border-2 border-[#0ea5e9] shadow-[0_0_15px_rgba(14,165,233,0.4)] flex items-center justify-center px-4">
          <span className="absolute top-1 left-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            QUESTION {questionNumber}
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-white font-mono drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
            {question ? question.prompt : '...'}
          </span>
        </div>

        {/* 4 Answer Buttons Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
          {question?.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isTargetCorrect = correctOptionIndex === idx || (isLocked && opt.isCorrect);
            const isWrongSelection = isSelected && !opt.isCorrect;

            let btnStyle =
              'bg-gradient-to-b from-[#1f6fe0] to-[#0b4fb8] border-[#3b82f6] text-white hover:brightness-110 active:scale-95 shadow-[0_4px_12px_rgba(15,23,42,0.5)]';

            if (isWrongSelection) {
              btnStyle =
                'bg-gradient-to-b from-red-600 to-rose-800 border-red-400 text-white animate-shake shadow-[0_0_15px_#ef4444]';
            } else if (isTargetCorrect && isLocked) {
              btnStyle =
                'bg-gradient-to-b from-emerald-500 to-green-700 border-emerald-300 text-white shadow-[0_0_20px_#22c55e] animate-pulse';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(idx)}
                disabled={disabled || isLocked}
                className={`relative h-12 sm:h-14 rounded-md border-2 font-black text-xl sm:text-2xl flex items-center justify-center transition-all duration-100 cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
              >
                {/* Index marker top-left */}
                <span className="absolute top-0.5 left-1.5 text-[10px] font-extrabold opacity-70">
                  {idx + 1}.
                </span>
                {/* Answer value (formatted with real minus if negative) */}
                <span>{opt.value < 0 ? `−${Math.abs(opt.value)}` : opt.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right: PROGRESS Badge + Enlarged Track Mini-Map (Matching Screenshot) */}
      <TrackMiniMap pods={pods} correctCount={correctCount} />
    </div>
  );
};
