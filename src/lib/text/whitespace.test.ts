import { describe, expect, test } from "bun:test"
import { joinLines } from "./whitespace"

describe("joinLines", () => {
  test("joins lines with a single space by default", () => {
    expect(joinLines("hello\nworld\r\nfoo\rbar")).toBe("hello world foo bar")
  })

  test("collapses inner whitespace and trims lines", () => {
    expect(joinLines("  a   b\t\tc  \n\n   d  ")).toBe("a b c d")
  })

  test("supports a custom separator", () => {
    expect(joinLines("a\nb\nc", { separator: ", " })).toBe("a, b, c")
  })

  test("can keep empty lines and raw whitespace", () => {
    expect(
      joinLines(" a \n\n b ", {
        separator: "|",
        collapseWhitespace: false,
        trimLines: false,
        removeEmptyLines: false,
      })
    ).toBe(" a || b ")
  })

  test("returns an empty string for empty input", () => {
    expect(joinLines("")).toBe("")
    expect(joinLines("\n \n")).toBe("")
  })
})
