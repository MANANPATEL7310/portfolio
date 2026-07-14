import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Layer 7 — Floating System Labels.
 *
 * Tiny telemetry tags (SSH_ACTIVE, AES256, NODE_014, LATENCY 12ms…) surface at
 * random positions, linger, then fade — as if the OS is narrating its own
 * background processes. Implemented as pooled DOM spans (not canvas) so the mono
 * type stays razor-crisp and each fade is a cheap GPU opacity/transform.
 *
 * A fixed number of "slots" each run an independent show → hold → fade → move
 * cycle, so labels never repeat in an obvious pattern. The whole layer is
 * aria-hidden + pointer-events-none, and disables itself under reduced motion.
 */

const LABELS = [
  "SSH_ACTIVE",
  "TCP_ESTABLISHED",
  "AES256",
  "NODE_014",
  "GPU_CLUSTER",
  "AUTH_SUCCESS",
  "PACKET_2301",
  "AI_CORE",
  "ML_ENGINE",
  "LATENCY 12ms",
  "QUANTUM_SYNC",
  "MEMORY_MAP",
  "ROUTE_08",
  "TLS_HANDSHAKE",
  "KERNEL_OK",
  "SHA_512",
  "0x4A7E",
  "THREAT_IDLE",
  "SYNC 99.7%",
  "CORE_TEMP 41C",
];

interface Slot {
  key: number;
  text: string;
  top: number; // %
  left: number; // %
}

/** How many labels can be visible at once. Kept low so they stay subtle. */
const SLOT_COUNT = 5;

function randomSlot(key: number): Slot {
  return {
    key,
    text: LABELS[(Math.random() * LABELS.length) | 0],
    // Keep clear of the dead-centre reading zone where hero copy lives.
    top: 8 + Math.random() * 84,
    left: Math.random() < 0.5 ? 4 + Math.random() * 26 : 68 + Math.random() * 28,
  };
}

export default function SystemLabels() {
  const reduced = useReducedMotion();
  const [slots, setSlots] = useState<(Slot | null)[]>(() =>
    Array.from({ length: SLOT_COUNT }, () => null)
  );

  useEffect(() => {
    if (reduced) return;
    let counter = 0;
    const timers: number[] = [];

    const cycle = (index: number) => {
      // Show a fresh label in this slot…
      setSlots((prev) => {
        const next = [...prev];
        next[index] = randomSlot(counter++);
        return next;
      });
      // …hold for a while, then clear it (AnimatePresence fades it out)…
      const holdFor = 3500 + Math.random() * 4500;
      timers[index] = window.setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
        // …wait a gap, then reschedule this slot at a new spot.
        const gap = 1500 + Math.random() * 4000;
        timers[index] = window.setTimeout(() => cycle(index), gap);
      }, holdFor);
    };

    // Stagger initial appearances so they don't all pop in together.
    for (let i = 0; i < SLOT_COUNT; i++) {
      timers[i] = window.setTimeout(() => cycle(i), i * 900 + Math.random() * 600);
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <AnimatePresence>
        {slots.map(
          (slot) =>
            slot && (
              <motion.span
                key={slot.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.32, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute select-none whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-neon-green/70"
                style={{
                  top: `${slot.top}%`,
                  left: `${slot.left}%`,
                  textShadow: "0 0 8px rgba(0,255,136,0.35)",
                }}
              >
                {slot.text}
              </motion.span>
            )
        )}
      </AnimatePresence>
    </div>
  );
}
