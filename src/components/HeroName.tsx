import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero-title cinematic reveal — a "system boot / signal stabilized" establish
 * animation for the large hero name, in the style of high-end cyberpunk /
 * military title intros, toned down to a premium engineering-interface feel.
 *
 * It changes nothing about the resting title: font, size, gradient, spacing and
 * position are inherited untouched from the parent <h1>.
 *
 * The WHOLE WORD behaves as one object (not per-letter):
 *  • starts ~25% visible; a couple of offset ghost copies try to stabilize
 *  • the word flickers low↔full a few times while micro-vibrating 1–3px
 *  • thin horizontal slices crack and snap back (signal breaking/reconnecting)
 *  • an emerald sweep restores clarity left→right
 *  • ghosts collapse, cracks vanish, glow settles, vibration stops — locked.
 *
 * ONE-SHOT by design, with a guaranteed-stable ending: the component moves
 * through three phases —
 *   "idle" (plain name, waiting for first viewport entry)
 *   "run"  (the ~1s overlay reveal)
 *   "done" (renders NOTHING but the plain name string, permanently)
 * Once "done", there is no state, overlay, or style left that could ever hide
 * or move the title again until the page is refreshed.
 *
 * Fully skipped under prefers-reduced-motion (plain title only).
 */

/** How long the reveal runs before it settles (ms). */
const REVEAL_MS = 1000;
/** Delay after first visibility, so the h1's entrance lands first. */
const FIRST_DELAY_MS = 650;

type Phase = "idle" | "run" | "done";

export default function HeroName({ name }: { name: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (reduced) {
      setPhase("done"); // permanent plain title, no reveal ever
      return;
    }

    const el = ref.current;
    if (!el) return;

    let startTimer = 0;
    let endTimer = 0;
    let started = false;

    const begin = () => {
      if (started) return;
      started = true;
      startTimer = window.setTimeout(() => {
        setPhase("run");
        endTimer = window.setTimeout(() => setPhase("done"), REVEAL_MS);
      }, FIRST_DELAY_MS);
    };

    // Play once, the first time the hero enters the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          begin();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [reduced]);

  // After the one-shot reveal (or under reduced motion): the name is rendered
  // as a completely normal static string — nothing else, forever.
  if (phase === "done") {
    return <>{name}</>;
  }

  return (
    <span
      ref={ref}
      className="relative inline-block align-baseline"
      style={{ whiteSpace: "pre" }}
    >
      {/* Base title, visible while idle; hidden only during the ~1s run (the
          overlay's boot copy takes its place, perfectly aligned). */}
      <span style={{ opacity: phase === "run" ? 0 : 1 }}>{name}</span>

      {phase === "run" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          style={{ whiteSpace: "pre" }}
        >
          {/* Offset ghost copies of the whole word — collapse + fade */}
          <span className="hero-ghost2 hero-ghost2--a text-gradient-neon absolute left-0 top-0">
            {name}
          </span>
          <span className="hero-ghost2 hero-ghost2--b text-gradient-neon absolute left-0 top-0">
            {name}
          </span>

          {/* The word as one object: flicker + micro-vibration + glow, settling.
              Rendered `relative` so it defines the overlay box the absolutely
              positioned layers (ghosts, slices, sweep) align to. */}
          <span className="hero-boot text-gradient-neon relative">{name}</span>

          {/* Thin cracking slices that shift + snap back */}
          <span className="hero-slice hero-slice--1 text-gradient-neon">
            {name}
          </span>
          <span className="hero-slice hero-slice--2 text-gradient-neon">
            {name}
          </span>
          <span className="hero-slice hero-slice--3 text-gradient-neon">
            {name}
          </span>

          {/* Emerald energy sweep restoring clarity left→right */}
          <span className="hero-sweep absolute left-0 top-0">{name}</span>
        </span>
      )}
    </span>
  );
}
