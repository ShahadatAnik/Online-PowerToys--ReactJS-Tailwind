import { createFileRoute } from "@tanstack/react-router"
import { Eraser, FileText } from "lucide-react"
import { useDeferredValue, useId } from "react"
import { CopyButton } from "@/components/copy-button"
import { TextPanel } from "@/components/text-panel"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { toolSeo } from "@/lib/seo"
import { type CaseStyle, caseStyles, convertCase } from "@/lib/text/case"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/case-converter")

export const Route = createFileRoute("/tools/case-converter")({
  head: () => toolSeo(tool),
  component: CaseConverterPage,
})

const SAMPLE = "The quick brown fox jumps over the lazy dog\nparseHTTPResponse statusCode"

function CaseConverterPage() {
  const ids = useId()
  const [input, setInput] = usePersistedState("case-converter:input", "")
  const [style, setStyle] = usePersistedState<CaseStyle>("case-converter:style", "title")
  const deferredInput = useDeferredValue(input)
  const output = convertCase(deferredInput, style)

  return (
    <ToolLayout
      tool={tool}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>
            <FileText />
            Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput("")} disabled={!input}>
            <Eraser />
            Clear
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <ToggleGroup
          type="single"
          variant="outline"
          value={style}
          onValueChange={(value) => {
            if (value) setStyle(value as CaseStyle)
          }}
          aria-label="Case style"
          className="flex w-full flex-wrap"
        >
          {caseStyles.map((option) => (
            <ToggleGroupItem key={option.id} value={option.id} className="font-mono text-xs">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <TextPanel
            id={`${ids}-input`}
            label="Input"
            placeholder="Type or paste text to convert…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
          />
          <TextPanel
            id={`${ids}-output`}
            label="Result"
            placeholder="Converted text appears here."
            value={output}
            readOnly
            actions={<CopyButton value={output} />}
          />
        </div>
      </div>
    </ToolLayout>
  )
}
