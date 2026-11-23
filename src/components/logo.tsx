import { Link } from "@tanstack/react-router"
import { LogoMark } from "@/components/logo-mark"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="Online PowerToys home"
    >
      <LogoMark className="size-8 drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transition-none" />
      <span className="font-display text-xl leading-none tracking-wide">
        Power<span className="text-primary">Toys</span>
      </span>
    </Link>
  )
}
