import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_BEAM_EVENT, type NavBeamDetail } from "../lib/navBeam";

/**
 * Renders the navbar → section "light beam" navigation flourish. Mounted once in
 * App; listens for {@link NAV_BEAM_EVENT} dispatched by nav clicks.
 *
 * Sequence per click:
 *   1. A thin emerald beam launches from the clicked nav item.
 *   2. It streaks across the viewport toward the target section's near edge
 *      (approaching from whichever horizontal side is shorter), ~380ms with a
 *      motion-blurred trail.
 *   3. On impact a spark flashes at the collision point.
 *   4. The target section's border pulses a glow that settles back to rest
 *      (~750ms), drawing the eye to exactly where the user landed.
 *
 * Scroll-to-section is handled independently by the Navbar (concurrent), so the
 * beam rides along with the scroll rather than blocking it.
 *
 * prefers-reduced-motion: no traveling beam — just a single instant border
 * highlight flash on the target section.
 */

interface Beam {
  id: number;
  ox: number;
  oy: number;
  angle: number; // degrees
  length: number;
  impactX: number;
  impactY: number;
  targetId: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
}

const TRAIL = 150; // px length of the streak's motion-blurred tail

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
  const [beams, setBeams] = useState<Beam[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onBeam = (e: Event) => {
      const { x, y, targetId } = (e as CustomEvent<NavBeamDetail>).detail;
      const target = document.getElementById(targetId);

      // Reduced motion → skip the beam, just flash the border instantly.
      if (reduced.matches || !target) {
        glowSection(targetId, "section-flash", 450);
        return;
      }

      const rect = target.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2;
      const fromLeft = x <= centerX;
      const impactX = fromLeft
        ? Math.max(rect.left + 16, 12)
        : Math.min(rect.right - 16, window.innerWidth - 12);
      // Land near where the section settles under the fixed navbar; clamp so a
      // far-below target still gets a sensible on-screen impact point.
      const impactY = Math.min(
        Math.max(rect.top + 16, 104),
        window.innerHeight * 0.55
      );

      const dx = impactX - x;
      const dy = impactY - y;
      const length = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      const id = ++idRef.current;
      setBeams((prev) => [
        ...prev,
        { id, ox: x, oy: y, angle, length, impactX, impactY, targetId },
      ]);
    };

    window.addEventListener(NAV_BEAM_EVENT, onBeam);
    return () => window.removeEventListener(NAV_BEAM_EVENT, onBeam);
  }, []);

  const onBeamDone = (b: Beam) => {
    // Remove the beam, flash a spark at impact, and pulse the section border.
    setBeams((prev) => prev.filter((x) => x.id !== b.id));
    setSparks((prev) => [...prev, { id: b.id, x: b.impactX, y: b.impactY }]);
    glowSection(b.targetId, "section-landing", 800);
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {beams.map((b) => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: b.ox,
              top: b.oy,
              width: b.length,
              height: 0,
              transform: `rotate(${b.angle}deg)`,
              transformOrigin: "0 0",
            }}
          >
            {/* The streak: a bright head trailing a fading tail. Starts with its
                head at the origin (x:0) and travels to the impact (x:length). */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: b.length, opacity: [0, 1, 1, 0.9] }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={() => onBeamDone(b)}
              style={{
                position: "absolute",
                left: -TRAIL,
                top: -1.5,
                width: TRAIL,
                height: 3,
                borderRadius: 3,
                background:
                  "linear-gradient(90deg, rgba(0,255,136,0) 0%, rgba(0,255,136,0.35) 55%, rgba(124,255,79,0.95) 92%, #eafff2 100%)",
                filter: "blur(0.6px)",
                boxShadow:
                  "0 0 10px rgba(0,255,136,0.8), 0 0 20px rgba(0,255,136,0.45)",
              }}
            >
              {/* Bright projectile head at the leading edge. */}
              <span
                style={{
                  position: "absolute",
                  right: -2,
                  top: "50%",
                  width: 7,
                  height: 7,
                  marginTop: -3.5,
                  borderRadius: "9999px",
                  background: "#eafff2",
                  boxShadow:
                    "0 0 10px 2px rgba(124,255,79,0.9), 0 0 20px 6px rgba(0,255,136,0.6)",
                }}
              />
            </motion.div>
          </div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0.3, opacity: 0.95 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onAnimationComplete={() =>
              setSparks((prev) => prev.filter((x) => x.id !== s.id))
            }
            style={{
              position: "absolute",
              left: s.x - 24,
              top: s.y - 24,
              width: 48,
              height: 48,
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(234,255,242,0.95) 0%, rgba(124,255,79,0.7) 30%, rgba(0,255,136,0.25) 55%, rgba(0,255,136,0) 72%)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
