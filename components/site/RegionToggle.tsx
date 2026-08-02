"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTrackEvent } from "@/lib/analytics";

type Region = "uk" | "us";

export function RegionToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const [region, setRegion] = useState<Region>(() => {
    if (typeof window === "undefined") return "uk";
    return (window.localStorage.getItem("region") as Region | null) ?? "uk";
  });

  const track = useTrackEvent();

  useEffect(() => {
    window.localStorage.setItem("region", region);
  }, [region]);

  const select = (next: Region) => {
    setRegion(next);
    track("region_toggle", { region: next, path: pathname ?? undefined });
    if (pathname && (pathname.startsWith("/uk/") || pathname.startsWith("/us/"))) {
      const nextPath = pathname.replace(/^\/(uk|us)\//, `/${next}/`);
      router.push(nextPath);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-hairline bg-elevated p-1">
      {(["uk", "us"] as Region[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => select(r)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            region === r ? "bg-accent text-text" : "text-text-muted hover:text-text"
          )}
          aria-pressed={region === r}
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
