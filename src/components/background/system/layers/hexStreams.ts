/**
 * Layer 3 — Hexadecimal Memory Streams.
 *
 * Deliberately NOT Matrix rain. Instead of dense green columns we scatter a
 * sparse field of floating hex tokens (`0x7AFE`, `A3`, `9C`, `E4`) that each
 * fade in, drift upward at their own speed, then fade out and respawn somewhere
 * new. No two share a column; sizes and opacities vary so the field reads as
 * live memory addresses surfacing and dissolving, not falling code.
 */

import type { FrameState, Layer, QualityTier } from "../types";

interface Token {
  x: number;
  y: number;
  vy: number; // upward drift (negative)
  size: number;
  text: string;
  life: number; // 0..1 age
  ttl: number; // total lifetime (s)
  maxAlpha: number;
}

const HEXCHARS = "0123456789ABCDEF";

function randHex(): string {
  const roll = Math.random();
  const len =
    roll < 0.4 ? 2 : roll < 0.8 ? 4 : Math.random() < 0.5 ? 3 : 6;
  let s = Math.random() < 0.55 ? "0x" : "";
  for (let i = 0; i < len; i++)
    s += HEXCHARS[(Math.random() * 16) | 0];
  return s;
}

export function createHexStreamsLayer(): Layer {
  let w = 0;
  let h = 0;
  let tokens: Token[] = [];

  const spawn = (t: Token, initial: boolean) => {
    t.x = Math.random() * w;
    t.y = initial ? Math.random() * h : h + 20 + Math.random() * 40;
    t.vy = -(6 + Math.random() * 16); // px/s upward
    t.size = 9 + Math.random() * 9;
    t.text = randHex();
    t.ttl = 6 + Math.random() * 8;
    t.life = initial ? Math.random() * t.ttl : 0;
    t.maxAlpha = 0.12 + Math.random() * 0.35;
  };

  return {
    id: "hexstreams",
    resize(width, height, q: QualityTier) {
      w = width;
      h = height;
      const count = Math.round(
        Math.max(10, Math.min(46, (width * height) / 42000)) * q.density
      );
      tokens = Array.from({ length: count }, () => {
        const t = {} as Token;
        spawn(t, true);
        return t;
      });
    },
    update(fs: FrameState) {
      for (const t of tokens) {
        t.y += t.vy * fs.dt;
        t.life += fs.dt;
        if (t.life >= t.ttl || t.y < -30) spawn(t, false);
      }
    },
    draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const t of tokens) {
        // Triangular fade: ramp in over first 20%, hold, ramp out last 30%.
        const p = t.life / t.ttl;
        const fade =
          p < 0.2 ? p / 0.2 : p > 0.7 ? Math.max(0, (1 - p) / 0.3) : 1;
        const alpha = t.maxAlpha * fade * fs.glow;
        if (alpha <= 0.01) continue;
        ctx.font = `${t.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(0,255,136,${alpha})`;
        ctx.fillText(t.text, t.x, t.y + offsetY);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    },
  };
}
