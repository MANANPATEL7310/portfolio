import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only custom cursor: a neon dot inside a trailing ring. Over
 * interactive elements both fade out and the native hand pointer takes over.
 * Never shown on touch/coarse pointers or under prefers-reduced-motion —
 * the OS cursor stays.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    // Target position (mouse) and eased ring position.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let raf = 0;

    const interactiveSel =
      'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const interactive = (e.target as HTMLElement)?.closest?.(interactiveSel);
      setHovering(Boolean(interactive));
    };

    const tick = () => {
      // Lag the ring toward the dot for a spring-like trail.
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {/* Center dot — fades out over interactive elements where the
          native hand pointer takes over as the precise pointer */}
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-neon-green transition-opacity duration-150 ${
          hovering ? "!opacity-0" : ""
        }`}
        style={{ boxShadow: "0 0 8px rgba(0,255,136,0.8)" }}
      />
      {/* Ring — hidden over interactive elements (hand pointer only) */}
      <div ref={ringRef} className="fixed left-0 top-0 h-[26px] w-[26px]">
        <div
          className={`h-full w-full rounded-full border border-neon-green/50 transition-opacity duration-150 ${
            hovering ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}
