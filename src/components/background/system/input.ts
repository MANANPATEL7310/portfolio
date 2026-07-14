/**
 * Shared input state for the whole background system.
 *
 * Every interactive layer (particles bending toward the cursor, the security
 * grid lighting up, click ripples) reads from ONE pointer/scroll source instead
 * of each attaching its own listeners. All listeners are `passive` so they can
 * never delay scrolling or interaction — a hard requirement of the brief.
 */

import type { Pointer, Ripple } from "./types";

export class InputState {
  readonly pointer: Pointer = { x: -9999, y: -9999, active: false, speed: 0 };
  readonly ripples: Ripple[] = [];
  scrollY = 0;

  private lastX = -9999;
  private lastY = -9999;
  private cleanup: (() => void) | null = null;

  /** Attach passive window/document listeners. Returns nothing; call stop(). */
  start() {
    const onMove = (e: PointerEvent) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
    };
    const onLeave = () => {
      this.pointer.active = false;
      this.pointer.x = -9999;
      this.pointer.y = -9999;
      this.pointer.speed = 0;
    };
    const onScroll = () => {
      this.scrollY = window.scrollY || window.pageYOffset || 0;
    };
    const onClick = (e: PointerEvent) => {
      // Cap concurrent ripples so a click-storm can't balloon the array.
      if (this.ripples.length < 6) {
        this.ripples.push({ x: e.clientX, y: e.clientY, life: 1 });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    document.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    this.cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }

  /**
   * Per-frame bookkeeping: smooth pointer speed and age out dead ripples.
   * Called by the engine once per tick before layers update.
   */
  tick(dt: number) {
    if (this.pointer.active && this.lastX > -9000) {
      const dx = this.pointer.x - this.lastX;
      const dy = this.pointer.y - this.lastY;
      const inst = Math.hypot(dx, dy);
      // Exponential smoothing so energy cues ease rather than jitter.
      this.pointer.speed += (inst - this.pointer.speed) * 0.2;
    } else {
      this.pointer.speed *= 0.9;
    }
    this.lastX = this.pointer.x;
    this.lastY = this.pointer.y;

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      // ~1.1s lifetime; dt-scaled so it's frame-rate independent.
      this.ripples[i].life -= dt * 0.9;
      if (this.ripples[i].life <= 0) this.ripples.splice(i, 1);
    }
  }

  stop() {
    this.cleanup?.();
    this.cleanup = null;
  }
}
