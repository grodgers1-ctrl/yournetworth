import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/content/taxonomy";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-English definitions of personal-finance terms.",
};

export default function GlossaryIndexPage() {
  const setLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Your Net Worth Glossary",
    url: "https://yournetworth.net/glossary",
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.title,
      description: t.definition,
      url: `https://yournetworth.net/glossary/${t.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(setLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">Glossary</h1>
        <p className="mt-4 max-w-3xl text-text-muted">
          Plain-English definitions of personal-finance terms. We grow this over time so every article can link to a clear
          reference instead of repeating the same explanation.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glossaryTerms.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="rounded-[16px] border border-hairline bg-surface p-5 transition-colors hover:border-stroke"
            >
              <h2 className="font-semibold text-text">{t.title}</h2>
              <p className="mt-2 text-sm text-text-muted line-clamp-3">{t.definition}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
