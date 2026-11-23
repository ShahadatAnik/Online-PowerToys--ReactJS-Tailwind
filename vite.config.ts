import { execFileSync } from "node:child_process"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { site } from "./src/lib/site.ts"
import { ogImagePath, toolSlug, tools } from "./src/lib/tools.ts"

/** Date of the last commit touching any of the files, for sitemap `<lastmod>`. */
function lastModified(...files: string[]): string | undefined {
  try {
    const dates = files
      .map((file) =>
        execFileSync("git", ["log", "-1", "--format=%cI", "--", file]).toString().trim()
      )
      .filter(Boolean)
      .sort()
    return dates.at(-1)
  } catch {
    // No git (or no history) in this environment: omit lastmod rather than guess.
    return undefined
  }
}

const image = (slug: string) => [{ loc: new URL(ogImagePath(slug), site.url).toString() }]

/** Every indexable page, with its sitemap metadata. */
const pages = [
  {
    path: "/",
    sitemap: {
      priority: 1,
      changefreq: "weekly" as const,
      lastmod: lastModified("src/routes/index.tsx", "src/lib/tools.ts"),
      images: image("home"),
    },
  },
  ...tools.map((tool) => ({
    path: tool.path,
    sitemap: {
      priority: 0.8,
      changefreq: "monthly" as const,
      lastmod: lastModified(`src/routes${tool.path}.tsx`, "src/lib/tools.ts"),
      images: image(toolSlug(tool)),
    },
  })),
]

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // Dev-only TanStack devtools; stripped from production builds.
    devtools(),
    tailwindcss(),
    tanstackStart({
      // Every route is static, so prerender all of them to HTML. Link crawling is off
      // because it would also pick up in-page anchors such as "/#text" for the sitemap.
      prerender: {
        enabled: true,
        crawlLinks: false,
        failOnError: true,
        // Write /tools/x.html rather than /tools/x/index.html. Netlify serves the former at
        // /tools/x directly; the latter would 301 to /tools/x/, away from the canonical URL.
        autoSubfolderIndex: false,
      },
      pages,
      // Client-rendered shell (/_shell.html) that Netlify serves for unknown URLs; the
      // router then renders the catch-all route (src/routes/$.tsx) for whatever URL it is.
      // maskPath must not be "/" (the default): pages are keyed by path, so the shell
      // would claim "/" and the real home page would never be prerendered.
      spa: {
        enabled: true,
        maskPath: "/404",
      },
      sitemap: {
        enabled: true,
        host: site.url,
      },
    }),
    viteReact(),
  ],
})
