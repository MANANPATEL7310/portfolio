import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight, FolderGit2 } from "lucide-react";
import type { Project } from "../data/portfolioData";
import { useTilt } from "../hooks/useTilt";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const tilt = useTilt(4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 2) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      ref={tilt.ref as React.Ref<HTMLElement>}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className="group glass glass-hover relative flex flex-col overflow-hidden rounded-xl shadow-elev-1 transition-shadow"
    >
      {/* Cursor-following glass highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(20rem 20rem at var(--mx, 50%) var(--my, 0%), rgba(0,255,136,0.10), transparent 60%)",
        }}
      />

      {/* Header bar — file/process style */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-base-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-step-0 text-content-secondary">
          <FolderGit2 className="h-3.5 w-3.5 text-neon-green" aria-hidden="true" />
          <span className="text-content-secondary/70">~/projects/</span>
          <span className="text-neon-green">{project.id}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neon-cyan/70">
          {project.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-mono text-step-3 font-bold text-content-primary transition-colors group-hover:text-neon-green">
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-step-0 text-content-secondary">
          role: {project.role}
        </p>

        <p className="mt-4 font-sans text-step-1 leading-relaxed text-content-primary/75">
          {project.description}
        </p>

        {/* Problem → Solution */}
        <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-base-900/50 p-3 font-mono text-step-0">
          <p className="text-content-secondary">
            <span className="text-red-400/80">problem:</span> {project.problem}
          </p>
          <p className="flex items-start gap-1 text-content-secondary">
            <ArrowRight
              className="mt-0.5 h-3 w-3 shrink-0 text-neon-green"
              aria-hidden="true"
            />
            <span>
              <span className="text-neon-green">solution:</span>{" "}
              {project.solution}
            </span>
          </p>
        </div>

        {/* Feature tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.features.map((f) => (
            <span
              key={f}
              className="rounded-lg border border-neon-green/25 bg-neon-green/5 px-2.5 py-1 font-mono text-[11px] text-neon-green/90"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Stack line */}
        <div className="mt-4 font-mono text-[11px] text-content-secondary/80">
          <span className="text-content-secondary/60">stack:</span>{" "}
          {project.stack.join(" · ")}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-reticle inline-flex items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 font-mono text-step-0 font-medium text-neon-green hover:bg-neon-green/20 hover:shadow-neon"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            live demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-reticle inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-step-0 text-content-primary/75 hover:border-white/40 hover:text-content-primary"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            source
          </a>
        </div>
      </div>
    </motion.article>
  );
}
