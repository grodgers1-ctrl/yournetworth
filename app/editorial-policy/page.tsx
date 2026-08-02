import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Editorial policy",
  description: "How Your Net Worth sources, reviews, and updates personal-finance content and calculators.",
  openGraph: {
    title: "Editorial policy",
    description: "How Your Net Worth sources, reviews, and updates personal-finance content and calculators.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial policy",
    description: "How Your Net Worth sources, reviews, and updates personal-finance content and calculators.",
    images: ["/og.png"],
  },
};

const sections = [
  {
    title: "Who writes and reviews",
    body: "Every article and guide has a named author. Every tool has a named methodology owner. Where a topic demands specialist review, we add a \"Reviewed by\" line. We do not publish anonymous or unattributed finance content.",
  },
  {
    title: "How we source information",
    body: "We prefer primary sources: HMRC guidance, IRS publications, ONS and Bank of England data, Federal Reserve releases, and official government websites. When we cite a third-party study or article, we link to it directly so you can check the original.",
  },
  {
    title: "How we test calculators",
    body: "Each calculator has a pure-maths module in lib/calc/ that is tested independently from the user interface. The numbers you see on the chart come from those modules. We document the assumptions, the formulas, and the data sources on a dedicated methodology page for every tool.",
  },
  {
    title: "How we update and correct",
    body: "Tax bands, allowances, and market conditions change. We review every published page at six months and again at one year, or sooner when a major source changes. Corrections are logged on the updates page and reflected in the \"Last updated\" date on each page.",
  },
  {
    title: "What this is not",
    body: "Nothing on this site is financial advice. Our tools are educational. They cannot know your full situation, your risk tolerance, or your tax position. Always check the output against your own circumstances, and speak to a qualified professional before making a decision that could affect your money.",
  },
  {
    title: "Affiliates and independence",
    body: "Some outbound links earn a commission. These are clearly marked and routed through a local redirect so we can measure them. They do not influence the maths inside the calculators. Affiliate links sit in a contextual card, never in a banner or pop-up.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]} />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <SectionHeader
          title="Editorial policy"
          subtitle="Personal finance is a YMYL topic. That means every claim, every calculator, and every guide must earn its place on the page. This policy explains how we do that."
        />

        <div className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <div key={s.title} id={`section-${i + 1}`}>
              <h2 className="text-subsection">{s.title}</h2>
              <p className="mt-2 text-body">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-body">
          If you spot an error or a source that needs updating, please reach out via the author page or the updates page.
        </p>
      </section>
    </>
  );
}
