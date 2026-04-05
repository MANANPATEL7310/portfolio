'use client';

import Image from "next/image";
import { motion } from 'framer-motion';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from "@/store/useSystemStore";
import { useWindowStore } from '@/store/useWindowStore';

export function Dock() {
  const dockApps = usePortfolioDataStore((state) => state.settings.dockApps);
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const theme = useSystemStore((state) => getResolvedTheme(state.theme, state.systemTheme));
  const openWindows = Object.values(windows);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center">
      <div
        className={`desktop-shadow pointer-events-auto flex items-end gap-3 rounded-[1.7rem] px-5 pb-3 pt-3 backdrop-blur-2xl ${
          theme === "light"
            ? "border border-white/35 bg-[rgba(173,194,255,0.32)]"
            : "border border-white/20 bg-white/12"
        }`}
      >
        {dockApps.map((app) => {
          const isFinderFamily =
            app.id === "projects" &&
            openWindows.some(
              (windowState) =>
                windowState.id === "projects" ||
                windowState.id.startsWith("project:") ||
                windowState.id.startsWith("project-file:") ||
                windowState.id === "resume",
            );

          const isOpen =
            app.id !== "trash" &&
            (isFinderFamily || openWindows.some((windowState) => windowState.id === app.id));
          const icon =
            app.id === "trash" && openWindows.length > 0
              ? "/portfolio/trash-2.png"
              : app.icon;

          return (
            <div key={`${app.id}-${app.label}`} className="group relative flex cursor-pointer flex-col items-center">
              <div className="pointer-events-none absolute -top-12 rounded-xl bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                {app.label}
              </div>

              <motion.button
                whileHover={{ scale: 1.4, y: -10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="transform origin-bottom"
                onClick={() => {
                  if (app.id !== "trash") {
                    openWindow(app.id, app.title, { viewMode: app.openMode });
                  }
                }}
              >
                <Image src={icon} alt={app.label} width={70} height={70} className="w-[4.4rem] drop-shadow-2xl" sizes="70px" />
              </motion.button>

              <div className={`absolute -bottom-1.5 h-1 w-1 rounded-full transition-opacity ${theme === "light" ? "bg-black/80" : "bg-white/85"} ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
