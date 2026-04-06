'use client';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';

export function TrashNoteApp({ itemId }: { itemId: string }) {
  const trash = usePortfolioDataStore((state) => state.trash);
  const item = trash.items.find((entry) => entry.id === itemId);

  if (!item || item.type === 'image') {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-white px-8 py-7 text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="max-w-[480px] space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-black/35 dark:text-white/35">
            Archived idea
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#171717] dark:text-white/92">
            {item.name}
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-black/62 dark:text-white/62">{item.summary}</p>
        </div>

        {item.content ? (
          <div className="space-y-7 text-[18px] leading-[1.35] text-[#171717] dark:text-white/92">
            {item.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#171717] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-white/12 dark:hover:bg-white/18"
          >
            Open archived link
          </a>
        ) : null}
      </div>
    </div>
  );
}
