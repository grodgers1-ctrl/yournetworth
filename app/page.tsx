import type { Metadata } from "next";
import Link from "next/link";
import { ToolRegionLink } from "@/components/site/ToolRegionLink";

export const metadata: Metadata = {
  title: "Free UK & US Personal Finance Calculators",
  description:
    "A dark-first, no-sign-up suite of personal-finance calculators for UK and US savers.",
};

const tools = [
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    desc: "See what you own, what you owe, and where the gap is heading.",
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    desc: "Estimate how much you need to cover your spending, with real uncertainty.",
  },
  {
    slug: "compound-interest",
    title: "Compound Interest",
    desc: "Watch how time, rate, and contributions stack up over the years.",
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment",
    desc: "Compare overpaying your mortgage against investing the same cash.",
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff",
    desc: "Stack your debts and compare snowball versus avalanche side by side.",
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    desc: "Add income and spending in different currencies, converted to one base.",
  },
];

export default function HomePage() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Your Net Worth",
    url: "https://yournetworth.net",
    sameAs: ["https://dividendmapper.com"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <section className="mx-auto max-w-[1160px] px-6 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-text md:text-6xl">
            Your net worth, without the noise.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-muted md:text-xl">
            Free personal-finance calculators for UK and US savers. No sign-up, no ads, no dark patterns. Just live
            numbers and a clear chart.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/glossary"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-text transition-colors hover:bg-accent-hover"
            >
              Browse the glossary
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stroke px-6 text-sm font-medium text-text-muted transition-colors hover:border-text-muted hover:text-text"
            >
              About the project
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <h2 className="text-2xl font-semibold tracking-tight text-text md:text-3xl">
            What you can do here
          </h2>
          <p className="mt-3 max-w-2xl text-text-muted">
            Six calculators, each built around the same idea: move a slider and watch the answer change.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) =>
              t.slug === "fire-number" ? (
                <ToolRegionLink
                  key={t.slug}
                  toolSlug={t.slug}
                  className="rounded-[16px] border border-hairline bg-elevated p-6 shadow-studio transition-colors hover:border-stroke"
                >
                  <h3 className="text-lg font-semibold text-text">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{t.desc}</p>
                </ToolRegionLink>
              ) : (
                <div
                  key={t.slug}
                  className="rounded-[16px] border border-hairline bg-elevated p-6 shadow-studio"
                >
                  <h3 className="text-lg font-semibold text-text">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{t.desc}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-text md:text-3xl">
          Why this feels different
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "Dark-first design. No banner ads, no pop-ups, no newsletter gates.",
            "Built for two markets. UK and US tax wrappers, terminology, and currency.",
            "Shareable by default. Every scenario has a URL you can copy and paste.",
            "No accounts at launch. Your numbers stay in your browser, not our database.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
