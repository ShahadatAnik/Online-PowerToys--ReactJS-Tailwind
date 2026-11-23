import { site } from "@/lib/site"
import type { Tool } from "@/lib/tools"

interface SeoInput {
  /** Page title; omit for the home page. */
  title?: string
  description?: string
  /** Absolute path of the page, used for the canonical URL. */
  path: string
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString()

/** Builds title, description, Open Graph, Twitter and canonical tags for a route's `head()`. */
export function seo({ title, description = site.description, path }: SeoInput) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`
  const url = absoluteUrl(path)
  const image = absoluteUrl(site.ogImage)

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  }
}

/** SEO tags plus WebApplication structured data for a tool page. */
export function toolSeo(tool: Tool) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: absoluteUrl(tool.path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }

  return {
    ...seo({ title: tool.title, description: tool.description, path: tool.path }),
    scripts: [
      {
        type: "application/ld+json",
        // Escape "<" so the JSON can never close the script tag early.
        children: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      },
    ],
  }
}
