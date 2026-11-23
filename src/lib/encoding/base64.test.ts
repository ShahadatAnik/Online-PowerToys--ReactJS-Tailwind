import { describe, expect, test } from "bun:test"
import { decodeBase64, encodeBase64 } from "./base64"

describe("encodeBase64", () => {
  test("encodes ASCII", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=")
  })

  test("encodes UTF-8 text", () => {
    expect(encodeBase64("héllo 👋")).toBe("aMOpbGxvIPCfkYs=")
  })

  test("supports the URL-safe alphabet", () => {
    expect(encodeBase64("??>>", { urlSafe: true })).toBe("Pz8-Pg")
  })
})

describe("decodeBase64", () => {
  test("round-trips UTF-8", () => {
    const text = "Ünïcödé ✓ 日本語"
    expect(decodeBase64(encodeBase64(text))).toEqual({ ok: true, value: text })
    expect(decodeBase64(encodeBase64(text, { urlSafe: true }))).toEqual({
      ok: true,
      value: text,
    })
  })

  test("ignores whitespace and missing padding", () => {
    expect(decodeBase64(" aGVs\nbG8 ")).toEqual({ ok: true, value: "hello" })
  })

  test("rejects invalid input", () => {
    expect(decodeBase64("not base64!").ok).toBe(false)
    expect(decodeBase64("a").ok).toBe(false)
  })

  test("rejects non UTF-8 payloads", () => {
    expect(decodeBase64("/w==").ok).toBe(false)
  })
})
