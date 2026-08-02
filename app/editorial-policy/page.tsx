import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial policy",
  description:
    "How Your Net Worth sources, reviews, and updates personal-finance content and calculators.",
};

export default function EditorialPolicyPage() {
  return (
    <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">Editorial policy</h1>
      <p className="mt-4 max-w-3xl text-text-muted">
        Personal finance is a YMYL topic. That means every claim, every calculator, and every guide must earn its place on
        the page. This policy explains how we do that.
      </p>

      <div className="mt-10 max-w-3xl space-y-8 text-text-muted">
        <div>
          <h2 className="text-xl font-semibold text-text">Who writes and reviews</h2>
          <p className="mt-2">
            Every article and guide has a named author. Every tool has a named methodology owner. Where a topic demands
            specialist review, we add a &quot;Reviewed by&quot; line. We do not publish anonymous or unattributed finance content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">How we source information</h2>
          <p className="mt-2">
            We prefer primary sources: HMRC guidance, IRS publications, ONS and Bank of England data, Federal Reserve
            releases, and official government websites. When we cite a third-party study or article, we link to it directly
            so you can check the original.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">How we test calculators</h2>
          <p className="mt-2">
            Each calculator has a pure-maths module in{" "}
            <code className="rounded bg-elevated px-1.5 py-0.5 text-sm text-text">lib/calc/</code> that is tested
            independently from the user interface. The numbers you see on the chart come from those modules. We document the
            assumptions, the formulas, and the data sources on a dedicated methodology page for every tool.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">How we update and correct</h2>
          <p className="mt-2">
            Tax bands, allowances, and market conditions change. We review every published page at six months and again at
            one year, or sooner when a major source changes. Corrections are logged on the{" "}
            <Link href="/updates" className="text-accent hover:text-accent-hover">
              updates
            </Link>{" "}
            page and reflected in the &quot;Last updated&quot; date on each page.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">What this is not</h2>
          <p className="mt-2">
            Nothing on this site is financial advice. Our tools are educational. They cannot know your full situation, your
            risk tolerance, or your tax position. Always check the output against your own circumstances, and speak to a
            qualified professional before making a decision that could affect your money.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">Affiliates and independence</h2>
          <p className="mt-2">
            Some outbound links earn a commission. These are clearly marked and routed through a local redirect so we can
            measure them. They do not influence the maths inside the calculators. Affiliate links sit in a contextual card,
            never in a banner or pop-up.
          </p>
        </div>
      </div>
    </section>
  );
}
