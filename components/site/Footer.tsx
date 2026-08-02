import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1160px] px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-text">Your Net Worth</p>
            <p className="mt-2 text-sm text-text-muted">
              Free UK and US calculators, built to be clear and useful. A sister site to{" "}
              <a
                href="https://dividendmapper.com"
                target="_blank"
                rel="noopener"
                className="text-accent hover:text-accent-hover"
              >
                DividendMapper.com
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Link href="/editorial-policy" className="text-sm text-text-muted hover:text-text">
              Editorial policy
            </Link>
            <Link href="/about" className="text-sm text-text-muted hover:text-text">
              About
            </Link>
            <Link href="/updates" className="text-sm text-text-muted hover:text-text">
              Updates
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t border-hairline pt-6">
          <p className="text-xs text-text-dim">
            Not financial advice. Our calculators are educational tools, not personalised recommendations. Past
            performance and assumptions do not predict future results. Please read our full{" "}
            <Link href="/editorial-policy" className="underline hover:text-text">
              editorial policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
