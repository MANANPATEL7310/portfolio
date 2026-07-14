/**
 * Layer 12 (+ Layer 6 cursor coupling) — Digital Particles.
 *
 * A deep field of tiny particles that drift slowly, twinkle, and vary in size /
 * brightness by depth (`z`) to build parallax-like depth even before scroll.
 * They never move randomly — each has a stable slow-drift vector. Near the
 * cursor they brighten and bend gently toward it (the cursor is an energy
 * source), then spring smoothly back to their home drift when it leaves.
 *
 * Rendered with additive glow sprites for cheap, luminous accumulation.
 */

import type { FrameState, Layer, QualityTier } from "../types";
import { getSharedSprites, drawGlow } from "../sprites";

interface Particle {
  x: number;
  y: number;
  vx: number; // home drift
  vy: number;
  ox: number; // live cursor-displacement offset (springs back to 0)
  oy: number;
  z: number; // 0 (far) .. 1 (near) → size + brightness + parallax feel
  tw: number; // twinkle phase
}

const INFLUENCE = 150;

export function createParticlesLayer(): Layer {
  let w = 0;
  let h = 0;
  let parts: Particle[] = [];
  const sprites = getSharedSprites();

  return {
    id: "particles",
    resize(width, height, q: QualityTier) {
      w = width;
      h = height;
      const count = Math.round(
        Math.max(120, Math.min(1100, (width * height) / 2200)) * q.density
      );
      parts = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (4 + z * 6),
          vy: (Math.random() - 0.5) * (4 + z * 6),
          ox: 0,
          oy: 0,
          z,
          tw: Math.random() * Math.PI * 2,
        };
      });
    },
    update(fs: FrameState) {
      const { pointer, dt } = fs;
      for (const p of parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.tw += dt * (1 + p.z);

        // Wrap so the field is seamless and endless.
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;

        // Cursor coupling: bend toward the pointer, scaled by depth (near
        // particles react more), then let the offset spring back to zero.
        if (pointer.active) {
          const dx = pointer.x - (p.x + p.ox);
          const dy = pointer.y - (p.y + p.oy);
          const d2 = dx * dx + dy * dy;
          if (d2 < INFLUENCE * INFLUENCE && d2 > 1) {
            const d = Math.sqrt(d2);
            const pull = (1 - d / INFLUENCE) * (0.3 + p.z * 0.7) * 26;
            p.ox += (dx / d) * pull * dt;
            p.oy += (dy / d) * pull * dt;
          }
        }
        // Spring home.
        p.ox *= 0.9;
        p.oy *= 0.9;
      }
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      ctx.globalCompositeOperation = "lighter";
      // Near particles get more parallax than far ones for real depth.
      for (const p of parts) {
        const twinkle = 0.6 + 0.4 * Math.sin(p.tw);
        const size = 0.02 + p.z * 0.05;
        const alpha = (0.12 + p.z * 0.4) * twinkle * fs.glow;
        const py = p.y + p.oy + offsetY * (0.5 + p.z);
        drawGlow(ctx, sprites.emerald, p.x + p.ox, py, size, alpha);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    },
  };
}
