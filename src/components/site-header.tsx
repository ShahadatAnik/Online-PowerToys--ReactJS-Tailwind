import { CommandMenu } from "@/components/command-menu"
import { GitHubIcon } from "@/components/icons"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur-lg [view-transition-name:site-header] supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-1.5">
          <CommandMenu />
          <Button variant="ghost" size="icon" asChild>
            <a
              href={site.repository}
              target="_blank"
              rel="noreferrer"
              aria-label="Source code on GitHub"
            >
              <GitHubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
