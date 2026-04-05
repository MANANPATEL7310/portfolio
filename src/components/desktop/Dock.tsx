'use client';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { DockItem } from '@/components/ui/DockItem';

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
          theme === 'light'
            ? 'border border-white/35 bg-[rgba(173,194,255,0.32)]'
            : 'border border-white/20 bg-white/12'
        }`}
      >
        {dockApps.map((app) => {
          const isFinderFamily =
            app.id === 'projects' &&
            openWindows.some(
              (windowState) =>
                windowState.id === 'projects' ||
                windowState.id.startsWith('project:') ||
                windowState.id.startsWith('project-file:') ||
                windowState.id === 'resume'
            );

          const isOpen =
            app.id !== 'trash' &&
            (isFinderFamily || openWindows.some((windowState) => windowState.id === app.id));
          const icon =
            app.id === 'trash' && openWindows.length > 0 ? '/portfolio/trash-2.png' : app.icon;

          return (
            <DockItem
              key={`${app.id}-${app.label}`}
              label={app.label}
              icon={icon}
              isOpen={isOpen}
              onClick={() => {
                if (app.id !== 'trash') {
                  openWindow(app.id, app.title, { viewMode: app.openMode });
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
