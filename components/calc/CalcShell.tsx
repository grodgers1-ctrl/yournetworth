"use client";

import { useState } from "react";
import { Link2, Download, Check } from "lucide-react";
import { RegionToggle } from "@/components/site/RegionToggle";
import { CalcScenarios } from "./CalcScenarios";
import { cn } from "@/lib/utils";

type CalcShellProps<T extends Record<string, unknown>> = {
  title: string;
  slug: string;
  state: T;
  setState: (state: T) => void;
  initial: T;
  copyLink: () => Promise<void>;
  exportJson: () => string;
  cta?: React.ReactNode;
  children: React.ReactNode;
};

export function CalcShell<T extends Record<string, unknown>>({
  title,
  slug,
  state,
  setState,
  initial,
  copyLink,
  exportJson,
  cta,
  children,
}: CalcShellProps<T>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyLink();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-studio">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            <p className="mt-1 text-sm text-text-muted">Move any slider to see the chart recalculate instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <RegionToggle />
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border border-hairline px-4 text-sm font-medium transition-colors",
                copied
                  ? "border-green-800/50 bg-green-900/20 text-green-300"
                  : "border-hairline bg-elevated text-text-muted hover:text-text"
              )}
              aria-label="Copy shareable link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([exportJson()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${slug}-scenario.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline bg-elevated px-4 text-sm font-medium text-text-muted transition-colors hover:text-text"
              aria-label="Export scenario as JSON"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="mt-4">
          <CalcScenarios slug={slug} state={state} setState={setState} initial={initial} />
        </div>
      </div>

      {children}

      {cta && <div className="rounded-[16px] border border-hairline bg-surface p-5">{cta}</div>}
    </div>
  );
}
