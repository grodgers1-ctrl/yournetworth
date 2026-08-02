"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { GlossaryTerm } from "@/content/taxonomy";
import { CardTitle, CardDescription } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function GlossaryFilter({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const filtered = terms.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.definition.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-4 w-4 text-text-dim" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms..."
          className="h-12 w-full rounded-full border border-hairline bg-elevated pl-10 pr-4 text-sm text-text placeholder:text-text-dim focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Search glossary terms"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState className="mt-6" title="No matching terms" description="Try a different search term." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="rounded-[16px] border border-hairline bg-surface p-5 transition-colors hover:border-stroke focus-ring"
            >
              <CardTitle className="text-base">{t.title}</CardTitle>
              <CardDescription className="mt-2 line-clamp-3">{t.definition}</CardDescription>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
