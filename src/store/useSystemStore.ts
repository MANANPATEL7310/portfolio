import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getSettings, type ResolvedThemeMode, type ThemeMode } from "@/lib/dataService";

const SYSTEM_STORAGE_KEY = "macos-portfolio.system";
const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

export function getResolvedTheme(theme: ThemeMode, systemTheme: ResolvedThemeMode): ResolvedThemeMode {
  return theme === "system" ? systemTheme : theme;
}

function applyTheme(theme: ResolvedThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

interface SystemStore {
  theme: ThemeMode;
  systemTheme: ResolvedThemeMode;
  wallpaper: string;
  isSpotlightOpen: boolean;
  selectedDesktopItemId: string | null;
  hasHydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  setWallpaper: (wallpaper: string) => void;
  toggleSpotlight: () => void;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  selectDesktopItem: (id: string) => void;
  clearDesktopSelection: () => void;
  setSystemTheme: (theme: ResolvedThemeMode) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set, get) => ({
      theme: getSettings().themeDefault,
      systemTheme: getSystemTheme(),
      wallpaper: getSettings().wallpapers[0]?.id ?? 'default',
      isSpotlightOpen: false,
      selectedDesktopItemId: null,
      hasHydrated: false,

      setTheme: (theme) => {
        const resolvedTheme = getResolvedTheme(theme, get().systemTheme);
        applyTheme(resolvedTheme);
        set({ theme });
      },

      setWallpaper: (wallpaper) => {
        set({ wallpaper });
      },

      setSystemTheme: (theme) => {
        set({ systemTheme: theme });

        if (get().theme === "system") {
          applyTheme(theme);
        }
      },

      toggleSpotlight: () => set((state) => ({ isSpotlightOpen: !state.isSpotlightOpen })),
      openSpotlight: () => set({ isSpotlightOpen: true }),
      closeSpotlight: () => set({ isSpotlightOpen: false }),
      selectDesktopItem: (id) => set({ selectedDesktopItemId: id }),
      clearDesktopSelection: () => set({ selectedDesktopItemId: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: SYSTEM_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        wallpaper: state.wallpaper,
      }),
      onRehydrateStorage: () => (state) => {
        const theme = state?.theme ?? getSettings().themeDefault;
        const resolvedTheme = getResolvedTheme(theme, getSystemTheme());
        applyTheme(resolvedTheme);
        state?.setHasHydrated(true);
      },
    },
  ),
);
