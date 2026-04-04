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
    <div className="flex h-full bg-[#1f1f22] text-white">
      <aside className="hidden w-[198px] shrink-0 border-r border-white/10 bg-[#34343a] px-3 py-5 md:block">
        <p className="px-3 text-[13px] font-semibold text-white/28">Photos</p>
        <div className="mt-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.label}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[17px] transition ${
                  section.active ? "bg-white/10 text-white" : "text-white/82 hover:bg-white/6"
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
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <span className="text-[18px] font-semibold text-white/88">Jun 7, 2025</span>
          <Search className="h-7 w-7 text-white/55" />
        </div>

        <div className="hide-scrollbar flex-1 overflow-auto px-5 py-5">
          <div className="grid auto-rows-[145px] grid-cols-2 gap-3 lg:grid-cols-3">
            {galleryMoments.map((moment, index) => (
              <div
                key={`${index}-${moment.className}`}
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${moment.className}`}
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
