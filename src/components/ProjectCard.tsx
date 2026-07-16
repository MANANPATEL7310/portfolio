import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  FolderGit2,
  ImageIcon,
  Layers,
  X,
} from "lucide-react";
import type { Project } from "../data/portfolioData";
import { useTilt } from "../hooks/useTilt";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const tilt = useTilt(4);
  const [imgError, setImgError] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      ref={tilt.ref as React.Ref<HTMLElement>}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className="group glass glass-hover relative flex h-full flex-col overflow-hidden rounded-xl shadow-elev-1 transition-shadow"
    >
      {/* Cursor-following glass highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(20rem 20rem at var(--mx, 50%) var(--my, 0%), rgba(0,255,136,0.10), transparent 60%)",
        }}
      />

      {/* Tech-stack overlay card */}
      <AnimatePresence>
        {stackOpen && (
          <>
            {/* Dimmed backdrop — click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setStackOpen(false)}
              className="absolute inset-0 z-20 bg-base-900/70 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label={`${project.name} tech stack`}
              className="absolute inset-x-4 top-1/2 z-30 -translate-y-1/2 rounded-xl border border-neon-green/30 bg-base-900/95 p-4 shadow-elev-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-content-secondary">
                  <Layers className="h-3.5 w-3.5 text-neon-green" aria-hidden="true" />
                  <span className="text-content-secondary/70">
                    {project.id}
                  </span>
                  <span className="text-neon-green">/ tech-stack</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStackOpen(false)}
                  aria-label="Close tech stack"
                  className="rounded-md p-1 text-content-secondary transition-colors hover:text-content-primary"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-neon-green/25 bg-neon-green/5 px-2.5 py-1 font-mono text-[11px] text-neon-green/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header bar — file/process style */}
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-base-900/60 px-3 py-2 font-mono text-[11px] text-content-secondary">
        <FolderGit2 className="h-3 w-3 shrink-0 text-neon-green" aria-hidden="true" />
        <span className="truncate">
          <span className="text-content-secondary/70">~/projects/</span>
          <span className="text-neon-green">{project.id}</span>
        </span>
      </div>

      {/* Thumbnail — falls back to a placeholder until the image is added */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-base-900/50">
        {!imgError ? (
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-content-secondary/50">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
            <span className="font-mono text-[10px]">{project.image}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-mono text-step-2 font-bold text-content-primary transition-colors group-hover:text-neon-green">
          {project.name}
        </h3>

        <p className="mt-1.5 font-sans text-step-0 leading-relaxed text-content-primary/75">
          {project.description}
        </p>

        {/* Actions — 3 equal buttons in one row */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            style={{ "--sweep-color": "#00ff88" } as React.CSSProperties}
            className="btn-reticle inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-neon-green/30 bg-neon-green/5 px-2 py-1.5 font-mono text-[11px] font-medium text-neon-green/90 hover:border-neon-green/70 hover:bg-neon-green/10 hover:text-neon-green"
          >
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
            live demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            style={{ "--sweep-color": "rgba(255,255,255,0.9)" } as React.CSSProperties}
            className="btn-reticle inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-white/15 px-2 py-1.5 font-mono text-[11px] text-content-primary/75 hover:border-white/50 hover:text-content-primary"
          >
            <Github className="h-3 w-3 shrink-0" aria-hidden="true" />
            github
          </a>
          <button
            type="button"
            onClick={() => setStackOpen(true)}
            style={{ "--sweep-color": "#00e5ff" } as React.CSSProperties}
            className="btn-reticle inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-neon-cyan/30 px-2 py-1.5 font-mono text-[11px] text-neon-cyan/80 hover:border-neon-cyan/70 hover:text-neon-cyan"
          >
            <Layers className="h-3 w-3 shrink-0" aria-hidden="true" />
            tech stack
          </button>
        </div>
      </div>
    </motion.article>
  );
}
