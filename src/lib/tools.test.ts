import { describe, expect, test } from "bun:test"
import { searchTools, toolCategories, tools } from "./tools"

describe("tool registry", () => {
  test("paths are unique and live under /tools/", () => {
    const paths = tools.map((t) => t.path)
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) expect(path).toMatch(/^\/tools\/[a-z0-9-]+$/)
  })

  test("every tool belongs to a known category", () => {
    for (const tool of tools) expect(toolCategories).toContain(tool.category)
  })
})

describe("searchTools", () => {
  test("returns everything for an empty query", () => {
    expect(searchTools("  ")).toHaveLength(tools.length)
  })

  test("matches titles and keywords case-insensitively", () => {
    expect(searchTools("JSON").map((t) => t.path)).toEqual(["/tools/json-formatter"])
    expect(searchTools("birthday").map((t) => t.path)).toEqual(["/tools/age-calculator"])
  })

  test("requires every term to match", () => {
    expect(searchTools("json birthday")).toHaveLength(0)
  })
})
