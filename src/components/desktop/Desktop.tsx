'use client';

import { useRef, useEffect } from 'react';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WelcomeText } from './WelcomeText';
import { DesktopIcon } from './DesktopIcon';
import { Spotlight } from './Spotlight';
import { WindowManager } from '../window/WindowManager';
import { useSystemStore } from '@/store/useSystemStore';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

const LEFT_ICONS = [
  { id: 'resume', label: 'Resume', icon: '/assets/Finder-1.png', windowTitle: 'Resume', initialX: 40, initialY: 100 },
  { id: 'about', label: 'Contact', icon: '/assets/Finder-2.png', windowTitle: 'About Me', initialX: 40, initialY: 230 },
];

const RIGHT_ICONS = [
  { id: 'projects', label: 'Projects', icon: '/assets/Finder-3.png', windowTitle: 'Projects', initialX: -120, initialY: 80 },
  { id: 'about', label: 'Skills', icon: '/assets/Finder-4.png', windowTitle: 'About Me', initialX: -120, initialY: 210 },
  { id: 'about', label: 'About Me', icon: '/assets/Finder-5.png', windowTitle: 'About Me', initialX: -120, initialY: 340 },
];

export function Desktop() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { wallpaper, toggleSpotlight } = useSystemStore();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Global CMD+K shortcut
  useKeyboardShortcut(['Meta', 'k'], toggleSpotlight);

  return (
    <div
      ref={constraintsRef}
      className="relative w-screen h-screen overflow-hidden bg-gray-900 text-foreground selection:bg-blue-500 selection:text-white"
    >
      {/* Wallpaper */}
      <img
        src={wallpaper}
        alt="Wallpaper"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all duration-700"
      />

      {/* Slight darkening vignette for text legibility */}
      <div className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" />

      {/* Menu Bar */}
      <MenuBar />

      {/* Welcome text — centred, behind windows */}
      <WelcomeText />

      {/* Left desk icons */}
      {LEFT_ICONS.map((icon, i) => (
        <DesktopIcon
          key={`left-${i}`}
          {...icon}
          constraintsRef={constraintsRef}
        />
      ))}

      {/* Right desk icons — anchored from right edge */}
      <div className="absolute right-0 top-0 w-0 h-0">
        {RIGHT_ICONS.map((icon, i) => (
          <DesktopIcon
            key={`right-${i}`}
            {...icon}
            constraintsRef={constraintsRef}
          />
        ))}
      </div>

      {/* Window Manager */}
      <WindowManager constraintsRef={constraintsRef} />

      {/* Spotlight overlay */}
      <Spotlight />

      {/* Dock */}
      <Dock />
    </div>
  );
}
