'use client';

import React from 'react';

interface ChevronButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg';
}

export const ChevronButton: React.FC<ChevronButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  size = 'md',
}) => {
  const isLg = size === 'lg';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center font-black italic text-white shadow-xl transition-all cursor-pointer select-none active:scale-95 ${
        disabled
          ? 'bg-slate-500 opacity-50 cursor-not-allowed'
          : 'bg-gradient-to-r from-[#F5A623] via-[#FFB71A] to-[#F5911B] hover:brightness-110 hover:scale-105'
      } ${
        isLg
          ? 'px-8 sm:px-14 py-3 sm:py-4 text-2xl sm:text-3xl rounded-sm'
          : 'px-6 sm:px-10 py-2 sm:py-3 text-lg sm:text-xl rounded-sm'
      } ${className}`}
      style={{
        clipPath: 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 8% 50%)',
      }}
    >
      {/* Dark Chevron pattern on right */}
      <span className="relative z-10 tracking-wider flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {children}
      </span>
    </button>
  );
};
