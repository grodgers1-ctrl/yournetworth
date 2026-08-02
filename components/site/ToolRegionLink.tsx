"use client";

import Link from "next/link";
import { useState } from "react";

type ToolRegionLinkProps = {
  toolSlug: string;
  children: React.ReactNode;
  className?: string;
};

function resolveHref(toolSlug: string): string {
  if (typeof window === "undefined") return `/uk/tools/${toolSlug}/`;
  const region = (window.localStorage.getItem("region") as "uk" | "us" | null) ?? "uk";
  return `/${region}/tools/${toolSlug}/`;
}

export function ToolRegionLink({ toolSlug, children, className }: ToolRegionLinkProps) {
  const [href] = useState(() => resolveHref(toolSlug));

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
