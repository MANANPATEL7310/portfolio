import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  /** Terminal-style command shown as the section header, e.g. "$ cat about.md" */
  command: string;
  /** Human-readable title for the section (also used for aria-label) */
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Consistent wrapper for every content section: anchor id, a terminal command
 * header, and a scroll-triggered reveal. Keeps the theme uniform without
 * repeating markup in every section component.
 */
export default function SectionShell({
  id,
  command,
  title,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="mb-9 flex items-center gap-3">
          <span className="select-none font-mono text-sm text-neon-green/80">
            {command}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-green/30 to-transparent" />
        </div>
        {children}
      </motion.div>
    </section>
  );
}
