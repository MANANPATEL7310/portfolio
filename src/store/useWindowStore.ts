import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isActive: boolean;
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
      return {
        windows: state.windows.map(w => 
          w.id === id ? { ...w, isOpen: true, isMinimized: false, isActive: true } : { ...w, isActive: false }
        ),
        activeWindowId: id
      };
    }
    return {
      windows: [...state.windows.map(w => ({...w, isActive: false})), {
        id,
        title,
        isOpen: true,
        isActive: true,
        isMinimized: false,
        isMaximized: false
      }],
      activeWindowId: id
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  toggleMinimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
  })),

  toggleMaximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),

  bringToFront: (id) => set((state) => ({
    windows: state.windows.map(w => ({
      ...w,
      isActive: w.id === id
    })),
    activeWindowId: id
  }))
}));
