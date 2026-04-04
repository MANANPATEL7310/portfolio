import Image from "next/image";
import { Download, RotateCcw, Search, Share2 } from "lucide-react";

import { projects, type ProjectSlug } from "@/data/portfolio";

export function ProjectPreviewApp({ slug }: { slug: ProjectSlug }) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-[#191b22] text-white">
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 text-white/70">
        <span className="text-sm font-medium">{project.shortLabel} Preview</span>
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4" />
          <RotateCcw className="h-4 w-4" />
          <Download className="h-4 w-4" />
          <Share2 className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#10131d]">
          <Image
            src={project.heroImage}
            alt={`${project.shortLabel} screenshot`}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 70vw, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
