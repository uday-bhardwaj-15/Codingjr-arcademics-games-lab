'use client';

import React from 'react';
import { RacerState, SubtractionQuestion } from '../types';
import { JetSkiAvatar } from './JetSkiAvatar';
import { Minimap } from './Minimap';
import { UI_THEME } from '../ui/theme';

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
    <div className="absolute bottom-0 left-0 right-0 h-[174px] z-25 px-4 pb-3 flex items-end justify-between select-none pointer-events-none">
      {/* 1. Left: Player Jet-Ski Avatar + Navy Name Pill */}
      <div className="relative z-10 flex flex-col items-center justify-end w-[130px] pb-1 pointer-events-auto">
        <div className="transition-transform duration-200 hover:scale-105 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
          <JetSkiAvatar color={humanRacer.color} size="md" />
        </div>
        <div className="mt-1 px-4 py-1 rounded-full bg-[#14336f] border-2 border-[#38bdf8]/70 shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <span className="font-extrabold text-sm text-white tracking-wide truncate max-w-[100px] block text-center">
            {humanRacer.name}
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
        {/* Top: Dark Navy Question Header (228-792 x 411-471) */}
        <div
          className="relative h-[48px] w-full rounded-xl flex items-center justify-center px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a2a72 0%, #123f98 100%)',
            border: '1px solid rgba(190, 225, 255, 0.4)',
          }}
        >
          {/* Top gloss highlight on header */}
          <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {!isCountdown && question && (
            <>
              {/* "QUESTION n" small top-left badge */}
              <span className="absolute top-2 left-3 text-[11px] font-black uppercase tracking-wider text-[#bcd8ff]">
                QUESTION {questionNumber}
              </span>

              {/* Centered Equation / Feedback */}
              {isWrongLocked ? (
                <span className="text-2xl sm:text-3xl font-black text-rose-400 animate-bounce tracking-wide">
                  Oops! Try again
                </span>
              ) : (
                <span
                  className={`text-3xl sm:text-4xl font-extrabold tracking-widest text-white transition-transform ${
                    isCorrectFlash ? 'text-emerald-400 scale-110' : ''
                  }`}
                >
                  {question.a} - {question.b}
                </span>
              )}
            </>
          )}
        </div>

        {/* Bottom: 4 Glossy Blue Answer Buttons (131 x 64, gap 10) */}
        <div className="grid grid-cols-4 gap-2.5 h-[66px]">
          {[0, 1, 2, 3].map((idx) => {
            const hasOption = !isCountdown && options[idx] !== undefined;
            const val = hasOption ? options[idx] : null;
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = question && val === question.answer;

            let btnBg = 'linear-gradient(180deg, #2f7ff5 0%, #1352cc 100%)';
            let btnBorder = '2px solid rgba(190, 225, 255, 0.9)';
            let btnShadow = '0 4px 10px rgba(0, 0, 0, 0.35)';

            if (isSelected) {
              if (isCorrectFlash && isCorrectOption) {
                btnBg = 'linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)';
                btnBorder = '2px solid #a3f7bf';
                btnShadow = '0 0 16px rgba(46, 204, 113, 0.8)';
              } else if (isWrongLocked) {
                btnBg = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
                btnBorder = '2px solid #fca5a5';
                btnShadow = '0 0 16px rgba(231, 76, 60, 0.8)';
              }
            }

            return (
              <button
                key={idx}
                disabled={isCountdown || isWrongLocked || !hasOption}
                onClick={() => onAnswer(idx)}
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
                  {val !== null ? val : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right: Floating Minimap Card (128 x 106) */}
      <div className="relative z-10 flex items-center justify-center pr-1 pb-1 pointer-events-auto">
        <Minimap racers={allRacers} isFinishApproaching={isFinishApproaching} />
      </div>
    </div>
  );
}
