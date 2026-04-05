'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText, FolderOpen, Info, Search, Trash2 } from "lucide-react";

import { getProjectFileWindowId, getProjectWindowId } from "@/lib/dataService";
import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";
import { useWindowStore } from "@/store/useWindowStore";

export function ProjectDetailApp({ projectId }: { projectId: string }) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const openWindow = useWindowStore((state) => state.openWindow);
  const project = useMemo(
    () => projects.find((item) => item.id === projectId),
    [projectId, projects],
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(project?.files[0]?.id ?? null);

  if (!project) {
    return null;
  }

  const openProjectFile = (fileId: string) => {
    const file = project.files.find((item) => item.id === fileId);
    if (!file) {
      return;
    }

    if (file.type === "link" && file.url) {
      window.open(file.url, "_blank", "noopener,noreferrer");
      return;
    }

    openWindow(getProjectFileWindowId(project.id, file.id), file.windowTitle ?? file.name);
  };

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]">
        <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Favorites</p>
        <div className="mt-2 space-y-1">
          <button
            onClick={() => openWindow("projects", "Work", { viewMode: "finder" })}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] text-black/78 transition hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6"
          >
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
          {projects.map((item) => (
            <button
              key={item.id}
              onClick={() => openWindow(getProjectWindowId(item.id), item.titleBar)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                item.id === project.id
                  ? "bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white"
                  : "text-black/72 hover:bg-black/4 dark:text-white/80 dark:hover:bg-white/6"
              }`}
            >
              <FileText className="h-4 w-4 text-blue-400" />
              {item.folderLabel}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <div className="flex items-center gap-4 text-black/35 dark:text-white/45">
            <ChevronLeft className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <span className="ml-2 text-[21px] font-semibold text-[#2c2c2f] dark:text-white">{project.titleBar}</span>
          </div>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-16 gap-y-10 overflow-auto px-10 py-12 lg:px-20">
          {project.files.map((file) => (
            <FileButton
              key={file.id}
              label={file.name}
              selected={selectedFileId === file.id}
              onClick={() => {
                setSelectedFileId(file.id);
                if (file.type === "link") {
                  openProjectFile(file.id);
                }
              }}
              onDoubleClick={() => openProjectFile(file.id)}
            >
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
                <Image
                  src={file.icon || file.src || project.icon}
                  alt={file.name}
                  width={96}
                  height={96}
                  className={`max-h-24 w-auto object-contain ${file.type === "image" ? "rounded-2xl border border-black/6 bg-white shadow-lg dark:border-white/10" : ""}`}
                  sizes="96px"
                />
              </div>
            </FileButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileButton({
  children,
  label,
  selected,
  onClick,
  onDoubleClick,
}: {
  children: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`group flex flex-col items-center gap-3 rounded-2xl px-4 py-3 text-center text-[17px] text-[#1b1b1d] transition dark:text-white/92 ${
        selected ? "bg-black/[0.04] dark:bg-white/6" : ""
      }`}
    >
      <div className="transition duration-200 group-hover:scale-[1.03]">{children}</div>
      <span>{label}</span>
    </button>
  );
}
