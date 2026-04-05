'use client';

import { motion } from 'framer-motion';

import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import type { ThemeMode } from '@/lib/dataService';

const OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeModeSwitch({ compact = false }: { compact?: boolean }) {
  const theme = useSystemStore((state) => state.theme);
  const systemTheme = useSystemStore((state) => state.systemTheme);
  const setTheme = useSystemStore((state) => state.setTheme);
  const resolvedTheme = getResolvedTheme(theme, systemTheme);
  const activeIndex = OPTIONS.findIndex((option) => option.value === theme);

  return (
    <div
      className={`relative inline-flex items-center rounded-full border border-border-subtle bg-surface/85 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-colors duration-300 ${
        compact ? 'h-10 w-[11.5rem]' : 'h-11 w-[14rem]'
      }`}
      role="radiogroup"
      aria-label="Theme mode"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        className="absolute inset-y-1 rounded-full bg-foreground/10"
        style={{
          width: compact ? 'calc((100% - 0.5rem) / 3)' : 'calc((100% - 0.5rem) / 3)',
          left: `calc(${(activeIndex < 0 ? 0 : activeIndex) * 33.333}% + 0.25rem)`,
        }}
      />

      {OPTIONS.map((option) => {
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(option.value)}
            className={`relative z-10 flex h-full flex-1 items-center justify-center rounded-full px-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-200 ${
              isActive ? 'text-foreground' : 'text-text-secondary hover:text-foreground'
            }`}
            title={`${option.label} Mode${option.value === 'system' ? ` (${resolvedTheme} now)` : ''}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
