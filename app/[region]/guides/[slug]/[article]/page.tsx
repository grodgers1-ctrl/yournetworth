import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { getArticle, getGuide, getAuthor, type Region } from "@/content/taxonomy";
import UK4PercentRule from "@/content/articles/uk/fire-number/4-percent-rule.mdx";
import US4PercentRule from "@/content/articles/us/fire-number/4-percent-rule.mdx";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { buildBreadcrumb } from "@/lib/seo/breadcrumb";

type PageProps = {
  params: Promise<{ region: string; slug: string; article: string }>;
};

import UKExchangeRateRisk from "@/content/articles/uk/multi-currency-budget/exchange-rate-risk.mdx";
import USExchangeRateRisk from "@/content/articles/us/multi-currency-budget/exchange-rate-risk.mdx";
import UKSinkingFunds from "@/content/articles/uk/net-worth-tracker/sinking-funds.mdx";
import USEmergencyFundVsHysa from "@/content/articles/us/net-worth-tracker/emergency-fund-vs-hysa.mdx";
import UKMortgageOverpayVsIsa from "@/content/articles/uk/mortgage-overpayment/overpay-vs-isa.mdx";
import USMortgagePayOffVs401k from "@/content/articles/us/mortgage-overpayment/pay-off-vs-401k.mdx";

const ARTICLE_MODULES: Record<string, Record<string, Record<Region, ComponentType | undefined>>> = {
  "fire-number": {
    "4-percent-rule": {
      uk: UK4PercentRule,
      us: US4PercentRule,
    },
  },
  "multi-currency-budget": {
    "exchange-rate-risk": {
      uk: UKExchangeRateRisk,
      us: USExchangeRateRisk,
    },
  },
  "mortgage-overpayment": {
    "overpay-vs-isa": {
      uk: UKMortgageOverpayVsIsa,
      us: undefined,
    },
    "pay-off-vs-401k": {
      uk: undefined,
      us: USMortgagePayOffVs401k,
    },
  },
  "net-worth-tracker": {
    "sinking-funds": {
      uk: UKSinkingFunds,
      us: undefined,
    },
    "emergency-fund-vs-hysa": {
      uk: undefined,
      us: USEmergencyFundVsHysa,
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
    { region: "uk", slug: "multi-currency-budget", article: "exchange-rate-risk" },
    { region: "us", slug: "multi-currency-budget", article: "exchange-rate-risk" },
    { region: "uk", slug: "mortgage-overpayment", article: "overpay-vs-isa" },
    { region: "us", slug: "mortgage-overpayment", article: "pay-off-vs-401k" },
    { region: "uk", slug: "net-worth-tracker", article: "sinking-funds" },
    { region: "us", slug: "net-worth-tracker", article: "emergency-fund-vs-hysa" },
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
    openGraph: { title, description, url: path, type: "article", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
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
  const breadcrumbLd = buildBreadcrumb([
    { name: "Home", item: "https://yournetworth.net/" },
    { name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
    { name: guide.title, item: `https://yournetworth.net/${r}/guides/${slug}/` },
    { name: item.title },
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
            { label: guide.title, href: `/${r}/guides/${slug}/` },
            { label: item.title },
          ]}
        />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <article>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-text-dim">
            <Badge variant="muted">{r === "uk" ? "UK article" : "US article"}</Badge>
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

        <Card variant="surface" className="mt-10 p-5">
          <CardTitle>Back to the guide</CardTitle>
          <CardDescription className="mt-1">
            Read the full{" "}
            <Link href={`/${r}/guides/${slug}/`} className="text-accent hover:text-accent-hover">
              {guide.title}
            </Link>{" "}
            for the complete picture.
          </CardDescription>
        </Card>
      </section>
    </>
  );
}
