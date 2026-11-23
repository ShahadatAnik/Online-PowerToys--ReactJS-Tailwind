import { describe, expect, test } from "bun:test"
import { getTool, relatedTools, searchTools, toolCategories, toolSlug, tools } from "./tools"

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

describe("SEO content", () => {
  test("titles and meta descriptions fit search result snippets", () => {
    for (const tool of tools) {
      expect(tool.seoTitle.length).toBeLessThanOrEqual(46)
      expect(tool.metaDescription.length).toBeGreaterThanOrEqual(110)
      expect(tool.metaDescription.length).toBeLessThanOrEqual(160)
    }
  })

  test("every tool has how-to steps and FAQs", () => {
    for (const tool of tools) {
      expect(tool.howTo.length).toBeGreaterThanOrEqual(3)
      expect(tool.faqs.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe("relatedTools", () => {
  test("prefers the same category and never includes the tool itself", () => {
    const tool = getTool("/tools/json-formatter")
    const related = relatedTools(tool)
    expect(related).toHaveLength(3)
    expect(related.map((t) => t.path)).not.toContain(tool.path)
    expect(related.slice(0, 2).every((t) => t.category === "Developer")).toBe(true)
  })
})

test("toolSlug strips the /tools/ prefix", () => {
  expect(toolSlug(getTool("/tools/word-counter"))).toBe("word-counter")
})
