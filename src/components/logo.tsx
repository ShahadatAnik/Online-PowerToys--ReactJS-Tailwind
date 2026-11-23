import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="Online PowerToys home"
    >
      <img
        src="/favicon-32x32.png"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-md transition-transform group-hover:-rotate-6"
      />
      <span className="font-display text-xl leading-none tracking-wide">
        Power<span className="text-primary">Toys</span>
      </span>
    </Link>
  )
}
