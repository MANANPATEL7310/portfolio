/**
 * Pre-baked glow sprites.
 *
 * Drawing a soft radial glow per particle with `ctx.shadowBlur` is one of the
 * most expensive things you can do in Canvas2D — it re-blurs on every fill. We
 * pay that cost exactly ONCE by rendering a radial-gradient disc into a small
 * offscreen canvas, then stamp it thousands of times per frame with a cheap
 * `drawImage` under `globalCompositeOperation = "lighter"` (additive blending,
 * which is how real light accumulates). This is the single most important
 * performance decision in the whole engine.
 */

export interface GlowSprite {
  canvas: HTMLCanvasElement;
  /** Half-size in CSS px; the sprite is 2*radius square. */
  radius: number;
}

/**
 * Build a soft circular glow whose colour is `r,g,b`. The gradient falls off
 * smoothly to fully transparent at the edge so overlapping stamps blend without
 * hard seams.
 */
export function makeGlowSprite(
  r: number,
  g: number,
  b: number,
  radius = 32,
  coreAlpha = 1
): GlowSprite {
  const size = radius * 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(
    radius,
    radius,
    0,
    radius,
    radius,
    radius
  );
  grad.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},${coreAlpha * 0.55})`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},${coreAlpha * 0.12})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return { canvas, radius };
}

/**
 * Stamp a glow sprite centred at (x, y), scaled and alpha-faded. Caller is
 * responsible for setting `globalCompositeOperation = "lighter"` around batches
 * for correct additive light accumulation.
 */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  sprite: GlowSprite,
  x: number,
  y: number,
  scale: number,
  alpha: number
): void {
  const s = sprite.radius * 2 * scale;
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite.canvas, x - s / 2, y - s / 2, s, s);
}

/** The engine's shared palette, matching the project's design tokens. */
export const PALETTE = {
  emerald: [0, 255, 136] as const, // --accent-primary  #00FF88
  lime: [124, 255, 79] as const, //   --accent-secondary #7CFF4F
  cyan: [0, 229, 255] as const, //    --accent-tertiary  #00E5FF
};

/**
 * Lazily-created shared sprites. Created on first engine mount so we never pay
 * the cost on the server / before the canvas exists.
 */
let shared: {
  emerald: GlowSprite;
  cyan: GlowSprite;
  lime: GlowSprite;
} | null = null;

export function getSharedSprites() {
  if (!shared) {
    shared = {
      emerald: makeGlowSprite(...PALETTE.emerald, 32),
      cyan: makeGlowSprite(...PALETTE.cyan, 32),
      lime: makeGlowSprite(...PALETTE.lime, 32),
    };
  }
  return shared;
}
