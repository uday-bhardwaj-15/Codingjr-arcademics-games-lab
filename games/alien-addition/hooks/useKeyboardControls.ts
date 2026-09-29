'use client';

import { useEffect, useRef } from 'react';

export function useKeyboardControls(
  enabled: boolean,
  onFire: () => void,
  keysRef: React.MutableRefObject<{ left: boolean; right: boolean }>
) {
  const fireRef = useRef(onFire);
  fireRef.current = onFire; // always the latest handler

  useEffect(() => {
    if (!enabled) return;

    // Remove focus from any previous active element (e.g. PLAY button)
    (document.activeElement as HTMLElement | null)?.blur();

    const isTyping = (target: EventTarget | null) =>
      ['INPUT', 'TEXTAREA'].includes((target as HTMLElement)?.tagName);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ' || e.code === 'KeyW') {
        e.preventDefault();
        if (!e.repeat) {
          fireRef.current();
        }
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        keysRef.current.left = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        keysRef.current.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, keysRef]);
}
