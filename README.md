<div align="center">
  <img src="public/apple-touch-icon.png" alt="Online PowerToys logo" width="80" height="80">

  <h3 align="center">Online PowerToys</h3>

  <p align="center">
    Fast, private tools for power users — everything runs in your browser.
    <br />
    <br />
    <a href="https://online-powertoys.netlify.app/">Live site</a>
  </p>
</div>

## Tools

| Category    | Tool                     | Route                   |
| ----------- | ------------------------ | ----------------------- |
| Text        | Line to Space Converter  | `/tools/line-to-space`  |
| Text        | Word & Character Counter | `/tools/word-counter`   |
| Text        | Case Converter           | `/tools/case-converter` |
| Developer   | JSON Formatter           | `/tools/json-formatter` |
| Developer   | Base64 Encoder / Decoder | `/tools/base64`         |
| Developer   | UUID Generator           | `/tools/uuid-generator` |
| Date & Time | Age Calculator           | `/tools/age-calculator` |

Also included: a ⌘K / Ctrl+K command palette, light/dark/system themes, inputs saved per tool in
`localStorage`, and per-page SEO metadata with a sitemap.

## Stack

Everything runs on **[Bun](https://bun.sh)**: package manager, script runner, Vite runtime and test runner.

- [TanStack Start](https://tanstack.com/start) + TanStack Router (file-based, type-safe routes), fully prerendered to static HTML
- React 19, TypeScript 7 (strict)
- Tailwind CSS 4 (CSS-first config in `src/styles.css`) + [shadcn/ui](https://ui.shadcn.com) (Radix)
- `date-fns` for calendar-accurate date math
- Biome for linting and formatting, `bun test` + Testing Library (happy-dom) for tests

## Getting started

Requires Bun ≥ 1.4.

```sh
bun install
bun run dev        # http://localhost:3000
```

| Script                   | What it does                                            |
| ------------------------ | ------------------------------------------------------- |
| `bun run dev`            | Start the dev server                                    |
| `bun run build`          | Generate OG images, then build and prerender to `dist/` |
| `bun run generate:icons` | Regenerate favicons and app icons from the logo         |
| `bun run preview`        | Serve the production build                              |
| `bun run test`           | Run unit and component tests                            |
| `bun run check`          | Lint and check formatting (`check:fix` to apply)        |
| `bun run typecheck`      | Type-check the project                                  |
| `bun run validate`       | All of the above, the same as CI                        |

## Project layout

```
src/
  routes/            File-based routes (__root.tsx shell, index.tsx home, tools/*)
  components/        App components (layout, command menu, theme, tool UI)
  components/ui/     shadcn/ui components (add more with `bunx shadcn@latest add <name>`)
  lib/               Pure, unit-tested logic (text, json, base64, dates, uuid) + tool registry
  hooks/             Reusable hooks (persisted state, clipboard, hotkeys)
  styles.css         Tailwind + theme tokens, page transitions
scripts/
  generate-icons.tsx      Favicon, Apple touch and PWA icons from <LogoMark> (output committed)
  generate-og-images.tsx  Per-page Open Graph images + llms.txt (runs on every build)
```

## SEO

Every page is prerendered HTML with its own:

- title, meta description and canonical URL (no trailing slash, served without redirects)
- Open Graph and Twitter card tags, with a generated 1200×630 image per page
- JSON-LD structured data: `WebSite`, author and `ItemList` on the home page;
  `WebApplication`, `BreadcrumbList` and `FAQPage` on tool pages
- visible how-to steps, FAQ and related tools, all from the tool registry

The build also emits `sitemap.xml` (with `lastmod` from git and image entries) and `llms.txt`.
Unknown URLs return 404 with `noindex`.

The logo lives in `src/components/logo-mark.tsx`. After changing it, run `bun run generate:icons`.

## Adding a tool

1. Put the logic in `src/lib/` as pure functions, with a `*.test.ts` next to it.
2. Add an entry to the `tools` array in `src/lib/tools.ts`: title, description, category, icon,
   keywords, plus the SEO fields (`seoTitle`, `metaDescription`, `howTo`, `faqs`). The home page,
   command palette, footer, sitemap, OG image and `llms.txt` pick it up automatically.
3. Create `src/routes/tools/<slug>.tsx` using `ToolLayout` and `toolSeo(getTool("/tools/<slug>"))` for `head`.

## Deployment

The site is deployed to Netlify as static files (see `netlify.toml`). Netlify runs `bun run build`
and publishes `dist/client`. Unknown paths get the SPA shell (`_shell.html`) with a 404 status, and the old
pre-2026 URLs (`/AgeCalculator`, …) redirect to the new routes.

## Author

👤 **Shahadat Anik**

- Website: https://shahadatanik.github.io/
- GitHub: [@ShahadatAnik](https://github.com/ShahadatAnik)

Give a ⭐️ if this project helped you!
