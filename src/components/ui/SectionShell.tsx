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
 * header, and a scroll-triggered reveal that rises + fades with the shared
 * expo-out easing. Header uses a monospace, uppercase, letter-spaced treatment
 * prefixed with a "$"/">" glyph in the accent color.
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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader command={command} />
        {children}
      </motion.div>
    </section>
  );
}

/**
 * Shared section-header treatment — a "$"/">" prefixed monospace command with a
 * trailing circuit hairline. Exported so non-SectionShell sections (About,
 * Contact) can render an identical header.
 */
export function SectionHeader({ command }: { command: string }) {
  return (
    <div className="mb-9 flex items-center gap-3" data-glitch>
      <span className="select-none font-mono text-step-1 uppercase tracking-[0.15em] text-neon-green/80">
        {command}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-neon-green/30 to-transparent" />
    </div>
  );
}
