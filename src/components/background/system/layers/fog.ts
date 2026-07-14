/**
 * Layer 2 — Digital Atmosphere.
 *
 * An ultra-soft procedural fog that reads as flowing digital energy, never
 * smoke. Two cheap ingredients combined:
 *   • a small value-noise texture baked ONCE into an offscreen canvas, then
 *     drawn upscaled with a slowly drifting sample offset (the "flow"), and
 *   • a couple of large, slowly morphing radial blooms in the accent colours.
 * Both sit at very low alpha to add depth without ever distracting.
 */

import type { FrameState, Layer, QualityTier } from "../types";

const NOISE_SIZE = 96; // baked once, upscaled hugely — cheap

export function createFogLayer(): Layer {
  let tex: HTMLCanvasElement | null = null;
  let w = 0;
  let h = 0;

  const bakeNoise = () => {
    const c = document.createElement("canvas");
    c.width = NOISE_SIZE;
    c.height = NOISE_SIZE;
    const cx = c.getContext("2d")!;
    const img = cx.createImageData(NOISE_SIZE, NOISE_SIZE);
    // Smooth-ish value noise: average a few octaves of white noise per pixel so
    // the field has soft cloudy structure rather than TV static.
    for (let y = 0; y < NOISE_SIZE; y++) {
      for (let x = 0; x < NOISE_SIZE; x++) {
        const n =
          (Math.sin(x * 0.15) + Math.cos(y * 0.13)) * 0.25 +
          Math.random() * 0.5 +
          0.25;
        const v = Math.max(0, Math.min(1, n));
        const i = (y * NOISE_SIZE + x) * 4;
        // Tint toward emerald/cyan; alpha carries the density.
        img.data[i] = 0;
        img.data[i + 1] = 255;
        img.data[i + 2] = 170;
        img.data[i + 3] = v * 255;
      }
    }
    cx.putImageData(img, 0, 0);
    tex = c;
  };

  return {
    id: "fog",
    resize(width, height, _q: QualityTier) {
      w = width;
      h = height;
      if (!tex) bakeNoise();
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      if (!fs.quality.fog || !tex) return;
      const t = fs.time;

      // ── Drifting noise sheet ──────────────────────────────────────────────
      // Upscale the tiny texture to ~1.6× viewport and pan it very slowly. The
      // pan wraps via two staggered draws so there's never a visible seam.
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.05 * fs.glow;
      const scale = Math.max(w, h) * 1.8;
      const dx = ((t * 6) % scale) - scale;
      const dy = ((t * 4) % scale) - scale + offsetY;
      ctx.imageSmoothingEnabled = true;
      for (let ix = 0; ix < 2; ix++) {
        for (let iy = 0; iy < 2; iy++) {
          ctx.drawImage(tex, dx + ix * scale, dy + iy * scale, scale, scale);
        }
      }
      ctx.restore();

      // ── Two slow morphing accent blooms ───────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const blooms = [
        {
          cx: w * (0.3 + 0.05 * Math.sin(t * 0.05)),
          cy: h * (0.35 + 0.04 * Math.cos(t * 0.04)) + offsetY,
          r: Math.max(w, h) * 0.5,
          col: "0,255,136",
          a: 0.035,
        },
        {
          cx: w * (0.72 + 0.05 * Math.cos(t * 0.045)),
          cy: h * (0.6 + 0.05 * Math.sin(t * 0.05)) + offsetY,
          r: Math.max(w, h) * 0.45,
          col: "0,229,255",
          a: 0.028,
        },
      ];
      for (const b of blooms) {
        const g = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, b.r);
        g.addColorStop(0, `rgba(${b.col},${b.a * fs.glow})`);
        g.addColorStop(1, `rgba(${b.col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    },
  };
}
