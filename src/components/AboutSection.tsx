import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { profile } from "../data/portfolioData";
import { SectionHeader } from "./ui/SectionShell";

/**
 * Renders the long-form "about" content as a set of terminal document blocks.
 * Flows directly beneath the hero (which owns the #about anchor), so it has no
 * anchor of its own.
 */
export default function AboutSection() {
  return (
    <section
      aria-label="About Manan"
      className="relative mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader command="$ cat about.md" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {profile.aboutSections.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: (i % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`group glass glass-hover rounded-xl p-5 shadow-elev-1 ${
                i === profile.aboutSections.length - 1 &&
                profile.aboutSections.length % 2 === 1
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <h3 className="flex items-center gap-2 font-mono text-step-1 text-neon-green">
                <FileText
                  className="h-4 w-4 text-neon-green/70"
                  aria-hidden="true"
                />
                ## {s.title}
              </h3>
              <p className="mt-3 font-sans text-step-1 leading-relaxed text-content-primary/75">
                {s.content}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
