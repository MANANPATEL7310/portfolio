/**
 * Shared contract for the navbar → section "light beam" navigation animation.
 * Navbar dispatches a beam request on click; <NavBeam /> (mounted once in App)
 * listens and renders the traveling beam + landing glow. Decoupled via a window
 * CustomEvent so no provider/prop-drilling is needed.
 */
export const NAV_BEAM_EVENT = "nav:beam";

export interface NavBeamDetail {
  /** Launch origin in viewport coords — the clicked nav item's center. */
  x: number;
  y: number;
  /** Target section element id (without the leading '#'). */
  targetId: string;
}

/** Fire a beam from a clicked element toward a target section. */
export function triggerNavBeam(originEl: Element | null, targetId: string) {
  const rect = originEl?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : 24;
  window.dispatchEvent(
    new CustomEvent<NavBeamDetail>(NAV_BEAM_EVENT, {
      detail: { x, y, targetId },
    })
  );
}
