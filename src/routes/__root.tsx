import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, HeadContent, ScriptOnce, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { ReactNode } from "react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Starfield } from "@/components/starfield"
import { ThemeProvider, themeScript } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { site } from "@/lib/site"
import arthemisFont from "../assets/fonts/arthemis.woff2?url"
import appCss from "../styles.css?url"

/** True when the catch-all route (src/routes/$.tsx) rendered the Not Found page. */
const isNotFoundPage = (matches: readonly { routeId: string }[]) => matches.at(-1)?.routeId === "/$"

export const Route = createRootRoute({
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "description", content: site.description },
      { name: "author", content: site.author.name },
      { name: "theme-color", content: site.themeColor },
      { name: "color-scheme", content: "light dark" },
      ...(isNotFoundPage(matches)
        ? [{ title: `Page not found | ${site.name}` }, { name: "robots", content: "noindex" }]
        : []),
    ],
    links: [
      {
        rel: "preload",
        href: arthemisFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{themeScript}</ScriptOnce>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <a
              href="#main"
              className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              Skip to content
            </a>
            <Starfield />
            <div className="relative flex min-h-svh flex-col">
              <SiteHeader />
              <main id="main" className="flex flex-1 flex-col">
                {children}
              </main>
              <SiteFooter />
            </div>
            <Toaster position="bottom-right" closeButton />
          </TooltipProvider>
        </ThemeProvider>
        <TanStackDevtools
          config={{ position: "bottom-left" }}
          plugins={[{ name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}
