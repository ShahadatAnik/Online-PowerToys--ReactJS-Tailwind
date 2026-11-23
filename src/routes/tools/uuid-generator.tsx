import { createFileRoute } from "@tanstack/react-router"
import { RefreshCw } from "lucide-react"
import { useCallback, useEffect, useId, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { SwitchField } from "@/components/switch-field"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { toolSeo } from "@/lib/seo"
import { getTool } from "@/lib/tools"
import { generateUuids, MAX_UUIDS } from "@/lib/uuid"

const tool = getTool("/tools/uuid-generator")

export const Route = createFileRoute("/tools/uuid-generator")({
  head: () => toolSeo(tool),
  component: UuidGeneratorPage,
})

const clampCount = (value: number) => Math.min(Math.max(Math.trunc(value) || 1, 1), MAX_UUIDS)

function UuidGeneratorPage() {
  const ids = useId()
  const [options, setOptions] = usePersistedState("uuid-generator:options", {
    count: 5,
    uppercase: false,
    hyphens: true,
  })
  // Generated only in the browser so prerendered HTML never ships fixed IDs.
  const [uuids, setUuids] = useState<string[]>([])

  const regenerate = useCallback(() => setUuids(generateUuids(options)), [options])

  useEffect(() => {
    regenerate()
  }, [regenerate])

  const all = uuids.join("\n")

  return (
    <ToolLayout tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${ids}-count`}>How many</FieldLabel>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[Math.min(options.count, 100)]}
                    min={1}
                    max={100}
                    onValueChange={([count]) =>
                      setOptions((o) => ({ ...o, count: clampCount(count ?? 1) }))
                    }
                    aria-label="Number of UUIDs"
                    className="flex-1"
                  />
                  <Input
                    id={`${ids}-count`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_UUIDS}
                    value={options.count}
                    onChange={(event) =>
                      setOptions((o) => ({ ...o, count: clampCount(event.target.valueAsNumber) }))
                    }
                    className="w-20 tabular-nums"
                  />
                </div>
                <FieldDescription>Up to {MAX_UUIDS} at once.</FieldDescription>
              </Field>
              <SwitchField
                label="Uppercase"
                checked={options.uppercase}
                onCheckedChange={(uppercase) => setOptions((o) => ({ ...o, uppercase }))}
              />
              <SwitchField
                label="Hyphens"
                checked={options.hyphens}
                onCheckedChange={(hyphens) => setOptions((o) => ({ ...o, hyphens }))}
              />
              <Button onClick={regenerate} className="w-full">
                <RefreshCw />
                Regenerate
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex min-h-12 items-center justify-between gap-2 border-b border-border/70 px-4 py-2">
            <h2 className="text-sm font-medium">
              {uuids.length.toLocaleString()} UUID{uuids.length === 1 ? "" : "s"} (v4)
            </h2>
            <CopyButton value={all} label="Copy all" />
          </div>
          <ol
            className="max-h-[32rem] divide-y divide-border/60 overflow-y-auto"
            aria-live="polite"
          >
            {uuids.map((uuid, index) => (
              <li key={uuid} className="group flex items-center gap-3 px-4 py-2 hover:bg-muted/40">
                <span className="w-8 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <code className="min-w-0 flex-1 truncate font-mono text-sm select-all">{uuid}</code>
                <CopyButton
                  value={uuid}
                  label="Copy"
                  variant="ghost"
                  size="xs"
                  className="opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
