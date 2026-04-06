'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AtSign, BriefcaseBusiness, CalendarDays, Send, type LucideIcon } from 'lucide-react';

import { openInBrowser } from '@/lib/openInBrowser';
import { usePortfolioDataStore } from '@/store/usePortfolioDataStore';

const iconMap: Record<string, LucideIcon> = {
  'calendar-days': CalendarDays,
  send: Send,
  'at-sign': AtSign,
  'briefcase-business': BriefcaseBusiness,
};

export function ContactApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const socials = usePortfolioDataStore((state) => state.socials);
  const copy = usePortfolioDataStore((state) => state.settings.copy);

  const hrefMap = {
    calendar: socials.calendar,
    email: socials.email,
    twitter: socials.twitter,
    linkedin: socials.linkedin,
  };

  const actions = socials.actions
    .map((action) => ({
      ...action,
      href: hrefMap[action.id as keyof typeof hrefMap],
      Icon: iconMap[action.icon] ?? CalendarDays,
    }))
    .filter((action) => Boolean(action.href));

  return (
    <div className="flex h-full flex-col bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="flex h-14 items-center border-b border-black/6 px-6 dark:border-white/10">
        <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/92">Contact</span>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center gap-5">
            <Image
              src={profile.avatar}
              alt={`${profile.name} profile`}
              width={90}
              height={90}
              className="h-[90px] w-[90px] rounded-full object-cover ring-2 ring-black/5 dark:ring-white/10"
            />
            <div>
              <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-[#171717] dark:text-white">
                {copy.contactHeading}
              </h1>
              <p className="mt-2 max-w-[520px] text-[17px] text-black/70 dark:text-white/75">
                {copy.contactIntro}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {actions.map((action) => {
              const external = action.href.startsWith('http');

              return (
                <motion.button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    if (external) {
                      openInBrowser(action.href, { title: action.label });
                      return;
                    }

                    if (typeof window !== 'undefined') {
                      window.location.href = action.href;
                    }
                  }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${action.colorClass} p-5 text-white shadow-lg transition`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <action.Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[17px] font-semibold">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
