'use client';

import Image from 'next/image';

import type { ProjectData } from '@/lib/dataService';

interface ProjectsOverviewPaneProps {
  projects: ProjectData[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onOpenProject: (projectId: string) => void;
}

export function ProjectsOverviewPane({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenProject,
}: ProjectsOverviewPaneProps) {
  return (
    <div className="grid grid-cols-1 gap-y-12 px-10 py-12 sm:grid-cols-2 sm:px-16 lg:px-24">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          onDoubleClick={() => onOpenProject(project.id)}
          className={`group flex flex-col items-center justify-self-center gap-3 rounded-2xl px-4 py-3 text-center transition ${
            selectedProjectId === project.id ? 'bg-black/[0.04] dark:bg-white/6' : ''
          }`}
        >
          <Image
            src={project.icon}
            alt={project.titleBar}
            width={112}
            height={112}
            className="w-28 transition duration-200 group-hover:scale-105"
            sizes="112px"
          />
          <span className="text-[20px] text-[#18181b] dark:text-white/92">{project.desktopLabel}</span>
        </button>
      ))}
    </div>
  );
}
