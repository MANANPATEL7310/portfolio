'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';
import { Sidebar, SidebarSection } from '@/components/ui/Sidebar';

export function AboutApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const defaultSectionId = profile.aboutSections[0]?.id ?? null;
  const [activeSectionId, setActiveSectionId] = useState(defaultSectionId);

  const activeSection = useMemo(
    () => profile.aboutSections.find((section) => section.id === activeSectionId) ?? profile.aboutSections[0],
    [activeSectionId, profile.aboutSections]
  );

  const aboutSection: SidebarSection = {
    items: profile.aboutSections.map((section) => ({
      id: section.id,
      label: section.label,
      icon: section.icon,
      active: section.id === activeSectionId,
      onClick: () => setActiveSectionId(section.id),
    })),
  };

  if (!activeSection) {
    return null;
  }

  return (
    <div className="flex h-full bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <Sidebar sections={[aboutSection]} width={198} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center border-b border-black/6 px-5 dark:border-white/10">
          <span className="text-[20px] font-medium text-[#2c2c2f] dark:text-white/92">About Me</span>
        </div>

        <div className="hide-scrollbar overflow-auto px-7 py-8 md:px-9">
          <div className="mx-auto max-w-[580px]">
            <Image
              src={profile.avatar}
              alt={`${profile.name} portrait`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />

            <h1 className="mt-5 text-[28px] font-semibold leading-tight text-[#151515] dark:text-white">
              {activeSection.title}
            </h1>

            <div className="mt-6 space-y-6 text-[18px] leading-[1.45] text-black/82 dark:text-white/82">
              {activeSection.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
