'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { AtSign, BriefcaseBusiness, CalendarDays, Send } from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";
import { HoverText } from '@/components/ui/HoverText';

const actionConfig = [
  {
    id: "calendar",
    label: "Schedule a call",
    icon: CalendarDays,
    colorClass: "from-rose-400 to-rose-500",
  },
  {
    id: "email",
    label: "Email me",
    icon: Send,
    colorClass: "from-emerald-400 to-emerald-500",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    icon: AtSign,
    colorClass: "from-orange-300 to-rose-300",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: BriefcaseBusiness,
    colorClass: "from-sky-400 to-sky-500",
  },
] as const;

export function ContactApp() {
  const profile = usePortfolioDataStore((state) => state.profile);
  const socials = usePortfolioDataStore((state) => state.socials);

  const actions = actionConfig.map((action) => ({
    ...action,
    href: socials[action.id],
  }));

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
                Let&apos;s Connect
              </h1>
              <p className="mt-2 max-w-[520px] text-[17px] text-black/70 dark:text-white/75">
                Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              const external = action.href.startsWith('http');

              return (
                <motion.a
                  key={action.id}
                  href={action.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${action.colorClass} p-5 text-white shadow-lg transition`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[17px] font-semibold">
                    <HoverText variant="underline">{action.label}</HoverText>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
