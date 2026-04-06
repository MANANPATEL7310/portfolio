'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { Sidebar, type SidebarSection } from '@/components/ui/Sidebar';
import { getProjectFileWindowId, getSidebars } from '@/lib/dataService';
import { openInBrowser } from '@/lib/openInBrowser';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';
import { AboutContentPane } from '@/features/about/AboutContentPane';
import { TrashContentPane } from '@/features/trash/TrashContentPane';
import { ProjectFilesPane } from './ProjectFilesPane';
import { ProjectsOverviewPane } from './ProjectsOverviewPane';
import { useFinderNavigation } from './useFinderNavigation';

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
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [aboutSectionId, setAboutSectionId] = useState(profile.aboutSections[0]?.id ?? null);
  const { currentLocation, navigate, goBack, goForward, canGoBack, canGoForward } = useFinderNavigation({
    pane: 'project',
    projectId,
  });
  const activePane = currentLocation.pane;
  const effectiveSelectedProjectId = currentLocation.projectId ?? selectedProjectId;

  const activeProject = useMemo(
    () => {
      return projects.find((item) => item.id === effectiveSelectedProjectId) ?? projects.find((item) => item.id === projectId) ?? null;
    },
    [effectiveSelectedProjectId, projectId, projects],
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
      openInBrowser(file.url, { title: file.windowTitle ?? file.name });
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
          setSelectedFileId(null);
          navigate({ pane: 'root' });
          return;
        }

        if (item.id === 'about') {
          navigate({ pane: 'about' });
          return;
        }

        if (item.id === 'trash') {
          navigate({ pane: 'trash' });
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
        setSelectedProjectId(item.id);
        setSelectedFileId(null);
        navigate({
          pane: 'project',
          projectId: item.id,
        });
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
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className="rounded-md p-1 transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/6"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goForward}
              disabled={!canGoForward}
              className="rounded-md p-1 transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/6"
              aria-label="Go forward"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
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
          <TrashContentPane />
        ) : activePane === 'root' ? (
          <ProjectsOverviewPane
            projects={projects}
            selectedProjectId={effectiveSelectedProjectId}
            onSelectProject={(nextProjectId) => {
              setSelectedProjectId(nextProjectId);
              setSelectedFileId(null);
            }}
            onOpenProject={(nextProjectId) => {
              setSelectedProjectId(nextProjectId);
              setSelectedFileId(null);
              navigate({
                pane: 'project',
                projectId: nextProjectId,
              });
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
