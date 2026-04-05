import type { ReactNode } from "react";
import dynamic from "next/dynamic";

import {
  type ProjectDetailWindowId,
  type ProjectNoteWindowId,
  type ProjectPreviewWindowId,
  type WindowId,
  projects,
} from "@/data/portfolio";
import { AboutApp } from "@/features/about/AboutApp";
import { ContactApp } from "@/features/contact/ContactApp";
import { ProjectDetailApp } from "@/features/projects/ProjectDetailApp";
import { ProjectNoteApp } from "@/features/projects/ProjectNoteApp";
import { ProjectPreviewApp } from "@/features/projects/ProjectPreviewApp";
import { ProjectsApp } from "@/features/projects/ProjectsApp";
import { ResumeApp } from "@/features/resume/ResumeApp";
import { TerminalApp } from "@/features/terminal/TerminalApp";

const BlogWindow = dynamic(() => import("@/features/blog/BlogApp").then((module) => module.BlogApp), {
  ssr: false,
});

const PhotosWindow = dynamic(
  () => import("@/features/photos/TestimonialsApp").then((module) => module.TestimonialsApp),
  {
    ssr: false,
  },
);

export interface WindowDefinition {
  defaultSize: { width: number; height: number };
  sizeClassName: string;
  contentClassName?: string;
  showTitle?: boolean;
  content: ReactNode;
}

const projectDetailWindows: Record<ProjectDetailWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project) => [
    project.windowId,
    {
      defaultSize: { width: 980, height: 650 },
      sizeClassName: "w-[min(60vw,980px)] h-[min(60vh,650px)]",
      content: <ProjectDetailApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectDetailWindowId, WindowDefinition>;

const projectPreviewWindows: Record<ProjectPreviewWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project) => [
    project.previewWindowId,
    {
      defaultSize: { width: 1050, height: 620 },
      sizeClassName: "w-[min(58vw,1050px)] h-[min(58vh,620px)]",
      content: <ProjectPreviewApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectPreviewWindowId, WindowDefinition>;

const projectNoteWindows: Record<ProjectNoteWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project) => [
    project.noteWindowId,
    {
      defaultSize: { width: 500, height: 430 },
      sizeClassName: "w-[min(28vw,500px)] h-[min(38vh,430px)]",
      content: <ProjectNoteApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectNoteWindowId, WindowDefinition>;

export const windowRegistry: Record<WindowId, WindowDefinition> = {
  projects: {
    defaultSize: { width: 1110, height: 665 },
    sizeClassName: "w-[min(72vw,1110px)] h-[min(63vh,665px)]",
    content: <ProjectsApp />,
  },
  resume: {
    defaultSize: { width: 540, height: 740 },
    sizeClassName: "w-[min(37vw,540px)] h-[min(78vh,740px)]",
    content: <ResumeApp />,
  },
  photos: {
    defaultSize: { width: 1110, height: 620 },
    sizeClassName: "w-[min(66vw,1110px)] h-[min(60vh,620px)]",
    content: <PhotosWindow />,
  },
  about: {
    defaultSize: { width: 800, height: 470 },
    sizeClassName: "w-[min(48vw,800px)] h-[min(48vh,470px)]",
    content: <AboutApp />,
  },
  contact: {
    defaultSize: { width: 740, height: 420 },
    sizeClassName: "w-[min(42vw,740px)] h-[min(42vh,420px)]",
    content: <ContactApp />,
  },
  blog: {
    defaultSize: { width: 1100, height: 580 },
    sizeClassName: "w-[min(60vw,1100px)] h-[min(52vh,580px)]",
    content: <BlogWindow />,
  },
  terminal: {
    defaultSize: { width: 770, height: 420 },
    sizeClassName: "w-[min(40vw,770px)] h-[min(40vh,420px)]",
    content: <TerminalApp />,
  },
  ...projectDetailWindows,
  ...projectPreviewWindows,
  ...projectNoteWindows,
};
