import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../data/portfolioData";

/**
 * A short terminal boot-sequence shown once on first load. Types out a few
 * "system check" lines, then wipes away to reveal the site. Kept brief (~1.8s)
 * so it reads as a confident intro, not a loading screen. Under
 * prefers-reduced-motion it collapses to a single quick fade.
 */
const LINES = [
  "> initializing secure session…",
  "> loading ~/portfolio/manan",
  "> mounting interface modules",
  "> access granted ✓",
];

export default function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      const t = window.setTimeout(() => setVisible(false), 350);
      return () => window.clearTimeout(t);
    }

    // Reveal lines one at a time.
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), 260 + i * 340));
    });
    timers.push(window.setTimeout(() => setVisible(false), 260 + LINES.length * 340 + 420));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-base-900"
        >
          {/* Sweeping scanline wipe */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
          >
            <div
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-neon-green/10 to-transparent"
              style={{ animation: "boot-wipe 1.6s cubic-bezier(0.16,1,0.3,1) infinite" }}
            />
          </div>

          <div className="w-[min(90vw,32rem)] px-6 font-mono text-step-1">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-neon-green/70" />
              <span className="ml-3 text-content-secondary">
                {profile.handle}:~$ ./boot
              </span>
            </div>
            <div className="space-y-1.5">
              {LINES.slice(0, shown).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    i === LINES.length - 1
                      ? "text-neon-green"
                      : "text-content-secondary"
                  }
                >
                  {line}
                </motion.p>
              ))}
              <span className="inline-block h-4 w-2 animate-blink bg-neon-lime align-middle" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
