'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { AtSign, BriefcaseBusiness, CalendarDays, Send } from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

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
    <div className="flex h-full items-center justify-center bg-white px-5 py-6 text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="w-full max-w-[690px]">
        <Image
          src={profile.avatar}
          alt={`${profile.name} profile`}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
        />

        <h1 className="mt-8 text-[54px] font-semibold leading-none tracking-tight text-[#171717] dark:text-white">Let&apos;s Connect</h1>
        <p className="mt-5 max-w-[620px] text-[18px] text-black/80 dark:text-white/82">
          Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const external = action.href.startsWith("http");

            return (
              <motion.a
                key={action.id}
                href={action.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-2xl bg-gradient-to-br ${action.colorClass} px-4 py-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition`}
              >
                <Icon className="h-6 w-6" />
                <p className="mt-9 text-[17px] font-semibold">{action.label}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
