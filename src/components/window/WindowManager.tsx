'use client';

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from 'framer-motion';

import { getProjectFile, parseWindowId } from "@/lib/dataService";
import { useWindowStore } from '@/store/useWindowStore';
import { WindowFrame } from './WindowFrame';

function WindowFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-white/85 text-sm text-black/45 dark:bg-[#1f1f22] dark:text-white/45">
      Loading window...
    </div>
  );
}

const ProjectsApp = dynamic(() => import("@/features/projects/ProjectsApp").then((mod) => mod.ProjectsApp), {
  loading: () => <WindowFallback />,
});
const ProjectDetailApp = dynamic(() => import("@/features/projects/ProjectDetailApp").then((mod) => mod.ProjectDetailApp), {
  loading: () => <WindowFallback />,
});
const ProjectNoteApp = dynamic(() => import("@/features/projects/ProjectNoteApp").then((mod) => mod.ProjectNoteApp), {
  loading: () => <WindowFallback />,
});
const ProjectPreviewApp = dynamic(() => import("@/features/projects/ProjectPreviewApp").then((mod) => mod.ProjectPreviewApp), {
  loading: () => <WindowFallback />,
});
const ResumeApp = dynamic(() => import("@/features/resume/ResumeApp").then((mod) => mod.ResumeApp), {
  loading: () => <WindowFallback />,
});
const TestimonialsApp = dynamic(() => import("@/features/photos/TestimonialsApp").then((mod) => mod.TestimonialsApp), {
  loading: () => <WindowFallback />,
});
const AboutApp = dynamic(() => import("@/features/about/AboutApp").then((mod) => mod.AboutApp), {
  loading: () => <WindowFallback />,
});
const ContactApp = dynamic(() => import("@/features/contact/ContactApp").then((mod) => mod.ContactApp), {
  loading: () => <WindowFallback />,
});
const BlogApp = dynamic(() => import("@/features/blog/BlogApp").then((mod) => mod.BlogApp), {
  loading: () => <WindowFallback />,
});
const TerminalApp = dynamic(() => import("@/features/terminal/TerminalApp").then((mod) => mod.TerminalApp), {
  loading: () => <WindowFallback />,
});
const SettingsApp = dynamic(() => import("@/features/settings/SettingsApp").then((mod) => mod.SettingsApp), {
  loading: () => <WindowFallback />,
});

function renderWindowContent(windowId: string) {
  const parsed = parseWindowId(windowId);

  if (parsed.kind === "project") {
    return <ProjectDetailApp projectId={parsed.projectId} windowId={windowId} />;
  }

  if (parsed.kind === "project-file") {
    const file = getProjectFile(parsed.projectId, parsed.fileId);
    return file?.type === "image"
      ? <ProjectPreviewApp projectId={parsed.projectId} fileId={parsed.fileId} />
      : <ProjectNoteApp projectId={parsed.projectId} fileId={parsed.fileId} />;
  }

  switch (parsed.appId) {
    case "projects":
      return <ProjectsApp windowId={windowId} />;
    case "resume":
      return <ResumeApp />;
    case "photos":
      return <TestimonialsApp />;
    case "about":
      return <AboutApp />;
    case "contact":
      return <ContactApp />;
    case "blog":
      return <BlogApp />;
    case "terminal":
      return <TerminalApp />;
    case "settings":
      return <SettingsApp />;
    default:
      return <WindowFallback />;
  }
}

export function WindowManager({ constraintsRef }: { constraintsRef: React.RefObject<Element | null> }) {
  const windowsMap = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const windows = useMemo(
    () => Object.values(windowsMap).sort((left, right) => left.zIndex - right.zIndex),
    [windowsMap],
  );

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <AnimatePresence>
        {windows.map((windowState) => (
          <WindowFrame
            key={windowState.id}
            id={windowState.id}
            title={windowState.title}
            isActive={activeWindowId === windowState.id}
            isMinimized={windowState.isMinimized}
            isMaximized={windowState.isMaximized}
            constraintsRef={constraintsRef}
            position={windowState.position}
            size={windowState.size}
            zIndex={windowState.zIndex}
          >
            {renderWindowContent(windowState.id)}
          </WindowFrame>
        ))}
      </AnimatePresence>
    </div>
  );
}
