import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero-title cinematic reveal — a "system boot / signal stabilized" establish
 * animation for the large hero name, in the style of high-end cyberpunk /
 * military title intros, toned down to a premium engineering-interface feel.
 *
 * It changes nothing about the resting title: font, size, gradient, spacing and
 * position are inherited untouched from the parent <h1>. At rest the DOM is the
 * exact original gradient text. The reveal only overlays transient, aria-hidden
 * copies for ~1s per run, then unmounts so the text is perfectly static.
 *
 * The WHOLE WORD behaves as one object (not per-letter):
 *  • starts ~25% visible; a couple of offset ghost copies try to stabilize
 *  • the word flickers low↔full a few times while micro-vibrating 1–3px
 *  • thin horizontal slices crack and snap back (signal breaking/reconnecting)
 *  • an emerald sweep restores clarity left→right
 *  • ghosts collapse, cracks vanish, glow settles, vibration stops — locked.
 *
 * Because it's the person's NAME (a primary element), the reveal re-plays once
 * on a slow, theme-matched interval (a few seconds' gap) — not a continuous
 * loop and never flashing after a run settles. Each replay remounts the overlay
 * subtree via an incrementing `key`, which cleanly restarts the CSS animations.
 *
 * Fully skipped under prefers-reduced-motion (renders only the static title),
 * and it won't replay while the tab is hidden.
 */

/** How long one reveal run lasts before it settles + unmounts (ms). */
const REVEAL_MS = 1000;
/** Delay after mount before the first reveal, so the h1 entrance lands first. */
const FIRST_DELAY_MS = 650;
/** Base gap between replays (ms); a little randomness keeps it non-mechanical. */
const REPLAY_GAP_MS = 100;

export default function HeroName({ name }: { name: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [runId, setRunId] = useState(0); // increments per reveal → remounts FX
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (reduced) return; // static title, no reveal ever

    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let startTimer = 0;
    let endTimer = 0;
    let gapTimer = 0;

    const runOnce = () => {
      if (cancelled) return;
      // Don't animate an unseen tab; poll back shortly instead.
      if (document.hidden) {
        gapTimer = window.setTimeout(runOnce, 1500);
        return;
      }
      setRunId((id) => id + 1);
      setRunning(true);
      endTimer = window.setTimeout(() => {
        if (cancelled) return;
        setRunning(false);
        const jitter = Math.random() * 500; // 0.5–1.0s between plays
        gapTimer = window.setTimeout(runOnce, REPLAY_GAP_MS + jitter);
      }, REVEAL_MS);
    };

    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      startTimer = window.setTimeout(runOnce, FIRST_DELAY_MS);
    };

    // Kick off the first reveal when the hero first enters the viewport.
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
      cancelled = true;
      io.disconnect();
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
      window.clearTimeout(gapTimer);
    };
  }, [reduced]);

  return (
    <span
      ref={ref}
      className="relative inline-block align-baseline"
      style={{ whiteSpace: "pre" }}
    >
      {/* Base pristine gradient title (inherits from the <h1>). Hidden only
          while a reveal runs; at rest it's the exact original title. The swap is
          seamless because the overlay ends perfectly aligned + full brightness. */}
      <span style={{ opacity: running ? 0 : 1 }}>{name}</span>

      {running && (
        <span
          key={runId}
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
