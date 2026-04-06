'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code2, ExternalLink, FolderOpen, Grid2X2, List, Search, type LucideIcon } from 'lucide-react';

import { Sidebar, type SidebarSection } from '@/components/ui/Sidebar';
import { getProjectFileWindowId, getSidebars } from '@/lib/dataService';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';
import { AboutContentPane } from '@/features/about/AboutContentPane';
import { ProjectFilesPane } from './ProjectFilesPane';
import { ProjectsOverviewPane } from './ProjectsOverviewPane';
import { useFinderNavigation } from './useFinderNavigation';

export function ProjectsApp({ windowId }: { windowId: string }) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const profile = usePortfolioDataStore((state) => state.profile);
  const currentWindow = useWindowStore((state) => state.windows[windowId]);
  const openWindow = useWindowStore((state) => state.openWindow);
  const setWindowTitle = useWindowStore((state) => state.setWindowTitle);
  const setWindowViewMode = useWindowStore((state) => state.setWindowViewMode);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [aboutSectionId, setAboutSectionId] = useState(profile.aboutSections[0]?.id ?? null);
  const { currentLocation, navigate, goBack, goForward, canGoBack, canGoForward } = useFinderNavigation({
    pane: 'root',
  });

  const viewMode = currentWindow?.viewMode ?? 'finder';
  const sidebarData = getSidebars();
  const finderRootTitle = sidebarData.finder.items[0]?.action?.title ?? 'Work';
  const activePane = currentLocation.pane;
  const effectiveSelectedProjectId = currentLocation.projectId ?? selectedProjectId;
  const selectedProject = useMemo(
    () => {
      return effectiveSelectedProjectId
        ? projects.find((project) => project.id === effectiveSelectedProjectId) ?? null
        : null;
    },
    [effectiveSelectedProjectId, projects],
  );
  const showcaseProject = selectedProject ?? projects[0] ?? null;
  const activeFileId =
    selectedProject && selectedFileId && selectedProject.files.some((file) => file.id === selectedFileId)
      ? selectedFileId
      : selectedProject?.files[0]?.id ?? null;

  useEffect(() => {
    const nextTitle =
      viewMode === 'showcase'
        ? 'Projects Showcase'
        : activePane === 'about'
          ? 'About Me'
          : activePane === 'trash'
            ? 'Trash'
            : activePane === 'project'
              ? selectedProject?.titleBar ?? finderRootTitle
              : finderRootTitle;

    if (currentWindow && currentWindow.title !== nextTitle) {
      setWindowTitle(windowId, nextTitle);
    }
  }, [activePane, currentWindow, finderRootTitle, selectedProject?.titleBar, setWindowTitle, viewMode, windowId]);

  const openLiveProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
  };

  const openGithub = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
  };

  const openFinderProject = (projectId: string) => {
    setWindowViewMode(windowId, 'finder');
    setSelectedProjectId(projectId);
    setSelectedFileId(null);
    navigate({
      pane: 'project',
      projectId,
    });
  };

  const handleOpenProjectFile = (projectId: string, fileId: string) => {
    const project = projects.find((item) => item.id === projectId);
    const file = project?.files.find((item) => item.id === fileId);

    if (!project || !file) {
      return;
    }

    if (file.type === 'link' && file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
      return;
    }

    openWindow(getProjectFileWindowId(projectId, fileId), file.windowTitle ?? file.name);
  };

  const favoriteSection: SidebarSection = {
    heading: sidebarData.finder.heading,
    items: sidebarData.finder.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      active:
        viewMode === 'finder' &&
        ((item.id === 'projects' && activePane === 'root') ||
          (item.id === 'about' && activePane === 'about') ||
          (item.id === 'trash' && activePane === 'trash')),
      onClick: () => {
        if (item.id === 'projects') {
          setWindowViewMode(windowId, 'finder');
          setSelectedProjectId(null);
          setSelectedFileId(null);
          navigate({ pane: 'root' });
          return;
        }

        if (item.id === 'about') {
          setWindowViewMode(windowId, 'finder');
          navigate({ pane: 'about' });
          return;
        }

        if (item.id === 'trash') {
          setWindowViewMode(windowId, 'finder');
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
    items: projects.map((project) => ({
      id: project.id,
      label: project.folderLabel,
      icon: 'file-text',
      active: viewMode === 'finder' && activePane === 'project' && selectedProjectId === project.id,
      onClick: () => openFinderProject(project.id),
    })),
  };

  const headerTitle =
    viewMode === 'showcase'
      ? 'Projects Showcase'
      : activePane === 'about'
        ? 'About Me'
        : activePane === 'trash'
          ? 'Trash'
          : activePane === 'project'
            ? selectedProject?.titleBar ?? finderRootTitle
            : finderRootTitle;

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <Sidebar sections={[favoriteSection, workSection]} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <div className="flex items-center gap-4 text-black/35 dark:text-white/45">
            <button
              onClick={() => {
                if (viewMode === 'finder') {
                  goBack();
                }
              }}
              disabled={viewMode !== 'finder' || !canGoBack}
              className="rounded-md p-1 transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/6"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => {
                if (viewMode === 'finder') {
                  goForward();
                }
              }}
              disabled={viewMode !== 'finder' || !canGoForward}
              className="rounded-md p-1 transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/6"
              aria-label="Go forward"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span className="ml-2 text-[22px] font-semibold text-[#2c2c2f] dark:text-white">
              {headerTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-black/6 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/6">
              <button
                onClick={() => setWindowViewMode(windowId, 'finder')}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  viewMode === 'finder'
                    ? 'bg-white text-[#171717] shadow-sm dark:bg-white/12 dark:text-white'
                    : 'text-black/55 dark:text-white/55'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Folder View
                </span>
              </button>
              <button
                onClick={() => setWindowViewMode(windowId, 'showcase')}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  viewMode === 'showcase'
                    ? 'bg-white text-[#171717] shadow-sm dark:bg-white/12 dark:text-white'
                    : 'text-black/55 dark:text-white/55'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Grid2X2 className="h-4 w-4" />
                  Grid View
                </span>
              </button>
            </div>
            <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {projects.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-black/45 dark:text-white/45">
              No projects yet.
            </div>
          ) : viewMode === 'showcase' ? (
            <div className="grid gap-5 px-8 py-8 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const active = showcaseProject?.id === project.id;

                return (
                  <motion.article
                    key={project.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setSelectedFileId(null);
                    }}
                    onDoubleClick={() => openLiveProject(project.id)}
                    className={`group relative overflow-hidden rounded-[1.7rem] border text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition ${
                      active
                        ? 'border-blue-400/60 ring-2 ring-blue-400/30'
                        : 'border-black/8 dark:border-white/10'
                    }`}
                  >
                    <div className="relative h-48 bg-black/[0.03] dark:bg-white/6">
                      <Image
                        src={project.thumbnail || project.icon}
                        alt={project.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <ActionPill onClick={() => openLiveProject(project.id)} label="Open Project" icon={ExternalLink} />
                        <ActionPill onClick={() => openGithub(project.id)} label="View Code" icon={Code2} />
                        <ActionPill onClick={() => openFinderProject(project.id)} label="Details" icon={FolderOpen} />
                      </div>
                    </div>
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-[22px] font-semibold text-[#18181b] dark:text-white">{project.name}</h2>
                          <p className="mt-2 text-[15px] leading-6 text-black/68 dark:text-white/62">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-medium text-black/65 dark:bg-white/8 dark:text-white/65"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : activePane === 'about' ? (
            <AboutContentPane
              activeSectionId={aboutSectionId}
              showSectionTabs
              onSelectSection={setAboutSectionId}
            />
          ) : activePane === 'trash' ? (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm text-black/45 dark:text-white/45">
              Trash is empty right now.
            </div>
          ) : activePane === 'project' && selectedProject ? (
            <ProjectFilesPane
              project={selectedProject}
              selectedFileId={activeFileId}
              onSelectFile={setSelectedFileId}
              onOpenFile={(fileId) => handleOpenProjectFile(selectedProject.id, fileId)}
            />
          ) : (
            <ProjectsOverviewPane
              projects={projects}
              selectedProjectId={effectiveSelectedProjectId}
              onSelectProject={(projectId) => {
                setSelectedProjectId(projectId);
                setSelectedFileId(null);
              }}
              onOpenProject={openFinderProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ActionPill({
  onClick,
  label,
  icon: Icon,
}: {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#171717] shadow-lg transition hover:bg-white"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
