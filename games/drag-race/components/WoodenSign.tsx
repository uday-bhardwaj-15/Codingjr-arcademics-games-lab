'use client';

import React from 'react';

interface WoodenSignProps {
  hint?: string;
  className?: string;
}

export const WoodenSign: React.FC<WoodenSignProps> = ({
  hint = 'Choose the car that matches the answer!',
  className = '',
}) => {
  return (
    <div
      className={`absolute left-[18px] top-[40px] z-30 pointer-events-none select-none ${className}`}
      style={{
        transform: 'rotate(-4deg)',
        transformOrigin: 'bottom center',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Main Wooden Board Box (~170px width = ~17% of stage) */}
        <div
          className="relative w-[172px] p-2.5 rounded-2xl border-4 border-[#6E3C18] bg-[#A7612A] shadow-xl overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(180deg, #BA7238 0%, #8E4E1F 100%)',
          }}
        >
          {/* Decorative Wood Grain Rings / Lines */}
          <svg
            viewBox="0 0 170 80"
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
          >
            <path d="M 0 18 Q 85 30 170 18" stroke="#4A260C" strokeWidth="2.5" fill="none" />
            <path d="M 0 44 Q 85 35 170 48" stroke="#4A260C" strokeWidth="2" fill="none" />
            <path d="M 0 68 Q 85 78 170 64" stroke="#4A260C" strokeWidth="2" fill="none" />
            <circle cx="130" cy="40" r="7" stroke="#4A260C" strokeWidth="1.5" fill="none" />
          </svg>

          {/* 4 Corner Nail Rivets */}
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#3D1E0A] border border-[#7A4418]" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3D1E0A] border border-[#7A4418]" />
          <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#3D1E0A] border border-[#7A4418]" />
          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3D1E0A] border border-[#7A4418]" />

          {/* White Bold Instruction Text with Gold Arrow */}
          <div className="relative z-10 text-center font-fredoka leading-tight">
            <p className="text-[14px] font-bold text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
              {hint.includes('matches') ? (
                <>
                  <span>Choose the car</span>
                  <br />
                  <span>that matches the</span>
                  <br />
                  <span className="inline-flex items-center justify-center gap-1">
                    answer!
                    <span className="text-[#FFB020] text-base font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      ➜
                    </span>
                  </span>
                </>
              ) : (
                <span>{hint}</span>
              )}
            </p>
          </div>
        </div>

        {/* Thick Wooden Stand Post */}
        <div
          className="w-6 h-14 bg-[#6E3C18] border-x-2 border-b-2 border-[#4A260C] -mt-1 shadow-md"
          style={{
            backgroundImage: 'linear-gradient(90deg, #5A2F12 0%, #8E4E1F 50%, #4A260C 100%)',
          }}
        />

        {/* Lush Leafy SVG Bush at Base (Replacing any placeholder shapes) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-10 pointer-events-none">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible drop-shadow-sm">
            <ellipse cx="25" cy="24" rx="16" ry="12" fill="#2E852A" />
            <ellipse cx="55" cy="24" rx="16" ry="12" fill="#2E852A" />
            <ellipse cx="40" cy="18" rx="18" ry="14" fill="#3E9B3A" />
            <ellipse cx="40" cy="12" rx="12" ry="7" fill="#6CC24A" opacity="0.8" />
          </svg>
        </div>
      </div>
    </div>
  );
};
