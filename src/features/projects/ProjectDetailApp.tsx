'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { Sidebar, type SidebarSection } from '@/components/ui/Sidebar';
import { getProjectFileWindowId, getSidebars } from '@/lib/dataService';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';
import { AboutContentPane } from '@/features/about/AboutContentPane';
import { ProjectFilesPane } from './ProjectFilesPane';
import { ProjectsOverviewPane } from './ProjectsOverviewPane';

type FinderPane = 'root' | 'project' | 'about' | 'trash';

export function ProjectDetailApp({
  projectId,
  windowId,
}: {
  projectId: string;
  windowId: string;
}) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const profile = usePortfolioDataStore((state) => state.profile);
  const openWindow = useWindowStore((state) => state.openWindow);
  const setWindowTitle = useWindowStore((state) => state.setWindowTitle);
  const [activePane, setActivePane] = useState<FinderPane>('project');
  const [activeProjectId, setActiveProjectId] = useState(projectId);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [aboutSectionId, setAboutSectionId] = useState(profile.aboutSections[0]?.id ?? null);

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
    const nextTitle =
      activePane === 'about'
        ? 'About Me'
        : activePane === 'trash'
          ? 'Trash'
          : activePane === 'root'
            ? 'Work'
            : activeProject?.titleBar ?? 'Work';

    setWindowTitle(windowId, nextTitle);
  }, [activePane, activeProject?.titleBar, setWindowTitle, windowId]);

  const openProjectFile = (nextProjectId: string, fileId: string) => {
    const project = projects.find((item) => item.id === nextProjectId);
    const file = project?.files.find((item) => item.id === fileId);

    if (!project || !file) {
      return;
    }

    if (file.type === 'link' && file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
      return;
    }

    openWindow(getProjectFileWindowId(nextProjectId, fileId), file.windowTitle ?? file.name);
  };

  const favoritesSection: SidebarSection = {
    heading: sidebarData.finder.heading,
    items: sidebarData.finder.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      active:
        (item.id === 'projects' && activePane === 'root') ||
        (item.id === 'about' && activePane === 'about') ||
        (item.id === 'trash' && activePane === 'trash'),
      onClick: () => {
        if (item.id === 'projects') {
          setActivePane('root');
          setSelectedFileId(null);
          return;
        }

        if (item.id === 'about') {
          setActivePane('about');
          return;
        }

        if (item.id === 'trash') {
          setActivePane('trash');
          return;
        }

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
      active: activePane === 'project' && item.id === activeProject?.id,
      onClick: () => {
        setActivePane('project');
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
              {activePane === 'about'
                ? 'About Me'
                : activePane === 'trash'
                  ? 'Trash'
                  : activePane === 'root'
                    ? 'Work'
                    : activeProject.titleBar}
            </span>
          </div>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        {activePane === 'about' ? (
          <AboutContentPane
            activeSectionId={aboutSectionId}
            showSectionTabs
            onSelectSection={setAboutSectionId}
          />
        ) : activePane === 'trash' ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-black/45 dark:text-white/45">
            Trash is empty right now.
          </div>
        ) : activePane === 'root' ? (
          <ProjectsOverviewPane
            projects={projects}
            selectedProjectId={activeProjectId}
            onSelectProject={(nextProjectId) => {
              setActiveProjectId(nextProjectId);
              setSelectedFileId(null);
            }}
            onOpenProject={(nextProjectId) => {
              setActivePane('project');
              setActiveProjectId(nextProjectId);
              setSelectedFileId(null);
            }}
          />
        ) : (
          <ProjectFilesPane
            project={activeProject}
            selectedFileId={activeFileId}
            onSelectFile={setSelectedFileId}
            onOpenFile={(fileId) => openProjectFile(activeProject.id, fileId)}
          />
        )}
      </div>
    </div>
  );
}
