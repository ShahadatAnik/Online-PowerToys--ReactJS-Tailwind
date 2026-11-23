export interface JoinLinesOptions {
  /** Text inserted between joined lines. */
  separator: string
  /** Collapse runs of spaces/tabs inside each line into a single space. */
  collapseWhitespace: boolean
  /** Trim leading/trailing whitespace from every line. */
  trimLines: boolean
  /** Drop lines that are empty (after trimming, if enabled). */
  removeEmptyLines: boolean
}

export const defaultJoinLinesOptions: JoinLinesOptions = {
  separator: " ",
  collapseWhitespace: true,
  trimLines: true,
  removeEmptyLines: true,
}

const LINE_BREAK = /\r\n|\r|\n/
const INLINE_WHITESPACE = /[^\S\r\n]+/g

/** Joins multi-line text into a single line using the given separator. */
export function joinLines(input: string, options: Partial<JoinLinesOptions> = {}): string {
  const { separator, collapseWhitespace, trimLines, removeEmptyLines } = {
    ...defaultJoinLinesOptions,
    ...options,
  }

  let lines = input.split(LINE_BREAK)
  if (collapseWhitespace) {
    lines = lines.map((line) => line.replace(INLINE_WHITESPACE, " "))
  }
  if (trimLines) lines = lines.map((line) => line.trim())
  if (removeEmptyLines) lines = lines.filter((line) => line.trim() !== "")

  return lines.join(separator)
}
