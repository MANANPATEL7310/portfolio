import { useCallback, useRef } from "react";

/**
 * Subtle cursor-based 3D tilt for cards. Returns a ref to attach to the element
 * plus mouse handlers. The card rotates toward the cursor (max ~4deg) and
 * exposes the pointer position as CSS custom properties (`--mx`, `--my`) so a
 * glass highlight can follow the cursor. Disabled under reduced-motion and on
 * coarse pointers.
 */
export function useTilt(max = 4) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef<number>(0);

  const enabled = useRef<boolean | null>(null);
  const isEnabled = () => {
    if (enabled.current === null) {
      const fine = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      enabled.current = fine && !reduced;
    }
    return enabled.current;
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !isEnabled()) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const rotateY = (px - 0.5) * 2 * max;
      const rotateX = -(py - 0.5) * 2 * max;

      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    },
    [max]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
