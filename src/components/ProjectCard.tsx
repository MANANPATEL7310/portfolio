import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2, ImageIcon } from "lucide-react";
import type { Project } from "../data/portfolioData";
import { useTilt } from "../hooks/useTilt";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const tilt = useTilt(4);
  const [imgError, setImgError] = useState(false);

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
      className="group glass glass-hover relative flex flex-col overflow-hidden rounded-xl shadow-elev-1 transition-shadow"
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

        <p className="mt-1.5 line-clamp-3 font-sans text-step-0 leading-relaxed text-content-primary/75">
          {project.description}
        </p>

        {/* Stack line */}
        <div className="mt-3 truncate font-mono text-[10px] text-content-secondary/80">
          <span className="text-content-secondary/60">stack:</span>{" "}
          {project.stack.join(" · ")}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-reticle inline-flex items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-2.5 py-1 font-mono text-[11px] font-medium text-neon-green hover:bg-neon-green/20 hover:shadow-neon"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            live demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-reticle inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-content-primary/75 hover:border-white/40 hover:text-content-primary"
          >
            <Github className="h-3 w-3" aria-hidden="true" />
            github repo
          </a>
        </div>
      </div>
    </motion.article>
  );
}
