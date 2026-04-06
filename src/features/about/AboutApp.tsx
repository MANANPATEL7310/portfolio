'use client';

import { useState } from 'react';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { Sidebar, SidebarSection } from '@/components/ui/Sidebar';
import { AboutContentPane } from './AboutContentPane';

export function AboutApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const defaultSectionId = profile.aboutSections[0]?.id ?? null;
  const [activeSectionId, setActiveSectionId] = useState(defaultSectionId);

  const aboutSection: SidebarSection = {
    items: profile.aboutSections.map((section) => ({
      id: section.id,
      label: section.label,
      icon: section.icon,
      active: section.id === activeSectionId,
      onClick: () => setActiveSectionId(section.id),
    })),
  };

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <Sidebar sections={[aboutSection]} width={220} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center border-b border-black/6 px-6 dark:border-white/10">
          <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/92">About Me</span>
        </div>
        <AboutContentPane activeSectionId={activeSectionId} />
      </div>
    </div>
  );
}
