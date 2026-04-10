'use client';

import { Download, ExternalLink, FileText } from "lucide-react";

import { launchExternalBrowser } from "@/lib/openInBrowser";
import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function ResumeApp() {
  const resume = usePortfolioDataStore((state) => state.profile.resume);
  const viewerSrc = `${resume.fileSrc}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <div className="flex h-full flex-col bg-[#2f2f33] text-white">
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#232327] px-4 text-white/75">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4" />
          <span className="text-[12px] font-semibold text-white/75">{resume.viewerTitle}</span>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <button
            onClick={() => launchExternalBrowser(resume.fileSrc)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open in new tab</span>
          </button>
          <a
            href={resume.fileSrc}
            download={resume.viewerTitle}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      <div className="flex-1 bg-[#34343a] p-3">
        <div className="flex h-full flex-col overflow-hidden rounded-[0.9rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
          <iframe
            src={viewerSrc}
            title={resume.viewerTitle}
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
