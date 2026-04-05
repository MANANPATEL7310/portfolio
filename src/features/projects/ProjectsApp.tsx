'use client';

import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText, FolderOpen, Info, Search, Trash2 } from "lucide-react";

import { portfolioAssets, projects } from "@/data/portfolio";
import { useWindowStore } from "@/store/useWindowStore";

export function ProjectsApp() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <aside className="hidden w-[206px] shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]">
        <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Favorites</p>
        <div className="mt-2 space-y-1">
          <button className="flex w-full items-center gap-2 rounded-xl bg-black/8 px-3 py-2 text-left text-[17px] text-[#1b1b1d] dark:bg-white/10 dark:text-white">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            Work
          </button>
          <button
            onClick={() => openWindow("about", "About Me")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] text-black/78 transition hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6"
          >
            <Info className="h-4 w-4 text-blue-400" />
            About me
          </button>
          <button
            onClick={() => openWindow("resume", "Resume.pdf")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] text-black/78 transition hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6"
          >
            <FileText className="h-4 w-4 text-blue-400" />
            Resume
          </button>
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] text-black/78 transition hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6">
            <Trash2 className="h-4 w-4 text-blue-400" />
            Trash
          </button>
        </div>

        <p className="mt-10 px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Work</p>
        <div className="mt-2 space-y-1">
          {projects.map((project) => (
            <button
              key={project.slug}
              onClick={() => openWindow(project.windowId, project.titleBar)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] text-black/72 transition hover:bg-black/4 dark:text-white/80 dark:hover:bg-white/6"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              {project.folderLabel}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <div className="flex items-center gap-4 text-black/35 dark:text-white/45">
            <ChevronLeft className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <span className="ml-2 text-[22px] font-semibold text-[#2c2c2f] dark:text-white">Work</span>
          </div>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-y-12 overflow-auto px-10 py-12 sm:grid-cols-2 sm:px-16 lg:px-24">
          {projects.map((project) => (
            <button
              key={project.slug}
              onClick={() => openWindow(project.windowId, project.titleBar)}
              className="group flex flex-col items-center gap-3 justify-self-center text-center"
            >
              <Image
                src={portfolioAssets.folderIcon}
                alt={project.title}
                className="w-28 transition duration-200 group-hover:scale-105"
                sizes="112px"
              />
              <span className="text-[20px] text-[#18181b] dark:text-white/92">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
