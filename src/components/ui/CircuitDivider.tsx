import { motion } from "framer-motion";

/**
 * A thin horizontal "circuit-line" divider with a couple of small glowing
 * nodes, and a single pulse that travels along the line once when it scrolls
 * into view. Reinforces the "connected system" motif between sections without
 * repeating the background pattern.
 */
export default function CircuitDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-6xl items-center px-5 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="relative h-px w-full"
      >
        {/* Base hairline */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />

        {/* Glowing nodes */}
        <span className="absolute left-[18%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.7)]" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-neon-cyan/70 shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
        <span className="absolute left-[81%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-lime shadow-[0_0_8px_rgba(124,255,79,0.7)]" />

        {/* Travelling pulse (fires once on scroll-into-view) */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,136,0.9), transparent)",
            animation: "divider-pulse 1.6s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        />
      </motion.div>
    </div>
  );
}
