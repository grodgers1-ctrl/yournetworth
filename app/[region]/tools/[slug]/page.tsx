import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTool } from "@/content/taxonomy";
import { ukRegion, usRegion } from "@/lib/regions";
import { FireNumberTool } from "@/components/tools/FireNumberTool";
import type { Region } from "@/content/taxonomy";

type PageProps = {
  params: Promise<{ region: string; slug: string }>;
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
  if (!r || slug !== "fire-number") {
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
        "en-GB": "/uk/tools/fire-number/",
        "en-US": "/us/tools/fire-number/",
        "x-default": "/uk/tools/fire-number/",
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { region, slug } = await params;
  const r = regionFromString(region);
  if (!r || slug !== "fire-number") {
    notFound();
  }
  const tool = getTool(r, slug);
  if (!tool) {
    notFound();
  }
  const config = r === "uk" ? ukRegion : usRegion;
  const path = `/${r}/tools/${slug}/`;
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    applicationCategory: "FinanceApplication",
    url: `https://yournetworth.net${path}`,
    inLanguage: r === "uk" ? "en-GB" : "en-US",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yournetworth.net/" },
      { "@type": "ListItem", position: 2, name: r.toUpperCase(), item: `https://yournetworth.net/${r}/` },
      { "@type": "ListItem", position: 3, name: tool.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-10 md:py-16">
        <FireNumberTool region={r} />
        <div className="mt-8 rounded-[16px] border border-hairline bg-surface p-5">
          <p className="text-sm text-text-muted">
            Want to see the formulas, assumptions, and sources behind the numbers? Read the{" "}
            <Link href="/methodology/fire-number/" className="text-accent hover:text-accent-hover">
              FIRE Number methodology
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
