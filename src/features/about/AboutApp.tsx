import Image from "next/image";
import { BookOpen, BriefcaseBusiness, FileText, FolderOpen } from "lucide-react";

import { aboutCopy, aboutSections, portfolioAssets } from "@/data/portfolio";

const icons = [FolderOpen, BookOpen, BriefcaseBusiness, FolderOpen, FileText];

export function AboutApp() {
  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]">
        <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Favorites</p>
        <div className="mt-4 space-y-1">
          {aboutSections.map((section, index) => {
            const Icon = icons[index] ?? FolderOpen;
            const active = index === 0;
            return (
              <button
                key={section}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                  active
                    ? "bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white"
                    : "text-black/78 hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6"
                }`}
              >
                <Icon className="h-4 w-4 text-blue-400" />
                {section}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center border-b border-black/6 px-5 dark:border-white/10">
          <span className="text-[20px] font-medium text-[#2c2c2f] dark:text-white/92">About Me</span>
        </div>

        <div className="hide-scrollbar overflow-auto px-7 py-8 md:px-9">
          <div className="mx-auto max-w-[580px]">
            <Image
              src={portfolioAssets.avatarImage}
              alt="Adrian portrait"
              className="h-20 w-20 rounded-full object-cover"
            />

            <h1 className="mt-5 text-[28px] font-semibold leading-tight text-[#151515] dark:text-white">
              {aboutCopy[0]}
            </h1>

            <div className="mt-6 space-y-6 text-[18px] leading-[1.45] text-black/82 dark:text-white/82">
              {aboutCopy.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
