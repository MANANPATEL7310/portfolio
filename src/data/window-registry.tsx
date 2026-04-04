import type { ReactNode } from "react";

import {
  type ProjectDetailWindowId,
  type ProjectNoteWindowId,
  type ProjectPreviewWindowId,
  type WindowId,
  projects,
} from "@/data/portfolio";
import { AboutApp } from "@/features/about/AboutApp";
import { BlogApp } from "@/features/blog/BlogApp";
import { ContactApp } from "@/features/contact/ContactApp";
import { TestimonialsApp } from "@/features/photos/TestimonialsApp";
import { ProjectDetailApp } from "@/features/projects/ProjectDetailApp";
import { ProjectNoteApp } from "@/features/projects/ProjectNoteApp";
import { ProjectPreviewApp } from "@/features/projects/ProjectPreviewApp";
import { ProjectsApp } from "@/features/projects/ProjectsApp";
import { ResumeApp } from "@/features/resume/ResumeApp";
import { TerminalApp } from "@/features/terminal/TerminalApp";

export interface WindowDefinition {
  initialPosition: { x: number; y: number };
  sizeClassName: string;
  contentClassName?: string;
  showTitle?: boolean;
  content: ReactNode;
}

const projectDetailWindows: Record<ProjectDetailWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project, index) => [
    project.windowId,
    {
      initialPosition: { x: 220 + index * 30, y: 150 + index * 24 },
      sizeClassName: "w-[min(60vw,980px)] h-[min(60vh,650px)]",
      content: <ProjectDetailApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectDetailWindowId, WindowDefinition>;

const projectPreviewWindows: Record<ProjectPreviewWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project, index) => [
    project.previewWindowId,
    {
      initialPosition: { x: 130 + index * 24, y: 170 + index * 20 },
      sizeClassName: "w-[min(58vw,1050px)] h-[min(58vh,620px)]",
      content: <ProjectPreviewApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectPreviewWindowId, WindowDefinition>;

const projectNoteWindows: Record<ProjectNoteWindowId, WindowDefinition> = Object.fromEntries(
  projects.map((project, index) => [
    project.noteWindowId,
    {
      initialPosition: { x: 910 + index * 20, y: 270 + index * 18 },
      sizeClassName: "w-[min(28vw,500px)] h-[min(38vh,430px)]",
      content: <ProjectNoteApp slug={project.slug} />,
    },
  ]),
) as Record<ProjectNoteWindowId, WindowDefinition>;

export const windowRegistry: Record<WindowId, WindowDefinition> = {
  projects: {
    initialPosition: { x: 80, y: 110 },
    sizeClassName: "w-[min(72vw,1110px)] h-[min(63vh,665px)]",
    content: <ProjectsApp />,
  },
  resume: {
    initialPosition: { x: 940, y: 70 },
    sizeClassName: "w-[min(37vw,540px)] h-[min(78vh,740px)]",
    content: <ResumeApp />,
  },
  photos: {
    initialPosition: { x: 250, y: 150 },
    sizeClassName: "w-[min(66vw,1110px)] h-[min(60vh,620px)]",
    content: <TestimonialsApp />,
  },
  about: {
    initialPosition: { x: 420, y: 240 },
    sizeClassName: "w-[min(48vw,800px)] h-[min(48vh,470px)]",
    content: <AboutApp />,
  },
  contact: {
    initialPosition: { x: 610, y: 270 },
    sizeClassName: "w-[min(42vw,740px)] h-[min(42vh,420px)]",
    content: <ContactApp />,
  },
  blog: {
    initialPosition: { x: 420, y: 250 },
    sizeClassName: "w-[min(60vw,1100px)] h-[min(52vh,580px)]",
    content: <BlogApp />,
  },
  terminal: {
    initialPosition: { x: 610, y: 285 },
    sizeClassName: "w-[min(40vw,770px)] h-[min(40vh,420px)]",
    content: <TerminalApp />,
  },
  ...projectDetailWindows,
  ...projectPreviewWindows,
  ...projectNoteWindows,
};
