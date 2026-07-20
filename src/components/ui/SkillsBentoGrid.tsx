import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { skills, dsaStats } from "../../data/portfolioData";

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
    <span className="inline-block rounded-md border border-neon-green/15 bg-neon-green/[0.07] px-2.5 py-1 font-mono text-step-0 text-content-primary/85 transition-all duration-300 hover:border-neon-green/40 hover:bg-neon-green/[0.14] hover:text-neon-green hover:shadow-[0_0_10px_rgba(0,255,136,0.15)]">
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
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green/60" />
            <span className="transition-colors duration-300 hover:text-neon-green">
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
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-neon-green"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
          </svg>
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
