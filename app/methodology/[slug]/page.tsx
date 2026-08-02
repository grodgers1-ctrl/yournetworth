import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getMethodology, getTool, getAuthor } from "@/content/taxonomy";
import FireNumberMethodology from "@/content/methodology/fire-number.mdx";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const METHODOLOGY_MODULES: Record<string, ComponentType | undefined> = {
  "fire-number": FireNumberMethodology,
};

export function generateStaticParams() {
  return [{ slug: "fire-number" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const methodology = getMethodology(slug);
  if (!methodology) return {};
  const title = methodology.title;
  const description = `Methodology, assumptions, and sources for the ${methodology.title} calculator.`;
  const path = `/methodology/${slug}/`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
  };
}

export default async function MethodologyPage({ params }: PageProps) {
  const { slug } = await params;
  const methodology = getMethodology(slug);
  if (!methodology) notFound();
  const Module = METHODOLOGY_MODULES[slug];
  if (!Module) notFound();
  const author = methodology.toolSlug ? getAuthor("glenn-rodgers") : undefined;
  const toolUk = getTool("uk", methodology.toolSlug);
  const toolUs = getTool("us", methodology.toolSlug);
  const path = `/methodology/${slug}/`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: methodology.title,
    author: author ? { "@type": "Person", name: author.name, url: `https://yournetworth.net/authors/${author.slug}/` } : undefined,
    datePublished: "2026-08-02",
    dateModified: methodology.lastReviewed,
    inLanguage: "en",
    url: `https://yournetworth.net${path}`,
    isPartOf: [
      toolUk ? { "@type": "WebApplication", name: toolUk.title, url: `https://yournetworth.net/uk/tools/${toolUk.slug}/` } : undefined,
      toolUs ? { "@type": "WebApplication", name: toolUs.title, url: `https://yournetworth.net/us/tools/${toolUs.slug}/` } : undefined,
    ].filter(Boolean),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yournetworth.net/" },
      { "@type": "ListItem", position: 2, name: methodology.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="mx-auto max-w-[760px] px-6 py-10 md:py-16">
        <div className="mb-8 text-sm text-text-muted">
          Region-neutral methodology · Last reviewed {methodology.lastReviewed}
          {author && <> · By <a href={`/authors/${author.slug}/`}>{author.name}</a></>}
        </div>
        <div className="mdx-content">
          <Module />
        </div>
      </article>
    </>
  );
}
