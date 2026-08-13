"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Download, Upload, Check, RotateCcw } from "lucide-react";
import { RegionToggle } from "@/components/site/RegionToggle";
import { CalcScenarios } from "./CalcScenarios";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTrackEvent } from "@/lib/analytics";

type CalcShellProps<T extends Record<string, unknown>> = {
  title: string;
  slug: string;
  state: T;
  setState: (state: T) => void;
  initial: T;
  copyLink: () => Promise<void>;
  exportJson: () => string;
  importJson?: (json: string) => void;
  subtitle?: string;
  exportLabel?: string;
  importLabel?: string;
  note?: string;
  cta?: React.ReactNode;
  /** Extra buttons rendered in the hero action row, e.g. "Load example". */
  extraActions?: React.ReactNode;
  /** Set false when the surrounding header already shows a region toggle. */
  showRegionToggle?: boolean;
  /** When true, renders a stripped-down view suitable for an iframe embed. */
  embed?: boolean;
  /** URL to link back to the full tool from an embed view. */
  embedBacklink?: string;
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
  importJson,
  subtitle,
  exportLabel = "Export",
  importLabel = "Import",
  note,
  cta,
  extraActions,
  showRegionToggle = true,
  embed = false,
  embedBacklink,
  children,
}: CalcShellProps<T>) {
  const [copied, setCopied] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const track = useTrackEvent();

  useEffect(() => {
    track("tool_viewed", { slug });
  }, [slug, track]);

  const handleCopy = async () => {
    await copyLink();
    setCopied(true);
    track("share_link_copied", { slug });
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !importJson) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      importJson(text);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      {!embed && (
        <div className="rounded-[16px] border border-hairline bg-surface p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
              <p className="mt-1 text-sm text-text-muted">{subtitle ?? "Move any slider to see the chart recalculate instantly."}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {showRegionToggle && <RegionToggle />}
              {extraActions}
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
                  track("export_clicked", { slug, format: "json" });
                }}
                variant="secondary"
                size="sm"
                aria-label={`${exportLabel} as JSON`}
              >
                <Download className="h-4 w-4" />
                {exportLabel}
              </Button>
              {importJson && (
                <>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImport}
                    aria-label="Import scenario JSON"
                  />
                  <Button
                    type="button"
                    onClick={() => importRef.current?.click()}
                    variant="secondary"
                    size="sm"
                    aria-label={`${importLabel} JSON`}
                  >
                    <Upload className="h-4 w-4" />
                    {importLabel}
                  </Button>
                </>
              )}
              <Button
                type="button"
                onClick={() => {
                  setState(initial);
                  track("reset_clicked", { slug });
                }}
                variant="secondary"
                size="sm"
                aria-label="Reset to default values"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          {note && <p className="mt-3 text-xs text-text-dim">{note}</p>}
          <div className="mt-5 border-t border-hairline pt-4">
            <CalcScenarios slug={slug} state={state} setState={setState} initial={initial} />
          </div>
        </div>
      )}

      {children}

      {!embed && cta && <div className="rounded-[16px] border border-hairline bg-surface p-5">{cta}</div>}

      {embed && embedBacklink && (
        <div className="flex items-center justify-between gap-4 rounded-[16px] border border-hairline bg-surface px-5 py-3">
          <span className="text-xs text-text-dim">
            Calculator by{" "}
            <a
              href={embedBacklink}
              target="_blank"
              rel="noopener"
              className="text-accent hover:text-accent-hover"
            >
              Your Net Worth
            </a>
          </span>
          <a
            href={embedBacklink}
            target="_blank"
            rel="noopener"
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            Open full tool →
          </a>
        </div>
      )}
    </div>
  );
}
