import Image from "next/image";
import { BookOpen, BriefcaseBusiness, FileText, FolderOpen } from "lucide-react";

import { aboutCopy, aboutSections, portfolioAssets } from "@/data/portfolio";

const icons = [FolderOpen, BookOpen, BriefcaseBusiness, FolderOpen, FileText];

export function AboutApp() {
  return (
    <div className="flex h-full bg-[#1f1f22] text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-white/10 bg-[#34343a] px-3 py-5 md:block">
        <p className="px-3 text-[13px] font-semibold text-white/28">Favorites</p>
        <div className="mt-4 space-y-1">
          {aboutSections.map((section, index) => {
            const Icon = icons[index] ?? FolderOpen;
            const active = index === 0;
            return (
              <button
                key={section}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                  active ? "bg-white/10 text-white" : "text-white/82 hover:bg-white/6"
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
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <span className="text-[20px] font-medium text-white/92">About Me</span>
        </div>

        <div className="hide-scrollbar overflow-auto px-7 py-8 md:px-9">
          <div className="mx-auto max-w-[580px]">
            <Image
              src={portfolioAssets.avatarImage}
              alt="Adrian portrait"
              className="h-20 w-20 rounded-full object-cover"
            />

            <h1 className="mt-5 text-[28px] font-semibold leading-tight text-white">
              {aboutCopy[0]}
            </h1>

            <div className="mt-6 space-y-6 text-[18px] leading-[1.45] text-white/82">
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
