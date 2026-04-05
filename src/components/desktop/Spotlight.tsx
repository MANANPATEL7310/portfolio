'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from "lucide-react";

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { useSystemStore } from '@/store/useSystemStore';
import { useWindowStore } from '@/store/useWindowStore';

function fuzzyMatch(query: string, keywords: string[], title: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return false;
  }

  return (
    title.toLowerCase().includes(normalizedQuery) ||
    keywords.some((keyword) => keyword.includes(normalizedQuery))
  );
}

export function Spotlight() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSpotlightOpen, closeSpotlight } = useSystemStore();
  const openWindow = useWindowStore((state) => state.openWindow);
  const projects = usePortfolioDataStore((state) => state.projects);
  const menuItems = usePortfolioDataStore((state) => state.settings.menuItems);
  const dockApps = usePortfolioDataStore((state) => state.settings.dockApps);

  const spotlightItems = useMemo(() => {
    const baseItems = [...menuItems, ...dockApps.filter((item) => item.id !== "trash")].reduce<
      Array<{ id: string; title: string; keywords: string[]; viewMode?: "finder" | "showcase" }>
    >((items, item) => {
      if (items.some((entry) => entry.id === item.id)) {
        return items;
      }

      items.push({
        id: item.id,
        title: item.title ?? item.label,
        keywords: [item.label.toLowerCase(), (item.title ?? item.label).toLowerCase()],
        viewMode: item.openMode,
      });
      return items;
    }, []);

    return [
      ...baseItems,
      ...projects.map((project) => ({
        id: `project:${project.id}`,
        title: project.titleBar,
        keywords: [
          project.name.toLowerCase(),
          project.folderLabel.toLowerCase(),
          ...project.tags.map((tag) => tag.toLowerCase()),
        ],
        viewMode: undefined,
      })),
    ] as Array<{ id: string; title: string; keywords: string[]; viewMode?: "finder" | "showcase" }>;
  }, [dockApps, menuItems, projects]);

  const results = useMemo(
    () => spotlightItems.filter((item) => fuzzyMatch(query, item.keywords, item.title)),
    [query, spotlightItems],
  );

  useEffect(() => {
    if (!isSpotlightOpen) {
      return;
    }

    const timer = setTimeout(() => {
      setQuery('');
      setSelected(0);
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isSpotlightOpen]);

  const openSelected = (index: number) => {
    const target = results[index];
    if (!target) {
      return;
    }

    openWindow(target.id, target.title, { viewMode: target.viewMode });
    closeSpotlight();
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99990] bg-black/40 backdrop-blur-sm"
            onClick={closeSpotlight}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed left-1/2 top-[20%] z-[99991] w-[560px] max-w-[92vw] -translate-x-1/2 overflow-hidden rounded-[1.7rem] border border-white/15 bg-[rgba(28,28,34,0.9)] shadow-[0_35px_90px_rgba(0,0,0,0.35)] backdrop-blur-[40px]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    closeSpotlight();
                    return;
                  }

                  if (event.key === 'ArrowDown') {
                    setSelected((value) => Math.min(value + 1, results.length - 1));
                    return;
                  }

                  if (event.key === 'ArrowUp') {
                    setSelected((value) => Math.max(value - 1, 0));
                    return;
                  }

                  if (event.key === 'Enter') {
                    openSelected(selected);
                  }
                }}
                placeholder="Search for apps, projects, resume…"
                className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/30 caret-blue-400"
              />
              <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/30">ESC</kbd>
            </div>

            {results.length > 0 ? (
              <div className="flex flex-col gap-0.5 p-2">
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openSelected(index)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      index === selected ? 'bg-blue-500' : 'hover:bg-white/8'
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${index === selected ? 'bg-white/20' : 'bg-white/10'}`}>
                      <Search className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className={`text-[11px] ${index === selected ? 'text-white/70' : 'text-white/40'}`}>Portfolio window</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="py-8 text-center text-sm text-white/30">
                No results for &quot;{query}&quot;
              </div>
            ) : (
              <div className="py-5 text-center text-[11px] uppercase tracking-widest text-white/20">
                Type to search apps &amp; content
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
