import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { glossaryTerms, getGlossaryTerm } from "@/content/taxonomy";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) return {};
  return {
    title: t.title,
    description: t.definition,
    openGraph: { title: t.title, description: t.definition, type: "article", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title: t.title, description: t.definition, images: ["/og.png"] },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const t = getGlossaryTerm(term);
  if (!t) notFound();

  const related = glossaryTerms.filter((x) => t.relatedTerms.includes(x.slug));

  const termLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.title,
    description: t.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Your Net Worth Glossary",
      url: "https://yournetworth.net/glossary",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Glossary", href: "/glossary" },
            { label: t.title },
          ]}
        />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <div className="mb-6">
          <Badge variant="muted">Glossary</Badge>
        </div>
        <h1 className="text-title">{t.title}</h1>
        <p className="mt-4 text-xl leading-relaxed text-text-muted">{t.definition}</p>

        <div className="mt-8 space-y-4 text-text-muted">
          {t.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-body">
              {para}
            </p>
          ))}
        </div>

        {related.length > 0 && (
          <Card variant="surface" className="mt-10 p-5">
            <CardTitle>Related terms</CardTitle>
            <ul className="mt-3 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/glossary/${r.slug}`} className="text-sm text-accent hover:text-accent-hover focus-ring rounded-sm">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </>
  );
}
