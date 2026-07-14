import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight, FolderGit2 } from "lucide-react";
import type { Project } from "../data/portfolioData";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-base-800/50 backdrop-blur-sm transition-all duration-300 hover:border-neon-green/40 hover:shadow-neon-lg"
    >
      {/* Header bar — file/process style */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-base-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-white/50">
          <FolderGit2 className="h-3.5 w-3.5 text-neon-green" aria-hidden="true" />
          <span className="text-white/40">~/projects/</span>
          <span className="text-neon-green">{project.id}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-neon-cyan/70">
          {project.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-mono text-xl font-bold text-white transition-colors group-hover:text-neon-green">
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-white/40">
          role: {project.role}
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
          {project.description}
        </p>

        {/* Problem → Solution */}
        <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-base-900/50 p-3 font-mono text-xs">
          <p className="text-white/60">
            <span className="text-red-400/80">problem:</span> {project.problem}
          </p>
          <p className="flex items-start gap-1 text-white/60">
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
              className="rounded-full border border-neon-green/25 bg-neon-green/5 px-2.5 py-1 font-mono text-[11px] text-neon-green/90"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Stack line */}
        <div className="mt-4 font-mono text-[11px] text-white/40">
          <span className="text-white/30">stack:</span>{" "}
          {project.stack.join(" · ")}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 font-mono text-xs font-medium text-neon-green transition-all hover:bg-neon-green/20 hover:shadow-neon"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            live demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 transition-all hover:border-white/40 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            source
          </a>
        </div>
      </div>
    </motion.article>
  );
}
