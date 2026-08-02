import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getArticle, getGuide, getAuthor, type Region } from "@/content/taxonomy";
import UK4PercentRule from "@/content/articles/uk/fire-number/4-percent-rule.mdx";
import US4PercentRule from "@/content/articles/us/fire-number/4-percent-rule.mdx";

type PageProps = {
  params: Promise<{ region: string; slug: string; article: string }>;
};

const ARTICLE_MODULES: Record<string, Record<string, Record<Region, ComponentType | undefined>>> = {
  "fire-number": {
    "4-percent-rule": {
      uk: UK4PercentRule,
      us: US4PercentRule,
    },
  },
};

function regionFromString(region: string): Region | null {
  return region === "uk" || region === "us" ? region : null;
}

export function generateStaticParams() {
  return [
    { region: "uk", slug: "fire-number", article: "4-percent-rule" },
    { region: "us", slug: "fire-number", article: "4-percent-rule" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug, article } = await params;
  const r = regionFromString(region);
  if (!r) return {};
  const item = getArticle(r, article);
  if (!item || item.guide !== slug) return {};
  const title = `${item.title} (${r.toUpperCase()})`;
  const description = `A supporting article for the ${r.toUpperCase()} FIRE Number guide.`;
  const path = `/${r}/guides/${slug}/${article}/`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-GB": `/uk/guides/${slug}/${article}/`,
        "en-US": `/us/guides/${slug}/${article}/`,
        "x-default": `/uk/guides/${slug}/${article}/`,
      },
    },
    openGraph: { title, description, url: path, type: "article" },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { region, slug, article } = await params;
  const r = regionFromString(region);
  if (!r) notFound();
  const item = getArticle(r, article);
  const guide = getGuide(r, slug);
  if (!item || !guide || item.guide !== slug) notFound();
  const Module = ARTICLE_MODULES[slug]?.[article]?.[r];
  if (!Module) notFound();
  const author = item.authorSlug ? getAuthor(item.authorSlug) : undefined;
  const path = `/${r}/guides/${slug}/${article}/`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    author: author ? { "@type": "Person", name: author.name, url: `https://yournetworth.net/authors/${author.slug}/` } : undefined,
    datePublished: "2026-08-02",
    dateModified: "2026-08-02",
    inLanguage: r === "uk" ? "en-GB" : "en-US",
    url: `https://yournetworth.net${path}`,
    isPartOf: { "@type": "Article", name: guide.title, url: `https://yournetworth.net/${r}/guides/${slug}/` },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yournetworth.net/" },
      { "@type": "ListItem", position: 2, name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://yournetworth.net/${r}/guides/${slug}/` },
      { "@type": "ListItem", position: 4, name: item.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="mx-auto max-w-[760px] px-6 py-10 md:py-16">
        <div className="mb-8 text-sm text-text-muted">
          {r === "uk" ? "UK article" : "US article"} · Updated 2 August 2026
          {author && <> · By <a href={`/authors/${author.slug}/`}>{author.name}</a></>}
        </div>
        <div className="mdx-content">
          <Module />
        </div>
      </article>
    </>
  );
}
