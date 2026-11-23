import { createFileRoute } from "@tanstack/react-router"
import { ArrowDownUp, Eraser, TriangleAlert } from "lucide-react"
import { useDeferredValue, useId } from "react"
import { CopyButton } from "@/components/copy-button"
import { TextPanel } from "@/components/text-panel"
import { ToolLayout } from "@/components/tool-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { decodeBase64, encodeBase64 } from "@/lib/encoding/base64"
import { toolSeo } from "@/lib/seo"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/base64")

export const Route = createFileRoute("/tools/base64")({
  head: () => toolSeo(tool),
  component: Base64Page,
})

type Mode = "encode" | "decode"

function Base64Page() {
  const ids = useId()
  const [mode, setMode] = usePersistedState<Mode>("base64:mode", "encode")
  const [input, setInput] = usePersistedState("base64:input", "")
  const [urlSafe, setUrlSafe] = usePersistedState("base64:url-safe", false)

  const deferredInput = useDeferredValue(input)
  const decoded = mode === "decode" && deferredInput ? decodeBase64(deferredInput) : null
  const output =
    mode === "encode" ? encodeBase64(deferredInput, { urlSafe }) : decoded?.ok ? decoded.value : ""

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode")
    setInput(output)
  }

  return (
    <ToolLayout
      tool={tool}
      actions={
        <Button variant="outline" size="sm" onClick={() => setInput("")} disabled={!input}>
          <Eraser />
          Clear
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList>
              <TabsTrigger value="encode" className="px-4">
                Encode
              </TabsTrigger>
              <TabsTrigger value="decode" className="px-4">
                Decode
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-4">
            {mode === "encode" ? (
              <Field orientation="horizontal" className="w-auto">
                <Switch id={`${ids}-url`} checked={urlSafe} onCheckedChange={setUrlSafe} />
                <FieldLabel htmlFor={`${ids}-url`}>URL-safe</FieldLabel>
              </Field>
            ) : null}
            <Button variant="outline" size="sm" onClick={swap} disabled={!output}>
              <ArrowDownUp />
              Use output as input
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextPanel
            id={`${ids}-input`}
            label={mode === "encode" ? "Plain text" : "Base64"}
            placeholder={mode === "encode" ? "Text to encode…" : "Base64 to decode…"}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={decoded?.ok === false}
            mono={mode === "decode"}
            autoFocus
          />
          <TextPanel
            id={`${ids}-output`}
            label={mode === "encode" ? "Base64" : "Plain text"}
            placeholder="Result appears here."
            value={output}
            readOnly
            mono={mode === "encode"}
            className="break-all"
            actions={<CopyButton value={output} />}
            footer={<span>{output.length.toLocaleString()} characters</span>}
          />
        </div>

        {decoded && !decoded.ok ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Couldn't decode</AlertTitle>
            <AlertDescription>{decoded.error}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </ToolLayout>
  )
}
