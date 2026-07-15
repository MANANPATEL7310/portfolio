import { useEffect } from "react";
import { NAV_BEAM_EVENT, type NavBeamDetail } from "../lib/navBeam";

/**
 * Nav → section landing highlight. Mounted once in App; listens for
 * {@link NAV_BEAM_EVENT} dispatched by nav clicks.
 *
 * The traveling "light beam" flourish was removed by design decision — on a nav
 * click the target section's border simply pulses a glow that settles back to
 * rest (~750ms), drawing the eye to exactly where the user landed. Scroll-to-
 * section is handled independently by the Navbar (concurrent).
 *
 * prefers-reduced-motion: a single static border highlight flash instead of the
 * animated pulse.
 */

/** Pulse the section border, then clean the class up. */
function glowSection(targetId: string, cls: string, ms: number) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.classList.remove(cls);
  // Force reflow so re-adding the class restarts the animation on rapid clicks.
  void el.offsetWidth;
  el.classList.add(cls);
  window.setTimeout(() => el.classList.remove(cls), ms);
}

export default function NavBeam() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onBeam = (e: Event) => {
      const { targetId } = (e as CustomEvent<NavBeamDetail>).detail;
      if (reduced.matches) {
        glowSection(targetId, "section-flash", 450);
      } else {
        glowSection(targetId, "section-landing", 800);
      }
    };

    window.addEventListener(NAV_BEAM_EVENT, onBeam);
    return () => window.removeEventListener(NAV_BEAM_EVENT, onBeam);
  }, []);

  return null;
}
