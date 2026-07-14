import { useEffect, useRef } from "react";

/**
 * Slow-drifting floating particles with a faint parallax response to the
 * cursor. Deliberately sparse and low-opacity to add depth without noise.
 */
export default function ParticleField() {
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
    const parallax = { x: 0, y: 0 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      depth: number; // 0.3..1, controls parallax strength + opacity
      hue: string;
    }

    let particles: Particle[] = [];

    const build = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        18,
        Math.min(60, Math.floor((width * height) / 34000))
      );
      particles = Array.from({ length: count }, () => {
        const depth = 0.3 + Math.random() * 0.7;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(0.05 + Math.random() * 0.18),
          r: 0.6 + depth * 1.6,
          depth,
          hue: Math.random() < 0.25 ? "0, 229, 255" : "0, 255, 136",
        };
      });
    };

    build();

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const px = p.x + parallax.x * p.depth * 18;
        const py = p.y + parallax.y * p.depth * 18;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, ${0.12 + p.depth * 0.35})`;
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
      parallax.x = (e.clientX / window.innerWidth - 0.5) * 2;
      parallax.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
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
