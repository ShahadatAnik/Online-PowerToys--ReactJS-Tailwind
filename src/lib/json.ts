import type { Result } from "@/lib/result"

export type JsonIndent = "2" | "4" | "tab"

export interface JsonErrorDetails {
  message: string
  line?: number
  column?: number
}

export type JsonResult = Result<string> & { details?: JsonErrorDetails }

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>
    return Object.fromEntries(
      Object.keys(record)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => [key, sortKeysDeep(record[key])])
    )
  }
  return value
}

/** Converts a character offset into a 1-based line/column pair. */
export function offsetToPosition(text: string, offset: number) {
  const lines = text.slice(0, offset).split("\n")
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 }
}

/** Extracts a line/column from engine-specific JSON.parse error messages when present. */
function toErrorDetails(input: string, error: unknown): JsonErrorDetails {
  const message = error instanceof Error ? error.message : String(error)
  const lineCol = /line (\d+) column (\d+)/i.exec(message)
  if (lineCol) {
    return { message, line: Number(lineCol[1]), column: Number(lineCol[2]) }
  }
  const position = /position (\d+)/i.exec(message)
  if (position) {
    return { message, ...offsetToPosition(input, Number(position[1])) }
  }
  return { message }
}

function transform(
  input: string,
  sortKeys: boolean,
  serialize: (value: unknown) => string
): JsonResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const details = toErrorDetails(input, error)
    return { ok: false, error: details.message, details }
  }
  return { ok: true, value: serialize(sortKeys ? sortKeysDeep(parsed) : parsed) }
}

export function formatJson(
  input: string,
  { indent = "2", sortKeys = false }: { indent?: JsonIndent; sortKeys?: boolean } = {}
): JsonResult {
  const space = indent === "tab" ? "\t" : Number(indent)
  return transform(input, sortKeys, (value) => JSON.stringify(value, null, space))
}

export function minifyJson(
  input: string,
  { sortKeys = false }: { sortKeys?: boolean } = {}
): JsonResult {
  return transform(input, sortKeys, (value) => JSON.stringify(value))
}
