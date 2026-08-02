import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authors, getAuthor } from "@/content/taxonomy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: author.name,
    description: author.bio,
    openGraph: { title: author.name, description: author.bio, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title: author.name, description: author.bio, images: ["/og.png"] },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    sameAs: author.sameAs,
    ...(author.photo ? { image: author.photo } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: author.name }]} />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <SectionHeader title={author.name} subtitle={author.jobTitle} />

        <div className="mt-8 max-w-3xl space-y-6 text-text-muted">
          <p className="text-body">{author.bio}</p>

          {author.credentials.length > 0 && (
            <div>
              <h2 className="text-subsection">Credentials</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body">
                {author.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {author.sameAs.length > 0 && (
            <div>
              <h2 className="text-subsection">Elsewhere</h2>
              <ul className="mt-2 space-y-1">
                {author.sameAs.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener"
                      className="text-accent hover:text-accent-hover focus-ring rounded-sm"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {author.publications.length > 0 && (
            <div>
              <h2 className="text-subsection">Publications on this site</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body">
                {author.publications.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
