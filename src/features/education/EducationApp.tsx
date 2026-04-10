'use client';

import { GraduationCap, NotebookPen } from 'lucide-react';

export function EducationApp() {
  return (
    <div className="flex h-full flex-col bg-white text-[#171717] dark:bg-[#1f1f22] dark:text-white">
      <div className="flex h-14 items-center border-b border-black/6 px-6 dark:border-white/10">
        <span className="text-[18px] font-semibold text-[#2c2c2f] dark:text-white/92">Education</span>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-[560px] rounded-[2rem] border border-black/8 bg-black/[0.02] p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/14 dark:text-sky-300">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-[#171717] dark:text-white">
            Education Section Coming Soon
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-black/62 dark:text-white/62">
            This window is ready for your education details, certifications, academic background, and learning journey.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-black/65 dark:border-white/10 dark:bg-white/6 dark:text-white/70">
            <NotebookPen className="h-4 w-4" />
            Placeholder component for future content
          </div>
        </div>
      </div>
    </div>
  );
}
