'use client';

import { useMemo, useState } from 'react';

import { getProjectById, getProjectFile, getTrashItem, parseWindowId } from '@/lib/dataService';
import { launchExternalBrowser } from '@/lib/openInBrowser';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { getResolvedTheme, useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';
import { useContextMenuStore } from '@/store/useContextMenuStore';
import { DockItem } from '@/components/ui/DockItem';

export function Dock() {
  const settings = usePortfolioDataStore((state) => state.settings);
  const dockApps = settings.dockApps;
  const projects = usePortfolioDataStore((state) => state.projects);
  const trash = usePortfolioDataStore((state) => state.trash);
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMinimizeWindow = useWindowStore((state) => state.toggleMinimizeWindow);
  const windows = useWindowStore((state) => state.windows);
  const theme = useSystemStore((state) => getResolvedTheme(state.theme, state.systemTheme));
  const openContextMenu = useContextMenuStore((state) => state.open);

  const handleDockContextMenu = (e: React.MouseEvent, appId: string, isOpen: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    openContextMenu({ x: e.clientX, y: e.clientY - 120 }, [
      { id: `open-${appId}`, label: "Open", action: () => openWindow(appId) },
      { id: `minimize-${appId}`, label: "Toggle Minimize", disabled: !isOpen, action: () => toggleMinimizeWindow(appId) },
      { id: `div-${appId}`, label: "", isDivider: true },
      { id: `quit-${appId}`, label: "Quit", disabled: !isOpen, action: () => closeWindow(appId) },
    ]);
  };

  const openWindows = Object.values(windows);
  const hasMaximizedWindow = openWindows.some((windowState) => windowState.isMaximized && !windowState.isMinimized);
  const [isDockRevealed, setIsDockRevealed] = useState(false);
  const pinnedDockIds = useMemo(() => new Set(dockApps.map((app) => app.id)), [dockApps]);
  const primaryDockApps = dockApps.filter((app) => app.id !== 'trash');
  const trashDockApp = dockApps.find((app) => app.id === 'trash');

  const transientDockItems = useMemo(() => {
    return openWindows.flatMap((windowState) => {
      const parsed = parseWindowId(windowState.id);

      if (parsed.kind === 'project') {
        const project = projects.find((entry) => entry.id === parsed.projectId) ?? getProjectById(parsed.projectId);
        if (!project) {
          return [];
        }

        return [{
          id: windowState.id,
          label: project.folderLabel,
          title: windowState.title,
          icon: project.icon,
        }];
      }

      if (parsed.kind === 'project-file') {
        const file = getProjectFile(parsed.projectId, parsed.fileId);
        if (!file) {
          return [];
        }

        return [{
          id: windowState.id,
          label: file.name,
          title: windowState.title,
          icon: file.type === 'image' && file.src ? file.src : file.icon,
        }];
      }

      if (parsed.kind === 'trash-file') {
        const item = trash.items.find((entry) => entry.id === parsed.itemId) ?? getTrashItem(parsed.itemId);
        if (!item) {
          return [];
        }

        return [{
          id: windowState.id,
          label: item.name,
          title: windowState.title,
          icon: item.type === 'image' && item.src ? item.src : item.icon,
        }];
      }

      if (parsed.kind !== 'app') {
        return [];
      }

      if (!pinnedDockIds.has(parsed.appId)) {
        const fallbackIcons: Partial<Record<typeof parsed.appId, string>> = {
          resume: '/portfolio/pdf.png',
          contact: '/portfolio/contact.png',
        };

        const fallbackIcon = fallbackIcons[parsed.appId];
        if (!fallbackIcon) {
          return [];
        }

        return [{
          id: windowState.id,
          label: windowState.title,
          title: windowState.title,
          icon: fallbackIcon,
        }];
      }

      return [];
    });
  }, [openWindows, pinnedDockIds, projects, trash.items]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] h-28">
      {hasMaximizedWindow ? (
        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 h-6"
          onPointerEnter={() => setIsDockRevealed(true)}
          aria-hidden="true"
        />
      ) : null}
      <div
        onPointerEnter={() => {
          if (hasMaximizedWindow) {
            setIsDockRevealed(true);
          }
        }}
        onPointerLeave={() => {
          if (hasMaximizedWindow) {
            setIsDockRevealed(false);
          }
        }}
        className={`desktop-shadow pointer-events-auto absolute left-1/2 bottom-6 flex -translate-x-1/2 items-end gap-1 rounded-[1.7rem] px-5 pb-3 pt-3 backdrop-blur-2xl transition-transform duration-300 ease-out ${
          theme === 'light'
            ? 'border border-white/35 bg-[rgba(173,194,255,0.32)]'
            : 'border border-white/20 bg-white/12'
        } ${
          hasMaximizedWindow && !isDockRevealed ? 'translate-y-[96px]' : 'translate-y-0'
        }`}
      >
        {primaryDockApps.map((app) => {
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
            isFinderFamily || openWindows.some((windowState) => windowState.id === app.id);

          return (
            <DockItem
              key={`${app.id}-${app.label}`}
              label={app.label}
              icon={app.icon}
              iconSize={app.iconSize}
              isOpen={isOpen}
              onClick={() => {
                if (app.id === 'browser') {
                  launchExternalBrowser(settings.browser.externalStartUrl);
                  return;
                }

                openWindow(app.id, app.title, { viewMode: app.openMode });
              }}
              onContextMenu={(e) => handleDockContextMenu(e, app.id, isOpen)}
            />
          );
        })}

        {transientDockItems.length > 0 ? (
          <div className={`mx-2 h-12 w-px self-center ${theme === 'light' ? 'bg-black/10' : 'bg-white/14'}`} />
        ) : null}

        {transientDockItems.map((item) => (
          <DockItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isOpen
            onClick={() => openWindow(item.id, item.title)}
            onContextMenu={(e) => handleDockContextMenu(e, item.id, true)}
          />
        ))}

        {trashDockApp ? (
          <>
            <div className={`mx-2 h-12 w-px self-center ${theme === 'light' ? 'bg-black/10' : 'bg-white/14'}`} />
            <DockItem
              key={`${trashDockApp.id}-${trashDockApp.label}`}
              label={trashDockApp.label}
              icon={
                openWindows.some(
                  (windowState) =>
                    windowState.id === 'trash' ||
                    windowState.id.startsWith('trash-file:'),
                )
                  ? '/portfolio/trash-2.png'
                  : trashDockApp.icon
              }
              isOpen={openWindows.some(
                (windowState) =>
                  windowState.id === 'trash' ||
                  windowState.id.startsWith('trash-file:'),
              )}
              onClick={() => {
                openWindow(trashDockApp.id, trashDockApp.title, { viewMode: trashDockApp.openMode });
              }}
              onContextMenu={(e) => handleDockContextMenu(e, trashDockApp.id, openWindows.some(
                (windowState) =>
                  windowState.id === 'trash' ||
                  windowState.id.startsWith('trash-file:'),
              ))}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
