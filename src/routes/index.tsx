import { createFileRoute } from "@tanstack/react-router"
import { Lock, Search, SearchX, Sparkles, X, Zap } from "lucide-react"
import { useDeferredValue, useState } from "react"
import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { homeSeo } from "@/lib/seo"
import { categoryId, searchTools, toolCategories, tools } from "@/lib/tools"

export const Route = createFileRoute("/")({
  head: homeSeo,
  component: HomePage,
})

const features = [
  {
    icon: Lock,
    title: "Private by design",
    text: "Every tool runs locally in your browser. Nothing is uploaded.",
  },
  {
    icon: Zap,
    title: "Instant results",
    text: "Output updates as you type — no buttons, no waiting.",
  },
  {
    icon: Sparkles,
    title: "Free & open source",
    text: "No sign-up, no ads, no tracking. Just useful tools.",
  },
]

function HomePage() {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const results = searchTools(deferredQuery)
  const isFiltering = deferredQuery.trim() !== ""

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-112 max-w-4xl rounded-full bg-primary/15 blur-3xl dark:bg-primary/10"
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6 md:pt-24 md:pb-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Lock className="size-3.5" aria-hidden="true" />
            {tools.length} tools · 100% in your browser
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[0.9] tracking-wide text-balance sm:text-7xl md:text-8xl">
            Online <span className="text-primary">PowerToys</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground md:text-lg">
            Fast, private, no-nonsense utilities for everyday text, developer and date tasks.
          </p>

          <div className="mt-8 w-full max-w-lg">
            <label htmlFor="tool-search" className="sr-only">
              Filter tools
            </label>
            <InputGroup className="h-11 bg-background/80 shadow-sm backdrop-blur">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                id="tool-search"
                type="search"
                placeholder="Filter tools — try “json” or “birthday”"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("")
                }}
                autoComplete="off"
              />
              {query ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear filter"
                    onClick={() => setQuery("")}
                  >
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </div>
        </div>
      </section>

      <section
        id="tools"
        aria-label="Tools"
        className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6"
      >
        {results.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No tools match “{deferredQuery}”</EmptyTitle>
              <EmptyDescription>Try a different keyword, or browse everything.</EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" onClick={() => setQuery("")}>
              Show all tools
            </Button>
          </Empty>
        ) : isFiltering ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {toolCategories.map((category) => (
              <section
                key={category}
                id={categoryId(category)}
                aria-labelledby={`${categoryId(category)}-heading`}
              >
                <h2
                  id={`${categoryId(category)}-heading`}
                  className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase"
                >
                  {category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools
                    .filter((tool) => tool.category === category)
                    .map((tool) => (
                      <ToolCard key={tool.path} tool={tool} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <section aria-label="Why PowerToys" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
