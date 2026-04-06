'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Archive, Clock3, ExternalLink, FolderOpen, StickyNote } from 'lucide-react';

import { getTrashFileWindowId } from '@/lib/dataService';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useWindowStore } from '@/store/useWindowStore';

export function TrashContentPane() {
  const trash = usePortfolioDataStore((state) => state.trash);
  const openWindow = useWindowStore((state) => state.openWindow);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(trash.items[0]?.id ?? null);

  const selectedItem = useMemo(
    () => trash.items.find((item) => item.id === selectedItemId) ?? trash.items[0] ?? null,
    [selectedItemId, trash.items],
  );

  const openArchiveItem = (itemId: string) => {
    const item = trash.items.find((entry) => entry.id === itemId);
    if (!item) {
      return;
    }

    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    openWindow(getTrashFileWindowId(item.id), item.windowTitle ?? item.name);
  };

  if (trash.items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center text-sm text-black/45 dark:text-white/45">
        {trash.emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-black/6 px-8 py-6 dark:border-white/10">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-black/[0.05] p-3 text-black/65 dark:bg-white/8 dark:text-white/75">
            <Archive className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[24px] font-semibold text-[#18181b] dark:text-white">{trash.title}</h2>
            <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-black/62 dark:text-white/62">
              {trash.subtitle}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-black/35 dark:text-white/35">
              {trash.items.length} archived items
            </p>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
        <div className="min-h-0 overflow-auto px-8 py-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trash.items.map((item) => {
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  onDoubleClick={() => openArchiveItem(item.id)}
                  className={`group overflow-hidden rounded-[1.55rem] border bg-white text-left shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition dark:bg-[#24242a] ${
                    isSelected
                      ? 'border-blue-400/55 ring-2 ring-blue-400/25 dark:border-blue-300/45'
                      : 'border-black/8 hover:border-black/14 dark:border-white/10 dark:hover:border-white/16'
                  }`}
                >
                  <div className="flex items-center justify-center border-b border-black/6 bg-black/[0.02] px-5 py-6 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                      <Image
                        src={item.type === 'image' && item.src ? item.src : item.icon}
                        alt={item.name}
                        width={96}
                        height={96}
                        className={`max-h-24 w-auto object-contain ${
                          item.type === 'image'
                            ? 'rounded-2xl border border-black/6 bg-white shadow-lg dark:border-white/10'
                            : ''
                        }`}
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[17px] font-semibold text-[#171717] dark:text-white/92">{item.name}</h3>
                      {item.type === 'link' ? (
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-black/35 dark:text-white/35" />
                      ) : item.type === 'folder' ? (
                        <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-black/35 dark:text-white/35" />
                      ) : (
                        <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-black/35 dark:text-white/35" />
                      )}
                    </div>
                    <p className="text-[14px] leading-6 text-black/62 dark:text-white/62">{item.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-medium text-black/60 dark:bg-white/8 dark:text-white/62"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="hidden min-h-0 border-l border-black/6 bg-black/[0.02] px-6 py-8 dark:border-white/10 dark:bg-white/[0.03] lg:block">
          {selectedItem ? (
            <div className="space-y-6">
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                <Image
                  src={selectedItem.type === 'image' && selectedItem.src ? selectedItem.src : selectedItem.icon}
                  alt={selectedItem.name}
                  width={112}
                  height={112}
                  className={`max-h-28 w-auto object-contain ${
                    selectedItem.type === 'image'
                      ? 'rounded-2xl border border-black/6 bg-white shadow-lg dark:border-white/10'
                      : ''
                  }`}
                  sizes="112px"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-[22px] font-semibold text-[#171717] dark:text-white">{selectedItem.name}</h3>
                <p className="text-[15px] leading-6 text-black/62 dark:text-white/62">{selectedItem.summary}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-black/45 dark:text-white/45">
                <Clock3 className="h-4 w-4" />
                Archived on{' '}
                {new Date(selectedItem.deletedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-medium text-black/60 dark:bg-white/8 dark:text-white/62"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => openArchiveItem(selectedItem.id)}
                className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-white/12 dark:hover:bg-white/18"
              >
                Open Archive Item
              </button>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
