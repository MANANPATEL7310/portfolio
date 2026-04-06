'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from "next/image";

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
import { WindowManager } from '../window/WindowManager';

export function Desktop() {
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
  const clampWindowsToViewport = useWindowStore((state) => state.clampWindowsToViewport);

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

  return (
    <div
      ref={constraintsRef}
      onClick={() => clearDesktopSelection()}
      className="selection-glow relative h-screen w-screen overflow-hidden bg-slate-950 text-foreground"
    >
      <Image
        src={currentWallpaper.src}
        alt="Desktop wallpaper"
        fill
        priority
        className={`pointer-events-none absolute inset-0 z-0 object-cover transition duration-700 ${
          theme === "light" ? "scale-[1.03] saturate-[0.78] brightness-[1.12]" : ""
        }`}
        sizes="100vw"
      />
      <div className="desktop-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div className={`pointer-events-none absolute inset-0 z-[2] ${theme === "light" ? "bg-white/24" : "bg-slate-950/12"}`} />

      <MenuBar />
      <WelcomeText />

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
    </div>
  );
}
