/**
 * Layer 4 (+ Layer 8) — AI Neural Network with live traffic.
 *
 * Hundreds of softly glowing nodes drift slowly while maintaining rough
 * topology. Connections are proximity-based and therefore constantly
 * connect / disconnect / reconnect as nodes move; each edge's brightness also
 * flickers on its own phase so the mesh never looks static. Small glowing
 * packets ride the brightest edges like live network traffic, leaving a faint
 * additive trail (Layer 8). The cursor acts as a gentle attractor.
 *
 * Performance: neighbour search uses a uniform spatial hash rebuilt each frame,
 * turning the naive O(n²) all-pairs test into ~O(n). Edges and nodes are drawn
 * with additive glow sprites — no per-draw shadowBlur.
 */

import type { FrameState, Layer, QualityTier } from "../types";
import { getSharedSprites, drawGlow } from "../sprites";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  flick: number; // brightness flicker phase
}

interface Packet {
  a: number; // from node index
  b: number; // to node index
  t: number; // 0..1 along edge
  speed: number;
}

const LINK_DIST = 118; // px; edges form within this radius
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

export function createNeuralNetworkLayer(): Layer {
  let w = 0;
  let h = 0;
  let nodes: Node[] = [];
  let packets: Packet[] = [];

  // Spatial hash buckets, rebuilt each frame.
  const cell = LINK_DIST;
  let cols = 0;
  let rows = 0;
  let grid: number[][] = [];

  const sprites = getSharedSprites();

  const seedPackets = (count: number) => {
    packets = [];
    for (let i = 0; i < count && nodes.length > 1; i++) {
      const a = (Math.random() * nodes.length) | 0;
      packets.push({ a, b: a, t: 1, speed: 0.35 + Math.random() * 0.5 });
    }
  };

  return {
    id: "neural",
    resize(width, height, q: QualityTier) {
      w = width;
      h = height;
      // Density scaled to area; capped so "hundreds" stays a desktop luxury.
      const count = Math.round(
        Math.max(40, Math.min(240, (width * height) / 11000)) * q.density
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        flick: Math.random() * Math.PI * 2,
      }));
      cols = Math.max(1, Math.ceil(width / cell));
      rows = Math.max(1, Math.ceil(height / cell));
      grid = Array.from({ length: cols * rows }, () => []);
      seedPackets(Math.max(6, Math.round(count * 0.12)));
    },
    update(fs: FrameState) {
      const { pointer, dt } = fs;
      for (const n of nodes) {
        // Gentle cursor attraction — the cursor is an energy source.
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200 && d2 > 1) {
            const f = (1 - Math.sqrt(d2) / 200) * 12;
            n.vx += (dx / Math.sqrt(d2)) * f * dt;
            n.vy += (dy / Math.sqrt(d2)) * f * dt;
          }
        }
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        // Damping keeps drift slow and prevents runaway from cursor kicks.
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.flick += dt * (0.6 + 0.4 * Math.sin(n.x * 0.01));

        // Soft wrap-around at the edges so topology stays whole.
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }

      // Advance packets; when one arrives, hop it to a connected neighbour.
      for (const p of packets) {
        p.t += p.speed * dt;
        if (p.t >= 1) {
          const from = p.b;
          const fn = nodes[from];
          // Pick a nearby node as the next hop (keeps traffic on the mesh).
          let best = -1;
          let bestD = LINK_DIST_SQ;
          for (let i = 0; i < nodes.length; i++) {
            if (i === from) continue;
            const dx = nodes[i].x - fn.x;
            const dy = nodes[i].y - fn.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD && Math.random() < 0.3) {
              bestD = d2;
              best = i;
            }
          }
          if (best === -1) {
            // Dead end → respawn elsewhere.
            p.a = p.b = (Math.random() * nodes.length) | 0;
          } else {
            p.a = from;
            p.b = best;
          }
          p.t = 0;
          p.speed = 0.35 + Math.random() * 0.5;
        }
      }
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      // ── Rebuild spatial hash ──────────────────────────────────────────────
      for (const b of grid) b.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const cx = Math.min(cols - 1, Math.max(0, (n.x / cell) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (n.y / cell) | 0));
        grid[cy * cols + cx].push(i);
      }

      // ── Edges (proximity links) ───────────────────────────────────────────
      ctx.lineWidth = 0.7;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const bucket = grid[cy * cols + cx];
          if (!bucket.length) continue;
          // Test this bucket against itself + the 4 forward neighbours only,
          // so each pair is considered exactly once.
          for (let ny = cy; ny <= cy + 1 && ny < rows; ny++) {
            for (let nx = cx - 1; nx <= cx + 1 && nx < cols; nx++) {
              if (nx < 0) continue;
              if (ny === cy && nx < cx) continue;
              const other = grid[ny * cols + nx];
              for (const i of bucket) {
                for (const j of other) {
                  if (j <= i) continue;
                  const a = nodes[i];
                  const b = nodes[j];
                  const dx = a.x - b.x;
                  const dy = a.y - b.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 >= LINK_DIST_SQ) continue;
                  const closeness = 1 - Math.sqrt(d2) / LINK_DIST;
                  // Per-edge flicker → connections fade/brighten over time.
                  const flick =
                    0.6 + 0.4 * Math.sin(fs.time * 1.5 + (i + j));
                  const alpha = closeness * 0.22 * flick * fs.glow;
                  if (alpha < 0.012) continue;
                  ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y + offsetY);
                  ctx.lineTo(b.x, b.y + offsetY);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // ── Nodes (additive glow) ─────────────────────────────────────────────
      ctx.globalCompositeOperation = "lighter";
      for (const n of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(n.flick);
        drawGlow(
          ctx,
          sprites.emerald,
          n.x,
          n.y + offsetY,
          0.09 + pulse * 0.05,
          (0.35 + pulse * 0.3) * fs.glow
        );
      }

      // ── Packets: live traffic with a faint trail ──────────────────────────
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t + offsetY;
        // Trail: a couple of dimmer stamps behind the head.
        for (let k = 0; k < 3; k++) {
          const tt = Math.max(0, p.t - k * 0.05);
          const tx = a.x + (b.x - a.x) * tt;
          const ty = a.y + (b.y - a.y) * tt + offsetY;
          drawGlow(ctx, sprites.lime, tx, ty, 0.07, (0.5 - k * 0.15) * fs.glow);
        }
        drawGlow(ctx, sprites.lime, x, y, 0.11, 0.9 * fs.glow);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    },
  };
}
