'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { Sidebar, type SidebarSection } from '@/components/ui/Sidebar';
import { FileRenderer } from '@/components/ui/FileItems';
import { getSidebars } from '@/lib/dataService';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';

export function ProjectDetailApp({
  projectId,
  windowId,
}: {
  projectId: string;
  windowId: string;
}) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const openWindow = useWindowStore((state) => state.openWindow);
  const setWindowTitle = useWindowStore((state) => state.setWindowTitle);
  const [activeProjectId, setActiveProjectId] = useState(projectId);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const activeProject = useMemo(
    () => projects.find((item) => item.id === activeProjectId) ?? projects.find((item) => item.id === projectId) ?? null,
    [activeProjectId, projectId, projects],
  );
  const sidebarData = getSidebars();
  const activeFileId =
    activeProject && selectedFileId && activeProject.files.some((file) => file.id === selectedFileId)
      ? selectedFileId
      : activeProject?.files[0]?.id ?? null;

  useEffect(() => {
    if (activeProject) {
      setWindowTitle(windowId, activeProject.titleBar);
    }
  }, [activeProject, setWindowTitle, windowId]);

  const favoritesSection: SidebarSection = {
    heading: sidebarData.finder.heading,
    items: sidebarData.finder.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      active: false,
      onClick: () => {
        if (item.action?.type === 'window' && item.action.windowId) {
          openWindow(item.action.windowId, item.action.title ?? item.label, { viewMode: item.action.viewMode });
        }
      },
    })),
  };

  const workSection: SidebarSection = {
    heading: sidebarData.finder.sectionLabel,
    items: projects.map((item) => ({
      id: item.id,
      label: item.folderLabel,
      icon: 'file-text',
      active: item.id === activeProject?.id,
      onClick: () => {
        setActiveProjectId(item.id);
        setSelectedFileId(null);
      },
    })),
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <Sidebar sections={[favoritesSection, workSection]} width={198} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <div className="flex items-center gap-4 text-black/35 dark:text-white/45">
            <ChevronLeft className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <span className="ml-2 text-[21px] font-semibold text-[#2c2c2f] dark:text-white">
              {activeProject.titleBar}
            </span>
          </div>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-16 gap-y-10 overflow-auto px-10 py-12 lg:px-20">
          {activeProject.files.map((file) => (
            <FileRenderer
              key={file.id}
              file={file}
              projectId={activeProject.id}
              selected={activeFileId === file.id}
              onSelect={() => setSelectedFileId(file.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
