/**
 * Layer 9 — Scan Beam.
 *
 * Every 12–20 seconds a soft holographic horizontal beam sweeps down the
 * viewport, briefly brightening whatever it passes, and leaves no permanent
 * trail. It's a single additive gradient band translated in Y — cheap, and
 * screen-anchored (no parallax) so it reads as the OS scanning the display.
 */

import type { FrameState, Layer } from "../types";

const SWEEP_DURATION = 2.8; // seconds top → bottom

export function createScanBeamLayer(): Layer {
  let w = 0;
  let h = 0;
  let nextIn = 4 + Math.random() * 6; // first sweep comes fairly soon
  let active = false;
  let progress = 0;

  return {
    id: "scanbeam",
    resize(width, height) {
      w = width;
      h = height;
    },
    update(fs: FrameState) {
      if (active) {
        progress += fs.dt / SWEEP_DURATION;
        if (progress >= 1) {
          active = false;
          nextIn = 12 + Math.random() * 8;
        }
      } else {
        nextIn -= fs.dt;
        if (nextIn <= 0) {
          active = true;
          progress = 0;
        }
      }
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState) {
      if (!active) return;
      // Ease the sweep so it accelerates in and decelerates out slightly.
      const eased = progress;
      const band = 120; // px tall soft band
      const y = eased * (h + band) - band;
      // Fade the beam in at the start and out at the end of the sweep.
      const envelope = Math.sin(progress * Math.PI); // 0→1→0
      const a = 0.14 * envelope * fs.glow;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createLinearGradient(0, y - band, 0, y + band);
      g.addColorStop(0, "rgba(0,255,136,0)");
      g.addColorStop(0.5, `rgba(0,255,136,${a})`);
      g.addColorStop(1, "rgba(0,255,136,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, y - band, w, band * 2);

      // Bright leading line.
      ctx.fillStyle = `rgba(180,255,220,${a * 1.6})`;
      ctx.fillRect(0, y - 0.5, w, 1);
      ctx.restore();
    },
  };
}
