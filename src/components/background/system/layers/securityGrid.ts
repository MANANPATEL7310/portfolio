/**
 * Layer 5 — Security Grid.
 *
 * A vast hexagonal grid blankets the viewport but stays essentially invisible.
 * As the cursor moves, the handful of hex cells near it illuminate with a soft
 * holographic glow, then fade once the cursor leaves. We never store the whole
 * grid — each frame we compute only the cells inside the cursor's neighbourhood
 * (a small window of rows/cols around the pointer), so cost is independent of
 * viewport size. A short-lived "heat" map lets illuminated cells fade smoothly
 * after the cursor has passed.
 */

import type { FrameState, Layer } from "../types";

// Pointy-top hex metrics. HEX_R is the centre-to-vertex radius.
const HEX_R = 34;
const HEX_W = Math.sqrt(3) * HEX_R; // horizontal spacing
const HEX_V = 1.5 * HEX_R; // vertical row spacing
const GLOW_RADIUS = 130; // cursor influence radius (px)

export function createSecurityGridLayer(): Layer {
  // Per-cell heat keyed by "col,row"; decays every frame.
  const heat = new Map<string, number>();

  const hexPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 90);
      const x = cx + HEX_R * Math.cos(a);
      const y = cy + HEX_R * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  return {
    id: "grid",
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      const { pointer } = fs;

      // Decay existing heat every frame (fade-after-leave).
      for (const [k, v] of heat) {
        const nv = v - fs.dt * 1.6;
        if (nv <= 0.01) heat.delete(k);
        else heat.set(k, nv);
      }

      // Inject heat for cells near the cursor.
      if (pointer.active) {
        const py = pointer.y - offsetY;
        const rowCenter = Math.round(py / HEX_V);
        const colCenter = Math.round(pointer.x / HEX_W);
        const span = Math.ceil(GLOW_RADIUS / HEX_W) + 1;
        for (let row = rowCenter - span; row <= rowCenter + span; row++) {
          const rowOffset = row & 1 ? HEX_W / 2 : 0;
          for (let col = colCenter - span; col <= colCenter + span; col++) {
            const cx = col * HEX_W + rowOffset;
            const cy = row * HEX_V;
            const dx = cx - pointer.x;
            const dy = cy - py;
            const d = Math.hypot(dx, dy);
            if (d > GLOW_RADIUS) continue;
            const k = `${col},${row}`;
            const target = (1 - d / GLOW_RADIUS) ** 1.5;
            heat.set(k, Math.max(heat.get(k) ?? 0, target));
          }
        }
      }

      // Draw only the illuminated cells.
      if (!heat.size) return;
      ctx.save();
      ctx.lineWidth = 1;
      for (const [k, v] of heat) {
        const [col, row] = k.split(",").map(Number);
        const rowOffset = row & 1 ? HEX_W / 2 : 0;
        const cx = col * HEX_W + rowOffset;
        const cy = row * HEX_V + offsetY;
        const a = v * fs.glow;
        hexPath(ctx, cx, cy);
        ctx.strokeStyle = `rgba(0,255,136,${0.5 * a})`;
        ctx.stroke();
        ctx.fillStyle = `rgba(0,255,136,${0.06 * a})`;
        ctx.fill();
      }
      ctx.restore();
    },
  };
}
