export interface UuidOptions {
  count: number
  uppercase: boolean
  hyphens: boolean
}

export const MAX_UUIDS = 500

/** Generates RFC 9562 version 4 UUIDs using the platform's cryptographic RNG. */
export function generateUuids(
  { count, uppercase, hyphens }: UuidOptions,
  random: () => string = () => crypto.randomUUID()
): string[] {
  const safeCount = Math.min(Math.max(Math.trunc(count) || 0, 1), MAX_UUIDS)
  return Array.from({ length: safeCount }, () => {
    let id = random()
    if (!hyphens) id = id.replaceAll("-", "")
    return uppercase ? id.toUpperCase() : id
  })
}
