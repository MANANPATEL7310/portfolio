import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BROWSER_HOME_URL, getBrowserDisplayTitle, isInternalBrowserUrl, normalizeBrowserUrl } from "@/lib/browser";
import {
  getDefaultWindowTitle,
  getBrowserWindowId,
  getWindowDefaultsForId,
  type WindowViewMode,
} from "@/lib/dataService";

export const MENU_BAR_HEIGHT = 48;
export const MIN_WINDOW_WIDTH = 400;
export const MIN_WINDOW_HEIGHT = 300;
const DEFAULT_WINDOW_WIDTH = 600;
const DEFAULT_WINDOW_HEIGHT = 420;
const WINDOW_STORAGE_KEY = "macos-portfolio.windows";
const DESKTOP_LAYOUT_VERSION = 2;

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
  viewMode?: WindowViewMode;
  prevState: {
    position: WindowPosition;
    size: WindowSize;
  } | null;
}

export type BrowserStatus = "loading" | "ready" | "blocked" | "external-only";

export interface BrowserHistoryEntry {
  url: string;
  title: string;
}

export interface BrowserSession {
  id: string;
  url: string;
  title: string;
  history: BrowserHistoryEntry[];
  historyIndex: number;
  status: BrowserStatus;
  reloadKey: number;
}

interface OpenWindowOptions {
  title?: string;
  viewMode?: WindowViewMode;
}

interface OpenBrowserOptions {
  title?: string;
  windowId?: string;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  browserSessions: Record<string, BrowserSession>;
  activeWindowId: string | null;
  desktopIconPositions: Record<string, WindowPosition>;
  desktopLayoutVersion: number;
  nextZIndex: number;
  hasHydrated: boolean;
  openWindow: (id: string, title?: string, options?: OpenWindowOptions) => void;
  openBrowserWindow: (url?: string, options?: OpenBrowserOptions) => string;
  ensureBrowserSession: (windowId: string, url?: string, title?: string) => void;
  navigateBrowserWindow: (windowId: string, url: string, options?: { title?: string; replace?: boolean }) => void;
  goBrowserBack: (windowId: string) => void;
  goBrowserForward: (windowId: string) => void;
  reloadBrowserWindow: (windowId: string) => void;
  setBrowserStatus: (windowId: string, status: BrowserStatus) => void;
  setBrowserTitle: (windowId: string, title: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  setWindowTitle: (id: string, title: string) => void;
  setWindowViewMode: (id: string, viewMode: WindowViewMode) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  clampWindowsToViewport: () => void;
  setDesktopIconPosition: (id: string, position: WindowPosition) => void;
  resetDesktopIconPositions: () => void;
  setHasHydrated: (value: boolean) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getViewport() {
  if (typeof window === "undefined") {
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

function buildBrowserHistoryEntry(url: string, title?: string): BrowserHistoryEntry {
  const normalizedUrl = normalizeBrowserUrl(url);
  return {
    url: normalizedUrl,
    title: title ?? getBrowserDisplayTitle(normalizedUrl),
  };
}

function buildBrowserSession(windowId: string, url = BROWSER_HOME_URL, title?: string): BrowserSession {
  const entry = buildBrowserHistoryEntry(url, title);
  return {
    id: windowId,
    url: entry.url,
    title: entry.title,
    history: [entry],
    historyIndex: 0,
    status: isInternalBrowserUrl(entry.url) ? "ready" : "loading",
    reloadKey: 0,
  };
}

function buildGeneratedBrowserWindowId() {
  const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return getBrowserWindowId(sessionId);
}

function buildWindowState(id: string, zIndex: number, options?: OpenWindowOptions): WindowState {
  const viewport = getViewport();
  const defaults = getWindowDefaultsForId(id);
  const size = clampWindowSize(
    {
      width: defaults.width ?? DEFAULT_WINDOW_WIDTH,
      height: defaults.height ?? DEFAULT_WINDOW_HEIGHT,
    },
    viewport,
  );
  const position = clampWindowPosition(
    {
      x: defaults.x ?? Math.round((viewport.width - size.width) / 2),
      y: defaults.y ?? Math.round((viewport.height - size.height) / 2),
    },
    size,
    viewport,
  ).position;

  return {
    id,
    title: options?.title ?? getDefaultWindowTitle(id),
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    position,
    size,
    zIndex,
    viewMode: options?.viewMode,
    prevState: null,
  };
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set) => ({
      windows: {},
      browserSessions: {},
      activeWindowId: null,
      desktopIconPositions: {},
      desktopLayoutVersion: DESKTOP_LAYOUT_VERSION,
      nextZIndex: 100,
      hasHydrated: false,

      openWindow: (id, title, options) =>
        set((state) => {
          if (id === "browser" || id === "blog") {
            const browserWindowId = buildGeneratedBrowserWindowId();
            const browserSession = buildBrowserSession(browserWindowId, BROWSER_HOME_URL, title ?? getDefaultWindowTitle(id));

            return {
              windows: {
                ...state.windows,
                [browserWindowId]: buildWindowState(browserWindowId, state.nextZIndex, {
                  ...options,
                  title: browserSession.title,
                }),
              },
              browserSessions: {
                ...state.browserSessions,
                [browserWindowId]: browserSession,
              },
              activeWindowId: browserWindowId,
              nextZIndex: state.nextZIndex + 1,
            };
          }

          const existing = state.windows[id];

          if (existing) {
            return {
              windows: {
                ...state.windows,
                [id]: {
                  ...existing,
                  title: title ?? options?.title ?? existing.title ?? getDefaultWindowTitle(id),
                  isOpen: true,
                  isMinimized: false,
                  zIndex: state.nextZIndex,
                  viewMode: options?.viewMode ?? existing.viewMode,
                },
              },
              activeWindowId: id,
              nextZIndex: state.nextZIndex + 1,
            };
          }

          return {
            windows: {
              ...state.windows,
              [id]: buildWindowState(id, state.nextZIndex, {
                ...options,
                title: title ?? options?.title,
              }),
            },
            activeWindowId: id,
            nextZIndex: state.nextZIndex + 1,
          };
        }),

      openBrowserWindow: (url = BROWSER_HOME_URL, options) => {
        const browserWindowId = options?.windowId ?? buildGeneratedBrowserWindowId();
        set((state) => {
          const browserSession = buildBrowserSession(browserWindowId, url, options?.title);
          const existing = state.windows[browserWindowId];

          return {
            windows: {
              ...state.windows,
              [browserWindowId]: existing
                ? {
                    ...existing,
                    title: browserSession.title,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: state.nextZIndex,
                  }
                : buildWindowState(browserWindowId, state.nextZIndex, {
                    title: browserSession.title,
                  }),
            },
            browserSessions: {
              ...state.browserSessions,
              [browserWindowId]: browserSession,
            },
            activeWindowId: browserWindowId,
            nextZIndex: state.nextZIndex + 1,
          };
        });
        return browserWindowId;
      },

      ensureBrowserSession: (windowId, url = BROWSER_HOME_URL, title) =>
        set((state) => {
          if (state.browserSessions[windowId]) {
            return state;
          }

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: buildBrowserSession(windowId, url, title),
            },
          };
        }),

      navigateBrowserWindow: (windowId, url, options) =>
        set((state) => {
          const existingSession = state.browserSessions[windowId] ?? buildBrowserSession(windowId);
          const entry = buildBrowserHistoryEntry(url, options?.title);
          const baseHistory = options?.replace
            ? existingSession.history.slice()
            : existingSession.history.slice(0, existingSession.historyIndex + 1);
          const nextHistory = options?.replace
            ? baseHistory.map((historyEntry, index) =>
                index === existingSession.historyIndex ? entry : historyEntry,
              )
            : [...baseHistory, entry];
          const nextHistoryIndex = options?.replace ? existingSession.historyIndex : nextHistory.length - 1;
          const nextSession: BrowserSession = {
            ...existingSession,
            url: entry.url,
            title: entry.title,
            history: nextHistory,
            historyIndex: nextHistoryIndex,
            status: isInternalBrowserUrl(entry.url) ? "ready" : "loading",
          };

          const existingWindow = state.windows[windowId];

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: nextSession,
            },
            windows: existingWindow
              ? {
                  ...state.windows,
                  [windowId]: {
                    ...existingWindow,
                    title: nextSession.title,
                  },
                }
              : state.windows,
          };
        }),

      goBrowserBack: (windowId) =>
        set((state) => {
          const session = state.browserSessions[windowId];
          if (!session || session.historyIndex <= 0) {
            return state;
          }

          const nextHistoryIndex = session.historyIndex - 1;
          const nextEntry = session.history[nextHistoryIndex];
          const existingWindow = state.windows[windowId];

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: {
                ...session,
                historyIndex: nextHistoryIndex,
                url: nextEntry.url,
                title: nextEntry.title,
                status: isInternalBrowserUrl(nextEntry.url) ? "ready" : "loading",
              },
            },
            windows: existingWindow
              ? {
                  ...state.windows,
                  [windowId]: {
                    ...existingWindow,
                    title: nextEntry.title,
                  },
                }
              : state.windows,
          };
        }),

      goBrowserForward: (windowId) =>
        set((state) => {
          const session = state.browserSessions[windowId];
          if (!session || session.historyIndex >= session.history.length - 1) {
            return state;
          }

          const nextHistoryIndex = session.historyIndex + 1;
          const nextEntry = session.history[nextHistoryIndex];
          const existingWindow = state.windows[windowId];

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: {
                ...session,
                historyIndex: nextHistoryIndex,
                url: nextEntry.url,
                title: nextEntry.title,
                status: isInternalBrowserUrl(nextEntry.url) ? "ready" : "loading",
              },
            },
            windows: existingWindow
              ? {
                  ...state.windows,
                  [windowId]: {
                    ...existingWindow,
                    title: nextEntry.title,
                  },
                }
              : state.windows,
          };
        }),

      reloadBrowserWindow: (windowId) =>
        set((state) => {
          const session = state.browserSessions[windowId];
          if (!session) {
            return state;
          }

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: {
                ...session,
                reloadKey: session.reloadKey + 1,
                status: isInternalBrowserUrl(session.url) ? "ready" : "loading",
              },
            },
          };
        }),

      setBrowserStatus: (windowId, status) =>
        set((state) => {
          const session = state.browserSessions[windowId];
          if (!session || session.status === status) {
            return state;
          }

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: {
                ...session,
                status,
              },
            },
          };
        }),

      setBrowserTitle: (windowId, title) =>
        set((state) => {
          const session = state.browserSessions[windowId];
          const windowState = state.windows[windowId];
          if (!session || session.title === title) {
            return state;
          }

          const history = session.history.map((entry, index) =>
            index === session.historyIndex ? { ...entry, title } : entry,
          );

          return {
            browserSessions: {
              ...state.browserSessions,
              [windowId]: {
                ...session,
                title,
                history,
              },
            },
            windows: windowState
              ? {
                  ...state.windows,
                  [windowId]: {
                    ...windowState,
                    title,
                  },
                }
              : state.windows,
          };
        }),

      closeWindow: (id) =>
        set((state) => {
          const nextWindows = { ...state.windows };
          const nextBrowserSessions = { ...state.browserSessions };
          delete nextWindows[id];
          delete nextBrowserSessions[id];

          return {
            windows: nextWindows,
            browserSessions: nextBrowserSessions,
            activeWindowId: getTopWindowId(nextWindows),
          };
        }),

      toggleMinimizeWindow: (id) =>
        set((state) => {
          const target = state.windows[id];
          if (!target) {
            return state;
          }

          const isRestoring = target.isMinimized;
          const nextZIndex = isRestoring ? state.nextZIndex + 1 : state.nextZIndex;
          const nextWindows = {
            ...state.windows,
            [id]: {
              ...target,
              isMinimized: !target.isMinimized,
              zIndex: isRestoring ? state.nextZIndex : target.zIndex,
            },
          };

          return {
            windows: nextWindows,
            activeWindowId: isRestoring ? id : getTopWindowId(nextWindows),
            nextZIndex,
          };
        }),

      toggleMaximizeWindow: (id) =>
        set((state) => {
          const target = state.windows[id];
          if (!target) {
            return state;
          }

          const viewport = getViewport();

          if (target.isMaximized && target.prevState) {
            const restoredSize = clampWindowSize(target.prevState.size, viewport);
            const restoredPosition = clampWindowPosition(
              target.prevState.position,
              restoredSize,
              viewport,
            ).position;

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

      bringToFront: (id) =>
        set((state) => {
          const target = state.windows[id];
          if (!target) {
            return state;
          }

          return {
            windows: {
              ...state.windows,
              [id]: {
                ...target,
                isMinimized: false,
                zIndex: state.nextZIndex,
              },
            },
            activeWindowId: id,
            nextZIndex: state.nextZIndex + 1,
          };
        }),

      setWindowTitle: (id, title) =>
        set((state) => {
          const target = state.windows[id];
          if (!target || target.title === title) {
            return state;
          }

          return {
            windows: {
              ...state.windows,
              [id]: {
                ...target,
                title,
              },
            },
          };
        }),

      setWindowViewMode: (id, viewMode) =>
        set((state) => {
          const target = state.windows[id];
          if (!target) {
            return state;
          }

          return {
            windows: {
              ...state.windows,
              [id]: {
                ...target,
                viewMode,
              },
            },
          };
        }),

      updateWindowPosition: (id, position) =>
        set((state) => {
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

      updateWindowSize: (id, size) =>
        set((state) => {
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

      clampWindowsToViewport: () =>
        set((state) => {
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

                hasChanges ||=
                  nextWindow.position.x !== windowState.position.x ||
                  nextWindow.position.y !== windowState.position.y ||
                  nextWindow.size.width !== windowState.size.width ||
                  nextWindow.size.height !== windowState.size.height;

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

              hasChanges ||=
                nextWindow.position.x !== windowState.position.x ||
                nextWindow.position.y !== windowState.position.y ||
                nextWindow.size.width !== windowState.size.width ||
                nextWindow.size.height !== windowState.size.height;

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

      setDesktopIconPosition: (id, position) =>
        set((state) => ({
          desktopIconPositions: {
            ...state.desktopIconPositions,
            [id]: position,
          },
        })),

      resetDesktopIconPositions: () =>
        set({
          desktopIconPositions: {},
          desktopLayoutVersion: DESKTOP_LAYOUT_VERSION,
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: WINDOW_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        windows: state.windows,
        browserSessions: state.browserSessions,
        activeWindowId: state.activeWindowId,
        desktopIconPositions: state.desktopIconPositions,
        desktopLayoutVersion: state.desktopLayoutVersion,
        nextZIndex: state.nextZIndex,
      }),
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined" || !state) {
          return;
        }

        window.requestAnimationFrame(() => {
          if (state.desktopLayoutVersion !== DESKTOP_LAYOUT_VERSION) {
            state.resetDesktopIconPositions();
          }
          if (state.windows.blog && !state.browserSessions.blog) {
            state.ensureBrowserSession("blog", BROWSER_HOME_URL, getDefaultWindowTitle("blog"));
          }
          state.setHasHydrated(true);
          state.clampWindowsToViewport();
        });
      },
    },
  ),
);
