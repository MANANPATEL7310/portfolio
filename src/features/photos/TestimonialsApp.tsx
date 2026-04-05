'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen, Heart, Image as ImageIcon, MapPin, Search, Users, X } from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

const sections = [
  { label: "Library", icon: FolderOpen, active: true },
  { label: "Memories", icon: ImageIcon },
  { label: "Places", icon: MapPin },
  { label: "People", icon: Users },
  { label: "Favorites", icon: Heart },
];

const layoutClasses: Record<string, string> = {
  hero: "col-span-2 row-span-2 lg:col-span-2",
  square: "col-span-1 row-span-1",
  portrait: "col-span-1 row-span-2",
};

export function TestimonialsApp() {
  const gallery = usePortfolioDataStore((state) => state.gallery);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewIndex = useMemo(
    () => gallery.findIndex((image) => image.id === previewId),
    [gallery, previewId],
  );
  const previewImage = previewIndex >= 0 ? gallery[previewIndex] : null;

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
          <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/88">
            {gallery[0]
              ? new Date(gallery[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Gallery"}
          </span>
          <Search className="h-7 w-7 text-black/45 dark:text-white/55" />
        </div>

        <div className="hide-scrollbar flex-1 overflow-auto px-5 py-5">
          {gallery.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-black/40 dark:text-white/45">
              No gallery images yet.
            </div>
          ) : (
            <div className="grid auto-rows-[145px] grid-cols-2 gap-3 lg:grid-cols-3">
              {gallery.map((moment) => (
                <button
                  key={moment.id}
                  onClick={() => setPreviewId(moment.id)}
                  className={`relative overflow-hidden rounded-xl border border-black/6 bg-black/[0.02] text-left dark:border-white/10 dark:bg-white/5 ${layoutClasses[moment.layout] ?? layoutClasses.square}`}
                >
                  <Image
                    src={moment.src}
                    alt={moment.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 30vw, 100vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {previewImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[1.8rem] border border-white/20 bg-black/80 shadow-[0_35px_100px_rgba(0,0,0,0.45)]"
            >
              <button
                onClick={() => setPreviewId(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/12 p-2 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[16/10] w-full">
                <Image src={previewImage.src} alt={previewImage.title} fill className="object-contain" sizes="90vw" />
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
                <div>
                  <p className="text-lg font-semibold">{previewImage.title}</p>
                  <p className="text-sm text-white/65">
                    {new Date(previewImage.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewId(gallery[(previewIndex - 1 + gallery.length) % gallery.length]?.id ?? null)}
                    className="rounded-full border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPreviewId(gallery[(previewIndex + 1) % gallery.length]?.id ?? null)}
                    className="rounded-full border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
