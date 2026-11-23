export const caseStyles = [
  { id: "sentence", label: "Sentence case" },
  { id: "lower", label: "lower case" },
  { id: "upper", label: "UPPER CASE" },
  { id: "title", label: "Title Case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
] as const

export type CaseStyle = (typeof caseStyles)[number]["id"]

/** Splits an identifier or phrase into lowercase words, honouring camelCase boundaries. */
export function splitWords(input: string): string[] {
  return input
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

function convertLine(line: string, style: CaseStyle): string {
  switch (style) {
    case "upper":
      return line.toUpperCase()
    case "lower":
      return line.toLowerCase()
    case "title":
      return line.replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, capitalize)
    case "sentence":
      return line
        .toLowerCase()
        .replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (match) => match.toUpperCase())
    case "camel":
      return splitWords(line)
        .map((word, i) => (i === 0 ? word : capitalize(word)))
        .join("")
    case "pascal":
      return splitWords(line).map(capitalize).join("")
    case "snake":
      return splitWords(line).join("_")
    case "kebab":
      return splitWords(line).join("-")
    case "constant":
      return splitWords(line).join("_").toUpperCase()
  }
}

/** Converts text to the given case style, line by line (line breaks are preserved). */
export function convertCase(input: string, style: CaseStyle): string {
  return input
    .split(/(\r\n|\r|\n)/)
    .map((part, i) => (i % 2 === 1 ? part : convertLine(part, style)))
    .join("")
}
