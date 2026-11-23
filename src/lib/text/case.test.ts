import { describe, expect, test } from "bun:test"
import { convertCase, splitWords } from "./case"

describe("splitWords", () => {
  test("splits on camelCase, acronyms and separators", () => {
    expect(splitWords("parseHTTPResponse_code-v2 now")).toEqual([
      "parse",
      "http",
      "response",
      "code",
      "v2",
      "now",
    ])
  })
})

describe("convertCase", () => {
  const input = "the quick brownFox. jumps over"

  test.each([
    ["upper", "THE QUICK BROWNFOX. JUMPS OVER"],
    ["lower", "the quick brownfox. jumps over"],
    ["title", "The Quick Brownfox. Jumps Over"],
    ["sentence", "The quick brownfox. Jumps over"],
    ["camel", "theQuickBrownFoxJumpsOver"],
    ["pascal", "TheQuickBrownFoxJumpsOver"],
    ["snake", "the_quick_brown_fox_jumps_over"],
    ["kebab", "the-quick-brown-fox-jumps-over"],
    ["constant", "THE_QUICK_BROWN_FOX_JUMPS_OVER"],
  ] as const)("%s", (style, expected) => {
    expect(convertCase(input, style)).toBe(expected)
  })

  test("converts each line independently and preserves line breaks", () => {
    expect(convertCase("hello world\r\nfoo bar", "kebab")).toBe("hello-world\r\nfoo-bar")
  })

  test("handles non-latin letters", () => {
    expect(convertCase("élan vital", "pascal")).toBe("ÉlanVital")
  })

  test("keeps apostrophes inside title-cased words", () => {
    expect(convertCase("don't stop", "title")).toBe("Don't Stop")
  })
})
