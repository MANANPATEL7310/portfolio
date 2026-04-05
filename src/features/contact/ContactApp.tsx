import Image from "next/image";
import { AtSign, BriefcaseBusiness, CalendarDays, Send } from "lucide-react";

import { contactActions, portfolioAssets } from "@/data/portfolio";

const iconMap = [CalendarDays, Send, AtSign, BriefcaseBusiness];

export function ContactApp() {
  return (
    <div className="flex h-full items-center justify-center bg-white px-5 py-6 text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="w-full max-w-[690px]">
        <Image
          src={portfolioAssets.avatarImage}
          alt="Adrian profile"
          className="h-20 w-20 rounded-full object-cover"
        />

        <h1 className="mt-8 text-[54px] font-semibold leading-none tracking-tight text-[#171717] dark:text-white">Let&apos;s Connect</h1>
        <p className="mt-5 max-w-[620px] text-[18px] text-black/80 dark:text-white/82">
          Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {contactActions.map((action, index) => {
            const Icon = iconMap[index] ?? Send;
            return (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                className={`rounded-2xl bg-gradient-to-br ${action.colorClass} px-4 py-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5`}
              >
                <Icon className="h-6 w-6" />
                <p className="mt-9 text-[17px] font-semibold">{action.label}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
