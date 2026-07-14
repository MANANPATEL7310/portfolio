/**
 * Layer 6 (click component) — Energy Ripples.
 *
 * Each mouse click spawns an expanding ring of energy at the cursor that grows
 * and fades. The ripple list itself lives on the shared InputState (so other
 * layers could react too); this layer just renders them. Screen-anchored to the
 * click point, so no parallax offset is applied.
 */

import type { FrameState, Layer } from "../types";

export function createRipplesLayer(): Layer {
  return {
    id: "ripples",
    draw(ctx: CanvasRenderingContext2D, fs: FrameState) {
      if (!fs.ripples.length) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const r of fs.ripples) {
        // life 1→0; radius grows as it dies, alpha fades out.
        const grow = 1 - r.life;
        const radius = 8 + grow * 170;
        const alpha = r.life * r.life * 0.5 * fs.glow;

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // A fainter inner echo for depth.
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    },
  };
}
