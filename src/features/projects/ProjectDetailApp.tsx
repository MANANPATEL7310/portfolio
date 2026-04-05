'use client';

import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText, FolderOpen, Info, Link2, Search, Trash2 } from "lucide-react";

import { portfolioAssets, projects, type ProjectSlug } from "@/data/portfolio";
import { useWindowStore } from "@/store/useWindowStore";

export function ProjectDetailApp({ slug }: { slug: ProjectSlug }) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]">
        <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Favorites</p>
        <div className="mt-2 space-y-1">
          <button
            onClick={() => openWindow("projects", "Work")}
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
              key={item.slug}
              onClick={() => openWindow(item.windowId, item.titleBar)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                item.slug === slug
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
          <FileButton
            label="Full case study"
            onClick={() => openWindow(project.noteWindowId, `${project.shortLabel} Project TLDR.txt`)}
          >
            <Image src={portfolioAssets.folderIcon} alt="" className="w-24" sizes="96px" />
          </FileButton>

          <FileButton label="Design.fig">
            <Image src={portfolioAssets.figmaIcon} alt="" className="w-20 rounded-3xl" sizes="80px" />
          </FileButton>

          <FileButton
            label="Screenshot.png"
            onClick={() => openWindow(project.previewWindowId, `${project.shortLabel} Screenshot.png`)}
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg">
              <Image src={project.heroImage} alt="" fill className="object-cover" sizes="80px" />
            </div>
          </FileButton>

          <FileButton label={project.siteLabel}>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
              <Image src={portfolioAssets.safariIcon} alt="" className="w-16" sizes="64px" />
            </div>
          </FileButton>

          <FileButton
            label="TLDR.txt"
            onClick={() => openWindow(project.noteWindowId, `${project.shortLabel} Project TLDR.txt`)}
          >
            <div className="relative">
              <Image src={portfolioAssets.txtIcon} alt="" className="w-14" sizes="56px" />
              <Link2 className="absolute -right-2 top-7 h-4 w-4 text-white/20" />
            </div>
          </FileButton>
        </div>
      </div>
    </div>
  );
}

function FileButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 text-center text-[17px] text-[#1b1b1d] dark:text-white/92"
    >
      <div className="transition duration-200 group-hover:scale-[1.03]">{children}</div>
      <span>{label}</span>
    </button>
  );
}
