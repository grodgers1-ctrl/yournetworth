"use client";

import { useState } from "react";
import { Link2, Download, Check, RotateCcw } from "lucide-react";
import { RegionToggle } from "@/components/site/RegionToggle";
import { CalcScenarios } from "./CalcScenarios";
import { Button } from "@/components/ui/Button";
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
      <div className="rounded-[16px] border border-hairline bg-surface p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            <p className="mt-1 text-sm text-text-muted">Move any slider to see the chart recalculate instantly.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RegionToggle />
            <Button
              type="button"
              onClick={handleCopy}
              variant="secondary"
              size="sm"
              className={cn(copied && "border-accent/30 bg-accent-muted text-accent")}
              aria-label="Copy shareable link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button
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
              variant="secondary"
              size="sm"
              aria-label="Export scenario as JSON"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              type="button"
              onClick={() => setState(initial)}
              variant="secondary"
              size="sm"
              aria-label="Reset to default values"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-5 border-t border-hairline pt-4">
          <CalcScenarios slug={slug} state={state} setState={setState} initial={initial} />
        </div>
      </div>

      {children}

      {cta && <div className="rounded-[16px] border border-hairline bg-surface p-5">{cta}</div>}
    </div>
  );
}
