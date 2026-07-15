import { useEffect, useRef } from "react";
import { Engine } from "./engine";
import { detectTier } from "./quality";
import type { Layer } from "./types";
import { createFogLayer } from "./layers/fog";
import { createHexStreamsLayer } from "./layers/hexStreams";
import { createBinaryStreamsLayer } from "./layers/binaryStreams";
import { createNeuralNetworkLayer } from "./layers/neuralNetwork";
import { createSecurityGridLayer } from "./layers/securityGrid";
import { createParticlesLayer } from "./layers/particles";
import { createAiCoreLayer } from "./layers/aiCore";
import { createRipplesLayer } from "./layers/ripples";

/**
 * SystemBackground — the single React surface for the entire unified ambient
 * engine. It owns exactly one <canvas> and all of its lifecycle:
 *   • sizing + DPR-capped backing store (re-applied on resize),
 *   • constructing the ordered layer stack and the Engine,
 *   • pausing the RAF loop when the tab is hidden,
 *   • honouring prefers-reduced-motion (one static, calm frame).
 *
 * Every heavy procedural layer from the brief (fog, hex streams, neural net,
 * security grid, particle field, AI core, click ripples) is composed
 * here into that one loop, back-to-front. The remaining layers (depth gradient,
 * grain, scanlines, UI glitch, floating labels) are cheaper DOM/CSS siblings
 * handled elsewhere in the tree.
 *
 * The canvas is non-interactive (`pointer-events: none`) and aria-hidden — it is
 * pure atmosphere and never blocks scrolling or interaction.
 */
export default function SystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tier = detectTier();

    // Layer order = paint order (back → front). Depth reads correctly because
    // atmosphere sits behind structure sits behind traffic sits behind FX.
    const layers: Layer[] = [
      createFogLayer(), // L2
      createAiCoreLayer(), // L11 (faint, deep centre)
      createParticlesLayer(), // L12 + cursor bend
      createHexStreamsLayer(), // L3 (drift up)
      createBinaryStreamsLayer(), // sparse 0/1 columns (fall down)
      createSecurityGridLayer(), // L5 (cursor grid)
      createNeuralNetworkLayer(), // L4 + L8
      createRipplesLayer(), // L6 clicks
    ];

    const engine = new Engine(ctx, layers, tier, reducedMotion);

    // ── Sizing ────────────────────────────────────────────────────────────
    let cssW = 0;
    let cssH = 0;
    const applySize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, tier.dprCap);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      // Draw in CSS-pixel space; the backing store handles DPR.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.resize(cssW, cssH);
    };
    applySize();
    engine.start();

    // Debounce resize so drag-resizing doesn't thrash layer rebuilds.
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applySize, 150);
    };
    const onVisibility = () => engine.setPaused(document.hidden);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      engine.stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
