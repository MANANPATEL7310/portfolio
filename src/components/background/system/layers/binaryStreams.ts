/**
 * Additive layer — Sparse Binary Streams.
 *
 * A deliberately RESTRAINED vertical 0/1 rain: only a handful of thin columns
 * fall at any time (far fewer than a classic Matrix wall), each with a bright
 * head and a short fading tail, so it reads as the OS occasionally paging a
 * memory column rather than screensaver spam. It coexists with the hex memory
 * streams (which drift UP) — these fall DOWN — giving the field a subtle
 * two-directional data motion.
 *
 * Runs inside the shared engine loop; no own RAF. Colours + glow match the
 * design tokens; alpha stays low so body copy is never disturbed.
 */

import type { FrameState, Layer, QualityTier } from "../types";

interface Column {
  x: number;
  y: number; // y of the falling head (px)
  speed: number; // px/s
  fontSize: number;
  length: number; // number of trailing glyphs
  bits: string[]; // the glyph stack (head at index 0)
  alpha: number; // per-column peak opacity
}

export function createBinaryStreamsLayer(): Layer {
  let w = 0;
  let h = 0;
  let cols: Column[] = [];

  const makeBits = (n: number) =>
    Array.from({ length: n }, () => (Math.random() < 0.5 ? "0" : "1"));

  const respawn = (c: Column, initial: boolean) => {
    c.fontSize = 12 + Math.random() * 5;
    c.length = 6 + Math.floor(Math.random() * 10);
    c.speed = 34 + Math.random() * 60;
    c.x = Math.random() * w;
    c.y = initial ? Math.random() * h : -c.length * (c.fontSize + 3);
    c.bits = makeBits(c.length);
    c.alpha = 0.14 + Math.random() * 0.22;
  };

  return {
    id: "binary",
    resize(width, height, q: QualityTier) {
      w = width;
      h = height;
      // Very sparse: ~1 column per 240px of width, scaled by device density.
      const count = Math.round(
        Math.max(3, Math.min(14, width / 240)) * q.density
      );
      cols = Array.from({ length: count }, () => {
        const c = {} as Column;
        respawn(c, true);
        return c;
      });
    },
    update(fs: FrameState) {
      for (const c of cols) {
        c.y += c.speed * fs.dt;
        // Occasionally flip a glyph so the column mutates as it falls.
        if (Math.random() < 0.06) {
          const i = (Math.random() * c.bits.length) | 0;
          c.bits[i] = Math.random() < 0.5 ? "0" : "1";
        }
        // Recycle once the whole tail has left the bottom.
        if (c.y - c.length * (c.fontSize + 3) > h) respawn(c, false);
      }
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const c of cols) {
        const step = c.fontSize + 3;
        ctx.font = `${c.fontSize}px "JetBrains Mono", monospace`;
        for (let i = 0; i < c.bits.length; i++) {
          const gy = c.y - i * step + offsetY;
          if (gy < -step || gy > h + step) continue;
          const fade = 1 - i / c.bits.length; // head brightest, tail dim
          if (i === 0) {
            // Bright lime head with a hint of glow.
            ctx.fillStyle = `rgba(124,255,79,${(0.6 + 0.4 * c.alpha) * fs.glow})`;
          } else {
            ctx.fillStyle = `rgba(0,255,136,${c.alpha * fade * fs.glow})`;
          }
          ctx.fillText(c.bits[i], c.x, gy);
        }
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },
  };
}
