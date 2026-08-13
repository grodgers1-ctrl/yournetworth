"use client";

import { usePathname } from "next/navigation";

export function LayoutShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed") ?? false;

  return (
    <>
      {!isEmbed && header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isEmbed && footer}
    </>
  );
}
