import { Link } from "@tanstack/react-router"
import { ShieldCheck } from "lucide-react"
import type { ReactNode } from "react"
import { ToolGuide } from "@/components/tool-guide"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { categoryId, type Tool } from "@/lib/tools"

interface ToolLayoutProps {
  tool: Tool
  /** Buttons shown next to the title (e.g. Clear, Sample). */
  actions?: ReactNode
  children: ReactNode
}

/** Shared frame for every tool page: breadcrumb, heading, actions and privacy note. */
export function ToolLayout({ tool, actions, children }: ToolLayoutProps) {
  const Icon = tool.icon

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" hash={categoryId(tool.category)}>
                {tool.category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tool.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {tool.title}
              </h1>
              {tool.isNew ? <Badge variant="secondary">New</Badge> : null}
            </div>
            <p className="max-w-2xl text-sm text-pretty text-muted-foreground md:text-base">
              {tool.description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </header>

      <div className="mt-8">{children}</div>

      <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
        Runs entirely in your browser — nothing you enter is uploaded or stored on a server.
      </p>

      <ToolGuide tool={tool} />
    </div>
  )
}
