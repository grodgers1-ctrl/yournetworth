"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { RegionToggle } from "@/components/site/RegionToggle";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/updates", label: "Updates" },
  { href: "/glossary", label: "Glossary" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-bg/70 backdrop-blur-[30px]">
        <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-text focus-ring rounded-sm">
            Your Net Worth
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <RegionToggle />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-elevated text-text-muted transition-colors hover:text-text focus-ring md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-hairline bg-surface transition-all duration-200 md:hidden ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-2 px-6 py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-text-muted transition-colors hover:text-text focus-ring rounded-sm"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <RegionToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
