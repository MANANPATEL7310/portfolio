'use client';

import { useEffect, useState } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemStore } from '@/store/useSystemStore';
import { ThemeDropdown } from './ThemeDropdown';

export function MenuBar() {
  const [time, setTime] = useState('');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const openWindow = useWindowStore((s) => s.openWindow);
  const toggleSpotlight = useSystemStore((s) => s.toggleSpotlight);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleString([], {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { label: 'Projects', id: 'projects', title: 'Projects' },
    { label: 'Contact', id: 'about', title: 'About Me' },
    { label: 'Resume', id: 'resume', title: 'Resume' },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 px-4 flex items-center justify-between text-xs font-medium z-[9999] pointer-events-auto"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Left — Brand Nav */}
      <div className="flex items-center gap-4 text-white/90">
        <img
          src="/assets/Apple Logo.svg"
          alt="Apple"
          className="w-[14px] h-[14px] invert opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
        />
        <span className="font-bold text-white cursor-default hidden sm:inline">Portfolio</span>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => openWindow(item.id, item.title)}
            className="hidden md:inline text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right — System Tray */}
      <div className="flex items-center gap-3 text-white/80 relative">
        {/* WiFi icon */}
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.2 7.2C4.8 3.6 9.2 1.8 12 1.8s7.2 1.8 10.8 5.4l-2.1 2.1C17.7 6.3 14.9 4.8 12 4.8s-5.7 1.5-8.7 4.5L1.2 7.2zm4.2 4.2C7.2 9.6 9.6 8.4 12 8.4s4.8 1.2 6.6 3l-2.1 2.1C15.3 12.3 13.7 11.4 12 11.4s-3.3.9-4.5 2.1L5.4 11.4zm6.6 6.6a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z"/>
        </svg>

        {/* Search / Spotlight trigger */}
        <button
          onClick={toggleSpotlight}
          className="hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center"
          title="Search (⌘K)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Battery */}
        <span className="hidden sm:inline opacity-70 font-mono text-[10px]">100%</span>

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => setIsThemeOpen((v) => !v)}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center"
            title="Appearance"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </button>
          <ThemeDropdown isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
        </div>

        {/* Time */}
        <span className="font-mono text-[11px] text-white/90 hidden sm:inline">{time}</span>
      </div>
    </div>
  );
}
