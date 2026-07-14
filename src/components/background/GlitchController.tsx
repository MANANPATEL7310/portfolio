import { useEffect } from "react";

/**
 * Every 15–25s, briefly applies an RGB-split flicker to a random element that
 * has opted in via `data-glitch`. Subtle enough most visitors won't consciously
 * register it — it just makes the interface feel alive. Fully disabled under
 * prefers-reduced-motion. Renders nothing.
 */
export default function GlitchController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: number;

    const schedule = () => {
      // 15–25s between glitches.
      const delay = 15000 + Math.random() * 10000;
      timeout = window.setTimeout(fire, delay);
    };

    const fire = () => {
      const targets = document.querySelectorAll<HTMLElement>("[data-glitch]");
      if (targets.length) {
        const el = targets[Math.floor(Math.random() * targets.length)];
        el.classList.add("glitch-active");
        window.setTimeout(() => el.classList.remove("glitch-active"), 120);
      }
      schedule();
    };

    schedule();
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
