import type { LucideIcon } from "lucide-react"
import {
  Binary,
  Braces,
  CalendarHeart,
  CaseSensitive,
  Fingerprint,
  LetterText,
  WrapText,
} from "lucide-react"
import type { FileRoutesByTo } from "@/routeTree.gen"

export type ToolCategory = "Text" | "Developer" | "Date & Time"

export const toolCategories: readonly ToolCategory[] = ["Text", "Developer", "Date & Time"]

/** URL-fragment id for a category section on the home page, e.g. "date-time". */
export const categoryId = (category: ToolCategory) =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export type ToolPath = Extract<keyof FileRoutesByTo, `/tools/${string}`>

export interface Tool {
  /** Route the tool lives at. */
  path: ToolPath
  title: string
  /** One-line summary for cards and the command menu. */
  summary: string
  /** Longer description for page headers and meta tags. */
  description: string
  category: ToolCategory
  icon: LucideIcon
  /** Extra search terms for the home filter and command menu. */
  keywords: readonly string[]
  /** Marks recently added tools in the UI. */
  isNew?: boolean
}

export const tools = [
  {
    path: "/tools/line-to-space",
    title: "Line to Space Converter",
    summary: "Join multi-line text into a single line.",
    description:
      "Join multi-line text into one line using spaces, commas or any custom separator, with optional trimming and whitespace cleanup.",
    category: "Text",
    icon: WrapText,
    keywords: ["newline", "join", "lines", "single line", "remove line breaks", "csv"],
  },
  {
    path: "/tools/word-counter",
    title: "Word & Character Counter",
    summary: "Count words, characters, sentences and more.",
    description:
      "Live word, character, sentence, paragraph and line counts with reading and speaking time estimates.",
    category: "Text",
    icon: LetterText,
    keywords: ["count", "words", "characters", "letters", "reading time", "length"],
  },
  {
    path: "/tools/case-converter",
    title: "Case Converter",
    summary: "Switch between camelCase, snake_case, Title Case and more.",
    description:
      "Convert text between sentence, lower, upper, title, camel, Pascal, snake, kebab and constant case.",
    category: "Text",
    icon: CaseSensitive,
    keywords: ["uppercase", "lowercase", "camel", "snake", "kebab", "title", "pascal"],
    isNew: true,
  },
  {
    path: "/tools/json-formatter",
    title: "JSON Formatter",
    summary: "Pretty-print, validate and minify JSON.",
    description:
      "Format, validate and minify JSON with configurable indentation, recursive key sorting and precise error messages.",
    category: "Developer",
    icon: Braces,
    keywords: ["json", "prettify", "beautify", "validate", "minify", "lint"],
    isNew: true,
  },
  {
    path: "/tools/base64",
    title: "Base64 Encoder / Decoder",
    summary: "Encode and decode UTF-8 safe Base64.",
    description:
      "Encode text to Base64 or decode it back, with full UTF-8 support and an optional URL-safe alphabet.",
    category: "Developer",
    icon: Binary,
    keywords: ["base64", "encode", "decode", "atob", "btoa", "url safe"],
    isNew: true,
  },
  {
    path: "/tools/uuid-generator",
    title: "UUID Generator",
    summary: "Generate cryptographically random v4 UUIDs.",
    description:
      "Generate one or hundreds of cryptographically secure version 4 UUIDs, with uppercase and hyphen options.",
    category: "Developer",
    icon: Fingerprint,
    keywords: ["uuid", "guid", "random", "id", "unique", "v4"],
    isNew: true,
  },
  {
    path: "/tools/age-calculator",
    title: "Age Calculator",
    summary: "Exact age in years, months, days and beyond.",
    description:
      "Calculate an exact, calendar-accurate age between two dates — in years, months, weeks, days, hours, minutes and seconds — plus a countdown to the next birthday.",
    category: "Date & Time",
    icon: CalendarHeart,
    keywords: ["age", "birthday", "date difference", "days between", "dob"],
  },
] as const satisfies readonly Tool[]

export function getTool(path: ToolPath): Tool {
  const tool = tools.find((t) => t.path === path)
  if (!tool) throw new Error(`Unknown tool: ${path}`)
  return tool
}

/** Case-insensitive match against title, summary, category and keywords. */
export function searchTools(query: string): Tool[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return [...tools]
  return tools.filter((tool) => {
    const haystack = [tool.title, tool.summary, tool.category, ...tool.keywords]
      .join(" ")
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}
