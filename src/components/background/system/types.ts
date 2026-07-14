/**
 * Shared contracts for the unified "AI Cyber-Defense OS" background engine.
 *
 * The whole ambient system runs on ONE requestAnimationFrame loop (see
 * `engine.ts`). Every visual layer implements the tiny {@link Layer} interface
 * and receives the same immutable-per-frame {@link FrameState}. This is what
 * makes the layers feel like one coordinated organism rather than a stack of
 * unrelated effects — they all read the same clock, pointer, scroll and
 * ambient "breath" values.
 */

/** Live pointer state, shared by every interactive layer. */
export interface Pointer {
  /** CSS-pixel position, or a large negative sentinel when the pointer left. */
  x: number;
  y: number;
  /** True while the pointer is actually over the document. */
  active: boolean;
  /** Smoothed velocity magnitude (px/frame) — used for subtle energy cues. */
  speed: number;
}

/** An expanding energy ring spawned on click (Layer 6). */
export interface Ripple {
  x: number;
  y: number;
  /** 0..1 life; 1 = just born, 0 = dead. */
  life: number;
}

/**
 * Everything a layer needs to update + draw a single frame. Recomputed by the
 * engine each tick; layers must treat it as read-only.
 */
export interface FrameState {
  /** Total elapsed seconds since engine start (monotonic, pause-aware). */
  time: number;
  /** Delta seconds since previous frame, clamped to avoid post-pause jumps. */
  dt: number;
  /** Logical viewport size in CSS pixels (already DPR-normalised in ctx). */
  width: number;
  height: number;
  /** Current window scrollY — the source of all parallax. */
  scrollY: number;
  pointer: Pointer;
  /** Active click ripples (shared so multiple layers can react). */
  ripples: Ripple[];
  /**
   * Ambient "breath": a value oscillating ~[0.98, 1.00] over 30–60s. Layers
   * multiply their alpha by this so the entire scene imperceptibly breathes as
   * one machine (Layer 10).
   */
  glow: number;
  /** Runtime quality knobs; may be downshifted live by the FPS governor. */
  quality: QualityTier;
  /** True only for the single static frame drawn under reduced motion. */
  reducedMotion: boolean;
}

/** A composable visual layer. Ordered by the engine; drawn back-to-front. */
export interface Layer {
  /** Stable id (also used to look up its parallax factor). */
  readonly id: string;
  /** Per-viewport (re)initialisation — called on mount and every resize. */
  resize?(width: number, height: number, q: QualityTier): void;
  /** Advance simulation. Skipped on the reduced-motion static frame. */
  update?(fs: FrameState): void;
  /** Paint. `offsetY` is this layer's pre-computed parallax translation. */
  draw(ctx: CanvasRenderingContext2D, fs: FrameState, offsetY: number): void;
}

/**
 * Device-derived density budget. Produced once by {@link detectTier} and then
 * nudged down/up at runtime by the FPS governor. Higher = richer scene.
 */
export interface QualityTier {
  /** Human label, handy for debugging. */
  name: "mobile" | "low" | "medium" | "high";
  /** Global density scalar in (0, 1]; the governor scales this live. */
  density: number;
  /** Max device-pixel-ratio the canvas backing store is allowed to use. */
  dprCap: number;
  /** Whether the faint AI-core sphere renders (off on weak devices). */
  aiCore: boolean;
  /** Whether procedural fog renders. */
  fog: boolean;
  /** Whether rare background micro-glitches fire. */
  glitch: boolean;
}
