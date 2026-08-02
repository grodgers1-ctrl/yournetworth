"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Region = "uk" | "us";

export function RegionToggle() {
  const [region, setRegion] = useState<Region>(() => {
    if (typeof window === "undefined") return "uk";
    return (window.localStorage.getItem("region") as Region | null) ?? "uk";
  });

  useEffect(() => {
    window.localStorage.setItem("region", region);
  }, [region]);

  const select = (next: Region) => {
    setRegion(next);
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
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
