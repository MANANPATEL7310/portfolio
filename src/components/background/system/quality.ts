/**
 * Adaptive quality: pick a starting density budget from the device, then keep
 * the frame rate honest at runtime.
 *
 * Two mechanisms:
 *  1. {@link detectTier} — a one-time read of hardware hints (cores, memory,
 *     pointer coarseness, screen size) to choose a sane initial tier.
 *  2. {@link FpsGovernor} — a rolling frame-time monitor that nudges the live
 *     `density` scalar DOWN when we sustain <~45fps and gently back UP when we
 *     have headroom. Layers scale their counts by `density`, so the whole scene
 *     thins out under load instead of dropping frames.
 */

import type { QualityTier } from "./types";

export function detectTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 720;
  const dpr = window.devicePixelRatio || 1;

  // Phones / tablets: keep it lean regardless of reported cores.
  if (coarse || smallScreen) {
    return {
      name: "mobile",
      density: 0.5,
      dprCap: Math.min(dpr, 1.5),
      aiCore: cores >= 6 && mem >= 4,
      fog: true,
      glitch: false,
    };
  }
  if (cores <= 4 || mem <= 4) {
    return {
      name: "low",
      density: 0.7,
      dprCap: Math.min(dpr, 2),
      aiCore: true,
      fog: true,
      glitch: true,
    };
  }
  if (cores <= 8) {
    return {
      name: "medium",
      density: 0.85,
      dprCap: Math.min(dpr, 2),
      aiCore: true,
      fog: true,
      glitch: true,
    };
  }
  return {
    name: "high",
    density: 1,
    dprCap: Math.min(dpr, 2),
    aiCore: true,
    fog: true,
    glitch: true,
  };
}

/**
 * Watches frame times and mutates `tier.density` in place. Returns true from
 * {@link sample} when the density changed enough that layers should re-derive
 * their counts (the engine forwards that as a soft "resize").
 */
export class FpsGovernor {
  private avg = 16.7; // ms/frame, seeded at 60fps
  private cooldown = 0; // frames to wait between adjustments
  private readonly floor: number;

  constructor(private tier: QualityTier) {
    // Never thin the scene below half its tier's starting density.
    this.floor = Math.max(0.25, tier.density * 0.5);
  }

  sample(frameMs: number): boolean {
    // Ignore absurd spikes (tab refocus, GC) so one hitch can't cascade.
    if (frameMs > 500) return false;
    this.avg += (frameMs - this.avg) * 0.05;

    if (this.cooldown > 0) {
      this.cooldown--;
      return false;
    }

    const prev = this.tier.density;
    if (this.avg > 22 && this.tier.density > this.floor) {
      // Sustained < ~45fps → shed 15% of density.
      this.tier.density = Math.max(this.floor, this.tier.density - 0.15);
      this.cooldown = 90; // ~1.5s before reassessing
    } else if (this.avg < 15 && this.tier.density < 1) {
      // Comfortable headroom (>66fps) → creep back up slowly.
      this.tier.density = Math.min(1, this.tier.density + 0.05);
      this.cooldown = 180; // recover cautiously
    }
    return this.tier.density !== prev;
  }
}
