import { useEffect, useRef } from "react";

/**
 * Animated network of glowing nodes connected by lines, with pulsing "data
 * packets" traveling along the connections. Nodes drift slowly and subtly
 * respond to cursor movement. Canvas-based for a low DOM footprint.
 */
export default function NetworkNodes() {
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
    interface Packet {
      a: number; // from node index
      b: number; // to node index
      t: number; // 0..1 position along edge
      speed: number;
    }

    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const LINK_DIST = 170;

    const build = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        14,
        Math.min(42, Math.floor((width * height) / 42000))
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.2 + Math.random() * 1.8,
      }));

      packets = Array.from({ length: Math.floor(count / 3) }, () => ({
        a: Math.floor(Math.random() * count),
        b: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.01,
      }));
    };

    build();

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Move + draw nodes.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Gentle cursor attraction.
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 180 * 180) {
          const f = 0.00006;
          n.vx += dx * f;
          n.vy += dy * f;
        }

        // Damping + soft speed cap.
        n.vx = Math.max(-0.4, Math.min(0.4, n.vx * 0.995));
        n.vy = Math.max(-0.4, Math.min(0.4, n.vy * 0.995));

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 136, 0.55)";
        ctx.fill();
      }

      // Draw links.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.16;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Move + draw packets.
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) {
          p.a = Math.floor(Math.random() * nodes.length);
          p.b = Math.floor(Math.random() * nodes.length);
          continue;
        }
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.a = Math.floor(Math.random() * nodes.length);
          p.b = Math.floor(Math.random() * nodes.length);
          continue;
        }
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
        glow.addColorStop(0, "rgba(124, 255, 79, 0.9)");
        glow.addColorStop(1, "rgba(124, 255, 79, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    if (prefersReduced) cancelAnimationFrame(raf);

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      build();
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
