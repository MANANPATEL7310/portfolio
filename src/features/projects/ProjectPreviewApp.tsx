'use client';

import { useState } from "react";
import Image from "next/image";
import { Download, Minus, Plus, RotateCcw, Search, Share2 } from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function ProjectPreviewApp({
  projectId,
  fileId,
}: {
  projectId: string;
  fileId: string;
}) {
  const [zoom, setZoom] = useState(1);
  const projects = usePortfolioDataStore((state) => state.projects);
  const project = projects.find((item) => item.id === projectId);
  const file = project?.files.find((item) => item.id === fileId);

  if (!project || !file || file.type !== "image" || !file.src) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f6f8] text-slate-600 dark:bg-[#191b22] dark:text-white">
      <div className="flex h-12 items-center justify-between border-b border-black/6 px-4 text-slate-500 dark:border-white/10 dark:text-white/70">
        <span className="text-sm font-medium">{project.name} Preview</span>
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4" />
          <RotateCcw className="h-4 w-4" />
          <button onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-xs">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((value) => Math.min(2, value + 0.1))}>
            <Plus className="h-4 w-4" />
          </button>
          <Download className="h-4 w-4" />
          <Share2 className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] border border-black/8 bg-white dark:border-white/10 dark:bg-[#10131d]">
          <div
            className="relative h-full w-full transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image
              src={file.src}
              alt={`${project.name} screenshot`}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 70vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
