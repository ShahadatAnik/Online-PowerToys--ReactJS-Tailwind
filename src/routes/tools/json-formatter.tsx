import { createFileRoute } from "@tanstack/react-router"
import { CircleCheck, Download, Eraser, FileText, TriangleAlert } from "lucide-react"
import { useDeferredValue, useId } from "react"
import { CopyButton } from "@/components/copy-button"
import { TextPanel } from "@/components/text-panel"
import { ToolLayout } from "@/components/tool-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { formatJson, type JsonIndent, minifyJson } from "@/lib/json"
import { toolSeo } from "@/lib/seo"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/json-formatter")

export const Route = createFileRoute("/tools/json-formatter")({
  head: () => toolSeo(tool),
  component: JsonFormatterPage,
})

const SAMPLE = JSON.stringify({
  name: "Online PowerToys",
  version: 1,
  tools: ["json-formatter", "base64", "uuid-generator"],
  settings: { theme: "system", private: true, analytics: null },
})

type Mode = "format" | "minify"

function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }))
  const link = Object.assign(document.createElement("a"), { href: url, download: filename })
  link.click()
  URL.revokeObjectURL(url)
}

function JsonFormatterPage() {
  const ids = useId()
  const [input, setInput] = usePersistedState("json-formatter:input", "")
  const [mode, setMode] = usePersistedState<Mode>("json-formatter:mode", "format")
  const [indent, setIndent] = usePersistedState<JsonIndent>("json-formatter:indent", "2")
  const [sortKeys, setSortKeys] = usePersistedState("json-formatter:sort", false)

  const deferredInput = useDeferredValue(input)
  const isEmpty = deferredInput.trim() === ""
  const result = isEmpty
    ? null
    : mode === "format"
      ? formatJson(deferredInput, { indent, sortKeys })
      : minifyJson(deferredInput, { sortKeys })
  const output = result?.ok ? result.value : ""

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
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <ToggleGroup
            type="single"
            variant="outline"
            value={mode}
            onValueChange={(value) => {
              if (value) setMode(value as Mode)
            }}
            aria-label="Output mode"
          >
            <ToggleGroupItem value="format">Pretty</ToggleGroupItem>
            <ToggleGroupItem value="minify">Minify</ToggleGroupItem>
          </ToggleGroup>
          <Field orientation="horizontal" className="w-auto" data-disabled={mode === "minify"}>
            <FieldLabel htmlFor={`${ids}-indent`}>Indent</FieldLabel>
            <Select
              value={indent}
              onValueChange={(value) => setIndent(value as JsonIndent)}
              disabled={mode === "minify"}
            >
              <SelectTrigger id={`${ids}-indent`} className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="tab">Tabs</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <Switch id={`${ids}-sort`} checked={sortKeys} onCheckedChange={setSortKeys} />
            <FieldLabel htmlFor={`${ids}-sort`}>Sort keys</FieldLabel>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextPanel
            id={`${ids}-input`}
            label="JSON input"
            placeholder='{"paste": "your JSON here"}'
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={result?.ok === false}
            aria-describedby={`${ids}-status`}
            mono
            autoFocus
            footer={
              <span id={`${ids}-status`} className="flex items-center gap-1.5">
                {result === null ? (
                  "Waiting for input"
                ) : result.ok ? (
                  <>
                    <CircleCheck className="size-3.5 text-primary" aria-hidden="true" />
                    Valid JSON
                  </>
                ) : (
                  <>
                    <TriangleAlert className="size-3.5 text-destructive" aria-hidden="true" />
                    Invalid JSON
                    {result.details?.line
                      ? ` at line ${result.details.line}, column ${result.details.column}`
                      : ""}
                  </>
                )}
              </span>
            }
          />
          <TextPanel
            id={`${ids}-output`}
            label="Output"
            placeholder="Formatted JSON appears here."
            value={output}
            readOnly
            mono
            actions={
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!output}
                  onClick={() => downloadText(output, "formatted.json")}
                  aria-label="Download as file"
                >
                  <Download />
                </Button>
                <CopyButton value={output} />
              </>
            }
          />
        </div>

        {result && !result.ok ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Couldn't parse JSON</AlertTitle>
            <AlertDescription className="font-mono text-xs">{result.error}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </ToolLayout>
  )
}
