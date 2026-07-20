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
  resumeUrl: "/Manan_resume.pdf",
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
  description: string;
  /** Path to the project thumbnail, e.g. "/projects/snapcast.png" (drop images into public/projects/). */
  image: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: "wanderlust",
    name: "Wanderlust",
    type: "Vacation rental platform",
    description:
      "A full-stack Airbnb clone that allows users to discover, book, and host unique accommodations worldwide with robust filtering and detailed listings.",
    image: "/projects/wanderlust.png",
    stack: ["Node.js", "Express", "MongoDB", "Bootstrap", "EJS"],
    liveUrl: "https://wanderlust-rk9p.onrender.com/",
    githubUrl: "https://github.com/manan/wanderlust",
  },

  {
    id: "stock-trading-platform",
    name: "Stock Trading Platform",
    type: "Stock trading platform",
    description:
      "A comprehensive trading and investment platform clone with real-time stock data, portfolio management, and a clean, responsive user interface.",
    image: "/projects/stocktrading.png",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    liveUrl: "https://stock-trading-plateform.onrender.com",
    githubUrl: "https://github.com/manan/stock-trading-platform",
  },
  {
    id: "convox",
    name: "ConvoX",
    type: "Real-time communication app",
    description:
      "A real-time video and chat platform featuring HD video calls, screen sharing, end-to-end encryption, and a polished user interface.",
    image: "/projects/convox.png",
    stack: ["React", "TypeScript", "WebRTC", "Socket.io", "Tailwind CSS"],
    liveUrl: "https://convo-x-gray.vercel.app/",
    githubUrl: "https://github.com/manan/convox",
  }
];

export interface SkillCategory {
  [subBranch: string]: string[];
}

export const skills: Record<string, SkillCategory> = {
  "Web Dev": {
    Frontend: ["React", "Next.js", "Tailwind CSS"],
    Backend: ["Node.js", "Express", "REST APIs"],
    Database: ["PostgreSQL", "MongoDB"],
    "Extra Tools": ["Git", "GitHub", "Postman"],
  },
  "AI-ML": {
    ML: ["Scikit-Learn", "Pandas", "NumPy"],
    DL: ["TensorFlow", "PyTorch"],
    "ML Tools": ["Jupyter", "Hugging Face"],
    "Agentic AI / Automation": ["LangChain", "OpenAI API"],
  },
  Languages: {
    Web: ["TypeScript", "JavaScript"],
    Systems: ["C"],
    General: ["Python", "Java"],
  },
  "Computer Science": {
    Core: ["Operating Systems", "DBMS", "Computer Networks"],
  },
};

export interface DsaStats {
  platform: string;
  profileUrl: string;
  problemsSolved: number;
}

export const dsaStats: DsaStats = {
  platform: "LeetCode",
  profileUrl: "https://leetcode.com/MANAN7310/",
  problemsSolved: 200,
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
