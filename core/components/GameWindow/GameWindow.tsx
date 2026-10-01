'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Maximize2, Minimize2, Smartphone } from 'lucide-react';

export const DESIGN_W = 1010;
export const DESIGN_H = 577;
export const StageScale = createContext<number>(1);

interface GameWindowProps {
  children: ReactNode;
}

export function GameWindow({ children }: GameWindowProps) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [real, setReal] = useState(false); // browser fullscreen active
  const [pseudo, setPseudo] = useState(false); // fallback (e.g. iOS Safari)
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  const isFull = real || pseudo;

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(el);

    const checkOrientation = () => {
      const isNarrow = window.innerWidth < 640;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isNarrow && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', checkOrientation);
    };
  }, [isFull]);

  useEffect(() => {
    const onFs = () => {
      setReal(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    if (!isFull) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pseudo) setPseudo(false);
      }
    };
    window.addEventListener('keydown', esc);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener('keydown', esc);
    };
  }, [isFull, pseudo]);

  const toggle = useCallback(async () => {
    if (pseudo) {
      setPseudo(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
      return;
    }
    try {
      if (box.current) {
        await box.current.requestFullscreen();
      }
    } catch {
      setPseudo(true);
    }
  }, [pseudo]);

  const k = size ? Math.min(size.w / DESIGN_W, size.h / DESIGN_H) : 1;
  const left = size ? (size.w - DESIGN_W * k) / 2 : 0;
  const top = size ? (size.h - DESIGN_H * k) / 2 : 0;

  return (
    <div
      ref={box}
      className={
        isFull
          ? 'fixed inset-0 z-[100] bg-black flex items-center justify-center select-none overflow-hidden'
          : 'relative mx-auto bg-[#0a0418] shadow-2xl rounded-none sm:rounded-xs select-none'
      }
      style={
        isFull
          ? undefined
          : {
              width: 'min(63.125rem, 100%, calc((100dvh - 11rem) * 1.75))',
              aspectRatio: '1010 / 577',
            }
      }
    >
      {/* Centered Scaled 1010x577 Design Stage */}
      <div
        className="absolute overflow-hidden bg-[#0a0418]"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          left,
          top,
          transformOrigin: '0 0',
          transform: `scale(${k})`,
          visibility: size ? 'visible' : 'hidden',
        }}
      >
        <StageScale.Provider value={k}>{children}</StageScale.Provider>
      </div>

      {/* Exit Fullscreen Toggle Button (visible in fullscreen mode) */}
      {isFull && (
        <button
          onClick={toggle}
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
          className="fixed right-4 top-4 z-[110] grid h-10 w-10 place-items-center rounded-lg bg-black/70 text-white hover:bg-black/90 active:scale-95 shadow-lg border border-white/20 transition-transform cursor-pointer"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}

      {/* Portrait Phone Orientation Hint */}
      {isPortraitMobile && !isFull && (
        <div className="absolute inset-0 z-50 bg-[#0A0418]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
          <Smartphone className="w-10 h-10 text-amber-400 animate-pulse rotate-90" />
          <h3 className="text-lg font-black tracking-wide text-amber-400">
            Rotate Your Device
          </h3>
          <p className="text-xs text-slate-300 font-medium max-w-xs">
            Please turn your phone to landscape mode for the best arcade experience.
          </p>
        </div>
      )}
    </div>
  );
}
