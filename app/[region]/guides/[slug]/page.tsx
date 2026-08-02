import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getGuide, getAuthor, getTool, type Region } from "@/content/taxonomy";
import UKFireNumberGuide from "@/content/guides/uk/fire-number.mdx";
import USFireNumberGuide from "@/content/guides/us/fire-number.mdx";

type PageProps = {
  params: Promise<{ region: string; slug: string }>;
};

const GUIDE_MODULES: Record<string, Record<Region, ComponentType | undefined>> = {
  "fire-number": {
    uk: UKFireNumberGuide,
    us: USFireNumberGuide,
  },
};

function regionFromString(region: string): Region | null {
  return region === "uk" || region === "us" ? region : null;
}

export function generateStaticParams() {
  return [
    { region: "uk", slug: "fire-number" },
    { region: "us", slug: "fire-number" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug } = await params;
  const r = regionFromString(region);
  if (!r) return {};
  const guide = getGuide(r, slug);
  if (!guide) return {};
  const title = `${guide.title} (${r.toUpperCase()})`;
  const description = `A plain-English guide to ${guide.title.toLowerCase()} for ${r === "uk" ? "UK" : "US"} savers.`;
  const path = `/${r}/guides/${slug}/`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-GB": `/uk/guides/${slug}/`,
        "en-US": `/us/guides/${slug}/`,
        "x-default": `/uk/guides/${slug}/`,
      },
    },
    openGraph: { title, description, url: path, type: "article" },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { region, slug } = await params;
  const r = regionFromString(region);
  if (!r) notFound();
  const guide = getGuide(r, slug);
  if (!guide) notFound();
  const Module = GUIDE_MODULES[slug]?.[r];
  if (!Module) notFound();
  const author = guide.authorSlug ? getAuthor(guide.authorSlug) : undefined;
  const tool = getTool(r, guide.tool);
  const path = `/${r}/guides/${slug}/`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    author: author ? { "@type": "Person", name: author.name, url: `https://yournetworth.net/authors/${author.slug}/` } : undefined,
    datePublished: "2026-08-02",
    dateModified: "2026-08-02",
    inLanguage: r === "uk" ? "en-GB" : "en-US",
    url: `https://yournetworth.net${path}`,
    isPartOf: tool ? { "@type": "WebApplication", name: tool.title, url: `https://yournetworth.net/${r}/tools/${tool.slug}/` } : undefined,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yournetworth.net/" },
      { "@type": "ListItem", position: 2, name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
      { "@type": "ListItem", position: 3, name: guide.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="mx-auto max-w-[760px] px-6 py-10 md:py-16">
        <div className="mb-8 text-sm text-text-muted">
          {r === "uk" ? "UK guide" : "US guide"} · Updated 2 August 2026
          {author && <> · By <a href={`/authors/${author.slug}/`}>{author.name}</a></>}
        </div>
        <div className="mdx-content">
          <Module />
        </div>
      </article>
    </>
  );
}
