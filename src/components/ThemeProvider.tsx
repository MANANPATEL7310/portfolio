'use client';

import { useEffect } from 'react';

import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSystemStore((state) => state.theme);
  const systemTheme = useSystemStore((state) => state.systemTheme);
  const setSystemTheme = useSystemStore((state) => state.setSystemTheme);

  useEffect(() => {
    void useSystemStore.persist.rehydrate();
    void useWindowStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    syncTheme();
    mediaQuery.addEventListener('change', syncTheme);

    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, [setSystemTheme]);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme(theme, systemTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [systemTheme, theme]);

  return children;
}
