import type { Metadata } from "next";
import { glossaryTerms } from "@/content/taxonomy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlossaryFilter } from "@/components/site/GlossaryFilter";

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
        <SectionHeader
          title="Glossary"
          subtitle="Plain-English definitions of personal-finance terms. We grow this over time so every article can link to a clear reference instead of repeating the same explanation."
        />
        <GlossaryFilter terms={glossaryTerms} />
      </section>
    </>
  );
}
