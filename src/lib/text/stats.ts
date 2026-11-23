export interface TextStats {
  words: number
  characters: number
  charactersNoSpaces: number
  lines: number
  sentences: number
  paragraphs: number
  /** Estimated silent reading time in seconds (238 wpm). */
  readingTimeSeconds: number
  /** Estimated speaking time in seconds (140 wpm). */
  speakingTimeSeconds: number
}

const READING_WPM = 238
const SPEAKING_WPM = 140

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
const wordSegmenter = new Intl.Segmenter(undefined, { granularity: "word" })
const sentenceSegmenter = new Intl.Segmenter(undefined, { granularity: "sentence" })

const EMPTY_STATS: TextStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  lines: 0,
  sentences: 0,
  paragraphs: 0,
  readingTimeSeconds: 0,
  speakingTimeSeconds: 0,
}

function* wordsOf(text: string) {
  for (const segment of wordSegmenter.segment(text)) {
    if (segment.isWordLike) yield segment.segment
  }
}

/** Computes Unicode-aware statistics (emoji and accents count as one character). */
export function getTextStats(text: string): TextStats {
  if (text.length === 0) return EMPTY_STATS

  let words = 0
  for (const _ of wordsOf(text)) words++

  let characters = 0
  let charactersNoSpaces = 0
  for (const { segment } of graphemeSegmenter.segment(text)) {
    characters++
    if (!/\s/.test(segment)) charactersNoSpaces++
  }

  let sentences = 0
  for (const { segment } of sentenceSegmenter.segment(text)) {
    if (/[\p{L}\p{N}]/u.test(segment)) sentences++
  }

  return {
    words,
    characters,
    charactersNoSpaces,
    lines: text.split(/\r\n|\r|\n/).length,
    sentences,
    paragraphs: text.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/).filter((p) => p.trim() !== "").length,
    readingTimeSeconds: Math.ceil((words / READING_WPM) * 60),
    speakingTimeSeconds: Math.ceil((words / SPEAKING_WPM) * 60),
  }
}

/** Returns the most frequent words (case-insensitive), most common first. */
export function getTopWords(text: string, limit = 10, minLength = 3) {
  const counts = new Map<string, number>()
  for (const word of wordsOf(text.toLocaleLowerCase())) {
    if ([...word].length < minLength) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit)
}

/** Formats a duration in seconds as a short human string, e.g. "2 min 5 sec". */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 sec"
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds} sec`
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`
}
