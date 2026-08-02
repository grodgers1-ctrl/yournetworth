import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/content/taxonomy";

export const metadata: Metadata = {
  title: "About",
  description: "Why Your Net Worth exists, who built it, and how it relates to DividendMapper.",
};

export default function AboutPage() {
  const author = authors[0];

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    sameAs: author.sameAs,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">About Your Net Worth</h1>

        <div className="mt-8 max-w-3xl space-y-6 text-text-muted">
          <p>
            Most personal-finance calculators look like they were built in 2008. They ask for your email before they show
            a number, stuff the page with banner ads, or bury the answer under a big orange button that says &quot;Calculate&quot;.
          </p>
          <p>
            Your Net Worth is the opposite. Each tool is a live chart with a set of sliders. Move the slider and the answer
            changes immediately. There is no submit button, no sign-up wall, and no dark pattern.
          </p>
          <p>
            The site is built for two markets from day one: the UK and the US. That means ISAs and SIPPs sit alongside
            Roth IRAs and 401ks. Currency, terminology, and tax wrappers change with the region, but the underlying maths and
            the design language stay the same.
          </p>
          <p>
            This is a sister project to{" "}
            <a href="https://dividendmapper.com" target="_blank" rel="noopener" className="text-accent hover:text-accent-hover">
              DividendMapper.com
            </a>
            , a paid dividend-portfolio tracker. The link is editorial, not a banner ad. It appears where the topic makes
            sense, and only there.
          </p>
        </div>

        <div className="mt-12 rounded-[16px] border border-hairline bg-surface p-6 md:p-8">
          <h2 className="text-xl font-semibold text-text">Who writes this</h2>
          <p className="mt-3 text-text-muted">
            Content is authored by{" "}
            <Link href={`/authors/${author.slug}`} className="text-accent hover:text-accent-hover">
              {author.name}
            </Link>
            . Every pillar guide, article, and glossary entry carries a named byline. We do not publish anonymous finance
            content.
          </p>
          <p className="mt-4 text-text-muted">
            Methodology pages explain how each calculator works, where the assumptions come from, and when the numbers were
            last reviewed. See our{" "}
            <Link href="/editorial-policy" className="text-accent hover:text-accent-hover">
              editorial policy
            </Link>{" "}
            for the full standard.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-text">What is coming</h2>
          <p className="mt-3 max-w-3xl text-text-muted">
            We are shipping six calculators in weekly clusters: Net Worth Tracker, FIRE Number, Compound Interest, Mortgage
            Overpayment, Debt Payoff, and Multi-Currency Budget. After that, the plan is to grow the glossary, add more
            guides, and publish original research. There are no ads and no plans to sell your data.
          </p>
        </div>
      </section>
    </>
  );
}
