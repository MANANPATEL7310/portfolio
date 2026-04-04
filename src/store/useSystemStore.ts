import { create } from 'zustand';
import type { ThemeMode } from '@/data/portfolio';

interface SystemStore {
  theme: ThemeMode;
  isSpotlightOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleSpotlight: () => void;
  openSpotlight: () => void;
  closeSpotlight: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  theme: 'dark',
  isSpotlightOpen: false,

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },

  toggleSpotlight: () => set((s) => ({ isSpotlightOpen: !s.isSpotlightOpen })),
  openSpotlight: () => set({ isSpotlightOpen: true }),
  closeSpotlight: () => set({ isSpotlightOpen: false }),
}));
