import Link from "next/link";
import { glossaryTerms } from "@/content/taxonomy";

export function Related({ slugs }: { slugs: string[] }) {
  const terms = slugs
    .map((slug) => glossaryTerms.find((t) => t.slug === slug))
    .filter(Boolean) as typeof glossaryTerms;

  if (terms.length === 0) return null;

  return (
    <div className="my-6 rounded-[16px] border border-hairline bg-surface p-5">
      <p className="text-sm font-semibold text-text">Related</p>
      <ul className="mt-2 space-y-1">
        {terms.map((t) => (
          <li key={t.slug}>
            <Link href={`/glossary/${t.slug}`} className="text-sm text-accent hover:text-accent-hover">
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
