import { motion } from "framer-motion";
import { GitCommitHorizontal, Compass, Route } from "lucide-react";
import { education } from "../data/portfolioData";
import SectionShell from "./ui/SectionShell";

export default function EducationSection() {
  return (
    <SectionShell
      id="education"
      command="$ cat education/roadmap.log"
      title="Education & Learning Path"
    >
      {/* Overview */}
      <div className="rounded-xl border border-white/10 bg-base-800/40 p-5 backdrop-blur-sm sm:p-6">
        <p className="font-sans text-base leading-relaxed text-white/75">
          {education.overview}
        </p>
      </div>

      {/* Relevant learning as a changelog */}
      <div className="mt-6">
        <div className="mb-4 font-mono text-sm text-neon-green/80">
          ## relevant-learning
        </div>
        <ol className="relative ml-3 border-l border-neon-green/20">
          {education.relevantLearning.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="mb-6 ml-6 last:mb-0"
            >
              <span className="absolute -left-[9px] grid h-[18px] w-[18px] place-items-center rounded-full border border-neon-green/40 bg-base-900">
                <GitCommitHorizontal
                  className="h-3 w-3 text-neon-green"
                  aria-hidden="true"
                />
              </span>
              <h3 className="font-mono text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1 font-sans text-sm leading-relaxed text-white/65">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Current path + roadmap */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-xl border border-white/10 bg-base-800/40 p-5 backdrop-blur-sm"
        >
          <h3 className="flex items-center gap-2 font-mono text-sm text-neon-green">
            <Compass className="h-4 w-4" aria-hidden="true" /> current-path
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-white/70">
            {education.currentPath}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-xl border border-neon-green/20 bg-neon-green/[0.04] p-5 backdrop-blur-sm"
        >
          <h3 className="flex items-center gap-2 font-mono text-sm text-neon-lime">
            <Route className="h-4 w-4" aria-hidden="true" /> next-up
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-white/70">
            {education.roadmap}
          </p>
        </motion.div>
      </div>
    </SectionShell>
  );
}
