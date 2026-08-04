import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { getGuide, getAuthor, getTool, getArticlesByGuide, type Region } from "@/content/taxonomy";
import UKFireNumberGuide from "@/content/guides/uk/fire-number.mdx";
import USFireNumberGuide from "@/content/guides/us/fire-number.mdx";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { buildBreadcrumb } from "@/lib/seo/breadcrumb";

type PageProps = {
  params: Promise<{ region: string; slug: string }>;
};

import UKMultiCurrencyBudgetGuide from "@/content/guides/uk/multi-currency-budget.mdx";
import USMultiCurrencyBudgetGuide from "@/content/guides/us/multi-currency-budget.mdx";
import UKMortgageOverpaymentGuide from "@/content/guides/uk/mortgage-overpayment.mdx";
import USMortgageOverpaymentGuide from "@/content/guides/us/mortgage-overpayment.mdx";
import UKNetWorthTrackerGuide from "@/content/guides/uk/net-worth-tracker.mdx";
import USNetWorthTrackerGuide from "@/content/guides/us/net-worth-tracker.mdx";

const GUIDE_MODULES: Record<string, Record<Region, ComponentType | undefined>> = {
  "fire-number": {
    uk: UKFireNumberGuide,
    us: USFireNumberGuide,
  },
  "multi-currency-budget": {
    uk: UKMultiCurrencyBudgetGuide,
    us: USMultiCurrencyBudgetGuide,
  },
  "mortgage-overpayment": {
    uk: UKMortgageOverpaymentGuide,
    us: USMortgageOverpaymentGuide,
  },
  "net-worth-tracker": {
    uk: UKNetWorthTrackerGuide,
    us: USNetWorthTrackerGuide,
  },
};

function regionFromString(region: string): Region | null {
  return region === "uk" || region === "us" ? region : null;
}

export function generateStaticParams() {
  return [
    { region: "uk", slug: "fire-number" },
    { region: "us", slug: "fire-number" },
    { region: "uk", slug: "multi-currency-budget" },
    { region: "us", slug: "multi-currency-budget" },
    { region: "uk", slug: "mortgage-overpayment" },
    { region: "us", slug: "mortgage-overpayment" },
    { region: "uk", slug: "net-worth-tracker" },
    { region: "us", slug: "net-worth-tracker" },
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
    openGraph: { title, description, url: path, type: "article", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
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
  const relatedArticles = getArticlesByGuide(r, slug);
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
  const breadcrumbLd = buildBreadcrumb([
    { name: "Home", item: "https://yournetworth.net/" },
    { name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
    { name: guide.title },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: r.toUpperCase(), href: `/${r}/` },
            { label: guide.title },
          ]}
        />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <article>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-text-dim">
            <Badge variant="muted">{r === "uk" ? "UK guide" : "US guide"}</Badge>
            <span>Updated 2 August 2026</span>
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

        {tool && (
          <Card variant="surface" className="mt-10 p-5">
            <CardTitle>Try the calculator</CardTitle>
            <CardDescription className="mt-1">
              Put the guide into practice with the{" "}
              <Link href={`/${r}/tools/${tool.slug}/`} className="text-accent hover:text-accent-hover">
                {tool.title} calculator
              </Link>
              .
            </CardDescription>
          </Card>
        )}

        {relatedArticles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-subsection">Related articles</h2>
            <div className="mt-4 grid gap-4">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${r}/guides/${slug}/${a.slug}/`}
                  className="rounded-[16px] border border-hairline bg-surface p-5 transition-colors hover:border-stroke focus-ring"
                >
                  <p className="text-sm font-medium text-text">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
