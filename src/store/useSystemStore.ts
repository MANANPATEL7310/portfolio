import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface SystemStore {
  theme: Theme;
  wallpaper: string;
  isSpotlightOpen: boolean;
  setTheme: (theme: Theme) => void;
  setWallpaper: (path: string) => void;
  toggleSpotlight: () => void;
  openSpotlight: () => void;
  closeSpotlight: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  theme: 'dark',
  wallpaper: '/assets/Desktop Wallpaper.png',
  isSpotlightOpen: false,

  setTheme: (theme) => {
    // Sync to DOM immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  setWallpaper: (path) => set({ wallpaper: path }),
  toggleSpotlight: () => set((s) => ({ isSpotlightOpen: !s.isSpotlightOpen })),
  openSpotlight: () => set({ isSpotlightOpen: true }),
  closeSpotlight: () => set({ isSpotlightOpen: false }),
}));
