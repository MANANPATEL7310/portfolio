/**
 * Subtle CRT-style scanline overlay plus slow-drifting radial "green fog"
 * blooms. Pure CSS — the drift animations live in index.css so they can be
 * disabled under prefers-reduced-motion.
 */
export default function ScanlineOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,255,136,0.05) 0px, rgba(0,255,136,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Slow-moving radial green blooms / light fog */}
      <div
        aria-hidden="true"
        className="bg-bloom pointer-events-none absolute inset-0"
      />
    </>
  );
}
