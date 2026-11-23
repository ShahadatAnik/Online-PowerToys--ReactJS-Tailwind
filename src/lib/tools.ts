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

export interface ToolFaq {
  question: string
  answer: string
}

export interface Tool {
  /** Route the tool lives at. */
  path: ToolPath
  title: string
  /** One-line summary for cards and the command menu. */
  summary: string
  /** Longer description shown in the page header. */
  description: string
  /** Search-friendly page title, without the site name (aim for 45 characters or fewer). */
  seoTitle: string
  /** Meta description for search results and link previews (aim for 140–160 characters). */
  metaDescription: string
  /** Steps for the "How to use" section on the tool page. */
  howTo: readonly string[]
  /** Questions and answers shown on the page and exposed as FAQPage structured data. */
  faqs: readonly ToolFaq[]
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
    seoTitle: "Remove Line Breaks – Join Lines Online",
    metaDescription:
      "Remove line breaks and join multi-line text into a single line with spaces, commas or a custom separator. Free, instant and private: it runs in your browser.",
    howTo: [
      "Paste or type your multi-line text into the Input box.",
      "Choose what to join the lines with: a space, comma, semicolon, pipe, tab, nothing, or your own custom separator.",
      "Optionally trim each line, skip empty lines or collapse repeated whitespace.",
      "Copy the single-line result. It updates instantly as you type.",
    ],
    faqs: [
      {
        question: "How do I remove line breaks from text?",
        answer:
          "Paste the text into the Input box and keep the separator set to Space. Every line break is replaced with a single space, and the joined text appears in the Result box, ready to copy.",
      },
      {
        question: "Can I turn a list into comma-separated values?",
        answer:
          "Yes. Choose Comma or Comma + space as the separator to turn one item per line into a comma-separated list, which is handy for SQL IN clauses, spreadsheets and tags.",
      },
      {
        question: "What happens to blank lines?",
        answer:
          "With Skip empty lines turned on, blank lines are dropped so you never get doubled separators. Turn it off to keep them.",
      },
      {
        question: "Is my text uploaded anywhere?",
        answer:
          "No. The conversion runs entirely in your browser, and nothing you paste is sent to a server.",
      },
    ],
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
    seoTitle: "Word Counter – Characters & Reading Time",
    metaDescription:
      "Free online word counter: count words, characters, sentences, paragraphs and lines as you type, with reading and speaking time estimates. Private and instant.",
    howTo: [
      "Type or paste your text into the text box.",
      "Read the live counts for words, characters (with and without spaces), sentences, paragraphs and lines.",
      "Check the estimated reading and speaking time, and the most frequent words.",
      "Your text is kept in this browser, so it is still there when you come back.",
    ],
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "Words are detected with your browser's built-in, language-aware text segmentation (Intl.Segmenter), so punctuation, emoji and multiple spaces don't inflate the count, and empty text counts as zero words.",
      },
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time assumes an average silent reading speed of 238 words per minute. Speaking time assumes 140 words per minute, a typical pace for presentations.",
      },
      {
        question: "Does the character count include spaces?",
        answer:
          "Both are shown: Characters includes spaces and line breaks, while No spaces excludes all whitespace. Emoji and accented letters count as one character each.",
      },
      {
        question: "Is there a length limit?",
        answer:
          "No hard limit. Counting happens in your browser and stays fast even for long documents, and nothing is uploaded.",
      },
    ],
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
    seoTitle: "Case Converter – camelCase, snake_case & More",
    metaDescription:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE instantly. Free and private.",
    howTo: [
      "Type or paste text into the Input box.",
      "Pick a case style: sentence, lower, upper, title, camel, Pascal, snake, kebab or constant case.",
      "Copy the converted text from the Result box.",
    ],
    faqs: [
      {
        question: "What is the difference between camelCase and PascalCase?",
        answer:
          "Both join words without spaces and capitalise each word, but camelCase starts with a lowercase letter (myVariableName) while PascalCase capitalises the first word too (MyVariableName).",
      },
      {
        question: "When should I use snake_case or kebab-case?",
        answer:
          "snake_case (words_with_underscores) is common for Python variables and database columns. kebab-case (words-with-hyphens) is used for URLs, CSS classes and file names. CONSTANT_CASE is the upper-case form of snake_case, used for constants.",
      },
      {
        question: "Can it convert existing camelCase or snake_case text?",
        answer:
          "Yes. The converter splits words on spaces, underscores, hyphens and case changes, so you can turn snake_case into camelCase or the other way round in one step.",
      },
    ],
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
    seoTitle: "JSON Formatter & Validator – Beautify JSON",
    metaDescription:
      "Format, beautify, validate and minify JSON online. Choose indentation, sort keys and get the exact line and column of syntax errors. Free and fully private.",
    howTo: [
      "Paste your JSON into the JSON input box.",
      "Choose Pretty to format it or Minify to compress it onto one line.",
      "Pick 2 spaces, 4 spaces or tabs for indentation, and optionally sort keys alphabetically.",
      "Copy the result or download it as a .json file. Invalid JSON shows an error with its line and column.",
    ],
    faqs: [
      {
        question: "How do I validate JSON?",
        answer:
          "Paste it into the input. Valid JSON is formatted immediately; invalid JSON shows a clear error message with the line and column where parsing failed, so you can fix it quickly.",
      },
      {
        question: "What does Sort keys do?",
        answer:
          "It orders the keys of every object alphabetically, including nested objects. Sorted output is easier to scan and gives cleaner diffs when comparing two JSON documents.",
      },
      {
        question: "Is it safe to paste API responses or config files?",
        answer:
          "Yes. Formatting and validation run entirely in your browser; your JSON is never uploaded or logged.",
      },
    ],
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
    seoTitle: "Base64 Encode & Decode Online (UTF-8)",
    metaDescription:
      "Encode text to Base64 or decode Base64 to text online, with full UTF-8 and emoji support and an optional URL-safe alphabet. Free, instant and private.",
    howTo: [
      "Choose Encode to turn text into Base64, or Decode to turn Base64 back into text.",
      "Type or paste your input. The result updates as you type.",
      "Turn on URL-safe to use - and _ instead of + and / (Base64URL).",
      "Copy the result with one click.",
    ],
    faqs: [
      {
        question: "What is Base64 encoding?",
        answer:
          "Base64 represents binary data using 64 printable characters (A–Z, a–z, 0–9, + and /). It is used to embed data in JSON, emails, data URLs and HTTP headers. It is an encoding, not encryption, so anyone can decode it.",
      },
      {
        question: "Does it support emoji and non-English text?",
        answer:
          "Yes. Text is encoded as UTF-8 before conversion, so accented letters, emoji and any script round-trip correctly, unlike the browser's built-in btoa().",
      },
      {
        question: "What is URL-safe Base64?",
        answer:
          "URL-safe Base64 (Base64URL) replaces + with - and / with _ so the output can be used in URLs, file names and JWTs without escaping.",
      },
    ],
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
    seoTitle: "UUID Generator – Random v4 GUIDs Online",
    metaDescription:
      "Generate random version 4 UUIDs (GUIDs) online with a cryptographically secure generator. Create up to 100 at once, in uppercase or without hyphens. Free.",
    howTo: [
      "Choose how many UUIDs you need, from 1 to 100.",
      "Optionally switch to uppercase or remove the hyphens.",
      "Copy a single UUID, or copy them all at once. Generate again for a fresh batch.",
    ],
    faqs: [
      {
        question: "What is a UUID v4?",
        answer:
          "A version 4 UUID is a 128-bit identifier made from random numbers, written as 36 characters such as 3f2b8c1e-7d4a-4f6b-9c2e-1a5d8e9f0b7c. It is the most common UUID type for database keys and request IDs.",
      },
      {
        question: "Are these UUIDs truly random and unique?",
        answer:
          "They come from your browser's cryptographically secure crypto.randomUUID(). With 122 random bits, the chance of generating a duplicate is negligible for any practical workload.",
      },
      {
        question: "Is a GUID the same as a UUID?",
        answer:
          "Yes. GUID is Microsoft's name for the same 128-bit identifier format, so these values work anywhere a GUID is expected.",
      },
    ],
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
    seoTitle: "Age Calculator – Exact Age From Birthday",
    metaDescription:
      "Calculate your exact age in years, months and days from your date of birth, plus total weeks, days and hours and a countdown to your next birthday. Free.",
    howTo: [
      "Pick a date of birth.",
      "Leave the second date as today, or pick any date to find the age on that day.",
      "Read your exact age in years, months and days, and the totals in months, weeks, days, hours, minutes and seconds.",
      "See how many days remain until the next birthday, and copy a summary.",
    ],
    faqs: [
      {
        question: "How is the exact age calculated?",
        answer:
          "The calculator uses real calendar math with each month's true length and leap years, instead of assuming 365-day years or 30-day months, so the years, months and days always match the calendar.",
      },
      {
        question: "How are February 29 birthdays handled?",
        answer:
          "People born on February 29 get their birthday on February 29 in leap years. In other years the birthday falls back to February 28, so the countdown and age stay correct.",
      },
      {
        question: "Can I calculate the age on a past or future date?",
        answer:
          'Yes. Change the "Age at the date of" field to any date to see the age on that day, for example for a document, an event or a retirement date.',
      },
    ],
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

/** Last path segment of a tool, e.g. "word-counter". */
export const toolSlug = (tool: Pick<Tool, "path">) => tool.path.slice("/tools/".length)

/** Public path of a page's generated Open Graph image (see scripts/generate-og-images.tsx). */
export const ogImagePath = (slug: string) => `/og/${slug}.png`

/** Other tools to suggest on a tool page: same category first, then the rest, in registry order. */
export function relatedTools(tool: Tool, limit = 3): Tool[] {
  const others = tools.filter((t) => t.path !== tool.path)
  return [
    ...others.filter((t) => t.category === tool.category),
    ...others.filter((t) => t.category !== tool.category),
  ].slice(0, limit)
}
