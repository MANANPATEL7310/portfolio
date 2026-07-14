import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GitFork, Star, Activity } from "lucide-react";
import { skills, githubStats } from "../data/portfolioData";
import SectionShell from "./ui/SectionShell";

/** Counts up to `target` once scrolled into view. */
function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    const duration = 1400;
    let start: number | null = null;
    let raf = 0;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

const categories = Object.entries(skills);

const statItems = [
  { key: "repos", label: "repositories", value: githubStats.repos, Icon: GitFork },
  { key: "stars", label: "stars earned", value: githubStats.stars, Icon: Star },
  {
    key: "contributions",
    label: "contributions",
    value: githubStats.contributions,
    Icon: Activity,
  },
];

export default function SkillsSection() {
  return (
    <SectionShell id="skills" command="$ tree ~/skills" title="Skills">
      {/* Skill tree */}
      <div className="rounded-xl border border-white/10 bg-base-800/40 p-5 font-mono text-sm backdrop-blur-sm sm:p-6">
        <div className="text-neon-green/80">skills/</div>
        <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([category, items], ci) => {
            const lastCat = ci === categories.length - 1;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: ci * 0.06 }}
              >
                <div className="text-neon-lime">
                  <span className="text-white/30">
                    {lastCat ? "└──" : "├──"}
                  </span>{" "}
                  {category}/
                </div>
                <ul className="mt-1">
                  {items.map((item, ii) => {
                    const lastItem = ii === items.length - 1;
                    return (
                      <li key={item} className="text-white/75">
                        <span className="text-white/20">
                          {lastCat ? "    " : "│   "}
                          {lastItem ? "└── " : "├── "}
                        </span>
                        <span className="transition-colors hover:text-neon-green">
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* GitHub stats row */}
      <div className="mt-6">
        <div className="mb-3 font-mono text-sm text-neon-green/80">
          $ git log --stat --global
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statItems.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-base-800/50 p-5 backdrop-blur-sm transition-colors hover:border-neon-green/30"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-neon-green/30 bg-neon-green/10">
                <s.Icon className="h-5 w-5 text-neon-green" aria-hidden="true" />
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-white">
                  <AnimatedCounter target={s.value} />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-white/45">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
