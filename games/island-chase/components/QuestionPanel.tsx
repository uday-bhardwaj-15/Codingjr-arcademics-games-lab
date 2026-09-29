'use client';

import React from 'react';
import { RacerState, SubtractionQuestion } from '../types';
import { JetSkiAvatar } from './JetSkiAvatar';
import { Minimap } from './Minimap';

interface QuestionPanelProps {
  humanRacer: RacerState;
  allRacers: RacerState[];
  question: SubtractionQuestion | null;
  questionNumber: number;
  isCountdown: boolean;
  isWrongLocked: boolean;
  selectedAnswer: number | null;
  isCorrectFlash: boolean;
  isFinishApproaching?: boolean;
  onAnswer: (index: number) => void;
}

export function QuestionPanel({
  humanRacer,
  allRacers,
  question,
  questionNumber,
  isCountdown,
  isWrongLocked,
  selectedAnswer,
  isCorrectFlash,
  isFinishApproaching = false,
  onAnswer,
}: QuestionPanelProps) {
  const options = question?.options || [];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[152px] bg-[#a8d4e6]/95 border-t-4 border-[#6bb2cc] z-25 px-6 py-2 flex items-center justify-between select-none">
      {/* 1. Left: Player Avatar + Name */}
      <div className="flex flex-col items-center justify-center w-36 pr-2">
        <JetSkiAvatar color={humanRacer.color} size="md" />
        <span className="mt-1 font-extrabold text-sm sm:text-base text-slate-800 truncate max-w-[130px] text-center">
          {humanRacer.name}
        </span>
      </div>

      {/* 2. Center: Question Display + 4 Answer Buttons */}
      <div className="flex-1 max-w-[536px] flex flex-col gap-2">
        {/* Top: Black Question Display (528x60) */}
        <div className="relative h-14 w-full bg-gradient-to-b from-[#181818] to-[#080808] border-2 border-cyan-500 rounded-xs shadow-inner flex items-center justify-center px-4 overflow-hidden">
          {!isCountdown && question && (
            <>
              {/* "QUESTION n" small top-left tag */}
              <span className="absolute top-1 left-2 text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider">
                QUESTION {questionNumber}
              </span>

              {/* Equation / Feedback */}
              {isWrongLocked ? (
                <span className="text-2xl sm:text-3xl font-black text-amber-400 animate-bounce">
                  Oops! Try again
                </span>
              ) : (
                <span
                  className={`text-3xl sm:text-4xl font-black tracking-widest text-white transition-colors ${
                    isCorrectFlash ? 'text-emerald-400 scale-105' : ''
                  }`}
                >
                  {question.a} - {question.b}
                </span>
              )}
            </>
          )}
        </div>

        {/* Bottom: 4 Numbered Answer Buttons */}
        <div className="grid grid-cols-4 gap-2 h-14">
          {[0, 1, 2, 3].map((idx) => {
            const hasOption = !isCountdown && options[idx] !== undefined;
            const val = hasOption ? options[idx] : null;
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = question && val === question.answer;

            let btnBg = 'bg-[#1d64d8] hover:bg-[#2563eb] active:bg-[#1e40af]';
            if (isSelected) {
              if (isCorrectFlash && isCorrectOption) {
                btnBg = 'bg-emerald-600 border-2 border-emerald-300';
              } else if (isWrongLocked) {
                btnBg = 'bg-rose-600 border-2 border-rose-300';
              }
            }

            return (
              <button
                key={idx}
                disabled={isCountdown || isWrongLocked || !hasOption}
                onClick={() => onAnswer(idx)}
                className={`relative rounded-xs text-white font-black shadow-md flex items-center justify-center transition-all cursor-pointer disabled:cursor-default disabled:opacity-90 ${btnBg}`}
              >
                {/* "1." to "4." label top-left */}
                <span className="absolute top-1 left-1.5 text-[10px] font-bold text-white/70">
                  {idx + 1}.
                </span>

                {/* Big Answer Number */}
                <span className="text-2xl sm:text-3xl font-black drop-shadow">
                  {val !== null ? val : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right: Minimap */}
      <div className="flex items-center justify-center pl-2">
        <Minimap racers={allRacers} isFinishApproaching={isFinishApproaching} />
      </div>
    </div>
  );
}
