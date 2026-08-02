import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { glossaryTerms, getGlossaryTerm } from "@/content/taxonomy";

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
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">{t.title}</h1>
          <p className="mt-4 text-lg text-text-muted">{t.definition}</p>

          <div className="mt-8 space-y-4 text-text-muted">
            {t.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-10 rounded-[16px] border border-hairline bg-surface p-5">
              <p className="text-sm font-semibold text-text">Related terms</p>
              <ul className="mt-2 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/glossary/${r.slug}`} className="text-sm text-accent hover:text-accent-hover">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
