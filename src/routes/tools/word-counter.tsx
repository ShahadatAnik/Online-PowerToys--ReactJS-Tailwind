import { createFileRoute } from "@tanstack/react-router"
import { Eraser, FileText } from "lucide-react"
import { useDeferredValue, useId } from "react"
import { CopyButton } from "@/components/copy-button"
import { StatCard } from "@/components/stat-card"
import { TextPanel } from "@/components/text-panel"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { toolSeo } from "@/lib/seo"
import { formatDuration, getTextStats, getTopWords } from "@/lib/text/stats"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/word-counter")

export const Route = createFileRoute("/tools/word-counter")({
  head: () => toolSeo(tool),
  component: WordCounterPage,
})

const SAMPLE = `The quick brown fox jumps over the lazy dog. It's a classic pangram!

Pangrams contain every letter of the alphabet at least once. Typists and designers use them to preview fonts — and now you can use this one to try the counter.`

const n = (value: number) => value.toLocaleString()

function WordCounterPage() {
  const id = useId()
  const [text, setText] = usePersistedState("word-counter:input", "")
  const deferredText = useDeferredValue(text)
  const stats = getTextStats(deferredText)
  const topWords = getTopWords(deferredText, 8)

  return (
    <ToolLayout
      tool={tool}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setText(SAMPLE)}>
            <FileText />
            Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => setText("")} disabled={!text}>
            <Eraser />
            Clear
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <TextPanel
          id={id}
          label="Your text"
          placeholder="Start typing or paste text to count words, characters and more…"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-96"
          autoFocus
          actions={<CopyButton value={text} />}
        />

        <div className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
          <dl className="grid grid-cols-2 gap-3" aria-live="polite">
            <StatCard
              label="Words"
              value={n(stats.words)}
              className="col-span-2 sm:col-span-1 lg:col-span-2"
            />
            <StatCard label="Characters" value={n(stats.characters)} />
            <StatCard label="No spaces" value={n(stats.charactersNoSpaces)} />
            <StatCard label="Sentences" value={n(stats.sentences)} />
            <StatCard label="Paragraphs" value={n(stats.paragraphs)} />
            <StatCard label="Lines" value={n(stats.lines)} />
            <StatCard
              label="Reading"
              value={formatDuration(stats.readingTimeSeconds)}
              hint="at 238 wpm"
            />
            <StatCard
              label="Speaking"
              value={formatDuration(stats.speakingTimeSeconds)}
              hint="at 140 wpm"
              className="col-span-2"
            />
          </dl>

          {topWords.length > 0 ? (
            <Card size="sm">
              <CardHeader>
                <CardTitle>Most frequent words</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {topWords.map(({ word, count }) => (
                    <li key={word} className="flex items-center gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate">{word}</span>
                      <span
                        className="h-1.5 rounded-full bg-primary/70"
                        style={{ width: `${(count / (topWords[0]?.count ?? 1)) * 64}px` }}
                        aria-hidden="true"
                      />
                      <span className="w-8 text-right text-muted-foreground tabular-nums">
                        {count}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </ToolLayout>
  )
}
