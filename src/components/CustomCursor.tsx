import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only custom cursor: a small crosshair dot that snaps into a bracket
 * "[ ]" reticle when hovering interactive elements. Uses a lagging spring so the
 * ring trails the dot slightly for a weighty, precise feel. Never shown on
 * touch/coarse pointers or under prefers-reduced-motion — the OS cursor stays.
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
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-neon-green"
        style={{ boxShadow: "0 0 8px rgba(0,255,136,0.8)" }}
      />
      {/* Reticle ring — morphs from a circle to a bracket frame on hover */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 grid place-items-center transition-[width,height,opacity] duration-200 ease-hover"
        style={{
          width: hovering ? 40 : 26,
          height: hovering ? 40 : 26,
        }}
      >
        {hovering ? (
          <CursorBrackets />
        ) : (
          <div className="h-full w-full rounded-full border border-neon-green/50" />
        )}
      </div>
    </div>
  );
}

/** Four corner brackets forming a targeting reticle. */
function CursorBrackets() {
  const corner =
    "absolute h-2.5 w-2.5 border-neon-green transition-all duration-200";
  return (
    <div className="relative h-full w-full">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}
