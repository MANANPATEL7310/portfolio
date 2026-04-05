'use client';

import Image from "next/image";
import { useWindowStore } from '@/store/useWindowStore';
import { motion } from 'framer-motion';
import { dockApps, portfolioAssets } from "@/data/portfolio";
import { getResolvedTheme, useSystemStore } from "@/store/useSystemStore";

export function Dock() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const windows = useWindowStore((s) => s.windows);
  const theme = useSystemStore((state) => state.theme);
  const systemTheme = useSystemStore((state) => state.systemTheme);
  const openWindows = Object.values(windows);
  const resolvedTheme = getResolvedTheme(theme, systemTheme);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center">
      <div
        className={`desktop-shadow pointer-events-auto flex items-end gap-3 rounded-[1.7rem] px-5 pb-3 pt-3 backdrop-blur-2xl transition-colors duration-300 ${
          resolvedTheme === "light"
            ? "border border-border-subtle bg-[rgba(173,194,255,0.32)]"
            : "border border-border-subtle bg-white/12"
        }`}
      >
        {dockApps.map((app) => {
          const isFinderFamily =
            app.id === "projects" &&
            openWindows.some(
              (window) =>
                window.id === "projects" ||
                window.id.startsWith("project-") ||
                window.id.startsWith("preview-") ||
                window.id.startsWith("note-") ||
                window.id === "resume",
            );

          const isOpen = app.id !== "trash" && (isFinderFamily || openWindows.some((window) => window.id === app.id));
          const icon =
            app.id === "trash" && openWindows.length > 0
              ? portfolioAssets.trashFullIcon
              : app.icon;

          return (
            <div key={`${app.id}-${app.label}`} className="group relative flex cursor-pointer flex-col items-center">
              <div className="pointer-events-none absolute -top-12 rounded-xl bg-foreground/85 px-3 py-1.5 text-xs text-background opacity-0 shadow-xl transition group-hover:opacity-100">
                {app.label}
              </div>

              <motion.div
                whileHover={{ scale: 1.4, y: -10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="transform origin-bottom"
                onClick={() => {
                  if (app.id !== "trash" && app.title) {
                    openWindow(app.id, app.title);
                  }
                }}
              >
                <Image src={icon} alt={app.label} className="w-[4.4rem] drop-shadow-2xl" sizes="70px" />
              </motion.div>

              <div className={`absolute -bottom-1.5 h-1 w-1 rounded-full transition-opacity ${resolvedTheme === "light" ? "bg-foreground/80" : "bg-background/85"} ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
