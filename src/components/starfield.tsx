import type { CSSProperties } from "react"

/** Small deterministic PRNG so prerendered HTML and the client produce identical stars. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIELD = 2000

function stars(count: number, seed: number) {
  const random = mulberry32(seed)
  return Array.from(
    { length: count },
    () =>
      `${Math.round(random() * FIELD)}px ${Math.round(random() * FIELD)}px oklch(1 0 0 / ${(
        0.35 + random() * 0.5
      ).toFixed(2)})`
  ).join(",")
}

const layers = [
  { shadow: stars(450, 1), size: 1, duration: "150s" },
  { shadow: stars(140, 2), size: 2, duration: "220s" },
  { shadow: stars(60, 3), size: 3, duration: "300s" },
]

/** The site's signature starfield, shown only in dark mode and frozen for reduced motion. */
export function Starfield() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {layers.map((layer) => (
        <div
          key={layer.size}
          className="starfield-layer"
          style={
            {
              "--stars": layer.shadow,
              "--star-size": `${layer.size}px`,
              "--star-duration": layer.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
