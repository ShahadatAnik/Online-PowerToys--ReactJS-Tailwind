import { type SVGProps, useId } from "react"

/**
 * The PowerToys brand mark: a lightning bolt with a spark on a warm orange tile.
 *
 * This component is the single source of truth for the logo. `scripts/generate-icons.tsx`
 * renders it to the favicon, app icons and Open Graph images, so edit it here only.
 */

/** Bolt outline on a 64×64 grid. */
const BOLT = "M38.5 7.5 17 36h13l-4 20.5L47.5 27h-13l4-19.5Z"
/** Four-point spark, a nod to the starfield. */
const SPARK =
  "M50 8.5c.9 4.1 2.2 5.4 6.3 6.3-4.1.9-5.4 2.2-6.3 6.3-.9-4.1-2.2-5.4-6.3-6.3 4.1-.9 5.4-2.2 6.3-6.3Z"

export const brandColors = {
  /** Gradient stops of the tile, top-left to bottom-right. */
  from: "#ffb14a",
  to: "#f0501c",
} as const

interface LogoMarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /**
   * `tile`: rounded tile on a transparent background (UI, favicons).
   * `full-bleed`: square background with the glyph inset into the safe zone
   * (Apple touch icon and maskable PWA icon, which the OS masks itself).
   */
  variant?: "tile" | "full-bleed"
  /** Accessible name; omit when the mark is decorative. */
  title?: string
}

export function LogoMark({ variant = "tile", title, ...props }: LogoMarkProps) {
  const id = useId()
  const fill = `${id}-fill`
  const gloss = `${id}-gloss`
  const shadow = `${id}-shadow`
  const isFullBleed = variant === "full-bleed"
  // Maskable icons keep their content within the central 80% circle.
  const glyph = isFullBleed ? "translate(32 32) scale(0.72) translate(-32 -32)" : undefined

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: titled when `title` is set, aria-hidden otherwise.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={fill} x1="6" y1="4" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={brandColors.from} />
          <stop offset="1" stopColor={brandColors.to} />
        </linearGradient>
        <linearGradient id={gloss} x1="32" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={shadow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.2"
            floodColor="#7a1e00"
            floodOpacity="0.35"
          />
        </filter>
      </defs>
      {isFullBleed ? (
        <rect width="64" height="64" fill={`url(#${fill})`} />
      ) : (
        <>
          <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#${fill})`} />
          <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#${gloss})`} />
          <rect
            x="2.75"
            y="2.75"
            width="58.5"
            height="58.5"
            rx="16.25"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        </>
      )}
      <g transform={glyph}>
        <path
          d={BOLT}
          fill="#fff"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter={`url(#${shadow})`}
        />
        <path d={SPARK} fill="#fff" fillOpacity="0.95" />
      </g>
    </svg>
  )
}
