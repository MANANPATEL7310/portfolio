'use client';

import { Download, ExternalLink, FileText, Printer } from "lucide-react";

import { launchExternalBrowser } from "@/lib/openInBrowser";
import { usePortfolioDataStore } from "@/store/usePortfolioDataStore";

export function ResumeApp() {
  const resume = usePortfolioDataStore((state) => state.profile.resume);
  const viewerSrc = `${resume.fileSrc}#view=FitH`;

  const handleDownload = async () => {
    try {
      const response = await fetch(resume.fileSrc);
      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = resume.viewerTitle;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      launchExternalBrowser(resume.fileSrc);
    }
  };

  const handlePrint = () => {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    frame.src = resume.fileSrc;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => {
        frame.remove();
      }, 1500);
    };

    document.body.appendChild(frame);
  };

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
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>
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
