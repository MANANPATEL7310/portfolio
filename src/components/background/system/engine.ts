/**
 * The engine — one requestAnimationFrame loop that drives the entire ambient
 * background as a single coordinated system.
 *
 * Responsibilities:
 *  • Own the shared {@link FrameState} (clock, pointer, scroll, breath, quality).
 *  • Update + draw every registered {@link Layer}, back-to-front, applying each
 *    layer's parallax translation (Layer 13) from a central factor table.
 *  • Modulate a global "breath" (Layer 10) so the whole scene imperceptibly
 *    pulses as one machine.
 *  • Fire rare, background-only micro-glitches (Layer 14) that never touch UI.
 *  • Cooperate with the FPS governor and pause when the tab is hidden.
 *
 * The React wrapper (`SystemBackground.tsx`) owns sizing/DPR and lifecycle; the
 * engine is framework-agnostic and testable in isolation.
 */

import type { FrameState, Layer, QualityTier } from "./types";
import { InputState } from "./input";
import { FpsGovernor } from "./quality";

/**
 * Per-layer parallax factors (fraction of scroll the layer shifts by). Deeper /
 * more atmospheric layers move least; foreground detail moves most, creating
 * cinematic depth. Values follow the design brief.
 */
const PARALLAX: Record<string, number> = {
  fog: 0.05,
  aicore: 0.08,
  particles: 0.1,
  hexstreams: 0.12,
  binary: 0.14,
  grid: 0.15,
  neural: 0.2,
  ripples: 0, // ripples are screen-anchored to the click point
};

export class Engine {
  private raf = 0;
  private running = false;
  private lastT = 0;
  private accumTime = 0;

  private readonly input = new InputState();
  private readonly governor: FpsGovernor;

  private width = 0;
  private height = 0;

  // Micro-glitch (Layer 14) scheduling + active window.
  private nextGlitchIn = 20 + Math.random() * 20; // seconds
  private glitchFrames = 0;

  private fs: FrameState;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private layers: Layer[],
    private tier: QualityTier,
    private reducedMotion: boolean
  ) {
    this.governor = new FpsGovernor(tier);
    this.fs = {
      time: 0,
      dt: 0,
      width: 0,
      height: 0,
      scrollY: 0,
      pointer: this.input.pointer,
      ripples: this.input.ripples,
      glow: 1,
      quality: tier,
      reducedMotion,
    };
  }

  /** Called by the wrapper on mount and on every resize (already DPR-scaled). */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.fs.width = width;
    this.fs.height = height;
    for (const l of this.layers) l.resize?.(width, height, this.tier);
  }

  start() {
    if (this.running) return;
    this.input.start();
    this.running = true;

    if (this.reducedMotion) {
      // Draw exactly one calm, motionless frame and stop. No RAF, no CPU.
      this.fs.time = 0;
      this.fs.dt = 0;
      this.fs.glow = 1;
      this.renderStatic();
      return;
    }

    this.lastT = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.input.stop();
  }

  /** Pause/resume for tab-visibility changes (no work while hidden). */
  setPaused(paused: boolean) {
    if (this.reducedMotion) return;
    if (paused) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else if (this.running && !this.raf) {
      this.lastT = performance.now(); // avoid a huge dt after the gap
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    const frameMs = now - this.lastT;
    this.lastT = now;

    // Clamp dt so a background tab / breakpoint can't teleport the sim.
    const dt = Math.min(0.05, frameMs / 1000);
    this.accumTime += dt;

    // Live density adaptation → re-derive layer counts when it shifts.
    if (this.governor.sample(frameMs)) {
      for (const l of this.layers) l.resize?.(this.width, this.height, this.tier);
    }

    this.input.tick(dt);

    // Breath (Layer 10): ~[0.975, 1.0], full cycle ~45s.
    const breath = 1 - 0.0125 * (1 - Math.cos(this.accumTime * 0.14));

    this.fs.time = this.accumTime;
    this.fs.dt = dt;
    this.fs.scrollY = this.input.scrollY;
    this.fs.glow = breath;

    this.render();

    // Micro-glitch scheduling (Layer 14) — background canvas only.
    if (this.tier.glitch) {
      if (this.glitchFrames > 0) {
        this.glitchFrames--;
      } else {
        this.nextGlitchIn -= dt;
        if (this.nextGlitchIn <= 0) {
          this.glitchFrames = 1 + (Math.random() < 0.5 ? 1 : 0); // 1–2 frames
          this.nextGlitchIn = 20 + Math.random() * 20;
        }
      }
    }

    if (this.running) this.raf = requestAnimationFrame(this.frame);
  };

  /** Full animated render pass. */
  private render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);

    for (const l of this.layers) {
      const factor = PARALLAX[l.id] ?? 0;
      const offsetY = -this.fs.scrollY * factor;
      l.update?.(this.fs);
      // Reset shared draw state between layers so one can't leak into the next.
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      l.draw(ctx, this.fs, offsetY);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Rare 1–2 frame background glitch: a couple of thin horizontal slices are
    // re-stamped with a small x-offset + channel tint. Purely on the canvas —
    // it can never affect text, cards, or any DOM UI.
    if (this.glitchFrames > 0) this.applyGlitch();
  }

  /** One motionless frame for prefers-reduced-motion. */
  private renderStatic() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
    for (const l of this.layers) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      l.draw(ctx, this.fs, 0);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  private applyGlitch() {
    const { ctx, width, height } = this;
    const slices = 2;
    for (let i = 0; i < slices; i++) {
      const sy = Math.random() * height;
      const sh = 2 + Math.random() * 6;
      const dx = (Math.random() - 0.5) * 8;
      // Copy a slice and re-stamp it offset with an additive cyan tint so the
      // displacement reads as a chromatic tear rather than a black gap.
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.5;
      ctx.drawImage(ctx.canvas, 0, sy, width, sh, dx, sy, width, sh);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }
}
