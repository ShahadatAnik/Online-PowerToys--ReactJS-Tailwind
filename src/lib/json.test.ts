import { describe, expect, test } from "bun:test"
import { formatJson, minifyJson, offsetToPosition } from "./json"

describe("formatJson", () => {
  test("pretty prints with the chosen indent", () => {
    expect(formatJson('{"a":1,"b":[1,2]}')).toEqual({
      ok: true,
      value: '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}',
    })
    expect(formatJson('{"a":1}', { indent: "tab" })).toEqual({
      ok: true,
      value: '{\n\t"a": 1\n}',
    })
  })

  test("reports invalid JSON with a message", () => {
    const result = formatJson('{"a": }')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.length).toBeGreaterThan(0)
  })
})

describe("minifyJson", () => {
  test("removes whitespace", () => {
    expect(minifyJson('{\n  "a": [1, 2]\n}')).toEqual({ ok: true, value: '{"a":[1,2]}' })
  })

  test("sorts keys recursively when asked", () => {
    expect(minifyJson('{"b":{"d":1,"c":2},"a":[{"z":1,"y":2}]}', { sortKeys: true })).toEqual({
      ok: true,
      value: '{"a":[{"y":2,"z":1}],"b":{"c":2,"d":1}}',
    })
  })
})

describe("offsetToPosition", () => {
  test("maps offsets to 1-based line and column", () => {
    expect(offsetToPosition("ab\ncd", 0)).toEqual({ line: 1, column: 1 })
    expect(offsetToPosition("ab\ncd", 4)).toEqual({ line: 2, column: 2 })
  })
})
