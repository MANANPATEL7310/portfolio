import type { StaticImageData } from "next/image";

import wallpaperImage from "../assets/portfolio/wallpaper.png";
import avatarImage from "../assets/portfolio/adrian.jpg";
import finderIcon from "../assets/portfolio/finder.png";
import safariIcon from "../assets/portfolio/safari.png";
import photosIcon from "../assets/portfolio/photos.png";
import contactIcon from "../assets/portfolio/contact.png";
import terminalIcon from "../assets/portfolio/terminal.png";
import trashIcon from "../assets/portfolio/trash.png";
import trashFullIcon from "../assets/portfolio/trash-2.png";
import folderIcon from "../assets/portfolio/folder.png";
import pdfIcon from "../assets/portfolio/pdf.png";
import figmaIcon from "../assets/portfolio/figma.png";
import txtIcon from "../assets/portfolio/txt.png";
import projectOneImage from "../assets/portfolio/project-1.png";
import projectTwoImage from "../assets/portfolio/project-2.png";
import projectThreeImage from "../assets/portfolio/project-3.png";
import blogOneImage from "../assets/portfolio/blog1.png";
import blogTwoImage from "../assets/portfolio/blog2.png";
import blogThreeImage from "../assets/portfolio/blog3.png";
import galleryOneImage from "../assets/portfolio/gal1.png";
import galleryTwoImage from "../assets/portfolio/gal2.png";
import galleryThreeImage from "../assets/portfolio/gal3.png";
import galleryFourImage from "../assets/portfolio/gal4.png";

export type ThemeMode = "dark" | "light";
export type ProjectSlug = "snapcast" | "converso" | "prepwise" | "bookwise";
export type ProjectDetailWindowId = `project-${ProjectSlug}`;
export type ProjectPreviewWindowId = `preview-${ProjectSlug}`;
export type ProjectNoteWindowId = `note-${ProjectSlug}`;
export type WindowId =
  | "projects"
  | "resume"
  | "photos"
  | "about"
  | "contact"
  | "blog"
  | "terminal"
  | ProjectDetailWindowId
  | ProjectPreviewWindowId
  | ProjectNoteWindowId;

export interface AppLauncher {
  id: WindowId | "trash";
  label: string;
  title?: string;
  icon: StaticImageData;
}

export interface DesktopShortcut {
  id: WindowId;
  label: string;
  title: string;
  icon: StaticImageData;
  side: "left" | "right";
  top: number;
}

export interface ProjectRecord {
  slug: ProjectSlug;
  windowId: ProjectDetailWindowId;
  previewWindowId: ProjectPreviewWindowId;
  noteWindowId: ProjectNoteWindowId;
  title: string;
  shortLabel: string;
  desktopLabel?: string;
  folderLabel: string;
  titleBar: string;
  siteLabel: string;
  stack: string[];
  description: string;
  tldr: string[];
  heroImage: StaticImageData;
}

export const portfolioIdentity = {
  name: "Adrian",
  fullTitle: "Adrian's Portfolio",
  greeting: "Hey, welcome to my",
  signature: "portfolio",
  role: "Frontend developer, motion enthusiast, and product-minded builder.",
  location: "Remote",
  email: "adrian@portfolio.dev",
};

export const portfolioAssets = {
  wallpaperImage,
  avatarImage,
  finderIcon,
  safariIcon,
  photosIcon,
  contactIcon,
  terminalIcon,
  trashIcon,
  trashFullIcon,
  folderIcon,
  pdfIcon,
  figmaIcon,
  txtIcon,
};

export const menuItems: Array<{ id: WindowId; label: string; title: string }> = [
  { id: "projects", label: "Projects", title: "Work" },
  { id: "photos", label: "Testimonials", title: "Photos" },
  { id: "contact", label: "Contact", title: "Contact Me" },
  { id: "resume", label: "Resume", title: "Resume.pdf" },
];

export const dockApps: AppLauncher[] = [
  { id: "projects", label: "Finder", title: "Work", icon: finderIcon },
  { id: "blog", label: "Safari", title: "My Developer Blog", icon: safariIcon },
  { id: "photos", label: "Photos", title: "Photos", icon: photosIcon },
  { id: "contact", label: "Contacts", title: "Contact Me", icon: contactIcon },
  { id: "terminal", label: "Terminal", title: "Tech Stack", icon: terminalIcon },
  { id: "trash", label: "Trash", icon: trashIcon },
];

export const projects: ProjectRecord[] = [
  {
    slug: "snapcast",
    windowId: "project-snapcast",
    previewWindowId: "preview-snapcast",
    noteWindowId: "note-snapcast",
    title: "Project 1 (SnapCast)",
    shortLabel: "SnapCast",
    desktopLabel: "Project 1 (SnapCast)",
    folderLabel: "Project 1",
    titleBar: "Project 1 - SnapCast",
    siteLabel: "snapcast.app",
    stack: ["Next.js", "TypeScript", "Motion", "Design systems"],
    description:
      "A video-first creator dashboard with polished editing flows, strong visual hierarchy, and a launch-ready marketing shell.",
    tldr: [
      "SnapCast turns creator workflow chaos into a clean, fast publishing experience.",
      "The product focuses on recording, clip management, and social-ready exports without sacrificing performance.",
      "Built with a responsive Next.js frontend, reusable UI primitives, and a motion layer that feels native instead of flashy.",
    ],
    heroImage: projectOneImage,
  },
  {
    slug: "converso",
    windowId: "project-converso",
    previewWindowId: "preview-converso",
    noteWindowId: "note-converso",
    title: "Project 2 (Converso)",
    shortLabel: "Converso",
    desktopLabel: "Project 2 (Converso)",
    folderLabel: "Project 2",
    titleBar: "Project 2 - Converso",
    siteLabel: "converso.com",
    stack: ["Next.js", "Tailwind", "AI UX", "Education"],
    description:
      "An AI learning companion platform designed to make lessons feel playful, personal, and easier to stick with.",
    tldr: [
      "Converso is a fun and modern way to learn coding without getting bored.",
      "Instead of just watching videos, you level up as you complete lessons, earn rewards like points and diamonds, and unlock cool achievements.",
      "Think of it like a game, but for learning JavaScript, React, and more.",
      "It's built using Next.js and Tailwind, so everything runs fast and looks clean.",
    ],
    heroImage: projectTwoImage,
  },
  {
    slug: "prepwise",
    windowId: "project-prepwise",
    previewWindowId: "preview-prepwise",
    noteWindowId: "note-prepwise",
    title: "Project 3 (PrepWise)",
    shortLabel: "PrepWise",
    desktopLabel: "Project 3 (PrepWise)",
    folderLabel: "Project 3",
    titleBar: "Project 3 - PrepWise",
    siteLabel: "prepwise.dev",
    stack: ["React", "Interview prep", "Speech flows", "Animation"],
    description:
      "A focused interview prep workspace with guided prompts, practice loops, and structured feedback built into the flow.",
    tldr: [
      "PrepWise helps candidates rehearse technical answers in a calmer, more repeatable way.",
      "It blends prompt coaching, timed drills, and clean review states so practice stays focused instead of overwhelming.",
      "The interface is intentionally minimal, with strong typography and quick transitions to keep attention on the content.",
    ],
    heroImage: projectThreeImage,
  },
  {
    slug: "bookwise",
    windowId: "project-bookwise",
    previewWindowId: "preview-bookwise",
    noteWindowId: "note-bookwise",
    title: "Project 4 (Bookwise)",
    shortLabel: "Bookwise",
    folderLabel: "Project 4",
    titleBar: "Project 4 - Bookwise",
    siteLabel: "bookwise.app",
    stack: ["SaaS", "Reader UX", "Subscriptions", "Search"],
    description:
      "A clean digital library product that helps readers organize notes, highlights, and reading goals in one calm workspace.",
    tldr: [
      "Bookwise gives readers a better way to manage highlights, notes, and reading lists.",
      "The experience prioritizes calm layouts, smart categorization, and quick navigation between books and insights.",
      "It was designed for long-term use, which means clarity, speed, and readable typography mattered more than flashy features.",
    ],
    heroImage: blogOneImage,
  },
];

export const desktopShortcuts: DesktopShortcut[] = [
  {
    id: "resume",
    label: "Resume.pdf",
    title: "Resume.pdf",
    icon: pdfIcon,
    side: "left",
    top: 170,
  },
  {
    id: "project-snapcast",
    label: "Project 1 (SnapCast)",
    title: "Project 1 - SnapCast",
    icon: folderIcon,
    side: "right",
    top: 110,
  },
  {
    id: "project-converso",
    label: "Project 2 (Converso)",
    title: "Project 2 - Converso",
    icon: folderIcon,
    side: "right",
    top: 360,
  },
  {
    id: "project-prepwise",
    label: "Project 3 (PrepWise)",
    title: "Project 3 - PrepWise",
    icon: folderIcon,
    side: "right",
    top: 570,
  },
];

export const projectDesktopLabels = projects.map((project) => ({
  id: project.windowId,
  label: project.desktopLabel ?? project.title,
}));

export const aboutSections = [
  "General",
  "Books",
  "Random",
  "Future Plans",
  "Drafts",
];

export const aboutCopy = [
  "Meet the developer behind the code",
  "Hey! I'm Adrian, a web developer who enjoys building sleek, interactive websites that actually work well.",
  "I specialize in JavaScript, React, and Next.js, and I love making things feel smooth, fast, and just a little bit delightful.",
  "I'm big on clean UI, good UX, and writing code that doesn't need a search party to debug.",
  "Outside of dev work, you'll find me tweaking layouts at 2AM, sipping overpriced coffee, or impulse-buying gadgets I absolutely convinced myself I needed.",
];

export const contactActions = [
  {
    label: "Schedule a call",
    href: "mailto:adrian@portfolio.dev?subject=Let's%20schedule%20a%20call",
    colorClass: "from-rose-400 to-rose-500",
  },
  {
    label: "Email me",
    href: "mailto:adrian@portfolio.dev",
    colorClass: "from-green-400 to-green-500",
  },
  {
    label: "Twitter/X",
    href: "https://x.com",
    colorClass: "from-orange-300 to-orange-400",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    colorClass: "from-sky-400 to-sky-500",
  },
];

export const blogPosts = [
  {
    date: "Sep 2, 2025",
    title: "How I Built My macOS-Style Dev Portfolio with React + Tailwind",
    image: blogOneImage,
  },
  {
    date: "Aug 28, 2025",
    title: "How I Organize My Projects for Sanity and Speed",
    image: blogTwoImage,
  },
  {
    date: "Aug 15, 2025",
    title: "Small UX Details That Make a Big Difference (and How I Implemented Them)",
    image: blogThreeImage,
  },
];

export const galleryMoments = [
  { image: galleryOneImage, className: "col-span-2 row-span-2" },
  { image: blogThreeImage, className: "col-span-1 row-span-2" },
  { image: galleryTwoImage, className: "col-span-1 row-span-1" },
  { image: galleryThreeImage, className: "col-span-1 row-span-1" },
  { image: galleryFourImage, className: "col-span-1 row-span-1" },
];

export const techStackRows = [
  { category: "Frontend", technologies: "React, Next, TypeScript" },
  { category: "Styling", technologies: "Tailwind, Sass, CSS" },
  { category: "Backend", technologies: "Node.js, Express, NestJS" },
  { category: "Database", technologies: "MongoDB, PostgreSQL" },
  { category: "Dev Tools", technologies: "Git, GitHub, Docker" },
];

export const spotlightItems = [
  { id: "about" as const, title: "About Me", keywords: ["about", "bio", "profile", "developer"] },
  { id: "projects" as const, title: "Work", keywords: ["projects", "work", "finder", "portfolio"] },
  { id: "photos" as const, title: "Photos", keywords: ["photos", "gallery", "testimonials", "events"] },
  { id: "resume" as const, title: "Resume.pdf", keywords: ["resume", "cv", "experience", "pdf"] },
  { id: "contact" as const, title: "Contact Me", keywords: ["contact", "email", "linkedin", "twitter"] },
  { id: "blog" as const, title: "My Developer Blog", keywords: ["blog", "safari", "articles", "writing"] },
  { id: "terminal" as const, title: "Tech Stack", keywords: ["terminal", "stack", "skills", "github"] },
  ...projects.map((project) => ({
    id: project.windowId,
    title: project.titleBar,
    keywords: [project.shortLabel.toLowerCase(), "project", "case study", "design"],
  })),
];
