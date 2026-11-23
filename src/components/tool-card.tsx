import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/tools"

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon

  return (
    <Link
      to={tool.path}
      className="group relative flex h-full flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all outline-none hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/40 focus-visible:ring-3 focus-visible:ring-ring/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          {tool.isNew ? <Badge variant="secondary">New</Badge> : null}
          <ArrowUpRight
            className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading font-semibold tracking-tight">{tool.title}</h3>
        <p className="text-sm text-muted-foreground">{tool.summary}</p>
      </div>
    </Link>
  )
}
