import type { Metadata } from "next";
import { updates } from "@/content/taxonomy";

export const metadata: Metadata = {
  title: "Updates",
  description: "Changelog and updates for Your Net Worth.",
};

export default function UpdatesPage() {
  return (
    <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-text md:text-5xl">Updates</h1>
      <p className="mt-4 max-w-3xl text-text-muted">
        A public log of what we publish, change, and fix. This is a cheap freshness signal for search engines and a useful
        reference for readers.
      </p>

      <div className="mt-10 space-y-6">
        {updates.map((u) => (
          <article
            key={u.date}
            className="rounded-[16px] border border-hairline bg-surface p-6"
          >
            <p className="text-xs font-medium text-text-dim">{u.date}</p>
            <h2 className="mt-2 text-lg font-semibold text-text">{u.title}</h2>
            <p className="mt-2 text-text-muted">{u.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
