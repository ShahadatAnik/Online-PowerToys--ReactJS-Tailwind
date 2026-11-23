import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  className?: string
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-colors",
        className
      )}
    >
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="font-heading text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
      {hint ? <dd className="text-xs text-muted-foreground">{hint}</dd> : null}
    </div>
  )
}
