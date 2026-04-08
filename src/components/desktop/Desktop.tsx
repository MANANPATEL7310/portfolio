'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { getDesktopGridPosition, getDesktopViewport } from '@/lib/desktopGrid';
import { getWallpaper } from '@/lib/dataService';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { DesktopIcon } from './DesktopIcon';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { WelcomeText } from './WelcomeText';
import { WallpaperRenderer } from './WallpaperRenderer';
import { WindowManager } from '../window/WindowManager';
import { ContextMenu } from './ContextMenu';
import { useContextMenuStore } from '@/store/useContextMenuStore';

export function Desktop({ enableHeroIntro = false }: { enableHeroIntro?: boolean }) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(() => getDesktopViewport());
  const theme = useSystemStore((state) => getResolvedTheme(state.theme, state.systemTheme));
  const currentWallpaperId = useSystemStore((state) => state.wallpaper);
  const currentWallpaper = getWallpaper(currentWallpaperId);
  const toggleSpotlight = useSystemStore((state) => state.toggleSpotlight);
  const isSpotlightOpen = useSystemStore((state) => state.isSpotlightOpen);
  const clearDesktopSelection = useSystemStore((state) => state.clearDesktopSelection);
  const closeSpotlight = useSystemStore((state) => state.closeSpotlight);
  const projects = usePortfolioDataStore((state) => state.projects);
  const desktopSettings = usePortfolioDataStore((state) => state.settings.desktopItems);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const clearActiveWindow = useWindowStore((state) => state.clearActiveWindow);
  const clampWindowsToViewport = useWindowStore((state) => state.clampWindowsToViewport);
  const openContextMenu = useContextMenuStore((state) => state.open);
  const closeContextMenu = useContextMenuStore((state) => state.close);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({ x: e.clientX, y: e.clientY }, [
      { id: "change-wallpaper", label: "Change Wallpaper" },
      { id: "new-folder", label: "New Folder", disabled: true },
      { id: "div-1", label: "", isDivider: true },
      { id: "get-info", label: "Get Info", disabled: true },
    ]);
  };

  const desktopItems = useMemo(
    () =>
      [
        ...desktopSettings,
        ...projects.map((project) => ({
          id: `project:${project.id}`,
          label: project.desktopLabel,
          title: project.titleBar,
          icon: project.icon,
        })),
      ].map((item, index) => ({
        ...item,
        desktopPosition: getDesktopGridPosition(index, viewport),
      })),
    [desktopSettings, projects, viewport],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    clampWindowsToViewport();

    const handleResize = () => {
      setViewport(getDesktopViewport());
      clampWindowsToViewport();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampWindowsToViewport]);

  useKeyboardShortcut(['Meta', 'k'], toggleSpotlight);
  useKeyboardShortcut(['Meta', 'w'], () => {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (isSpotlightOpen) {
        closeSpotlight();
        return;
      }

      if (activeWindowId) {
        closeWindow(activeWindowId);
        return;
      }

      clearDesktopSelection();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeWindowId, clearDesktopSelection, closeSpotlight, closeWindow, isSpotlightOpen]);

  const handleDesktopPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    clearDesktopSelection();
    closeSpotlight();
    closeContextMenu();
    clearActiveWindow();
  };

  return (
    <div
      ref={constraintsRef}
      onPointerDown={handleDesktopPointerDown}
      onContextMenu={handleContextMenu}
      className="selection-glow relative h-screen w-screen overflow-hidden bg-slate-950 text-foreground"
    >
      <WallpaperRenderer wallpaper={currentWallpaper} theme={theme} />
      <div className="desktop-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div className={`pointer-events-none absolute inset-0 z-[2] ${theme === "light" ? "bg-white/24" : "bg-slate-950/12"}`} />

      <MenuBar />
      <WelcomeText enableAutoIntro={enableHeroIntro} theme={theme} />

      {desktopItems.map((shortcut) => (
        <DesktopIcon
          key={shortcut.id}
          {...shortcut}
          constraintsRef={constraintsRef}
        />
      ))}

      <WindowManager constraintsRef={constraintsRef} />
      <Spotlight />
      <Dock />
      <ContextMenu />
    </div>
  );
}
