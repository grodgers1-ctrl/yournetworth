import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardDescription } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buildBreadcrumb } from "@/lib/seo/breadcrumb";
import { getTool, type Region } from "@/content/taxonomy";
import { ukRegion, usRegion } from "@/lib/regions";
import { FireNumberTool } from "@/components/tools/FireNumberTool";

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
        <FireNumberTool region={r} />
        <Card variant="surface" className="mt-8 p-5">
          <CardDescription>
            Want to see the formulas, assumptions, and sources behind the numbers? Read the{" "}
            <Link href="/methodology/fire-number/" className="text-accent hover:text-accent-hover">
              FIRE Number methodology
            </Link>
            .
          </CardDescription>
        </Card>
      </section>
    </>
  );
}
