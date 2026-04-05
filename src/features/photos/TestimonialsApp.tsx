import Image from "next/image";
import { FolderOpen, Heart, Image as ImageIcon, MapPin, Search, Users } from "lucide-react";

import { galleryMoments } from "@/data/portfolio";

const sections = [
  { label: "Library", icon: FolderOpen, active: true },
  { label: "Memories", icon: ImageIcon },
  { label: "Places", icon: MapPin },
  { label: "People", icon: Users },
  { label: "Favorites", icon: Heart },
];

export function TestimonialsApp() {
  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-black/6 bg-[#eef1f5] px-3 py-5 md:block dark:border-white/10 dark:bg-[#34343a]">
        <p className="px-3 text-[13px] font-semibold text-black/25 dark:text-white/28">Photos</p>
        <div className="mt-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.label}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                  section.active
                    ? "bg-black/8 text-[#1b1b1d] dark:bg-white/10 dark:text-white"
                    : "text-black/78 hover:bg-black/4 dark:text-white/82 dark:hover:bg-white/6"
                }`}
              >
                <Icon className="h-4 w-4 text-blue-400" />
                {section.label}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-black/6 px-6 dark:border-white/10">
          <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/88">Jun 7, 2025</span>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        <div className="hide-scrollbar flex-1 overflow-auto px-5 py-5">
          <div className="grid auto-rows-[145px] grid-cols-2 gap-3 lg:grid-cols-3">
            {galleryMoments.map((moment, index) => (
              <div
                key={`${index}-${moment.className}`}
                className={`relative overflow-hidden rounded-xl border border-black/6 bg-black/[0.02] dark:border-white/10 dark:bg-white/5 ${moment.className}`}
              >
                <Image
                  src={moment.image}
                  alt="Gallery moment"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 30vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
