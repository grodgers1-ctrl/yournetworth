import { MetadataRoute } from "next";
import { glossaryTerms } from "@/content/taxonomy";

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

  return [...pages, ...glossary].map((p) => ({ ...p, url: `${base}${p.url}` }));
}
