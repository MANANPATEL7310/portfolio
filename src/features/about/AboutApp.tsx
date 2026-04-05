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
      <Sidebar sections={[aboutSection]} width={220} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center border-b border-black/6 px-6 dark:border-white/10">
          <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/92">About Me</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-[600px]">
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

            <h1 className="mt-8 text-[26px] font-semibold leading-tight text-[#151515] dark:text-white">
              {activeSection.title}
            </h1>

            <div className="mt-5 space-y-5 text-[17px] leading-[1.6] text-black/80 dark:text-white/80">
              {activeSection.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
