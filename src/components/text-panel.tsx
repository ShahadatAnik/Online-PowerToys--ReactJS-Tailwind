import type { ComponentProps, ReactNode } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface TextPanelProps extends ComponentProps<typeof Textarea> {
  id: string
  label: string
  /** Controls rendered on the right of the panel header (copy, clear…). */
  actions?: ReactNode
  /** Status line under the textarea (counts, hints, errors). */
  footer?: ReactNode
  mono?: boolean
}

/** A card-styled textarea with a labelled header and optional footer. */
export function TextPanel({
  id,
  label,
  actions,
  footer,
  mono = false,
  className,
  ...props
}: TextPanelProps) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/70 has-[textarea[aria-invalid=true]]:ring-destructive/60">
      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-border/70 px-4 py-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {actions ? <div className="flex items-center gap-1.5">{actions}</div> : null}
      </div>
      <Textarea
        id={id}
        spellCheck={false}
        className={cn(
          "field-sizing-fixed min-h-72 flex-1 resize-y rounded-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed shadow-none focus-visible:ring-0 aria-invalid:ring-0 md:text-sm dark:bg-transparent",
          mono && "font-mono text-[13px]",
          className
        )}
        {...props}
      />
      {footer ? (
        <div className="flex min-h-9 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/70 px-4 py-2 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
