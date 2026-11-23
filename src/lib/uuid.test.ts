import { describe, expect, test } from "bun:test"
import { generateUuids, MAX_UUIDS } from "./uuid"

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe("generateUuids", () => {
  test("generates unique v4 UUIDs", () => {
    const ids = generateUuids({ count: 50, uppercase: false, hyphens: true })
    expect(ids).toHaveLength(50)
    expect(new Set(ids).size).toBe(50)
    for (const id of ids) expect(id).toMatch(V4)
  })

  test("applies formatting options", () => {
    const [id] = generateUuids({ count: 1, uppercase: true, hyphens: false })
    expect(id).toMatch(/^[0-9A-F]{32}$/)
  })

  test("clamps the count", () => {
    const opts = { uppercase: false, hyphens: true }
    expect(generateUuids({ ...opts, count: 0 })).toHaveLength(1)
    expect(generateUuids({ ...opts, count: 10_000 })).toHaveLength(MAX_UUIDS)
  })
})
