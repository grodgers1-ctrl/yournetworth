import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { getMethodology, getTool, getAuthor } from "@/content/taxonomy";
import FireNumberMethodology from "@/content/methodology/fire-number.mdx";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { buildBreadcrumb } from "@/lib/seo/breadcrumb";

type PageProps = {
  params: Promise<{ slug: string }>;
};

import MultiCurrencyBudgetMethodology from "@/content/methodology/multi-currency-budget.mdx";
import NetWorthTrackerMethodology from "@/content/methodology/net-worth-tracker.mdx";

const METHODOLOGY_MODULES: Record<string, ComponentType | undefined> = {
  "fire-number": FireNumberMethodology,
  "multi-currency-budget": MultiCurrencyBudgetMethodology,
  "net-worth-tracker": NetWorthTrackerMethodology,
};

export function generateStaticParams() {
  return [{ slug: "fire-number" }, { slug: "multi-currency-budget" }, { slug: "net-worth-tracker" }];
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
    openGraph: { title, description, url: path, type: "article", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
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
  const breadcrumbLd = buildBreadcrumb([
    { name: "Home", item: "https://yournetworth.net/" },
    { name: methodology.title },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: methodology.title },
          ]}
        />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <article>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-text-dim">
            <Badge variant="muted">Region-neutral methodology</Badge>
            <span>Last reviewed {methodology.lastReviewed}</span>
            {author && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  By{" "}
                  <Link href={`/authors/${author.slug}/`} className="text-accent hover:text-accent-hover">
                    {author.name}
                  </Link>
                </span>
              </>
            )}
          </div>
          <div className="mdx-content">
            <Module />
          </div>
        </article>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {toolUk && (
            <Card variant="surface" className="p-5">
              <CardTitle>UK tool</CardTitle>
              <CardDescription className="mt-1">
                <Link href={`/uk/tools/${toolUk.slug}/`} className="text-accent hover:text-accent-hover">
                  Open the UK {toolUk.title} calculator
                </Link>
              </CardDescription>
            </Card>
          )}
          {toolUs && (
            <Card variant="surface" className="p-5">
              <CardTitle>US tool</CardTitle>
              <CardDescription className="mt-1">
                <Link href={`/us/tools/${toolUs.slug}/`} className="text-accent hover:text-accent-hover">
                  Open the US {toolUs.title} calculator
                </Link>
              </CardDescription>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
