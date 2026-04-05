'use client';

import { useMemo, useState } from "react";
import {
  Download,
  Minus,
  PanelLeft,
  Plus,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";

import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function ResumeApp() {
  const resume = usePortfolioDataStore((state) => state.profile.resume);
  const [zoomIndex, setZoomIndex] = useState(
    Math.max(0, resume.zoomLevels.findIndex((level) => level === 100)),
  );

  const zoomLevel = resume.zoomLevels[zoomIndex] ?? 100;
  const scale = useMemo(() => zoomLevel / 100, [zoomLevel]);

  return (
    <div className="flex h-full flex-col bg-[#2f2f33] text-white">
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#232327] px-4 text-white/75">
        <div className="flex items-center gap-3">
          <PanelLeft className="h-4 w-4" />
          <span className="text-[12px] font-semibold text-white/75">Resume</span>
        </div>

        <div className="flex items-center gap-3 text-[12px]">
          <span className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5">1 / {resume.pageCount}</span>
          <button
            onClick={() => setZoomIndex((value) => Math.max(0, value - 1))}
            className="transition hover:text-white"
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span>{zoomLevel}%</span>
          <button
            onClick={() => setZoomIndex((value) => Math.min(resume.zoomLevels.length - 1, value + 1))}
            className="transition hover:text-white"
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Search className="h-4 w-4" />
          <RotateCcw className="h-4 w-4" />
          <Download className="h-4 w-4" />
          <Printer className="h-4 w-4" />
        </div>
      </div>

      <div className="hide-scrollbar flex-1 overflow-auto bg-[#34343a] px-5 py-5">
        <div className="mx-auto flex w-full justify-center">
          <article
            className="overflow-hidden rounded-[0.9rem] bg-white text-[#222] shadow-[0_30px_80px_rgba(0,0,0,0.34)]"
            style={{
              width: 560,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <header className="grid grid-cols-[1.2fr_1fr]">
              <div className="bg-[#373332] px-11 py-11 text-white">
                <h1 className="font-serif text-[32px] font-bold uppercase leading-[0.95] tracking-tight">
                  {resume.identity.name.split(" ").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
              <div className="bg-[#0f8596] px-8 py-11 text-white">
                {resume.identity.headline.map((line, index) => (
                  <p key={line} className={index === 1 ? "mt-2 text-[16px] font-semibold" : index > 1 ? "mt-2 text-[16px]" : "text-[16px] font-medium"}>
                    {line}
                  </p>
                ))}
              </div>
            </header>

            <section className="grid grid-cols-[1.2fr_1fr]">
              <div>
                <SectionHeader label="Profile" color="bg-[#0f8596]" />
                <div className="px-11 py-7 text-[12px] leading-5 text-[#4b5563]">
                  {resume.profile}
                </div>

                <SectionHeader label="Experience" color="bg-[#0f8596]" />
                <div className="space-y-6 px-11 py-6 text-[12px] leading-5 text-[#4b5563]">
                  {resume.experience.map((item) => (
                    <div key={item.company}>
                      <p className="text-[14px] font-semibold text-[#303030]">{item.company}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">{item.period}</p>
                      <p className="mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeader label="Contact" color="bg-[#4a4747]" />
                <div className="space-y-3 px-8 py-7 text-[12px] text-[#4b5563]">
                  {resume.contact.map((item, index) => (
                    <p key={item} className={index >= 2 ? "text-[#0f8596]" : ""}>{item}</p>
                  ))}
                </div>

                <SectionHeader label="Skills" color="bg-[#4a4747]" />
                <ul className="space-y-1 px-8 py-6 text-[12px] leading-5 text-[#0f8596]">
                  {resume.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>

                <SectionHeader label="Education" color="bg-[#4a4747]" />
                <div className="space-y-5 px-8 py-6 text-[12px] leading-5 text-[#4b5563]">
                  {resume.education.map((item) => (
                    <div key={item.school}>
                      <p className="text-[14px] font-semibold text-[#303030]">{item.school}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">{item.period}</p>
                      <p>{item.degree}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className={`${color} px-11 py-3 text-[14px] font-semibold uppercase tracking-wide text-white`}>
      {label}
    </div>
  );
}
