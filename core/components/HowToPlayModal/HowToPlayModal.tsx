'use client';

import React from 'react';
import { X, Gamepad2, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/core/audio/soundManager';

export interface InstructionStep {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export interface HowToPlayModalProps {
  isOpen: boolean;
  gameTitle: string;
  gameSubtitle?: string;
  gameIcon?: string;
  steps: InstructionStep[];
  controlsText?: string;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  gameTitle,
  gameSubtitle = 'How to Play & Game Guide',
  gameIcon = '🎮',
  steps,
  controlsText = '🖱️ Mouse Click or ⌨️ Number Keys 1 - 6',
  onClose,
}) => {
  if (!isOpen) return null;

  const handleGotIt = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0f291e] via-[#0a1f16] to-[#05120d] border-2 border-emerald-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.35)] flex flex-col justify-between max-h-[92%] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={handleGotIt}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-800/80 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors cursor-pointer"
          title="Close Instructions"
          aria-label="Close Instructions"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Game Icon */}
        <div className="flex items-center space-x-3.5 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl shadow-lg border border-emerald-200/50 shrink-0">
            {gameIcon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{gameSubtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic text-white tracking-wide leading-tight">
              {gameTitle}
            </h2>
          </div>
        </div>

        {/* 3 Step Instruction Cards */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg shrink-0">
                {step.icon}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white tracking-wide">
                    {step.title}
                  </span>
                  {step.badge && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Ribbon */}
        {controlsText && (
          <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-200">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>{controlsText}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGotIt}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#f59e1b] via-[#ea580c] to-[#d97706] hover:brightness-110 active:scale-95 text-white font-black italic text-lg tracking-wider shadow-xl border-2 border-yellow-300 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span className="text-yellow-200 group-hover:-translate-x-1 transition-transform">««</span>
            <span>GOT IT! LET&apos;S PLAY</span>
            <span className="text-yellow-200 group-hover:translate-x-1 transition-transform">»»</span>
          </button>
        </div>
      </div>
    </div>
  );
};
