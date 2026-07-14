import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view and returns its id.
 * Drives the active nav-link highlight (scroll-spy behavior).
 *
 * The active section is the one crossing a reference line partway down the
 * viewport (not just under the navbar). Sections carry large top padding, so a
 * near-top line would flip to the next section while its *content* is still
 * off-screen — reading as "one step ahead". A line at ~42% of the viewport
 * height flips only once the incoming section actually dominates the screen, so
 * the highlight stays in sync with what you're looking at.
 *
 * @param sectionIds  ordered list of section element ids (without the leading #)
 * @param lineRatio   fraction of viewport height for the reference line (0..1)
 */
export function useScrollSpy(sectionIds: string[], lineRatio = 0.42): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handler = () => {
      // Reference line partway down the viewport, in document coordinates.
      const line = window.scrollY + window.innerHeight * lineRatio;

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
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
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
  }, [sectionIds, lineRatio]);

  return activeId;
}
