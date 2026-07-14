/**
 * Low-opacity hexagonal grid overlay rendered as a tiled SVG background.
 * Pure CSS/SVG — no JS loop — so it costs essentially nothing.
 */
export default function HexGrid() {
  const hex = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'>
      <g fill='none' stroke='rgba(0,255,136,0.06)' stroke-width='1'>
        <path d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16 Z'/>
        <path d='M28 66 L56 82 L56 100 M28 66 L0 82 L0 100'/>
      </g>
    </svg>`
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${hex}")`,
        backgroundSize: "56px 100px",
        opacity: 0.5,
        maskImage:
          "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.9), transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.9), transparent 75%)",
      }}
    />
  );
}
