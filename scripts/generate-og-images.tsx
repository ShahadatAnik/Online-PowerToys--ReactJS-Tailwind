/**
 * Build-time SEO assets, generated from the tool registry so new tools get them for free:
 *   - public/og/<page>.png  1200×630 Open Graph / Twitter card image for every page
 *   - public/llms.txt       site summary for AI assistants and answer engines (llmstxt.org)
 *
 * Runs before `vite build` (see the "build" script). The output is git-ignored.
 */
import { mkdir, rm } from "node:fs/promises"
import { join } from "node:path"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import satori, { type Font } from "satori"
import { decompress } from "wawoff2"
import { LogoMark } from "../src/components/logo-mark"
import { OG_IMAGE_SIZE } from "../src/lib/seo"
import { site } from "../src/lib/site"
import { ogImagePath, toolCategories, toolSlug, tools } from "../src/lib/tools"
import { renderSvg, svgDataUri, svgToPng } from "./lib/render"

const root = join(import.meta.dir, "..")
const publicDir = join(root, "public")

const colors = {
  background: "#080c15",
  foreground: "#f7f5f2",
  muted: "#9da5b1",
  primary: "#fd9330",
  from: "#ffb14a",
  to: "#f0501c",
}

// ---------- fonts ----------

const geist = (weight: 400 | 500 | 700) =>
  Bun.file(
    Bun.resolveSync(`@fontsource/geist/files/geist-latin-${weight}-normal.woff`, import.meta.dir)
  ).arrayBuffer()

/** Satori can't read WOFF2, so decode the site's Arthemis font to TrueType. */
async function arthemis() {
  const woff2 = await Bun.file(join(root, "src/assets/fonts/arthemis.woff2")).bytes()
  // Copy out of the WebAssembly memory view so the buffer holds only the font bytes.
  return (await decompress(woff2)).slice().buffer as ArrayBuffer
}

const fonts: Font[] = [
  { name: "Geist", data: await geist(400), weight: 400, style: "normal" },
  { name: "Geist", data: await geist(500), weight: 500, style: "normal" },
  { name: "Geist", data: await geist(700), weight: 700, style: "normal" },
  { name: "Arthemis", data: await arthemis(), weight: 400, style: "normal" },
]

// ---------- shared pieces ----------

const logoUri = svgDataUri(renderSvg(<LogoMark />))
const iconUri = (Icon: LucideIcon, size: number) =>
  svgDataUri(renderToStaticMarkup(<Icon size={size} color={colors.primary} strokeWidth={1.75} />))

/** Deterministic star dots, echoing the site's dark-mode starfield. */
function stars(count: number) {
  let seed = 7
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: count }, () => {
    const size = random() < 0.85 ? 2 : 3
    const left = Math.round(random() * OG_IMAGE_SIZE.width)
    const top = Math.round(random() * OG_IMAGE_SIZE.height)
    return (
      <div
        key={`${left}-${top}`}
        style={{
          position: "absolute",
          left,
          top,
          width: size,
          height: size,
          borderRadius: size,
          background: `rgba(255,255,255,${(0.2 + random() * 0.45).toFixed(2)})`,
        }}
      />
    )
  })
}

const host = new URL(site.url).host

function Frame({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        // Satori sizes boxes as content-box by default; keep the canvas exactly 1200×630.
        boxSizing: "border-box",
        padding: "64px 80px 72px",
        fontFamily: "Geist",
        color: colors.foreground,
        backgroundColor: colors.background,
        backgroundImage:
          "radial-gradient(circle at 92% -10%, rgba(240,80,28,0.42), rgba(240,80,28,0) 55%), radial-gradient(circle at -5% 110%, rgba(255,177,74,0.16), rgba(255,177,74,0) 50%)",
      }}
    >
      {stars(70)}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img src={logoUri} width={64} height={64} alt="" />
        <div style={{ display: "flex", fontFamily: "Arthemis", fontSize: 44, letterSpacing: 1 }}>
          Online&nbsp;<span style={{ color: colors.primary }}>PowerToys</span>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 26,
          color: colors.muted,
        }}
      >
        <div style={{ display: "flex", fontWeight: 500 }}>
          {host}
          {path === "/" ? "" : path}
        </div>
        <div
          style={{
            display: "flex",
            padding: "10px 22px",
            borderRadius: 999,
            border: "1px solid rgba(253,147,48,0.35)",
            background: "rgba(253,147,48,0.1)",
            color: colors.primary,
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          Free · Private · Runs in your browser
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: OG_IMAGE_SIZE.width,
          height: 8,
          backgroundImage: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
        }}
      />
    </div>
  )
}

// ---------- pages ----------

function HomeCard() {
  return (
    <Frame path="/">
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.05,
          }}
        >
          <span>Fast, private tools</span>
          <span style={{ color: colors.primary }}>for power users.</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 1000 }}>
          {tools.map((tool) => (
            <div
              key={tool.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                fontSize: 24,
                color: colors.foreground,
              }}
            >
              <img src={iconUri(tool.icon, 26)} width={26} height={26} alt="" />
              {tool.title}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  return (
    <Frame path={tool.path}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 22,
              border: "1px solid rgba(253,147,48,0.35)",
              background: "rgba(253,147,48,0.12)",
            }}
          >
            <img src={iconUri(tool.icon, 46)} width={46} height={46} alt="" />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 500,
              color: colors.muted,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {tool.category} tool
          </div>
        </div>
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02 }}>
          {tool.title}
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: colors.muted,
            maxWidth: 980,
            lineClamp: 2,
          }}
        >
          {tool.description.length <= 120 ? tool.description : tool.summary}
        </div>
      </div>
    </Frame>
  )
}

async function renderCard(node: ReactNode, slug: string) {
  const svg = await satori(node, { ...OG_IMAGE_SIZE, fonts })
  const png = await svgToPng(svg, OG_IMAGE_SIZE.width)
  await Bun.write(join(publicDir, ogImagePath(slug)), png)
  return slug
}

// ---------- llms.txt ----------

function llmsTxt() {
  const url = (path: string) => new URL(path, site.url).toString()
  const sections = toolCategories.map((category) =>
    [
      `## ${category} tools`,
      "",
      ...tools
        .filter((tool) => tool.category === category)
        .map((tool) => `- [${tool.title}](${url(tool.path)}): ${tool.metaDescription}`),
    ].join("\n")
  )
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Every tool runs entirely in the browser: input is never uploaded, there is no account, and no tracking.",
    "",
    ...sections.flatMap((section) => [section, ""]),
    "## Optional",
    "",
    `- [Source code](${site.repository}): open-source repository (MIT).`,
    `- [Sitemap](${url("/sitemap.xml")})`,
    "",
  ].join("\n")
}

// ---------- run ----------

await rm(join(publicDir, "og"), { recursive: true, force: true })
await mkdir(join(publicDir, "og"), { recursive: true })

const written = await Promise.all([
  renderCard(<HomeCard />, "home"),
  ...tools.map((tool) => renderCard(<ToolCard tool={tool} />, toolSlug(tool))),
])
await Bun.write(join(publicDir, "llms.txt"), llmsTxt())

console.log(`[seo] ${written.length} Open Graph images in public/og, plus public/llms.txt`)
