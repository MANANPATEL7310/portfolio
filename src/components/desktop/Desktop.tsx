'use client';

import { useRef, useEffect } from 'react';
import Image from "next/image";

import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WelcomeText } from './WelcomeText';
import { DesktopIcon } from './DesktopIcon';
import { Spotlight } from './Spotlight';
import { WindowManager } from '../window/WindowManager';
import { desktopShortcuts, portfolioAssets } from "@/data/portfolio";
import { useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function Desktop() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const theme = useSystemStore((state) => state.theme);
  const toggleSpotlight = useSystemStore((state) => state.toggleSpotlight);
  const clampWindowsToViewport = useWindowStore((state) => state.clampWindowsToViewport);
  const hydrateDesktopIconPositions = useWindowStore((state) => state.hydrateDesktopIconPositions);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    try {
      const savedPositions = window.localStorage.getItem('macos-portfolio.desktop-icon-positions');
      if (savedPositions) {
        hydrateDesktopIconPositions(JSON.parse(savedPositions));
      }
    } catch {
      // Ignore malformed persisted layout.
    }

    clampWindowsToViewport();

    const handleResize = () => {
      clampWindowsToViewport();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [clampWindowsToViewport, hydrateDesktopIconPositions]);

  useKeyboardShortcut(['Meta', 'k'], toggleSpotlight);

  return (
    <div
      className="selection-glow relative h-screen w-screen overflow-hidden bg-slate-950 text-foreground"
    >
      <Image
        src={portfolioAssets.wallpaperImage}
        alt="Desktop wallpaper"
        fill
        priority
        className={`pointer-events-none absolute inset-0 z-0 object-cover transition duration-700 ${
          theme === "light" ? "scale-[1.03] saturate-[0.78] brightness-[1.12]" : ""
        }`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      />
      <div className="desktop-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div className={`pointer-events-none absolute inset-0 z-[2] ${theme === "light" ? "bg-white/24" : "bg-slate-950/12"}`} />

      <div ref={constraintsRef} className="pointer-events-none absolute inset-x-0 top-12 bottom-0 z-[3]" />

      <MenuBar />
      <WelcomeText />

      {desktopShortcuts.map((shortcut) => (
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
