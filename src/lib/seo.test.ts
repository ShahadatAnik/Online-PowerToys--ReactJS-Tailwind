import { describe, expect, test } from "bun:test"
import { homeSeo, jsonLd, toolSeo } from "./seo"
import { site } from "./site"
import { getTool, tools } from "./tools"

type Meta = { name?: string; property?: string; content?: string; title?: string }
const metaContent = (meta: Meta[], key: string) =>
  meta.find((m) => m.name === key || m.property === key)?.content

const graph = (scripts: { children: string }[]) =>
  JSON.parse(scripts[0]?.children ?? "{}")["@graph"] as Record<string, unknown>[]

describe("toolSeo", () => {
  const tool = getTool("/tools/json-formatter")
  const head = toolSeo(tool)

  test("sets title, description, canonical and a per-page image", () => {
    expect(head.meta[0]).toEqual({ title: `${tool.seoTitle} | ${site.name}` })
    expect(metaContent(head.meta, "description")).toBe(tool.metaDescription)
    expect(head.links).toEqual([{ rel: "canonical", href: `${site.url}/tools/json-formatter` }])
    expect(metaContent(head.meta, "og:image")).toBe(`${site.url}/og/json-formatter.png`)
    expect(metaContent(head.meta, "twitter:card")).toBe("summary_large_image")
  })

  test("structured data mirrors the visible FAQ and breadcrumb", () => {
    const nodes = graph(head.scripts)
    const types = nodes.map((node) => node["@type"])
    expect(types).toEqual(["WebApplication", "BreadcrumbList", "FAQPage", "WebSite", "Person"])
    const faq = nodes.find((node) => node["@type"] === "FAQPage") as {
      mainEntity: { name: string }[]
    }
    expect(faq.mainEntity.map((q) => q.name)).toEqual(tool.faqs.map((q) => q.question))
  })
})

test("homeSeo lists every tool", () => {
  const head = homeSeo()
  expect(head.meta[0]).toEqual({ title: site.homeTitle })
  expect(head.links[0]?.href).toBe(`${site.url}/`)
  const list = graph(head.scripts).find((node) => node["@type"] === "ItemList") as {
    itemListElement: { url: string }[]
  }
  expect(list.itemListElement.map((item) => item.url)).toEqual(
    tools.map((tool) => `${site.url}${tool.path}`)
  )
})

test("jsonLd cannot close its script tag early", () => {
  const { children } = jsonLd([{ name: "</script><script>alert(1)</script>" }])
  expect(children).not.toContain("<")
  expect(JSON.parse(children)["@graph"][0].name).toBe("</script><script>alert(1)</script>")
})

test("site description fits a search snippet", () => {
  expect(site.description.length).toBeLessThanOrEqual(160)
  expect(site.homeTitle.length).toBeLessThanOrEqual(60)
})
