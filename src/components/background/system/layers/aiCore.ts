/**
 * Layer 11 — AI Core.
 *
 * An extremely faint (3–5% opacity) wireframe sphere built entirely from tiny
 * glowing particles, rotating very slowly at the centre of the scene. It is the
 * symbolic "core" powering the operating system. Points are distributed evenly
 * with a Fibonacci sphere, rotated by a cheap Y/X matrix, and projected with a
 * light perspective divide. Back-facing points are dimmed by their z so the
 * sphere reads as a volume, not a flat disc. No WebGL required.
 */

import type { FrameState, Layer, QualityTier } from "../types";
import { getSharedSprites, drawGlow } from "../sprites";

interface P3 {
  x: number;
  y: number;
  z: number;
}

export function createAiCoreLayer(): Layer {
  let w = 0;
  let h = 0;
  let pts: P3[] = [];
  let radius = 0;
  const sprites = getSharedSprites();

  const build = (count: number) => {
    pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // 1 .. -1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }
  };

  return {
    id: "aicore",
    resize(width, height, q: QualityTier) {
      w = width;
      h = height;
      radius = Math.min(width, height) * 0.28;
      if (!q.aiCore) {
        pts = [];
        return;
      }
      build(Math.round(360 * q.density));
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      if (!fs.quality.aiCore || !pts.length) return;
      const cx = w / 2;
      const cy = h * 0.46 + offsetY;
      const t = fs.time;

      // Slow compound rotation.
      const ay = t * 0.12;
      const ax = t * 0.05;
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);

      ctx.globalCompositeOperation = "lighter";
      for (const p of pts) {
        // Rotate around Y then X.
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y * cosX - z * sinX;
        z = p.y * sinX + z * cosX;

        // Perspective projection.
        const persp = 1.6 / (1.6 - z); // z in [-1,1]
        const sx = cx + x * radius * persp;
        const sy = cy + y * radius * persp;

        // Depth cueing: front points brighter, back points faint.
        const depth = (z + 1) / 2; // 0 back .. 1 front
        const alpha = (0.02 + depth * 0.05) * fs.glow; // ~3–5% peak
        drawGlow(ctx, sprites.cyan, sx, sy, 0.03 + depth * 0.02, alpha);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    },
  };
}
