/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 *  Every component reads from this file. There should be ZERO hardcoded content
 *  (names, bios, links, projects, skills, etc.) anywhere in the JSX.
 *  Edit this file → the entire site updates.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Metric {
  label: string;
  value: string;
}

export interface AboutSection {
  title: string;
  content: string;
}

export interface Profile {
  name: string;
  handle: string;
  greeting: string;
  role: string;
  location: string;
  bio: string;
  status: string;
  availability: string;
  stage: string;
  resumeUrl?: string;
  metrics: Metric[];
  aboutSections: AboutSection[];
}

export const profile: Profile = {
  name: "Manan Patel",
  handle: "manan@portfolio",
  greeting: "Hi, I'm Manan Patel. Welcome to my portfolio.",
  role: "Student developer focused on full-stack web apps and polished UI/UX.",
  location: "India",
  bio: "I build fast, clean, product-minded web apps — from the database up to the last pixel. I care about how things feel to use, not just whether they work. Right now I'm sharpening my full-stack fundamentals while exploring AI/ML and preparing to go deep on data structures & algorithms.",
  status: "Building, shipping, and learning in public.",
  availability: "Open to internships & collaboration",
  stage: "Student Developer",
  // Drop a real link here later and the navbar CTA turns into a working download.
  resumeUrl: "",
  metrics: [
    { label: "Projects", value: "4 Full-Stack Builds" },
    { label: "Learning Now", value: "AI/ML Fundamentals" },
    { label: "Next Up", value: "DSA in 3-4 Months" },
  ],
  aboutSections: [
    {
      title: "General",
      content:
        "I'm a student developer who enjoys turning ideas into real, usable products. I like owning a build end to end — designing the data model, wiring the backend, and obsessing over the frontend details that make an app feel premium.",
    },
    {
      title: "My Journey",
      content:
        "I started with curiosity about how the websites I used every day were actually made. That curiosity turned into building my own projects, breaking things, fixing them, and slowly leveling up from static pages to full-stack applications with real auth, databases, and deployment.",
    },
    {
      title: "Current Focus",
      content:
        "Right now I'm deepening my full-stack skills with React, Next.js, and TypeScript on the frontend, and Node/Express with SQL and NoSQL databases on the backend. Alongside that, I'm learning AI/ML fundamentals to understand how intelligent features are built.",
    },
    {
      title: "Future Plans",
      content:
        "Over the next few months I'm committing to a serious DSA grind to strengthen my problem-solving, then applying it to more ambitious, scalable products. The long-term goal: ship software that people genuinely rely on.",
    },
    {
      title: "Beyond Code",
      content:
        "Away from the editor I like keeping up with new tech, exploring good product design, and reverse-engineering interfaces I admire to understand why they work so well.",
    },
  ],
};

export interface Project {
  id: string;
  name: string;
  type: string;
  role: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: "snapcast",
    name: "SnapCast",
    type: "Full-stack creator platform",
    role: "Designed and developed the product end to end",
    description:
      "A creator-focused platform for recording, sharing, and managing short video content with a fast, motion-rich interface.",
    problem:
      "Creators need a frictionless way to capture and publish short-form clips without wrestling with heavy, complicated tooling.",
    solution:
      "Built a streamlined record → upload → share flow with a polished UI, thoughtful state management, and a full-stack backend handling storage and metadata.",
    features: [
      "Creator workflow thinking",
      "Motion-rich UX",
      "Full-stack product structure",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    liveUrl: "https://snapcast.vercel.app",
    githubUrl: "https://github.com/manan/snapcast",
  },
  {
    id: "converso",
    name: "Converso",
    type: "Real-time conversation app",
    role: "Built frontend and backend, designed the real-time layer",
    description:
      "A real-time conversational app that keeps interactions fluid, responsive, and pleasant to use across devices.",
    problem:
      "Most chat-style experiences feel laggy or clunky, breaking the sense of a natural back-and-forth conversation.",
    solution:
      "Engineered a responsive real-time layer with optimistic UI updates and clean session handling, wrapped in an accessible, distraction-free interface.",
    features: [
      "Real-time interaction design",
      "Optimistic UI updates",
      "Responsive across devices",
    ],
    stack: ["React", "TypeScript", "Node.js", "MongoDB"],
    liveUrl: "https://converso.vercel.app",
    githubUrl: "https://github.com/manan/converso",
  },
  {
    id: "prepwise",
    name: "PrepWise",
    type: "Interview / learning prep tool",
    role: "Owned product direction and full-stack implementation",
    description:
      "A preparation tool that helps users practice and track progress toward interviews and skill goals in a structured way.",
    problem:
      "Prep is often scattered across notes, docs, and random resources with no clear sense of progress.",
    solution:
      "Created a structured prep experience with organized modules and progress tracking, backed by a clean data model and a focused, encouraging UI.",
    features: [
      "Structured learning flow",
      "Progress tracking",
      "Focused, distraction-free UI",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    liveUrl: "https://prepwise.vercel.app",
    githubUrl: "https://github.com/manan/prepwise",
  },
  {
    id: "bookwise",
    name: "Bookwise",
    type: "Library management platform",
    role: "Designed schema, built full-stack features and admin flows",
    description:
      "A library management platform for browsing, borrowing, and administering a catalog of books with a modern reading-forward UI.",
    problem:
      "Traditional library systems are dated, hard to navigate, and give admins little visibility or control.",
    solution:
      "Built a modern catalog with borrowing flows, an admin dashboard, and a normalized relational schema — all wrapped in a clean, book-first interface.",
    features: [
      "Relational data modeling",
      "Admin dashboard & flows",
      "Modern reading-forward UI",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://bookwise.vercel.app",
    githubUrl: "https://github.com/manan/bookwise",
  },
];

export const skills: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript"],
  Styling: ["Tailwind CSS", "CSS", "Responsive UI"],
  Backend: ["Node.js", "Express", "REST APIs"],
  Database: ["MongoDB", "PostgreSQL"],
  Workflow: ["Git", "GitHub", "Deployment"],
};

export interface GithubStats {
  repos: number;
  stars: number;
  contributions: number;
}

export const githubStats: GithubStats = {
  repos: 36,
  stars: 148,
  contributions: 1248,
};

export interface RelevantLearning {
  title: string;
  description: string;
}

export interface Education {
  overview: string;
  relevantLearning: RelevantLearning[];
  currentPath: string;
  roadmap: string;
}

export const education: Education = {
  overview:
    "I'm learning as a builder first — combining self-directed study with real projects so every concept I pick up is immediately applied to something I'm shipping.",
  relevantLearning: [
    {
      title: "Frontend systems",
      description:
        "Component architecture, state management, accessibility, and building responsive, animated interfaces with React, Next.js, and TypeScript.",
    },
    {
      title: "Backend fundamentals",
      description:
        "Designing REST APIs, authentication, and working with both relational (PostgreSQL) and document (MongoDB) databases.",
    },
    {
      title: "Product thinking",
      description:
        "Scoping features, modeling data around real user flows, and making UX decisions that keep products clear and usable.",
    },
  ],
  currentPath:
    "Deepening full-stack engineering while building AI/ML fundamentals to understand how modern intelligent features are designed and shipped.",
  roadmap:
    "Next 3–4 months: a focused DSA grind to strengthen problem-solving, followed by more ambitious, scalable full-stack products.",
};

export interface Certificate {
  name: string;
  issuer: string;
  focus: string;
}

export const certificates: Certificate[] = [
  {
    name: "Full-Stack Web Development",
    issuer: "Self-directed / Project-based",
    focus: "End-to-end app development with React, Next.js, and Node.js",
  },
  {
    name: "Responsive & Modern UI",
    issuer: "Self-directed / Project-based",
    focus: "Tailwind CSS, accessibility, and polished responsive interfaces",
  },
  // Add real certificates here — empty entries are handled gracefully by the UI.
];

export interface Socials {
  email: string;
  linkedin: string;
  twitter: string;
  github: string;
}

export const socials: Socials = {
  email: "manan@portfolio.dev",
  linkedin: "https://www.linkedin.com/in/manan-portfolio",
  twitter: "https://x.com/mananportfolio",
  github: "https://github.com/manan",
};

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "about", href: "#about" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "education", href: "#education" },
  { label: "certificates", href: "#certificates" },
  { label: "contact", href: "#contact" },
];
