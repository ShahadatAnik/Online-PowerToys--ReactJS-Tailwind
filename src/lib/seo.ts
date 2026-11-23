import { site } from "@/lib/site"
import { ogImagePath, type Tool, toolSlug, tools } from "@/lib/tools"

/** Size of every generated Open Graph image (see scripts/generate-og-images.tsx). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

interface SeoInput {
  /** Full document title. */
  title: string
  description: string
  /** Absolute path of the page, used for the canonical URL. */
  path: string
  /** Public path of the page's Open Graph image. */
  image: string
  imageAlt: string
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString()

/** Title, description, canonical, Open Graph and Twitter tags for a route's `head()`. */
export function seo({ title, description, path, image, imageAlt }: SeoInput) {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: String(OG_IMAGE_SIZE.width) },
      { property: "og:image:height", content: String(OG_IMAGE_SIZE.height) },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [{ rel: "canonical", href: url }],
  }
}

/** A JSON-LD `<script>` entry for a route's `head().scripts`. */
export function jsonLd(graph: Record<string, unknown>[]) {
  return {
    type: "application/ld+json",
    // Escape "<" so the JSON can never close the script tag early.
    children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
      /</g,
      "\\u003c"
    ),
  }
}

const ids = {
  website: `${site.url}/#website`,
  author: `${site.url}/#author`,
}

const authorNode = {
  "@type": "Person",
  "@id": ids.author,
  name: site.author.name,
  url: site.author.url,
  sameAs: [site.author.url],
}

const websiteNode = {
  "@type": "WebSite",
  "@id": ids.website,
  name: site.name,
  alternateName: site.shortName,
  url: absoluteUrl("/"),
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": ids.author },
}

/** Head tags and structured data (WebSite, author, list of tools) for the home page. */
export function homeSeo() {
  return {
    ...seo({
      title: site.homeTitle,
      description: site.description,
      path: "/",
      image: ogImagePath("home"),
      imageAlt: `${site.name}: ${site.tagline}`,
    }),
    scripts: [
      jsonLd([
        websiteNode,
        authorNode,
        {
          "@type": "ItemList",
          name: `${site.name} tools`,
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.title,
            url: absoluteUrl(tool.path),
          })),
        },
      ]),
    ],
  }
}

/** Head tags and structured data (WebApplication, breadcrumbs, FAQ) for a tool page. */
export function toolSeo(tool: Tool) {
  const url = absoluteUrl(tool.path)
  const image = ogImagePath(toolSlug(tool))

  return {
    ...seo({
      title: `${tool.seoTitle} | ${site.name}`,
      description: tool.metaDescription,
      path: tool.path,
      image,
      imageAlt: `${tool.title}: ${tool.summary}`,
    }),
    scripts: [
      jsonLd([
        {
          "@type": "WebApplication",
          "@id": `${url}#app`,
          name: tool.title,
          description: tool.metaDescription,
          url,
          image: absoluteUrl(image),
          applicationCategory:
            tool.category === "Developer" ? "DeveloperApplication" : "UtilitiesApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          inLanguage: "en",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@id": ids.author },
          isPartOf: { "@id": ids.website },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: tool.title, item: url },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
        websiteNode,
        authorNode,
      ]),
    ],
  }
}
