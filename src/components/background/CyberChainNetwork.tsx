import { useEffect, useRef } from "react";

/**
 * "Cyber chain network" — the single node-graph ambient layer (replaces the old
 * floating ParticleField AND the generic NetworkNodes, so only one graph effect
 * competes for attention).
 *
 * Nodes drift slowly and are wired into a handful of *chains*: ordered polylines
 * where node → link → node → link forms an irregular chain path across the
 * screen, evoking the "digital chain-link" motif from cyber-thriller UIs.
 *
 * Behaviors, all deliberately sparse + slow so the layer stays cinematic:
 *  • Chains occasionally BREAK — one link fractures with a brief glitch/spark
 *    flash, the two halves drift apart, then the link re-forms a few seconds
 *    later. Breaks fire rarely and asynchronously (never all at once).
 *  • Binary digits (0/1) travel ALONG the chain links like data packets flowing
 *    through the connections. A packet halts at a broken link (data can't cross
 *    the gap) until it re-forms. This is *in addition* to the independent
 *    <BinaryRain /> margin rain — here the bits ride the wires.
 *
 * Canvas-based for a low DOM footprint. Under prefers-reduced-motion it renders
 * a single static frame with no motion, breaks, or packets.
 */
export default function CyberChainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }
    /** A link is one segment between two consecutive nodes of a chain. */
    interface Link {
      a: number; // node index (chain start side)
      b: number; // node index (chain end side)
      broken: boolean;
      /** Countdown (frames) until the current broken/whole state flips back. */
      timer: number;
      /** Spark flash intensity at the break point, 0..1, decays each frame. */
      spark: number;
    }
    /** A binary bit riding along the chain's links. */
    interface Packet {
      chain: number; // chain index
      seg: number; // index into that chain's link list
      t: number; // 0..1 progress along the current link
      speed: number;
      bit: string; // "0" | "1"
    }

    let nodes: Node[] = [];
    let chains: Link[][] = [];
    let packets: Packet[] = [];
    // Frames until the next break is allowed to spawn (keeps them rare/async).
    let nextBreakIn = 0;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      chains = [];
      packets = [];

      // Low density: a few chains scaled gently to viewport area.
      const chainCount = Math.max(
        3,
        Math.min(7, Math.round((width * height) / 260000))
      );

      for (let c = 0; c < chainCount; c++) {
        const linksInChain = 3 + Math.floor(Math.random() * 4); // 3..6 links
        const start = nodes.length;

        // Seed the chain as a wandering walk so links stay short (chain-like),
        // rather than long straight spans.
        let px = rand(0, width);
        let py = rand(0, height);
        for (let n = 0; n <= linksInChain; n++) {
          nodes.push({
            x: px,
            y: py,
            vx: rand(-0.12, 0.12),
            vy: rand(-0.12, 0.12),
            r: 1.3 + Math.random() * 1.6,
          });
          const ang = rand(0, Math.PI * 2);
          const len = rand(90, 150);
          px = Math.max(20, Math.min(width - 20, px + Math.cos(ang) * len));
          py = Math.max(20, Math.min(height - 20, py + Math.sin(ang) * len));
        }

        const links: Link[] = [];
        for (let i = 0; i < linksInChain; i++) {
          links.push({
            a: start + i,
            b: start + i + 1,
            broken: false,
            timer: 0,
            spark: 0,
          });
        }
        chains.push(links);

        // Roughly one bit in flight per chain.
        packets.push({
          chain: c,
          seg: Math.floor(Math.random() * links.length),
          t: Math.random(),
          speed: rand(0.005, 0.011),
          bit: Math.random() < 0.5 ? "0" : "1",
        });
      }

      nextBreakIn = Math.floor(rand(120, 300));
    };

    build();

    let raf = 0;

    const stepNodes = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Gentle cursor attraction for a hint of interactivity.
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        if (dx * dx + dy * dy < 170 * 170) {
          n.vx += dx * 0.00005;
          n.vy += dy * 0.00005;
        }

        n.vx = Math.max(-0.35, Math.min(0.35, n.vx * 0.996));
        n.vy = Math.max(-0.35, Math.min(0.35, n.vy * 0.996));

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }
    };

    const stepBreaks = () => {
      // Spawn a rare, single break on a random whole link.
      nextBreakIn -= 1;
      if (nextBreakIn <= 0) {
        const c = Math.floor(Math.random() * chains.length);
        const links = chains[c];
        const candidates = links.filter((l) => !l.broken);
        if (candidates.length) {
          const link = candidates[Math.floor(Math.random() * candidates.length)];
          link.broken = true;
          link.spark = 1;
          link.timer = Math.floor(rand(150, 300)); // ~2.5–5s broken
        }
        // Space breaks out so they stay rare and desynchronized.
        nextBreakIn = Math.floor(rand(240, 480));
      }

      // Tick each link's break timer + spark decay.
      for (const links of chains) {
        for (const l of links) {
          if (l.spark > 0) l.spark = Math.max(0, l.spark - 0.045);
          if (l.broken) {
            l.timer -= 1;
            if (l.timer <= 0) {
              // Re-form: reconnect with a fresh spark at the joint.
              l.broken = false;
              l.spark = 1;
            }
          }
        }
      }
    };

    // Endpoints of a broken link pull apart slightly toward their own ends,
    // opening a visible gap where the fracture happened.
    const GAP = 14;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ── Links (the chain wires) ──────────────────────────────────────────
      for (const links of chains) {
        for (const l of links) {
          const a = nodes[l.a];
          const b = nodes[l.b];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;

          if (l.broken) {
            const ux = b.x - a.x;
            const uy = b.y - a.y;
            const len = Math.hypot(ux, uy) || 1;
            const gx = (ux / len) * GAP;
            const gy = (uy / len) * GAP;
            // Two half-segments, each stopping short of the fracture midpoint.
            ctx.strokeStyle = "rgba(0, 229, 255, 0.16)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mx - gx, my - gy);
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(mx + gx, my + gy);
            ctx.stroke();
          } else {
            ctx.strokeStyle = "rgba(0, 229, 255, 0.22)";
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }

          // Spark flash at the fracture / re-form point.
          if (l.spark > 0) {
            const s = l.spark;
            const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 10 * s + 4);
            glow.addColorStop(0, `rgba(124, 255, 79, ${0.9 * s})`);
            glow.addColorStop(0.5, `rgba(0, 255, 136, ${0.4 * s})`);
            glow.addColorStop(1, "rgba(0, 255, 136, 0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mx, my, 10 * s + 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── Nodes (chain joints) ─────────────────────────────────────────────
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 136, 0.6)";
        ctx.fill();
      }

      // ── Packets: binary bits flowing along the links ─────────────────────
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const p of packets) {
        const links = chains[p.chain];
        if (!links) continue;
        const link = links[p.seg];
        const a = nodes[link.a];
        const b = nodes[link.b];

        // A broken link blocks the bit — it waits at the gap until re-formed.
        if (!link.broken) {
          p.t += p.speed;
          if (p.t >= 1) {
            p.t = 0;
            p.seg = (p.seg + 1) % links.length; // keep flowing down the chain
            if (Math.random() < 0.4) p.bit = Math.random() < 0.5 ? "0" : "1";
          }
        }

        const t = link.broken ? Math.min(p.t, 0.45) : p.t;
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;

        ctx.fillStyle = "rgba(124, 255, 79, 0.85)";
        ctx.shadowColor = "rgba(0, 255, 136, 0.9)";
        ctx.shadowBlur = 6;
        ctx.fillText(p.bit, px, py);
        ctx.shadowBlur = 0;
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";

      if (!prefersReduced) {
        stepNodes();
        stepBreaks();
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      build();
      if (prefersReduced) draw();
    };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}
