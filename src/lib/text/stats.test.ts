import { describe, expect, test } from "bun:test"
import { formatDuration, getTextStats, getTopWords } from "./stats"

describe("getTextStats", () => {
  test("empty text is all zeros", () => {
    const stats = getTextStats("")
    expect(Object.values(stats).every((v) => v === 0)).toBe(true)
  })

  test("counts words, characters and lines", () => {
    const stats = getTextStats("Hello, world!\nThis is a test.")
    expect(stats.words).toBe(6)
    expect(stats.characters).toBe(29)
    expect(stats.charactersNoSpaces).toBe(24)
    expect(stats.lines).toBe(2)
    expect(stats.sentences).toBe(2)
    expect(stats.paragraphs).toBe(1)
  })

  test("does not count punctuation-only tokens or extra spaces as words", () => {
    expect(getTextStats("  one   two -- three  ").words).toBe(3)
  })

  test("counts emoji and combined characters as single characters", () => {
    expect(getTextStats("👍🏽é").characters).toBe(2)
  })

  test("counts paragraphs separated by blank lines", () => {
    expect(getTextStats("First.\n\nSecond.\n \nThird.").paragraphs).toBe(3)
  })

  test("decimals and abbreviations do not split sentences wrongly", () => {
    expect(getTextStats("It costs 3.50 dollars. Done").sentences).toBe(2)
  })
})

describe("getTopWords", () => {
  test("ranks words case-insensitively and skips short ones", () => {
    expect(getTopWords("The cat and THE dog. The end, cat!", 3)).toEqual([
      { word: "the", count: 3 },
      { word: "cat", count: 2 },
      { word: "and", count: 1 },
    ])
  })

  test("returns nothing for empty text", () => {
    expect(getTopWords("")).toEqual([])
  })
})

describe("formatDuration", () => {
  test("formats seconds and minutes", () => {
    expect(formatDuration(0)).toBe("0 sec")
    expect(formatDuration(45)).toBe("45 sec")
    expect(formatDuration(120)).toBe("2 min")
    expect(formatDuration(125)).toBe("2 min 5 sec")
  })
})
