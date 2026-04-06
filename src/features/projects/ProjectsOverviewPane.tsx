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
    <div className="grid auto-rows-max grid-cols-[repeat(auto-fit,minmax(170px,170px))] justify-start gap-x-10 gap-y-9 px-8 py-8 sm:px-10 lg:px-12">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          onDoubleClick={() => onOpenProject(project.id)}
          className={`group flex w-[170px] flex-col items-center gap-3 rounded-2xl px-3 py-3 text-center transition ${
            selectedProjectId === project.id ? 'bg-black/[0.04] shadow-sm dark:bg-white/6' : ''
          }`}
        >
          <Image
            src={project.icon}
            alt={project.titleBar}
            width={112}
            height={112}
            className="w-28 transition duration-200 group-hover:scale-[1.04]"
            sizes="112px"
          />
          <span className="text-[17px] leading-6 text-[#18181b] dark:text-white/92">{project.desktopLabel}</span>
        </button>
      ))}
    </div>
  );
}
