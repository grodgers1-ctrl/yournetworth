import { MetadataRoute } from "next";
import { glossaryTerms, tools, guides, articles, methodologies } from "@/content/taxonomy";

const base = "https://yournetworth.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: "/", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: "/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/editorial-policy", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/updates", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: "/glossary", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "/authors/glenn-rodgers", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const glossary = glossaryTerms.map((t) => ({
    url: `/glossary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const publishedTools = tools
    .filter((t) => t.published)
    .map((t) => ({
      url: `/${t.region}/tools/${t.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  const publishedGuides = guides
    .filter((g) => g.published)
    .map((g) => ({
      url: `/${g.region}/guides/${g.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const publishedArticles = articles
    .filter((a) => a.published)
    .map((a) => ({
      url: `/${a.region}/guides/${a.guide}/${a.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const publishedMethodologies = methodologies
    .filter((m) => m.published)
    .map((m) => ({
      url: `/methodology/${m.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...pages, ...glossary, ...publishedTools, ...publishedGuides, ...publishedArticles, ...publishedMethodologies].map(
    (p) => ({ ...p, url: `${base}${p.url}` })
  );
}
