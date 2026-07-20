import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { skills, dsaStats } from "../../data/portfolioData";
import { getTechIcon } from "../../utils/techIcons";

/* ── Animated counter (reused from the old section) ─────────────────────── */
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
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

/* ── Category icon mapping ──────────────────────────────────────────────── */
const categoryIcons: Record<string, string> = {
  "Web Dev": "⟨/⟩",
  "AI-ML": "🧠",
  Languages: "λ",
  "Computer Science": "⊞",
};

/* ── Shared animation config ────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* ── Skill pill ─────────────────────────────────────────────────────────── */
function SkillPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-neon-green/15 bg-neon-green/[0.07] px-2.5 py-1 font-mono text-step-0 text-content-primary/85 transition-all duration-300 hover:border-neon-green/40 hover:bg-neon-green/[0.14] hover:text-neon-green hover:shadow-[0_0_10px_rgba(0,255,136,0.15)]">
      {getTechIcon(name)}
      {name}
    </span>
  );
}

/* ── Standard skill card (pills layout) ─────────────────────────────────── */
function SkillCard({
  title,
  subBranches,
  index,
  className = "",
}: {
  title: string;
  subBranches: Record<string, string[]>;
  index: number;
  className?: string;
}) {
  const icon = categoryIcons[title] || "⊙";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`glass glass-hover flex flex-col rounded-xl p-5 sm:p-6 ${className}`}
    >
      {/* Card header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-neon-green/25 bg-neon-green/10 font-mono text-step-3 text-neon-green">
          {icon}
        </div>
        <h3 className="font-mono text-step-3 font-semibold tracking-tight text-content-primary">
          {title}
        </h3>
      </div>

      {/* Sub-branches */}
      <div className="flex flex-1 flex-col gap-4">
        {Object.entries(subBranches).map(([branch, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={branch}>
              <p className="mb-2 font-mono text-step-0 uppercase tracking-[0.15em] text-neon-green/70">
                {branch}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <SkillPill key={skill} name={skill} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Computer Science card (vertical unordered list) ────────────────────── */
function CsCard({
  subBranches,
  index,
  className = "",
}: {
  subBranches: Record<string, string[]>;
  index: number;
  className?: string;
}) {
  const allItems = Object.values(subBranches).flat();

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`glass glass-hover flex flex-col rounded-xl p-5 sm:p-6 ${className}`}
    >
      {/* Card header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-neon-green/25 bg-neon-green/10 font-mono text-step-3 text-neon-green">
          ⊞
        </div>
        <h3 className="font-mono text-step-3 font-semibold tracking-tight text-content-primary">
          Computer Science
        </h3>
      </div>

      {/* Vertical list */}
      <ul className="flex flex-1 flex-col gap-2.5 pl-1">
        {allItems.map((item) => (
          <li key={item} className="flex items-center gap-3 font-mono text-step-1 text-content-primary/85">
            <span className="transition-colors duration-300 hover:text-neon-green flex items-center">
              {getTechIcon(item) || <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green/60 mr-1.5" />}
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── DSA / LeetCode card ────────────────────────────────────────────────── */
function DsaCard({ index, className = "" }: { index: number; className?: string }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`glass glass-hover flex flex-col rounded-xl p-5 sm:p-6 ${className}`}
    >
      {/* Card header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-neon-green/25 bg-neon-green/10 font-mono text-step-3 text-neon-green">
          ⊕
        </div>
        <h3 className="font-mono text-step-3 font-semibold tracking-tight text-content-primary">
          DSA
        </h3>
      </div>

      {/* LeetCode stats */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/leetcode.png"
            alt="LeetCode"
            className="h-8 w-8 object-contain bg-white/95 rounded-[4px] p-[3px] drop-shadow-md"
            aria-hidden="true"
          />
          <span className="font-mono text-step-2 font-medium text-content-primary">
            {dsaStats.platform}
          </span>
        </div>

        {/* Big counter */}
        <div className="text-center">
          <div className="font-mono text-step-6 font-bold text-neon-green">
            <AnimatedCounter target={dsaStats.problemsSolved} />
          </div>
          <p className="mt-1 font-mono text-step-0 uppercase tracking-[0.15em] text-content-secondary">
            problems solved
          </p>
        </div>

        {/* Profile link */}
        <a
          href={dsaStats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-1 inline-flex items-center gap-2 rounded-lg border border-neon-green/25 bg-neon-green/[0.07] px-4 py-2 font-mono text-step-1 text-neon-green transition-all duration-300 hover:border-neon-green/50 hover:bg-neon-green/[0.15] hover:shadow-[0_0_16px_rgba(0,255,136,0.2)]"
        >
          View Profile
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}

/* ── Main Bento Grid ────────────────────────────────────────────────────── *
 *  Desktop (lg) layout:
 *  ┌────────────┬────────────┬────────────┐
 *  │  Web Dev   │    DSA     │            │
 *  ├────────────┼────────────┤   AI-ML    │
 *  │ Comp Sci   │ Languages  │  (tall)    │
 *  └────────────┴────────────┴────────────┘
 *
 *  Tablet (sm): 2 columns, AI-ML spans full width at the bottom.
 *  Mobile: single column, natural order.
 * ─────────────────────────────────────────────────────────────────────────── */
export default function SkillsBentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
      {/* Row 1, Col 1 — Web Dev */}
      <SkillCard
        title="Web Dev"
        subBranches={skills["Web Dev"]}
        index={0}
        className="lg:col-start-1 lg:row-start-1"
      />

      {/* Row 1, Col 2 — DSA */}
      <DsaCard
        index={1}
        className="lg:col-start-2 lg:row-start-1"
      />

      {/* Row 2, Col 1 — Computer Science (vertical list) */}
      <CsCard
        subBranches={skills["Computer Science"]}
        index={2}
        className="lg:col-start-1 lg:row-start-2"
      />

      {/* Row 2, Col 2 — Languages */}
      <SkillCard
        title="Languages"
        subBranches={skills["Languages"]}
        index={3}
        className="lg:col-start-2 lg:row-start-2"
      />

      {/* Col 3, Row 1–2 — AI-ML (spans 2 rows) */}
      <SkillCard
        title="AI-ML"
        subBranches={skills["AI-ML"]}
        index={4}
        className="lg:col-start-3 lg:row-start-1 lg:row-span-2"
      />
    </div>
  );
}
