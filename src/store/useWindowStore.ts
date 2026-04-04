import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string, title?: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (id, title = id) => set((state) => {
    const existing = state.windows.find(w => w.id === id);
    if (existing) {
      const reopened = {
        ...existing,
        title,
        isMinimized: false,
      };
      const windows = [
        ...state.windows.filter((w) => w.id !== id),
        reopened,
      ];

      return {
        windows,
        activeWindowId: id
      };
    }
    return {
      windows: [...state.windows, {
        id,
        title,
        isMinimized: false,
        isMaximized: false
      }],
      activeWindowId: id
    };
  }),

  closeWindow: (id) => set((state) => {
    const windows = state.windows.filter((w) => w.id !== id);
    return {
      windows,
      activeWindowId: windows.at(-1)?.id ?? null,
    };
  }),

  toggleMinimizeWindow: (id) => set((state) => {
    const target = state.windows.find((w) => w.id === id);
    if (!target) {
      return state;
    }

    if (target.isMinimized) {
      const windows = [
        ...state.windows.filter((w) => w.id !== id),
        { ...target, isMinimized: false },
      ];
      return { windows, activeWindowId: id };
    }

    const windows = state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: true } : w
    );

    return {
      windows,
      activeWindowId: windows.filter((w) => !w.isMinimized).at(-1)?.id ?? null,
    };
  }),

  toggleMaximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),

  bringToFront: (id) => set((state) => {
    const target = state.windows.find((w) => w.id === id);
    if (!target) {
      return state;
    }

    return {
      windows: [...state.windows.filter((w) => w.id !== id), target],
      activeWindowId: id,
    };
  })
}));
