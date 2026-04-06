'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';

interface AboutContentPaneProps {
  activeSectionId?: string | null;
  showSectionTabs?: boolean;
  onSelectSection?: (sectionId: string) => void;
}

export function AboutContentPane({
  activeSectionId,
  showSectionTabs = false,
  onSelectSection,
}: AboutContentPaneProps) {
  const profile = usePortfolioDataStore((state) => state.profile);

  const activeSection = useMemo(
    () => profile.aboutSections.find((section) => section.id === activeSectionId) ?? profile.aboutSections[0],
    [activeSectionId, profile.aboutSections],
  );

  if (!activeSection) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-[680px]">
        <div className="flex items-center gap-5">
          <Image
            src={profile.avatar}
            alt={`${profile.name} portrait`}
            width={90}
            height={90}
            className="h-[90px] w-[90px] rounded-full object-cover ring-2 ring-black/5 dark:ring-white/10"
          />
          <div>
            <h2 className="text-[22px] font-semibold text-[#151515] dark:text-white">{profile.name}</h2>
            <p className="text-[15px] text-black/60 dark:text-white/60">{profile.role}</p>
          </div>
        </div>

        {showSectionTabs ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {profile.aboutSections.map((section) => {
              const isActive = section.id === activeSection.id;

              return (
                <button
                  key={section.id}
                  onClick={() => onSelectSection?.(section.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#151515] text-white dark:bg-white/12 dark:text-white'
                      : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.07] dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/10'
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <h1 className="mt-8 text-[26px] font-semibold leading-tight text-[#151515] dark:text-white">
          {activeSection.title}
        </h1>

        <div className="mt-5 space-y-5 text-[17px] leading-[1.6] text-black/80 dark:text-white/80">
          {activeSection.content.map((paragraph, index) => (
            <p key={`${activeSection.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
