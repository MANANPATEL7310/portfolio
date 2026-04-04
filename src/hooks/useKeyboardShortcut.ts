'use client';

import { useEffect, useCallback } from 'react';

export function useKeyboardShortcut(keys: string[], callback: () => void) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const pressed = new Set([
      e.metaKey && 'Meta',
      e.ctrlKey && 'Control',
      e.shiftKey && 'Shift',
      e.altKey && 'Alt',
      e.key.toLowerCase(),
    ].filter(Boolean) as string[]);

    const allMatch = keys.every((k) =>
      pressed.has(k.toLowerCase()) || pressed.has(k)
    );

    if (allMatch) {
      e.preventDefault();
      callback();
    }
  }, [keys, callback]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
