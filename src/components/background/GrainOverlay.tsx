/**
 * Fine grain / film-noise texture at ~3% opacity over the whole viewport.
 * This single layer is what makes flat digital gradients read as a designed,
 * tactile surface instead of a plain CSS background. Rendered as an inline SVG
 * fractal-noise data URI so it costs nothing at runtime (no JS, no image
 * request) and stays crisp at any DPR.
 */
export default function GrainOverlay() {
  const noise = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-soft-light"
      style={{
        backgroundImage: `url("data:image/svg+xml,${noise}")`,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
