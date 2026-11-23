import { Link } from "@tanstack/react-router"
import { ShieldCheck } from "lucide-react"
import { site } from "@/lib/site"
import { toolCategories, tools } from "@/lib/tools"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <p className="font-display text-2xl leading-none">
            Online <span className="text-primary">PowerToys</span>
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline}.</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Everything runs locally in your browser.
          </p>
        </div>
        {toolCategories.map((category) => (
          <nav key={category} aria-label={`${category} tools`} className="space-y-3 text-sm">
            <h2 className="font-medium">{category}</h2>
            <ul className="space-y-2">
              {tools
                .filter((tool) => tool.category === category)
                .map((tool) => (
                  <li key={tool.path}>
                    <Link
                      to={tool.path}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Built by{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {site.author.name}
            </a>
            .
          </p>
          <a
            href={site.repository}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
