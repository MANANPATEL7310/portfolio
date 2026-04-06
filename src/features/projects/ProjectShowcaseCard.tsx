'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Code2, ExternalLink, FolderOpen } from 'lucide-react';

import type { ProjectData } from '@/lib/dataService';

const DESCRIPTION_PREVIEW_LENGTH = 92;

function getDescriptionPreview(description: string) {
  if (description.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return description;
  }

  const truncated = description.slice(0, DESCRIPTION_PREVIEW_LENGTH);
  const safePreview = truncated.includes(' ')
    ? truncated.slice(0, truncated.lastIndexOf(' '))
    : truncated;

  return `${safePreview.trim()}...`;
}

interface ProjectShowcaseCardProps {
  project: ProjectData;
  active: boolean;
  onSelect: () => void;
  onOpenProject: () => void;
  onOpenGithub: () => void;
  onOpenDetails: () => void;
}

export function ProjectShowcaseCard({
  project,
  active,
  onSelect,
  onOpenProject,
  onOpenGithub,
  onOpenDetails,
}: ProjectShowcaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const preview = useMemo(() => getDescriptionPreview(project.description), [project.description]);
  const needsExpansion = preview !== project.description;
  const description = isExpanded ? project.description : preview;

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.008 }}
      onClick={onSelect}
      onDoubleClick={onOpenProject}
      className={`group relative overflow-hidden rounded-[1.75rem] border text-left shadow-[0_22px_65px_rgba(15,23,42,0.08)] transition ${
        active
          ? 'border-blue-400/60 ring-2 ring-blue-400/25'
          : 'border-black/8 dark:border-white/10'
      }`}
    >
      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(240px,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative min-h-[208px] overflow-hidden rounded-[1.45rem] bg-black/[0.03] dark:bg-white/6">
          <Image
            src={project.thumbnail || project.icon}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/12 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 flex-wrap gap-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <ShowcasePill onClick={onOpenProject} label="Open Project" icon={<ExternalLink className="h-3.5 w-3.5" />} />
            <ShowcasePill onClick={onOpenGithub} label="View Code" icon={<Code2 className="h-3.5 w-3.5" />} />
            <ShowcasePill onClick={onOpenDetails} label="Details" icon={<FolderOpen className="h-3.5 w-3.5" />} />
          </div>
        </div>

        <div className="flex min-h-[208px] flex-col">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/35 dark:text-white/35">
              {project.websiteLabel}
            </p>
            <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.02em] text-[#18181b] dark:text-white">
              {project.name}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.04 }}
                className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[11px] font-medium text-black/68 dark:bg-white/8 dark:text-white/65"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="mt-4 text-[15px] leading-7 text-black/68 dark:text-white/62">
            <span>{description}</span>
            {needsExpansion ? (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setIsExpanded((current) => !current);
                }}
                className="ml-1 inline text-[14px] font-medium text-[#2563eb] transition hover:text-[#1d4ed8] dark:text-[#8ab4ff] dark:hover:text-[#b5ccff]"
              >
                {isExpanded ? 'less' : 'more'}
              </button>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-5">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onOpenProject();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-white/12 dark:hover:bg-white/18"
            >
              <ExternalLink className="h-4 w-4" />
              Open project
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onOpenGithub();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.03] px-4 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/6 dark:text-white/75 dark:hover:bg-white/10"
            >
              <Code2 className="h-4 w-4" />
              View code
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onOpenDetails();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.03] px-4 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/6 dark:text-white/75 dark:hover:bg-white/10"
            >
              <FolderOpen className="h-4 w-4" />
              View details
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ShowcasePill({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#171717] shadow-lg transition hover:bg-white"
    >
      {icon}
      {label}
    </button>
  );
}
