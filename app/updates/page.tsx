import type { Metadata } from "next";
import { updates } from "@/content/taxonomy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Updates",
  description: "Changelog and updates for Your Net Worth.",
  openGraph: { title: "Updates", description: "Changelog and updates for Your Net Worth.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Updates", description: "Changelog and updates for Your Net Worth.", images: ["/og.png"] },
};

export default function UpdatesPage() {
  return (
    <>
      <section className="mx-auto max-w-[1160px] px-6 py-6 md:py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Updates" }]} />
      </section>
      <section className="mx-auto max-w-[760px] px-6 pb-10 md:pb-16">
        <SectionHeader
          title="Updates"
          subtitle="A public log of what we publish, change, and fix. This is a cheap freshness signal for search engines and a useful reference for readers."
        />

        <div className="mt-10 space-y-6">
          {updates.map((u) => (
            <article
              key={u.date}
              className="rounded-[16px] border border-hairline bg-surface p-6 transition-colors hover:border-stroke"
            >
              <div className="flex items-center gap-3">
                <Badge variant="muted">{u.date}</Badge>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-text">{u.title}</h2>
              <p className="mt-2 text-body">{u.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
