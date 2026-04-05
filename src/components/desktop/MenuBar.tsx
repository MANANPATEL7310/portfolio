'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { CircleUserRound, Search, SlidersHorizontal, Wifi } from "lucide-react";

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { ThemeDropdown } from './ThemeDropdown';

export function MenuBar() {
  const [time, setTime] = useState('');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const profile = usePortfolioDataStore((state) => state.profile);
  const menuItems = usePortfolioDataStore((state) => state.settings.menuItems);
  const openWindow = useWindowStore((state) => state.openWindow);
  const toggleSpotlight = useSystemStore((state) => state.toggleSpotlight);
  const theme = useSystemStore((state) => getResolvedTheme(state.theme, state.systemTheme));

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`fixed inset-x-0 top-0 z-[9999] flex h-12 items-center justify-between px-6 text-sm font-medium backdrop-blur-2xl ${theme === "light" ? "border-b border-black/8 text-[#131313]" : "border-b border-white/10 text-white"}`}>
      <div className={`absolute inset-0 ${theme === "light" ? "bg-white/24" : "bg-black/18"}`} />

      <div className="relative flex items-center gap-5">
        <button
          onClick={() => openWindow("about", "About Me")}
          className={`flex items-center gap-3 ${theme === "light" ? "text-[#101010]" : "text-white/95"}`}
        >
          <Image
            src="/assets/Apple Logo.svg"
            alt="Apple logo"
            width={14}
            height={14}
            className={theme === "light" ? "" : "invert"}
          />
          <span className="hidden text-[17px] font-semibold md:inline">
            {profile.fullTitle}
          </span>
        </button>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => openWindow(item.id, item.title, { viewMode: item.openMode })}
            className={`hidden text-[17px] transition md:inline ${
              theme === "light" ? "text-black/85 hover:text-black" : "text-white/88 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`relative flex items-center gap-4 ${theme === "light" ? "text-black/85" : "text-white/82"}`}>
        <Wifi className="h-4 w-4" />
        <button
          onClick={toggleSpotlight}
          className={`transition ${theme === "light" ? "hover:text-black" : "hover:text-white"}`}
          title="Search (⌘K)"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={() => openWindow("about", "About Me")}
          className={`transition ${theme === "light" ? "hover:text-black" : "hover:text-white"}`}
          title="About me"
        >
          <CircleUserRound className="h-4 w-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsThemeOpen((value) => !value)}
            className={`transition ${theme === "light" ? "hover:text-black" : "hover:text-white"}`}
            title="Appearance"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <ThemeDropdown isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
        </div>
        <span className={`hidden text-[15px] font-medium md:inline ${theme === "light" ? "text-black/90" : "text-white/95"}`}>{time}</span>
      </div>
    </div>
  );
}
