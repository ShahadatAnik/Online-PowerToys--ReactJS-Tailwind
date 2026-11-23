import { createFileRoute } from "@tanstack/react-router"
import { format, isValid, parseISO } from "date-fns"
import { Cake, CalendarHeart, Eraser, PartyPopper, RotateCcw, TriangleAlert } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { DatePicker } from "@/components/date-picker"
import { StatCard } from "@/components/stat-card"
import { ToolLayout } from "@/components/tool-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldLabel } from "@/components/ui/field"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { type AgeBreakdown, calculateAge } from "@/lib/date/age"
import { toolSeo } from "@/lib/seo"
import { getTool } from "@/lib/tools"

const tool = getTool("/tools/age-calculator")

export const Route = createFileRoute("/tools/age-calculator")({
  head: () => toolSeo(tool),
  component: AgeCalculatorPage,
})

const toIsoDate = (date: Date) => format(date, "yyyy-MM-dd")
const fromIsoDate = (value: string | null) => {
  if (!value) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}

const n = (value: number) => value.toLocaleString()
const plural = (value: number, unit: string) => `${n(value)} ${unit}${value === 1 ? "" : "s"}`

function summarize(age: AgeBreakdown) {
  return [
    `${plural(age.years, "year")}, ${plural(age.months, "month")}, ${plural(age.days, "day")}`,
    `or ${plural(age.totalMonths, "month")}, ${plural(age.remainderDaysAfterMonths, "day")}`,
    `or ${plural(age.totalWeeks, "week")}, ${plural(age.remainderDaysAfterWeeks, "day")}`,
    `or ${plural(age.totalDays, "day")}`,
    `or ${plural(age.totalHours, "hour")}`,
    `or ${plural(age.totalMinutes, "minute")}`,
    `or ${plural(age.totalSeconds, "second")}`,
  ].join("\n")
}

function AgeCalculatorPage() {
  const ids = useId()
  const [fromIso, setFromIso] = usePersistedState<string | null>("age-calculator:from", null)
  // "Today" is resolved in the browser so the prerendered page never bakes in the build date.
  const [toIso, setToIso] = useState<string | null>(null)

  useEffect(() => {
    setToIso((current) => current ?? toIsoDate(new Date()))
  }, [])

  const from = fromIsoDate(fromIso)
  const to = fromIsoDate(toIso)
  const result = from && to ? calculateAge(from, to) : null
  const isToday = toIso === toIsoDate(new Date())

  return (
    <ToolLayout
      tool={tool}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFromIso(null)
            setToIso(toIsoDate(new Date()))
          }}
          disabled={!fromIso}
        >
          <Eraser />
          Reset
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${ids}-from`}>Date of birth</FieldLabel>
              <DatePicker
                id={`${ids}-from`}
                value={from}
                onChange={(date) => setFromIso(toIsoDate(date))}
                placeholder="Select your birthday"
                toYear={new Date().getFullYear()}
              />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`${ids}-to`}>Age at the date of</FieldLabel>
                {!isToday && toIso ? (
                  <Button
                    variant="link"
                    size="xs"
                    className="h-auto p-0"
                    onClick={() => setToIso(toIsoDate(new Date()))}
                  >
                    <RotateCcw />
                    Today
                  </Button>
                ) : null}
              </div>
              <DatePicker
                id={`${ids}-to`}
                value={to}
                onChange={(date) => setToIso(toIsoDate(date))}
                placeholder="Today"
              />
            </Field>
          </CardContent>
        </Card>

        {result === null ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarHeart />
              </EmptyMedia>
              <EmptyTitle>Pick a date of birth</EmptyTitle>
              <EmptyDescription>
                Your exact age — down to the second — will appear here instantly.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : !result.ok ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Check your dates</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        ) : (
          <AgeResult age={result.value} />
        )}
      </div>
    </ToolLayout>
  )
}

function AgeResult({ age }: { age: AgeBreakdown }) {
  const parts = [
    { value: age.years, unit: "year" },
    { value: age.months, unit: "month" },
    { value: age.days, unit: "day" },
  ]

  return (
    <div className="space-y-6" aria-live="polite">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/15 blur-3xl"
          />
          <CardContent className="relative flex h-full flex-col justify-between gap-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">Exact age</p>
              <CopyButton value={summarize(age)} label="Copy summary" />
            </div>
            <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {parts.map(({ value, unit }) => (
                <span key={unit} className="flex items-baseline gap-1.5">
                  <span className="font-heading text-5xl font-semibold tracking-tight text-primary tabular-nums md:text-6xl">
                    {value}
                  </span>
                  <span className="text-muted-foreground">
                    {unit}
                    {value === 1 ? "" : "s"}
                  </span>
                </span>
              ))}
            </p>
            <p className="text-sm text-muted-foreground">
              Born on a <span className="font-medium text-foreground">{age.bornOnWeekday}</span>.
            </p>
          </CardContent>
        </Card>

        <Card className={age.isBirthday ? "bg-primary text-primary-foreground" : undefined}>
          <CardContent className="flex h-full flex-col justify-between gap-4">
            {age.isBirthday ? (
              <>
                <PartyPopper className="size-8" aria-hidden="true" />
                <div>
                  <p className="font-heading text-2xl font-semibold">Happy birthday!</p>
                  <p className="text-sm opacity-90">
                    {plural(age.years, "year")} young today. Next one in{" "}
                    {plural(age.daysUntilNextBirthday, "day")}.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Cake className="size-8 text-primary" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Next birthday</p>
                  <p className="font-heading text-3xl font-semibold tracking-tight">
                    in {plural(age.daysUntilNextBirthday, "day")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Turning {age.ageAtNextBirthday} on{" "}
                    {format(age.nextBirthday, "EEEE, d MMMM yyyy")}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard
          label="Months"
          value={n(age.totalMonths)}
          hint={`+ ${plural(age.remainderDaysAfterMonths, "day")}`}
        />
        <StatCard
          label="Weeks"
          value={n(age.totalWeeks)}
          hint={`+ ${plural(age.remainderDaysAfterWeeks, "day")}`}
        />
        <StatCard label="Days" value={n(age.totalDays)} />
        <StatCard label="Hours" value={n(age.totalHours)} />
        <StatCard label="Minutes" value={n(age.totalMinutes)} />
        <StatCard label="Seconds" value={n(age.totalSeconds)} />
      </dl>
    </div>
  )
}
