import { create } from 'zustand';

import { windowRegistry } from '@/data/window-registry';

export const MENU_BAR_HEIGHT = 48;
export const MIN_WINDOW_WIDTH = 400;
export const MIN_WINDOW_HEIGHT = 300;
const DESKTOP_ICON_POSITIONS_STORAGE_KEY = 'macos-portfolio.desktop-icon-positions';
const DEFAULT_WINDOW_WIDTH = 600;
const DEFAULT_WINDOW_HEIGHT = 420;

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  prevState: {
    position: WindowPosition;
    size: WindowSize;
  } | null;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  desktopIconPositions: Record<string, WindowPosition>;
  nextZIndex: number;
  openWindow: (id: string, title?: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  clampWindowsToViewport: () => void;
  hydrateDesktopIconPositions: (positions: Record<string, WindowPosition>) => void;
  setDesktopIconPosition: (id: string, position: WindowPosition) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getViewport() {
  if (typeof window === 'undefined') {
    return {
      width: 1440,
      height: 900,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getWindowDefaults(id: string) {
  const definition = windowRegistry[id as keyof typeof windowRegistry];
  return definition?.defaultSize ?? {
    width: DEFAULT_WINDOW_WIDTH,
    height: DEFAULT_WINDOW_HEIGHT,
  };
}

function clampWindowSize(size: WindowSize, viewport = getViewport()) {
  const maxWidth = Math.max(MIN_WINDOW_WIDTH, viewport.width);
  const maxHeight = Math.max(MIN_WINDOW_HEIGHT, viewport.height - MENU_BAR_HEIGHT);

  return {
    width: clamp(size.width, MIN_WINDOW_WIDTH, maxWidth),
    height: clamp(size.height, MIN_WINDOW_HEIGHT, maxHeight),
  };
}

function clampWindowPosition(position: WindowPosition, size: WindowSize, viewport = getViewport()) {
  const clampedSize = clampWindowSize(size, viewport);
  const maxX = Math.max(0, viewport.width - clampedSize.width);
  const maxY = Math.max(MENU_BAR_HEIGHT, viewport.height - clampedSize.height);

  return {
    position: {
      x: clamp(position.x, 0, maxX),
      y: clamp(position.y, MENU_BAR_HEIGHT, maxY),
    },
    size: clampedSize,
  };
}

function getTopWindowId(windows: Record<string, WindowState>) {
  return Object.values(windows)
    .filter((windowState) => !windowState.isMinimized)
    .sort((left, right) => right.zIndex - left.zIndex)[0]?.id ?? null;
}

function persistDesktopIconPositions(positions: Record<string, WindowPosition>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DESKTOP_ICON_POSITIONS_STORAGE_KEY, JSON.stringify(positions));
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  activeWindowId: null,
  desktopIconPositions: {},
  nextZIndex: 100,

  openWindow: (id, title = id) => set((state) => {
    const viewport = getViewport();
    const existing = state.windows[id];

    if (existing) {
      const reopened: WindowState = {
        ...existing,
        title,
        isOpen: true,
        isMinimized: false,
        zIndex: state.nextZIndex,
      };

      return {
        windows: {
          ...state.windows,
          [id]: reopened,
        },
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    const defaultSize = clampWindowSize(getWindowDefaults(id), viewport);
    const centeredPosition = clampWindowPosition(
      {
        x: Math.round((viewport.width - defaultSize.width) / 2),
        y: Math.round((viewport.height - defaultSize.height) / 2),
      },
      defaultSize,
      viewport,
    ).position;

    const nextWindow: WindowState = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: centeredPosition,
      size: defaultSize,
      zIndex: state.nextZIndex,
      prevState: null,
    };

    return {
      windows: {
        ...state.windows,
        [id]: nextWindow,
      },
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  closeWindow: (id) => set((state) => {
    const nextWindows = { ...state.windows };
    delete nextWindows[id];

    return {
      windows: nextWindows,
      activeWindowId: getTopWindowId(nextWindows),
    };
  }),

  toggleMinimizeWindow: (id) => set((state) => {
    const target = state.windows[id];
    if (!target) {
      return state;
    }

    const nextWindows = {
      ...state.windows,
      [id]: {
        ...target,
        isMinimized: !target.isMinimized,
      },
    };

    return {
      windows: nextWindows,
      activeWindowId: getTopWindowId(nextWindows),
    };
  }),

  toggleMaximizeWindow: (id) => set((state) => {
    const target = state.windows[id];
    if (!target) {
      return state;
    }

    const viewport = getViewport();

    if (target.isMaximized && target.prevState) {
      const restoredSize = clampWindowSize(target.prevState.size, viewport);
      const restoredPosition = clampWindowPosition(target.prevState.position, restoredSize, viewport).position;

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...target,
            isMinimized: false,
            isMaximized: false,
            prevState: null,
            position: restoredPosition,
            size: restoredSize,
            zIndex: state.nextZIndex,
          },
        },
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    const maximizedSize = {
      width: Math.max(MIN_WINDOW_WIDTH, viewport.width),
      height: Math.max(MIN_WINDOW_HEIGHT, viewport.height - MENU_BAR_HEIGHT),
    };

    return {
      windows: {
        ...state.windows,
        [id]: {
          ...target,
          isMinimized: false,
          isMaximized: true,
          prevState: {
            position: target.position,
            size: target.size,
          },
          position: {
            x: 0,
            y: MENU_BAR_HEIGHT,
          },
          size: maximizedSize,
          zIndex: state.nextZIndex,
        },
      },
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  bringToFront: (id) => set((state) => {
    const target = state.windows[id];
    if (!target) {
      return state;
    }

    return {
      windows: {
        ...state.windows,
        [id]: {
          ...target,
          zIndex: state.nextZIndex,
        },
      },
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  updateWindowPosition: (id, position) => set((state) => {
    const target = state.windows[id];
    if (!target || target.isMaximized) {
      return state;
    }

    const viewport = getViewport();
    const clamped = clampWindowPosition(position, target.size, viewport).position;

    return {
      windows: {
        ...state.windows,
        [id]: {
          ...target,
          position: clamped,
        },
      },
    };
  }),

  updateWindowSize: (id, size) => set((state) => {
    const target = state.windows[id];
    if (!target || target.isMaximized) {
      return state;
    }

    const viewport = getViewport();
    const clampedSize = clampWindowSize(size, viewport);
    const maxX = Math.max(0, viewport.width - clampedSize.width);
    const maxY = Math.max(MENU_BAR_HEIGHT, viewport.height - clampedSize.height);

    return {
      windows: {
        ...state.windows,
        [id]: {
          ...target,
          size: clampedSize,
          position: {
            x: clamp(target.position.x, 0, maxX),
            y: clamp(target.position.y, MENU_BAR_HEIGHT, maxY),
          },
        },
      },
    };
  }),

  clampWindowsToViewport: () => set((state) => {
    const viewport = getViewport();
    let hasChanges = false;

    const windows = Object.fromEntries(
      Object.entries(state.windows).map(([id, windowState]) => {
        if (windowState.isMaximized) {
          const size = {
            width: Math.max(MIN_WINDOW_WIDTH, viewport.width),
            height: Math.max(MIN_WINDOW_HEIGHT, viewport.height - MENU_BAR_HEIGHT),
          };

          const nextWindow = {
            ...windowState,
            position: { x: 0, y: MENU_BAR_HEIGHT },
            size,
          };

          hasChanges ||= nextWindow.position.x !== windowState.position.x || nextWindow.position.y !== windowState.position.y || nextWindow.size.width !== windowState.size.width || nextWindow.size.height !== windowState.size.height;
          return [id, nextWindow];
        }

        const size = clampWindowSize(windowState.size, viewport);
        const maxX = Math.max(0, viewport.width - size.width);
        const maxY = Math.max(MENU_BAR_HEIGHT, viewport.height - size.height);
        const position = {
          x: clamp(windowState.position.x, 0, maxX),
          y: clamp(windowState.position.y, MENU_BAR_HEIGHT, maxY),
        };

        const nextWindow = {
          ...windowState,
          size,
          position,
        };

        hasChanges ||= nextWindow.position.x !== windowState.position.x || nextWindow.position.y !== windowState.position.y || nextWindow.size.width !== windowState.size.width || nextWindow.size.height !== windowState.size.height;
        return [id, nextWindow];
      }),
    );

    if (!hasChanges) {
      return state;
    }

    return {
      windows,
    };
  }),

  hydrateDesktopIconPositions: (positions) => set({
    desktopIconPositions: positions,
  }),

  setDesktopIconPosition: (id, position) => set((state) => {
    const nextPositions = {
      ...state.desktopIconPositions,
      [id]: position,
    };

    persistDesktopIconPositions(nextPositions);

    return {
      desktopIconPositions: nextPositions,
    };
  }),
}));
