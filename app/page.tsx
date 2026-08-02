import type { Metadata } from "next";
import { Calculator, TrendingUp, PiggyBank, Home, CreditCard, Coins, ArrowRight, Shield, Lock, FileText } from "lucide-react";
import { ToolRegionLink } from "@/components/site/ToolRegionLink";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonVariants, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Free UK & US Personal Finance Calculators",
  description:
    "A dark-first, no-sign-up suite of personal-finance calculators for UK and US savers. Track net worth, find your FIRE number, model compound interest, and more.",
  openGraph: {
    url: "/",
    title: "Your Net Worth - Free UK & US Personal Finance Calculators",
    description: "A dark-first, no-sign-up suite of personal-finance calculators for UK and US savers.",
  },
};

const tools = [
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    desc: "See what you own, what you owe, and where the gap is heading.",
    icon: TrendingUp,
    published: false,
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    desc: "Estimate how much you need to cover your spending, with real uncertainty.",
    icon: PiggyBank,
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest",
    desc: "Watch how time, rate, and contributions stack up over the years.",
    icon: Calculator,
    published: false,
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment",
    desc: "Compare overpaying your mortgage against investing the same cash.",
    icon: Home,
    published: false,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff",
    desc: "Stack your debts and compare snowball versus avalanche side by side.",
    icon: CreditCard,
    published: false,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    desc: "Add income and spending in different currencies, converted to one base.",
    icon: Coins,
    published: false,
  },
];

const trustPoints = [
  {
    icon: Lock,
    title: "Local-first",
    desc: "Your inputs stay in your browser. No account, no database, no tracking of your numbers.",
  },
  {
    icon: FileText,
    title: "Methodology-first",
    desc: "Every calculator has a published methodology page with formulas, assumptions, and sources.",
  },
  {
    icon: Shield,
    title: "No dark patterns",
    desc: "No sign-up gates, no newsletter pop-ups, no ads inside the tools. Just the numbers.",
  },
];

const faqs = [
  {
    question: "Do I need to create an account to use the calculators?",
    answer:
      "No. Every calculator runs in your browser. Your inputs are stored locally on your device, and you can share any scenario with a copied link.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. The calculators and guides are educational tools. They cannot know your full tax situation, risk tolerance, or future market returns. Always check with a qualified professional before making major decisions.",
  },
  {
    question: "Why UK and US versions?",
    answer:
      "Currency, terminology, and tax wrappers differ between the two markets. We surface the right labels and assumptions for each region so the numbers make sense where you live.",
  },
  {
    question: "How does the FIRE Number calculator handle uncertainty?",
    answer:
      "It runs a deterministic simulation across many return paths and shows percentile bands. The darker right edge of the chart, the Wedge of Death, represents the rising probability that you are no longer alive at that age.",
  },
  {
    question: "What is the relationship to DividendMapper?",
    answer:
      "Your Net Worth is a free calculator hub. DividendMapper is a paid sister product that models the actual dividend income a portfolio could produce. We link to it only where the topic makes sense.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-caption mb-4 font-medium uppercase tracking-widest text-accent">
            UK & US calculators
          </p>
          <h1 className="text-display md:text-7xl">Your net worth, without the noise.</h1>
          <p className="mt-6 text-xl leading-relaxed text-text-muted md:text-2xl">
            Free personal-finance calculators for UK and US savers. No sign-up, no ads, no dark patterns. Just live numbers and a clear chart.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ToolRegionLink
              toolSlug="fire-number"
              className={buttonVariants({ variant: "primary" })}
            >
              Try the FIRE Number tool <ArrowRight className="h-4 w-4" />
            </ToolRegionLink>
            <LinkButton href="/about" variant="secondary">
              About the project
            </LinkButton>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-text-dim">
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> No sign-up
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> No ads
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Published methodology
            </span>
          </div>
        </div>
      </section>

      {/* Preview / value prop */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="How it works"
                title="Move a slider, watch the answer change"
                subtitle="Every tool is built around the same idea: change an input and the chart recalculates instantly. No submit button, no waiting, no guesswork."
              />
              <div className="mt-8 space-y-4">
                {[
                  "See your FIRE number and the probability it lasts.",
                  "Compare scenarios with one-tap baseline / A / B / C chips.",
                  "Share any scenario with a copied link.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-body">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[16px] border border-hairline bg-bg p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-micro text-text-dim">Projected portfolio</p>
                    <p className="text-3xl font-bold text-text tabular-nums">£1,240,000</p>
                  </div>
                  <Badge variant="accent">FIRE</Badge>
                </div>
                <div className="mt-6 h-40 rounded-[12px] bg-elevated" aria-hidden="true">
                  <svg className="h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="previewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-text)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--color-text)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 140 C 60 130, 100 110, 160 100 S 260 70, 320 40 S 380 10, 400 0 V 160 H 0 Z"
                      fill="url(#previewGrad)"
                    />
                    <path
                      d="M0 140 C 60 130, 100 110, 160 100 S 260 70, 320 40 S 380 10, 400 0"
                      fill="none"
                      stroke="var(--color-text)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-xs text-text-dim">
                  This is a preview. The live tool updates the chart every time you move a slider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
        <SectionHeader
          eyebrow="Calculators"
          title="What you can do here"
          subtitle="Six calculators, each built around live inputs and a clear chart. Start with the FIRE Number tool; the rest are coming in weekly clusters."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const Icon = t.icon;
            const content = (
              <Card
                variant={t.published ? "default" : "surface"}
                className={`p-6 transition-colors ${
                  t.published ? "hover:border-stroke" : "opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-text">
                    <Icon className="h-5 w-5" />
                  </div>
                  {!t.published && <Badge variant="muted">Coming soon</Badge>}
                  {t.published && <Badge variant="accent">Live</Badge>}
                </div>
                <CardTitle className="mt-4">{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </Card>
            );
            return t.published ? (
              <ToolRegionLink key={t.slug} toolSlug={t.slug} className="block">
                {content}
              </ToolRegionLink>
            ) : (
              <div key={t.slug}>{content}</div>
            );
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-text">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[760px] px-6 py-16 md:py-24">
        <SectionHeader align="center" eyebrow="FAQ" title="Common questions" />
        <div className="mt-10 space-y-6">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="text-lg font-semibold text-text">{f.question}</h3>
              <p className="mt-2 text-body">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
          <div className="rounded-[16px] border border-hairline bg-surface p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-section">Start with your FIRE number.</h2>
              <p className="mt-4 text-body">
                See the portfolio size you would need to cover your annual spending, plus the probability that it lasts through the years ahead.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ToolRegionLink
                  toolSlug="fire-number"
                  className={buttonVariants({ variant: "primary" })}
                >
                  Open the FIRE Number tool <ArrowRight className="h-4 w-4" />
                </ToolRegionLink>
                <LinkButton href="/glossary" variant="secondary">
                  Browse the glossary
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
