import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authors, getAuthor } from "@/content/taxonomy";

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
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">{author.name}</h1>
        <p className="mt-2 text-lg text-text-muted">{author.jobTitle}</p>

        <div className="mt-8 max-w-3xl space-y-6 text-text-muted">
          <p>{author.bio}</p>

          {author.credentials.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text">Credentials</h2>
              <ul className="mt-2 list-inside list-disc">
                {author.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {author.sameAs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text">Elsewhere</h2>
              <ul className="mt-2 space-y-1">
                {author.sameAs.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener"
                      className="text-accent hover:text-accent-hover"
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
              <h2 className="text-lg font-semibold text-text">Publications on this site</h2>
              <ul className="mt-2 list-inside list-disc">
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
