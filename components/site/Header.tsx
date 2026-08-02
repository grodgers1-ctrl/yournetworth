"use client";

import Link from "next/link";
import { RegionToggle } from "@/components/site/RegionToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/updates", label: "Updates" },
  { href: "/glossary", label: "Glossary" },
  { href: "/authors/glenn-rodgers", label: "Author" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-bg/70 backdrop-blur-[30px]">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-text">
          Your Net Worth
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <RegionToggle />
      </div>
    </header>
  );
}
