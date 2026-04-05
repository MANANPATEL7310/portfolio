'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { CircleUserRound, Search, Wifi } from "lucide-react";

import { menuItems, portfolioIdentity } from "@/data/portfolio";
import { useWindowStore } from '@/store/useWindowStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { ThemeModeSwitch } from './ThemeModeSwitch';

export function MenuBar() {
  const [time, setTime] = useState('');
  const openWindow = useWindowStore((s) => s.openWindow);
  const toggleSpotlight = useSystemStore((s) => s.toggleSpotlight);
  const theme = useSystemStore((s) => s.theme);
  const systemTheme = useSystemStore((s) => s.systemTheme);
  const resolvedTheme = getResolvedTheme(theme, systemTheme);

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
    <div className="fixed inset-x-0 top-0 z-[9999] flex h-12 items-center justify-between border-b border-border-subtle px-6 text-sm font-medium text-foreground backdrop-blur-2xl transition-colors duration-300">
      <div className={`absolute inset-0 ${resolvedTheme === "light" ? "bg-white/24" : "bg-black/18"}`} />

      <div className="relative flex items-center gap-5">
        <button
          onClick={() => openWindow("about", "About Me")}
          className="flex items-center gap-3 text-foreground"
        >
          <Image
            src="/assets/Apple Logo.svg"
            alt="Apple logo"
            width={14}
            height={14}
            className={resolvedTheme === "dark" ? "invert" : ""}
          />
          <span className="hidden text-[17px] font-semibold md:inline">
            {portfolioIdentity.fullTitle}
          </span>
        </button>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => openWindow(item.id, item.title)}
            className="hidden text-[17px] text-text-secondary transition hover:text-foreground md:inline"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-4 text-text-secondary">
        <Wifi className="h-4 w-4" />
        <button
          onClick={toggleSpotlight}
          className="transition hover:text-foreground"
          title="Search (⌘K)"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={() => openWindow("about", "About Me")}
          className="transition hover:text-foreground"
          title="About me"
        >
          <CircleUserRound className="h-4 w-4" />
        </button>
        <ThemeModeSwitch />
        <span className="hidden text-[15px] font-medium text-foreground md:inline">{time}</span>
      </div>
    </div>
  );
}
