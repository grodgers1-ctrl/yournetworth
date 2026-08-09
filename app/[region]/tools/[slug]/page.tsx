import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { Card, CardDescription } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buildBreadcrumb } from "@/lib/seo/breadcrumb";
import { getTool, getMethodology, type Region } from "@/content/taxonomy";
import { ukRegion, usRegion } from "@/lib/regions";
import { FireNumberTool } from "@/components/tools/FireNumberTool";
import { MultiCurrencyBudgetTool } from "@/components/tools/MultiCurrencyBudgetTool";
import { MortgageOverpaymentTool } from "@/components/tools/MortgageOverpaymentTool";
import { NetWorthTrackerTool } from "@/components/tools/NetWorthTrackerTool";
import { DebtPayoffTool } from "@/components/tools/DebtPayoffTool";

type PageProps = {
  params: Promise<{ region: string; slug: string }>;
};

function regionFromString(region: string): Region | null {
  return region === "uk" || region === "us" ? region : null;
}

const TOOL_MODULES: Record<string, ComponentType<{ region: "uk" | "us" }> | undefined> = {
  "fire-number": FireNumberTool,
  "multi-currency-budget": MultiCurrencyBudgetTool,
  "mortgage-overpayment": MortgageOverpaymentTool,
  "net-worth-tracker": NetWorthTrackerTool,
  "debt-payoff": DebtPayoffTool,
};

type ToolSlug = keyof typeof TOOL_MODULES;

const PUBLISHED_SLUGS: ToolSlug[] = ["fire-number", "multi-currency-budget", "mortgage-overpayment", "net-worth-tracker", "debt-payoff"];

export function generateStaticParams() {
  return PUBLISHED_SLUGS.flatMap((slug) => [
    { region: "uk", slug },
    { region: "us", slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug } = await params;
  const r = regionFromString(region);
  if (!r || !PUBLISHED_SLUGS.includes(slug as ToolSlug)) {
    return {};
  }
  const tool = getTool(r, slug);
  if (!tool) {
    return {};
  }
  const config = r === "uk" ? ukRegion : usRegion;
  const title = `${tool.title} Calculator (${config.currency})`;
  const description = tool.description;
  const path = `/${r}/tools/${slug}/`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-GB": `/uk/tools/${slug}/`,
        "en-US": `/us/tools/${slug}/`,
        "x-default": `/uk/tools/${slug}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { region, slug } = await params;
  const r = regionFromString(region);
  if (!r || !PUBLISHED_SLUGS.includes(slug as ToolSlug)) {
    notFound();
  }
  const tool = getTool(r, slug);
  if (!tool) {
    notFound();
  }
  const ToolModule = TOOL_MODULES[slug];
  if (!ToolModule) {
    notFound();
  }
  const config = r === "uk" ? ukRegion : usRegion;
  const path = `/${r}/tools/${slug}/`;
  const methodology = tool.methodology ? getMethodology(tool.methodology) : undefined;
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    applicationCategory: "FinanceApplication",
    url: `https://yournetworth.net${path}`,
    inLanguage: r === "uk" ? "en-GB" : "en-US",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency },
  };
  const breadcrumbLd = buildBreadcrumb([
    { name: "Home", item: "https://yournetworth.net/" },
    { name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
    { name: tool.title },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: r.toUpperCase() },
            { label: tool.title },
          ]}
        />
      </section>
      <section className="mx-auto max-w-[1160px] px-6 pb-10 md:pb-16">
        <ToolModule region={r} />
        {methodology && (
          <Card variant="surface" className="mt-8 p-5">
            <CardDescription>
              Want to see the formulas, assumptions, and sources behind the numbers? Read the{" "}
              <Link href={`/methodology/${tool.methodology}/`} className="text-accent hover:text-accent-hover">
                {methodology.title}
              </Link>
              .
            </CardDescription>
          </Card>
        )}
      </section>
    </>
  );
}
