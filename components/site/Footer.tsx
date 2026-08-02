import Link from "next/link";
import { getPublishedTools, guides, articles, methodologies } from "@/content/taxonomy";

export function Footer() {
  const publishedTools = getPublishedTools();
  const publishedGuides = guides.filter((g) => g.published);
  const publishedArticles = articles.filter((a) => a.published);
  const publishedMethodologies = methodologies.filter((m) => m.published);

  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1160px] px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-sm font-semibold text-text">Your Net Worth</p>
            <p className="mt-2 text-sm text-text-muted">
              Free UK and US calculators, built to be clear and useful. A sister site to{" "}
              <a
                href="https://dividendmapper.com"
                target="_blank"
                rel="noopener"
                className="text-accent hover:text-accent-hover"
              >
                DividendMapper.com
              </a>
              .
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">Tools</p>
            <ul className="mt-4 space-y-2">
              {publishedTools.map((t) => (
                <li key={`${t.region}-${t.slug}`}>
                  <Link
                    href={`/${t.region}/tools/${t.slug}/`}
                    className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
                  >
                    {t.title} ({t.region.toUpperCase()})
                  </Link>
                </li>
              ))}
              {publishedTools.length === 0 && <li className="text-sm text-text-dim">More tools coming soon.</li>}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">Content</p>
            <ul className="mt-4 space-y-2">
              {publishedGuides.map((g) => (
                <li key={`${g.region}-${g.slug}`}>
                  <Link
                    href={`/${g.region}/guides/${g.slug}/`}
                    className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
                  >
                    {g.title} ({g.region.toUpperCase()})
                  </Link>
                </li>
              ))}
              {publishedArticles.slice(0, 2).map((a) => (
                <li key={`${a.region}-${a.slug}`}>
                  <Link
                    href={`/${a.region}/guides/${a.guide}/${a.slug}/`}
                    className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
                  >
                    {a.title} ({a.region.toUpperCase()})
                  </Link>
                </li>
              ))}
              {publishedMethodologies.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/methodology/${m.slug}/`}
                    className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
              {publishedGuides.length === 0 && publishedArticles.length === 0 && publishedMethodologies.length === 0 && (
                <li className="text-sm text-text-dim">More guides coming soon.</li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">Site</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm">
                  Editorial policy
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/authors/glenn-rodgers" className="text-sm text-text-muted transition-colors hover:text-text focus-ring rounded-sm">
                  Author
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="text-xs text-text-dim">
            Not financial advice. Our calculators are educational tools, not personalised recommendations. Past
            performance and assumptions do not predict future results. Please read our full{" "}
            <Link href="/editorial-policy" className="underline hover:text-text focus-ring rounded-sm">
              editorial policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

