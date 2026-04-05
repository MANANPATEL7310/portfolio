'use client';

import Image from "next/image";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function ProjectNoteApp({
  projectId,
  fileId,
}: {
  projectId: string;
  fileId: string;
}) {
  const projects = usePortfolioDataStore((state) => state.projects);
  const project = projects.find((item) => item.id === projectId);
  const file = project?.files.find((item) => item.id === fileId);

  if (!project || !file || file.type === "image") {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-white px-8 py-7 text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="max-w-[420px] space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-black/35 dark:text-white/35">
            {project.name}
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#171717] dark:text-white/92">
            {file.name}
          </h2>
        </div>

        {file.src && file.type === "figma" ? (
          <div className="rounded-[1.6rem] border border-black/8 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/4">
            <div className="relative mx-auto aspect-square w-32">
              <Image src={file.src} alt={file.name} fill className="object-contain" sizes="128px" />
            </div>
          </div>
        ) : null}

        {file.content ? (
          <div className="space-y-7 text-[18px] leading-[1.35] text-[#171717] dark:text-white/92">
            {file.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
