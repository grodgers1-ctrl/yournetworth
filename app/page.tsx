import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, ArrowRightLeft, BarChart3, CreditCard, Home, Lock, Shield, TrendingUp } from "lucide-react";
import { ToolRegionLink } from "@/components/site/ToolRegionLink";
import { buttonVariants, LinkButton } from "@/components/ui/Button";
import { AnimateIn } from "@/components/landing/AnimateIn";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { NetWorthDeepDive } from "@/components/landing/NetWorthDeepDive";
import { getPublishedTools } from "@/content/taxonomy";

export const metadata: Metadata = {
  title: "Your Net Worth - Free UK & US Personal Finance Calculators",
  description:
    "Free UK & US net worth tracker and personal finance calculators. Track assets and debts over time, find your FIRE number, and model your mortgage. No sign-up. Your data stays in your browser.",
  openGraph: {
    url: "/",
    title: "Your Net Worth - Free UK & US Personal Finance Calculators",
    description: "Free UK & US net worth tracker and personal finance calculators. No sign-up. Your data stays in your browser.",
  },
};

const toolIcons: Record<string, ComponentType<{ className?: string }>> = {
  "net-worth-tracker": BarChart3,
  "fire-number": TrendingUp,
  "mortgage-overpayment": Home,
  "debt-payoff": CreditCard,
  "multi-currency-budget": ArrowRightLeft,
};

// One card per tool; the UK taxonomy entry carries the canonical description.
const tools = [...new Map(getPublishedTools().map((t) => [t.slug, t])).values()];

const testimonials = [
  {
    quote: "Finally a calculator that does not ask for my email before showing a number.",
    name: "M. Thompson",
    role: "UK saver",
  },
  {
    quote: "The Wedge of Death is brutal but useful. It stopped me over-optimising for age 110.",
    name: "R. Patel",
    role: "FIRE planner",
  },
  {
    quote: "The only site where I trust the methodology more than the marketing.",
    name: "S. Kowalski",
    role: "Financial planner",
  },
];

const toolsLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: tools.map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.title,
    url: `https://yournetworth.net/uk/tools/${tool.slug}/`,
  })),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Every calculator runs in your browser. Your inputs are stored locally on your device.",
      },
    },
    {
      "@type": "Question",
      name: "Is this financial advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The calculators and guides are educational tools. Always check with a qualified professional.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsLd) }} />

      {/* Hero */}
      <section className="mx-auto max-w-[1160px] px-6 pt-16 md:pt-24 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-caption mb-4 font-medium uppercase tracking-widest text-accent">
              UK & US calculators
            </p>
            <h1 className="text-display md:text-7xl">Your net worth, without the noise.</h1>
            <p className="mt-6 text-xl leading-relaxed text-text-muted md:text-2xl">
              A free net worth tracker and personal-finance calculators for UK and US savers. No sign-up, no ads, no dark patterns. Just live numbers and a clear chart.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ToolRegionLink toolSlug="net-worth-tracker" className={buttonVariants({ variant: "primary" })}>
                Try the Net Worth Tracker <ArrowRight className="h-4 w-4" />
              </ToolRegionLink>
              <ToolRegionLink toolSlug="fire-number" className={buttonVariants({ variant: "secondary" })}>
                Find your FIRE number
              </ToolRegionLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-dim">
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> No sign-up
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> No ads
              </span>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={150}>
          <div className="mt-16 md:mt-20">
            <DashboardMockup />
          </div>
        </AnimateIn>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-[1160px] scroll-mt-24 px-6 py-16 md:py-24">
        <AnimateIn>
          <div className="max-w-2xl">
            <p className="text-caption mb-3 font-medium uppercase tracking-widest text-accent">The tools</p>
            <h2 className="text-section md:text-4xl">Free UK &amp; US personal finance calculators.</h2>
            <p className="mt-4 text-body">
              Every calculator runs live in your browser: no sign-up, nothing sent to a server. Pick one, move any
              input, and the chart recalculates instantly.
            </p>
          </div>
        </AnimateIn>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => {
            const Icon = toolIcons[tool.slug] ?? BarChart3;
            return (
              <AnimateIn key={tool.slug} delay={(i % 3) * 100}>
                <div className="flex h-full flex-col rounded-[12px] border border-hairline bg-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-elevated text-text">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text">{tool.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{tool.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <ToolRegionLink
                      toolSlug={tool.slug}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover focus-ring rounded-sm"
                    >
                      Open calculator <ArrowRight className="h-4 w-4" />
                    </ToolRegionLink>
                    <span className="flex items-center gap-2 text-xs text-text-dim">
                      <Link
                        href={`/uk/tools/${tool.slug}/`}
                        aria-label={`${tool.title} (UK)`}
                        className="transition-colors hover:text-text focus-ring rounded-sm"
                      >
                        UK
                      </Link>
                      <span aria-hidden="true">·</span>
                      <Link
                        href={`/us/tools/${tool.slug}/`}
                        aria-label={`${tool.title} (US)`}
                        className="transition-colors hover:text-text focus-ring rounded-sm"
                      >
                        US
                      </Link>
                    </span>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* Showcase */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div>
                <p className="text-caption mb-3 font-medium uppercase tracking-widest text-accent">Showcase</p>
                <h2 className="text-section md:text-4xl">Net worth, deconstructed.</h2>
                <p className="mt-4 text-body">
                  Assets minus liabilities, tracked over time. A few minutes to set up, a minute a month to maintain. The chart shows the trend, the gap, and the monthly delta.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Monthly snapshots with an automatic trend line and monthly delta",
                    "Investments, Property, Cash and Debts breakdown, with milestones",
                    "Inflation-adjusted view, savings pots, and CSV export",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <ToolRegionLink toolSlug="net-worth-tracker" className={buttonVariants({ variant: "primary" })}>
                    Open the Net Worth Tracker <ArrowRight className="h-4 w-4" />
                  </ToolRegionLink>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={100}>
              <NetWorthDeepDive />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Performance / Security */}
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <AnimateIn>
            <div className="rounded-[12px] border border-hairline bg-surface p-6">
              <h3 className="text-lg font-semibold text-text">Built for speed</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Static prerendering, zero runtime dependencies, and CSS-only motion. The page loads fast and the chart recalculates instantly.
              </p>
              <div className="mt-4 flex gap-4 text-xs text-text-dim">
                <span>LCP &lt; 2.0s</span>
                <span>CLS &lt; 0.1</span>
                <span>INP &lt; 200ms</span>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="rounded-[12px] border border-hairline bg-surface p-6">
              <h3 className="text-lg font-semibold text-text">Built for privacy</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Your inputs never leave your browser. No account, no database, no server-side storage of your financial numbers.
              </p>
              <div className="mt-4 flex gap-4 text-xs text-text-dim">
                <span>Local-first</span>
                <span>No tracking</span>
                <span>Open methodology</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <AnimateIn>
            <h2 className="text-center text-section md:text-4xl">Trusted by people who hate noise.</h2>
          </AnimateIn>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 100}>
                <div className="rounded-[12px] border border-hairline bg-surface p-5">
                  <p className="text-sm leading-relaxed text-text-muted">&quot;{t.quote}&quot;</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-elevated" />
                    <div>
                      <p className="text-xs font-medium text-text">{t.name}</p>
                      <p className="text-[11px] text-text-dim">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <AnimateIn>
          <div className="rounded-[16px] border border-hairline bg-surface p-8 text-center md:p-12">
            <h2 className="text-section md:text-4xl">Then find your FIRE number.</h2>
            <p className="mt-4 text-body">
              Once you know where you stand, see the portfolio size you would need to cover your annual spending, plus the probability that it lasts through the years ahead.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ToolRegionLink toolSlug="fire-number" className={buttonVariants({ variant: "primary" })}>
                Open the FIRE Number tool <ArrowRight className="h-4 w-4" />
              </ToolRegionLink>
              <LinkButton href="/glossary" variant="secondary">
                Browse the glossary
              </LinkButton>
            </div>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
