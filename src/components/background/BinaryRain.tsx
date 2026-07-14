import { useEffect, useRef } from "react";

/**
 * Sparse, elegant vertical binary rain (0/1) with occasional hex/address
 * strings. Canvas-based and deliberately low-density — NOT dense Matrix style —
 * so text stays readable and the frame budget stays small.
 */
export default function BinaryRain() {
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

    interface Column {
      x: number;
      y: number;
      speed: number;
      fontSize: number;
      chars: string[];
      hex: boolean;
    }

    let columns: Column[] = [];

    const HEX = "0123456789ABCDEF";
    const randHex = (len: number) =>
      "0x" +
      Array.from({ length: len }, () =>
        HEX[Math.floor(Math.random() * HEX.length)]
      ).join("");

    const build = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sparse: roughly one column every ~70px.
      const count = Math.max(6, Math.floor(width / 70));
      columns = Array.from({ length: count }, () => {
        const fontSize = 12 + Math.random() * 6;
        const hex = Math.random() < 0.18;
        const length = hex ? 1 : 8 + Math.floor(Math.random() * 14);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 0.25 + Math.random() * 0.7,
          fontSize,
          hex,
          chars: hex
            ? [randHex(4 + Math.floor(Math.random() * 4))]
            : Array.from({ length }, () => (Math.random() < 0.5 ? "0" : "1")),
        };
      });
    };

    build();

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const col of columns) {
        const step = col.fontSize + 4;
        ctx.font = `${col.fontSize}px "JetBrains Mono", monospace`;

        col.chars.forEach((ch, i) => {
          const cy = col.y - i * step;
          if (cy < -step || cy > height + step) return;
          // Head is brightest, trail fades out.
          const fade = 1 - i / col.chars.length;
          const alpha = col.hex ? 0.22 : 0.06 + fade * 0.5;
          ctx.fillStyle =
            i === 0 && !col.hex
              ? `rgba(124, 255, 79, ${0.7 * fade + 0.25})`
              : `rgba(0, 255, 136, ${alpha})`;
          ctx.fillText(ch, col.x, cy);
        });

        col.y += col.speed;

        // Recycle column once it fully leaves the bottom.
        const total = col.chars.length * (col.fontSize + 4);
        if (col.y - total > height) {
          col.y = -Math.random() * 200;
          col.x = Math.random() * width;
          col.speed = 0.25 + Math.random() * 0.7;
          if (col.hex) col.chars = [randHex(4 + Math.floor(Math.random() * 4))];
        }
      }

      raf = requestAnimationFrame(draw);
    };

    if (prefersReduced) {
      draw(); // single static frame
      cancelAnimationFrame(raf);
    } else {
      draw();
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      build();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
