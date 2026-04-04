'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from "lucide-react";

import { spotlightItems } from "@/data/portfolio";
import { useWindowStore } from '@/store/useWindowStore';
import { useSystemStore } from '@/store/useSystemStore';

function fuzzyMatch(query: string, keywords: string[], title: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  return title.toLowerCase().includes(q) || keywords.some((k) => k.includes(q));
}

export function Spotlight() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSpotlightOpen, closeSpotlight } = useSystemStore();
  const openWindow = useWindowStore((s) => s.openWindow);

  const results = spotlightItems.filter((app) => fuzzyMatch(query, app.keywords, app.title));

  useEffect(() => {
    if (!isSpotlightOpen) return;
    const timer = setTimeout(() => {
      setQuery('');
      setSelected(0);
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [isSpotlightOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeSpotlight(); return; }
    if (e.key === 'ArrowDown') { setSelected((s) => Math.min(s + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp') { setSelected((s) => Math.max(s - 1, 0)); return; }
    if (e.key === 'Enter' && results[selected]) {
      openWindow(results[selected].id, results[selected].title);
      closeSpotlight();
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
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
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="h-5 w-5 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search for apps, projects, resume…"
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-white/30 caret-blue-400"
              />
              <kbd className="text-[10px] text-white/30 border border-white/20 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
            </div>

            {results.length > 0 && (
              <div className="p-2 flex flex-col gap-0.5">
                {results.map((app, i) => (
                  <button
                    key={app.id}
                    onClick={() => { openWindow(app.id, app.title); closeSpotlight(); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      i === selected ? 'bg-blue-500' : 'hover:bg-white/8'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === selected ? 'bg-white/20' : 'bg-white/10'}`}>
                      <Search className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{app.title}</p>
                      <p className={`text-[11px] ${i === selected ? 'text-white/70' : 'text-white/40'}`}>Portfolio window</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="py-8 text-center text-white/30 text-sm">
                No results for &quot;{query}&quot;
              </div>
            )}

            {!query && (
              <div className="py-5 text-center text-white/20 text-xs tracking-widest uppercase">
                Type to search apps & content
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
