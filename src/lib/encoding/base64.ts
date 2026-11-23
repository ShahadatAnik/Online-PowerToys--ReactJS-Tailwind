import type { Result } from "@/lib/result"

const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/

function bytesToBinary(bytes: Uint8Array): string {
  let binary = ""
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return binary
}

/** Encodes UTF-8 text as Base64 (optionally the URL-safe alphabet, without padding). */
export function encodeBase64(text: string, { urlSafe = false } = {}): string {
  const encoded = btoa(bytesToBinary(new TextEncoder().encode(text)))
  if (!urlSafe) return encoded
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Decodes standard or URL-safe Base64 into UTF-8 text. Whitespace is ignored. */
export function decodeBase64(input: string): Result<string> {
  let normalized = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
  if (normalized.length % 4 === 1 || !BASE64.test(normalized)) {
    return { ok: false, error: "Input is not valid Base64." }
  }
  normalized = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

  try {
    const bytes = Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0))
    return {
      ok: true,
      value: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    }
  } catch {
    return {
      ok: false,
      error: "Decoded bytes are not valid UTF-8 text (the data may be binary).",
    }
  }
}
