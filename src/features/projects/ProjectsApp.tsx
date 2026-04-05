'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code2, Grid2X2, List, Search, ExternalLink, FolderOpen, type LucideIcon } from 'lucide-react';

import { getProjectWindowId, getSidebars } from '@/lib/dataService';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';
import { Sidebar, SidebarSection } from '@/components/ui/Sidebar';
import { HoverText } from '@/components/ui/HoverText';

export function ProjectsApp({ windowId }: { windowId: string }) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const currentWindow = useWindowStore((state) => state.windows[windowId]);
  const openWindow = useWindowStore((state) => state.openWindow);
  const setWindowViewMode = useWindowStore((state) => state.setWindowViewMode);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id ?? null);

  const viewMode = currentWindow?.viewMode ?? 'finder';
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId]
  );

  const sidebarData = getSidebars();

  const favoritesSection: SidebarSection = {
    heading: sidebarData.finder.heading,
    items: sidebarData.finder.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      active: item.id === 'projects',
      onClick: () => {
        if (item.action?.type === 'window' && item.action.windowId) {
          openWindow(item.action.windowId, item.action.title || item.label, { viewMode: item.action.viewMode });
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
      active: project.id === selectedProjectId,
      onClick: () => {
        setSelectedProjectId(project.id);
        if (viewMode === 'finder') {
          openProjectDetails(project.id);
        }
      },
    })),
  };

  const openProjectDetails = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    openWindow(getProjectWindowId(project.id), project.titleBar);
  };

  const openLiveProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };

  const openGithub = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return;
    }

    window.open(project.githubUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <Sidebar sections={[favoritesSection, workSection]} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <div className="flex items-center gap-4 text-black/35 dark:text-white/45">
            <ChevronLeft className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <span className="ml-2 text-[22px] font-semibold text-[#2c2c2f] dark:text-white">
              {viewMode === "showcase" ? "Projects Showcase" : "Work"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-black/6 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/6">
              <button
                onClick={() => setWindowViewMode(windowId, "finder")}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  viewMode === "finder"
                    ? "bg-white text-[#171717] shadow-sm dark:bg-white/12 dark:text-white"
                    : "text-black/55 dark:text-white/55"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Folder View
                </span>
              </button>
              <button
                onClick={() => setWindowViewMode(windowId, "showcase")}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  viewMode === "showcase"
                    ? "bg-white text-[#171717] shadow-sm dark:bg-white/12 dark:text-white"
                    : "text-black/55 dark:text-white/55"
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
          ) : viewMode === "showcase" ? (
            <div className="grid gap-5 px-8 py-8 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const active = selectedProject?.id === project.id;

                return (
                  <motion.article
                    key={project.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setSelectedProjectId(project.id)}
                    onDoubleClick={() => openLiveProject(project.id)}
                    className={`group relative overflow-hidden rounded-[1.7rem] border text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition ${
                      active
                        ? "border-blue-400/60 ring-2 ring-blue-400/30"
                        : "border-black/8 dark:border-white/10"
                    }`}
                  >
                    <div className="relative h-48 bg-black/[0.03] dark:bg-white/6">
                      <Image
                        src={project.thumbnail || "/portfolio/project-1.png"}
                        alt={project.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <ActionPill onClick={() => openLiveProject(project.id)} label="Open Project" icon={ExternalLink} />
                        <ActionPill onClick={() => openGithub(project.id)} label="View Code" icon={Code2} />
                        <ActionPill onClick={() => openProjectDetails(project.id)} label="Details" icon={FolderOpen} />
                      </div>
                    </div>
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="group cursor-pointer text-[22px] font-semibold text-[#18181b] transition-colors duration-200 group-hover:text-blue-500 dark:text-white dark:group-hover:text-blue-400">
                            <HoverText variant="underline">{project.name}</HoverText>
                          </h2>
                          <p className="mt-2 text-[15px] leading-6 text-black/68 dark:text-white/62">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <motion.span 
                            key={tag} 
                            whileHover={{ scale: 1.05 }}
                            className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-medium text-black/65 transition-colors duration-200 hover:bg-black/10 dark:bg-white/8 dark:text-white/65 dark:hover:bg-white/15"
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
          ) : (
            <div className="grid grid-cols-1 gap-y-12 px-10 py-12 sm:grid-cols-2 sm:px-16 lg:px-24">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  onDoubleClick={() => openProjectDetails(project.id)}
                  className="group flex flex-col items-center justify-self-center gap-3 text-center"
                >
                  <Image
                    src={project.icon}
                    alt={project.titleBar}
                    width={112}
                    height={112}
                    className="w-28 transition duration-200 group-hover:scale-105"
                    sizes="112px"
                  />
                  <span className="text-[20px] text-[#18181b] dark:text-white/92">{project.titleBar}</span>
                </button>
              ))}
            </div>
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
    <motion.button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#171717] shadow-lg transition-colors duration-200 hover:bg-white hover:text-blue-600"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="relative">
        <HoverText variant="underline">{label}</HoverText>
      </span>
    </motion.button>
  );
}
