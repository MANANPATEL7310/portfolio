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
  if (project.files.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <Image
          src={project.icon}
          alt={`${project.name} folder`}
          width={88}
          height={88}
          className="mb-5 w-20 opacity-90"
          sizes="80px"
        />
        <p className="text-base font-medium text-black/58 dark:text-white/55">This folder is currently empty.</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-black/40 dark:text-white/38">
          Project files will appear here when you add notes, previews, case studies, or links.
        </p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-max grid-cols-[repeat(auto-fit,minmax(160px,170px))] justify-start gap-x-9 gap-y-8 overflow-auto px-8 py-8 sm:px-10 lg:px-12">
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
          className={`group flex w-[170px] flex-col items-center gap-3 rounded-2xl px-3 py-3 text-center text-[16px] text-[#1b1b1d] transition dark:text-white/92 ${
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
          <span className="leading-6">{file.name}</span>
        </button>
      ))}
    </div>
  );
}
