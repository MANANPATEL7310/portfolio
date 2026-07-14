import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view and returns its id.
 * Drives the active nav-link highlight (scroll-spy behavior).
 *
 * @param sectionIds  ordered list of section element ids (without the leading #)
 * @param offset      px offset from the top to account for the fixed navbar
 */
export function useScrollSpy(sectionIds: string[], offset = 120): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handler = () => {
      const scrollPos = window.scrollY + offset;

      // If we're at the very bottom, force-activate the last section so the
      // final nav link highlights even when the section is short.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [sectionIds, offset]);

  return activeId;
}
