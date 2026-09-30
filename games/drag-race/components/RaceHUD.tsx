import React from 'react';
import { DragCarAvatar } from './DragCarAvatar';
import { DivisionQuestion, PlayerColor } from '../types';

interface RaceHUDProps {
  questionNumber: number;
  totalQuestions: number;
  question: DivisionQuestion | null;
  playerName: string;
  playerColor: PlayerColor;
  onSelectAnswer: (selectedAnswer: number, index: number) => void;
  disabled?: boolean;
  lastAnswerStatus?: 'correct' | 'incorrect' | null;
}

export const RaceHUD: React.FC<RaceHUDProps> = ({
  questionNumber,
  question,
  playerName,
  playerColor,
  onSelectAnswer,
  disabled = false,
  lastAnswerStatus = null,
}) => {
  if (!question) return null;

  return (
    <div className="absolute bottom-2 sm:bottom-3 left-4 right-14 sm:right-18 flex items-end justify-center z-30 select-none">
      {/* Sleek Semi-transparent Grey HUD Card (Exact match to Screenshot 1) */}
      <div className="bg-slate-900/75 backdrop-blur-md rounded-none sm:rounded-sm border border-white/20 px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-3 sm:gap-4 w-full max-w-xl">
        {/* Left: Player Avatar Badge */}
        <div className="flex flex-col items-center justify-center shrink-0 w-16 sm:w-20 py-0.5">
          <DragCarAvatar color={playerColor} size="sm" className="scale-90 sm:scale-100" />
          <span className="text-[10px] sm:text-xs font-black text-white drop-shadow truncate max-w-[80px] mt-0.5">
            {playerName}
          </span>
        </div>

        {/* Center/Right: Question Box + 4 Blue Answer Buttons */}
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Top Black Question Display Bar */}
          <div
            className={`w-full bg-black/95 rounded-xs px-3 py-1.5 sm:py-2 flex items-center border transition-colors ${
              lastAnswerStatus === 'correct'
                ? 'border-emerald-400 shadow-[0_0_15px_#22c55e]'
                : lastAnswerStatus === 'incorrect'
                ? 'border-rose-500 shadow-[0_0_15px_#ef4444]'
                : 'border-slate-700'
            }`}
          >
            {/* Question Label */}
            <div className="flex flex-col items-start mr-4 sm:mr-8 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                QUESTION
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-300 leading-none">
                {questionNumber}
              </span>
            </div>

            {/* Division Math Fact (Big Bold White) */}
            <div className="flex-1 text-center font-black text-xl sm:text-3xl text-white tracking-wide drop-shadow-md">
              {question.prompt}
            </div>
          </div>

          {/* Bottom: 4 Blue Square Answer Buttons */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {question.options.map((opt, idx) => {
              const hotkey = idx + 1;

              return (
                <button
                  key={`${question.id}_opt_${idx}`}
                  onClick={() => !disabled && onSelectAnswer(opt, idx)}
                  disabled={disabled}
                  className="group relative h-10 sm:h-12 rounded-xs sm:rounded-sm bg-[#1877f2] hover:bg-[#1565c0] active:scale-95 disabled:opacity-60 text-white font-black transition-all flex flex-row items-center justify-between px-2 sm:px-3 shadow-md hover:shadow-lg border-t border-blue-400 border-b border-blue-800 cursor-pointer overflow-hidden"
                >
                  {/* Small Hotkey Number in Top Left (e.g. "1.") */}
                  <span className="text-[9px] sm:text-[11px] text-blue-200 font-bold leading-none">
                    {hotkey}.
                  </span>

                  {/* Large Answer Number Centered */}
                  <span className="text-xl sm:text-2xl font-black text-white text-center leading-none flex-1 group-hover:scale-105 transition-transform">
                    {opt}
                  </span>

                  {/* Subtle glossy sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
