import { createFileRoute } from "@tanstack/react-router"
import { Eraser, FileText } from "lucide-react"
import { useDeferredValue, useId } from "react"
import { CopyButton } from "@/components/copy-button"
import { SwitchField } from "@/components/switch-field"
import { TextPanel } from "@/components/text-panel"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { toolSeo } from "@/lib/seo"
import { defaultJoinLinesOptions, joinLines } from "@/lib/text/whitespace"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/line-to-space")

export const Route = createFileRoute("/tools/line-to-space")({
  head: () => toolSeo(tool),
  component: LineToSpacePage,
})

const separators = [
  { id: "space", label: "Space", value: " " },
  { id: "comma-space", label: "Comma + space", value: ", " },
  { id: "comma", label: "Comma", value: "," },
  { id: "semicolon", label: "Semicolon", value: "; " },
  { id: "pipe", label: "Pipe", value: " | " },
  { id: "tab", label: "Tab", value: "\t" },
  { id: "none", label: "Nothing", value: "" },
  { id: "custom", label: "Custom…", value: null },
] as const

type SeparatorId = (typeof separators)[number]["id"]

const SAMPLE = `Lorem ipsum dolor sit amet,
consectetur adipiscing elit.

  Sed do eiusmod tempor
incididunt ut labore   et dolore
magna aliqua.`

const lineCount = (text: string) => (text ? text.split(/\r\n|\r|\n/).length : 0)

function LineToSpacePage() {
  const ids = useId()
  const [input, setInput] = usePersistedState("line-to-space:input", "")
  const [separatorId, setSeparatorId] = usePersistedState<SeparatorId>(
    "line-to-space:separator",
    "space"
  )
  const [customSeparator, setCustomSeparator] = usePersistedState("line-to-space:custom", " - ")
  const [options, setOptions] = usePersistedState("line-to-space:options", {
    collapseWhitespace: defaultJoinLinesOptions.collapseWhitespace,
    trimLines: defaultJoinLinesOptions.trimLines,
    removeEmptyLines: defaultJoinLinesOptions.removeEmptyLines,
  })

  const separator = separators.find((s) => s.id === separatorId)?.value ?? customSeparator
  const deferredInput = useDeferredValue(input)
  const output = joinLines(deferredInput, { ...options, separator })

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
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <TextPanel
            id={`${ids}-input`}
            label="Input"
            placeholder="Paste multi-line text here…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
            footer={
              <>
                <span>{lineCount(input).toLocaleString()} lines</span>
                <span>{input.length.toLocaleString()} characters</span>
              </>
            }
          />
          <TextPanel
            id={`${ids}-output`}
            label="Result"
            placeholder="Your single-line text appears here."
            value={output}
            readOnly
            actions={<CopyButton value={output} />}
            footer={<span>{output.length.toLocaleString()} characters</span>}
          />
        </div>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${ids}-separator`}>Join lines with</FieldLabel>
                <Select
                  value={separatorId}
                  onValueChange={(value) => setSeparatorId(value as SeparatorId)}
                >
                  <SelectTrigger id={`${ids}-separator`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {separators.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {separatorId === "custom" ? (
                <Field>
                  <FieldLabel htmlFor={`${ids}-custom`}>Custom separator</FieldLabel>
                  <Input
                    id={`${ids}-custom`}
                    value={customSeparator}
                    onChange={(event) => setCustomSeparator(event.target.value)}
                    className="font-mono"
                  />
                </Field>
              ) : null}
              <SwitchField
                label="Collapse whitespace"
                description="Turn repeated spaces and tabs into one space."
                checked={options.collapseWhitespace}
                onCheckedChange={(collapseWhitespace) =>
                  setOptions((o) => ({ ...o, collapseWhitespace }))
                }
              />
              <SwitchField
                label="Trim lines"
                description="Remove spaces at the start and end of each line."
                checked={options.trimLines}
                onCheckedChange={(trimLines) => setOptions((o) => ({ ...o, trimLines }))}
              />
              <SwitchField
                label="Skip empty lines"
                description="Ignore blank lines instead of adding extra separators."
                checked={options.removeEmptyLines}
                onCheckedChange={(removeEmptyLines) =>
                  setOptions((o) => ({ ...o, removeEmptyLines }))
                }
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
