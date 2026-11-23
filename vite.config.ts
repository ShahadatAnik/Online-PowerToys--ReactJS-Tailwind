import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { site } from "./src/lib/site.ts"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // Dev-only TanStack devtools; stripped from production builds.
    devtools(),
    tailwindcss(),
    tanstackStart({
      // Every route is static, so prerender all of them to HTML. Static routes are
      // discovered automatically; link crawling is off because it would also pick up
      // in-page anchors such as "/#text" and list them in the sitemap.
      prerender: {
        enabled: true,
        crawlLinks: false,
        failOnError: true,
      },
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
