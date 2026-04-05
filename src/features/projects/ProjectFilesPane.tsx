'use client';

import Image from "next/image";

import type { ProjectData } from "@/lib/dataService";

interface ProjectFilesPaneProps {
  project: ProjectData;
  selectedFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onOpenFile: (fileId: string) => void;
}

export function ProjectFilesPane({
  project,
  selectedFileId,
  onSelectFile,
  onOpenFile,
}: ProjectFilesPaneProps) {
  return (
    <div className="grid flex-1 grid-cols-2 gap-x-16 gap-y-10 overflow-auto px-10 py-12 lg:px-20">
      {project.files.map((file) => (
        <button
          key={file.id}
          onClick={() => {
            onSelectFile(file.id);
            if (file.type === "link") {
              onOpenFile(file.id);
            }
          }}
          onDoubleClick={() => onOpenFile(file.id)}
          className={`group flex flex-col items-center gap-3 rounded-2xl px-4 py-3 text-center text-[17px] text-[#1b1b1d] transition dark:text-white/92 ${
            selectedFileId === file.id ? "bg-black/[0.04] dark:bg-white/6" : ""
          }`}
        >
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl transition duration-200 group-hover:scale-[1.03]">
            <Image
              src={file.icon || file.src || project.icon}
              alt={file.name}
              width={96}
              height={96}
              className={`max-h-24 w-auto object-contain ${
                file.type === "image" ? "rounded-2xl border border-black/6 bg-white shadow-lg dark:border-white/10" : ""
              }`}
              sizes="96px"
            />
          </div>
          <span>{file.name}</span>
        </button>
      ))}
    </div>
  );
}
