"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Trash2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
} from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import {
  calculateNetWorth,
  categoryLabel,
  type Account,
  type AccountCategory,
  type NetWorthMode,
  type NetWorthState,
  accountValueAt,
  categorySign,
  COMMON_CURRENCIES,
} from "@/lib/calc/networth";
import { convertToBase, DEFAULT_FX_RATES } from "@/lib/calc/fx";
import { ukRegion, usRegion } from "@/lib/regions";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTrackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const standardCategories: AccountCategory[] = ["asset", "liability"];
const freedomCategories: AccountCategory[] = ["freedom_fund", "valuable_liability", "cash", "debt"];

const modeCategories: Record<NetWorthMode, AccountCategory[]> = {
  standard: standardCategories,
  freedom_framework: freedomCategories,
};

const modeMap: Record<NetWorthMode, Record<AccountCategory, AccountCategory>> = {
  standard: {
    asset: "asset",
    liability: "liability",
    freedom_fund: "asset",
    valuable_liability: "asset",
    cash: "asset",
    debt: "liability",
  },
  freedom_framework: {
    asset: "freedom_fund",
    liability: "debt",
    freedom_fund: "freedom_fund",
    valuable_liability: "valuable_liability",
    cash: "cash",
    debt: "debt",
  },
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextMonth(date: string): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

function currencySymbol(currency: string): string {
  try {
    return (
      new Intl.NumberFormat("en", { style: "currency", currency })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value || currency
    );
  } catch {
    return currency;
  }
}

function formatDate(iso: string): string {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}

function makeInitialState(region: "uk" | "us"): NetWorthState {
  const config = region === "uk" ? ukRegion : usRegion;
  return {
    mode: "freedom_framework",
    baseCurrency: config.currency,
    region,
    accounts: config.netWorthPresets.map((preset) => ({
      ...preset,
      id: makeId(),
      snapshots: [{ date: today(), value: 0 }],
    })),
  };
}

export function NetWorthTrackerTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const initial = useMemo(() => makeInitialState(region), [region]);
  const { state, setState, copyLink, exportJson } = useCalcState<NetWorthState>({
    key: "net-worth-tracker",
    initial,
  });
  const track = useTrackEvent();
  const importRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const outputs = useMemo(() => calculateNetWorth(state, DEFAULT_FX_RATES), [state]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: state.baseCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompact = (value: number) => {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: state.baseCurrency,
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(value);
  };

  const setMode = (mode: NetWorthMode) => {
    if (mode === state.mode) return;
    setState((s) => ({
      ...s,
      mode,
      accounts: s.accounts.map((account) => ({
        ...account,
        category: modeMap[mode][account.category],
      })),
    }));
  };

  const updateAccount = (id: string, patch: Partial<Account>) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => (account.id === id ? { ...account, ...patch } : account)),
    }));
  };

  const removeAccount = (id: string) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.filter((account) => account.id !== id),
    }));
  };

  const addAccount = (category: AccountCategory) => {
    setState((s) => ({
      ...s,
      accounts: [
        ...s.accounts,
        {
          id: makeId(),
          name: "",
          category,
          currency: s.baseCurrency,
          snapshots: [{ date: today(), value: 0 }],
        },
      ],
    }));
  };

  const addPreset = (preset: { id: string; name: string; category: AccountCategory; currency: string }) => {
    setState((s) => ({
      ...s,
      accounts: [
        ...s.accounts,
        {
          ...preset,
          id: makeId(),
          snapshots: [{ date: today(), value: 0 }],
        },
      ],
    }));
  };

  const addSnapshot = (accountId: string) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        const lastDate = account.snapshots.length > 0 ? account.snapshots[account.snapshots.length - 1].date : today();
        const next = nextMonth(lastDate);
        return {
          ...account,
          snapshots: [...account.snapshots, { date: next, value: accountValueAt(account, next) }],
        };
      }),
    }));
  };

  const updateSnapshot = (accountId: string, index: number, patch: { date?: string; value?: number }) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        const snapshots = account.snapshots.map((snapshot, i) =>
          i === index ? { ...snapshot, ...patch } : snapshot
        );
        return { ...account, snapshots };
      }),
    }));
  };

  const removeSnapshot = (accountId: string, index: number) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        return { ...account, snapshots: account.snapshots.filter((_, i) => i !== index) };
      }),
    }));
  };

  const importJson = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<NetWorthState>;
      setState({ ...initial, ...parsed });
      track("networth_import", { region });
    } catch {
      window.alert("Could not import that file. Make sure it is valid JSON exported from this tool.");
    }
  };

  const hasInvestments = state.accounts.some(
    (account) => account.category === "freedom_fund" || account.category === "asset"
  );

  const cta = (
    <Card variant="surface" className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">See what your holdings could pay you</CardTitle>
          <CardDescription className="mt-1">
            {hasInvestments
              ? "Your Freedom Fund is the engine behind your net worth. If you want to model the actual dividend income those holdings could produce, "
              : "Investments are what turn net worth into income. If you want to model the dividend cash flows behind your holdings, "}
            <a
              href="https://dividendmapper.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
              onClick={() => track("dividendmapper_cta_click", { region, path: "net-worth-tracker-tool" })}
            >
              DividendMapper <ArrowUpRight className="h-3.5 w-3.5" />
            </a>{" "}
            is built for that.
          </CardDescription>
        </div>
      </div>
    </Card>
  );

  const usedPresets = new Set(
    state.accounts
      .map((account) => config.netWorthPresets.find((p) => p.name === account.name && p.category === account.category))
      .filter(Boolean)
      .map((p) => p?.id)
  );

  const unusedPresets = config.netWorthPresets.filter((preset) => !usedPresets.has(preset.id));

  return (
    <CalcShell
      title="Net Worth Tracker"
      slug="net-worth-tracker"
      state={state}
      setState={setState}
      initial={initial}
      copyLink={copyLink}
      exportJson={exportJson}
      importJson={importJson}
      cta={undefined}
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-text">Accounts</h2>
              <div className="flex items-center gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const preset = config.netWorthPresets.find((p) => p.id === e.target.value);
                      if (preset) addPreset(preset);
                      e.target.value = "";
                    }
                  }}
                  className="h-8 rounded-lg border border-hairline bg-elevated px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                  aria-label="Add preset account"
                >
                  <option value="">Add preset...</option>
                  {unusedPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addAccount(state.mode === "standard" ? "asset" : "freedom_fund")}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-hairline bg-elevated px-3 text-xs font-medium text-text-muted transition-colors hover:text-text focus-ring"
                >
                  <Plus className="h-3.5 w-3.5" /> Custom
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mode" className="block text-xs font-medium text-text-dim">
                  Mode
                </label>
                <select
                  id="mode"
                  value={state.mode}
                  onChange={(e) => setMode(e.target.value as NetWorthMode)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="freedom_framework">Freedom Framework</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <div>
                <label htmlFor="base-currency" className="block text-xs font-medium text-text-dim">
                  Base currency
                </label>
                <select
                  id="base-currency"
                  value={state.baseCurrency}
                  onChange={(e) => setState((s) => ({ ...s, baseCurrency: e.target.value }))}
                  className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {COMMON_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c} ({currencySymbol(c)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {state.accounts.length === 0 && (
                <p className="text-sm text-text-dim">Add an account to start tracking your net worth.</p>
              )}
              {state.accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  mode={state.mode}
                  baseCurrency={state.baseCurrency}
                  showAdvanced={showAdvanced}
                  onUpdate={(patch) => updateAccount(account.id, patch)}
                  onRemove={() => removeAccount(account.id)}
                  onAddSnapshot={() => addSnapshot(account.id)}
                  onUpdateSnapshot={(index, patch) => updateSnapshot(account.id, index, patch)}
                  onRemoveSnapshot={(index) => removeSnapshot(account.id, index)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="flex w-full items-center justify-between rounded-[16px] border border-hairline bg-surface p-4 text-left text-sm font-medium text-text transition-colors hover:border-stroke focus-ring"
          >
            Advanced options
            {showAdvanced ? <ChevronUp className="h-4 w-4 text-text-dim" /> : <ChevronDown className="h-4 w-4 text-text-dim" />}
          </button>

          {showAdvanced && (
            <div className="rounded-[16px] border border-hairline bg-surface p-5 text-sm text-text-muted">
              <p>
                Units tracking lets you separate how many shares or units you own from the price per unit. Enable it on
                an account by entering a units value. The account value is then units multiplied by the latest price.
              </p>
              <p className="mt-2">
                Exchange rates use static fallback values when currencies differ from the base. For precise cross-currency
                tracking, update values in the base currency directly.
              </p>
            </div>
          )}

          {cta}
        </div>

        <div className="space-y-6 lg:col-span-7">
          <CalcResult
            primary={{
              label: "Net worth",
              value: formatValue(outputs.netWorth),
              caption: outputs.netWorth >= 0 ? "Assets exceed liabilities" : "Liabilities exceed assets",
            }}
            secondary={[
              { label: "Total assets", value: formatValue(outputs.totalAssets) },
              { label: "Total liabilities", value: formatValue(outputs.totalLiabilities) },
              ...(state.mode === "freedom_framework"
                ? [
                    { label: "Freedom Fund", value: formatValue(outputs.freedomFundTotal) },
                    { label: "4% annual cover", value: formatValue(outputs.annual4PctCoverage) },
                  ]
                : []),
            ]}
          />

          <NetWorthChart data={outputs.series} mode={state.mode} formatValue={formatCompact} />

          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <h3 className="text-sm font-semibold text-text">Account trends</h3>
            {outputs.accountSeries.length === 0 ? (
              <p className="mt-4 text-sm text-text-dim">No accounts to chart yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {outputs.accountSeries.map((series) => (
                  <div key={series.id} className="rounded-xl border border-hairline bg-elevated p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-text">{series.name || "Untitled"}</p>
                      <p className="text-xs tabular-nums text-text-muted">
                        {formatValue(series.values[series.values.length - 1]?.value || 0)}
                      </p>
                    </div>
                    <Sparkline data={series.values} className="mt-2 h-10 w-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <h3 className="text-sm font-semibold text-text">Export and import</h3>
            <p className="mt-1 text-xs text-text-muted">
              Back up your tracker or move it to another device. The JSON file contains your accounts and snapshots.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportJson()], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "net-worth-tracker.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" /> Export JSON
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => importJson(String(reader.result));
                  reader.readAsText(file);
                  e.target.value = "";
                }}
              />
              <Button type="button" variant="secondary" size="sm" onClick={() => importRef.current?.click()}>
                <Upload className="h-4 w-4" /> Import JSON
              </Button>
            </div>
          </div>

          <p className="text-xs text-text-dim">
            Not financial advice. Net worth is assets minus liabilities, converted to your base currency using static
            fallback rates. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}

function AccountCard({
  account,
  mode,
  baseCurrency,
  showAdvanced,
  onUpdate,
  onRemove,
  onAddSnapshot,
  onUpdateSnapshot,
  onRemoveSnapshot,
}: {
  account: Account;
  mode: NetWorthMode;
  baseCurrency: string;
  showAdvanced: boolean;
  onUpdate: (patch: Partial<Account>) => void;
  onRemove: () => void;
  onAddSnapshot: () => void;
  onUpdateSnapshot: (index: number, patch: { date?: string; value?: number }) => void;
  onRemoveSnapshot: (index: number) => void;
}) {
  const categories = modeCategories[mode];
  const latest = accountValueAt(account, today());
  const converted = convertToBase(latest * categorySign(account.category), account.currency, baseCurrency, DEFAULT_FX_RATES);

  return (
    <div className="rounded-xl border border-hairline bg-elevated p-3">
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <div className="space-y-2">
          <Input
            value={account.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Account name"
            className="h-8 text-xs"
            aria-label="Account name"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={account.category}
              onChange={(e) => onUpdate({ category: e.target.value as AccountCategory })}
              className="h-8 rounded-lg border border-hairline bg-surface px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
              aria-label="Category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
            <select
              value={account.currency}
              onChange={(e) => onUpdate({ currency: e.target.value })}
              className="h-8 rounded-lg border border-hairline bg-surface px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
              aria-label="Currency"
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={0}
                step={0.0001}
                value={account.units ?? ""}
                onChange={(e) => {
                  const units = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ units });
                }}
                placeholder="Units (optional)"
                className="h-8 text-xs"
                aria-label="Units"
              />
              <p className="flex items-center text-xs text-text-dim">
                {account.units && account.units > 0 ? `Value = units x price` : "Units disabled"}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-debt/10 hover:text-debt focus-ring"
          aria-label="Remove account"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 border-t border-hairline pt-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-text-dim">Snapshots</p>
          <button
            type="button"
            onClick={onAddSnapshot}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text focus-ring"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {account.snapshots.length === 0 && <p className="text-xs text-text-dim">No snapshots yet.</p>}
          {account.snapshots.map((snapshot, index) => (
            <div key={`${snapshot.date}-${index}`} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <Input
                type="date"
                value={snapshot.date}
                onChange={(e) => onUpdateSnapshot(index, { date: e.target.value })}
                className="h-8 text-xs"
                aria-label="Snapshot date"
              />
              <Input
                type="number"
                step={1}
                value={snapshot.value}
                onChange={(e) => onUpdateSnapshot(index, { value: Number(e.target.value) })}
                className="h-8 text-xs"
                aria-label="Snapshot value"
              />
              <button
                type="button"
                onClick={() => onRemoveSnapshot(index)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-debt/10 hover:text-debt focus-ring"
                aria-label="Remove snapshot"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs tabular-nums text-text-muted">
          Latest: {formatNumber(converted)} in {baseCurrency}
        </p>
      </div>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function NetWorthChart({
  data,
  mode,
  formatValue,
}: {
  data: {
    date: string;
    netWorth: number;
    totals: Record<string, number>;
    positives: { key: string; y0: number; y1: number }[];
    negatives: { key: string; y0: number; y1: number }[];
  }[];
  mode: NetWorthMode;
  formatValue: (value: number) => string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    index: number;
    x: number;
    y: number;
    containerWidth: number;
  } | null>(null);

  const width = 800;
  const height = 420;
  const margin = { top: 30, right: 20, bottom: 50, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (data.length === 0) {
    return (
      <div className="aspect-video rounded-[16px] border border-hairline bg-surface">
        <div className="flex h-full items-center justify-center text-sm text-text-muted">
          Add accounts and snapshots to see the chart.
        </div>
      </div>
    );
  }

  const yMin = Math.min(0, ...data.flatMap((d) => d.negatives.map((n) => n.y1)));
  const yMax = Math.max(
    ...data.flatMap((d) => d.positives.map((p) => p.y1)),
    Math.max(...data.map((d) => d.netWorth)) * 1.05
  );

  const xFor = (index: number) => (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);
  const yFor = (value: number) => innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  const positiveKeys = Array.from(new Set(data.flatMap((d) => d.positives.map((p) => p.key))));
  const negativeKeys = Array.from(new Set(data.flatMap((d) => d.negatives.map((n) => n.key))));

  const buildAreaPath = (points: { x: number; y0: number; y1: number }[]) => {
    if (points.length === 0) return "";
    const top = points.map((p) => `${p.x},${yFor(p.y1)}`).join(" L ");
    const bottom = [...points].reverse().map((p) => `${p.x},${yFor(p.y0)}`).join(" L ");
    return `M ${top} L ${bottom} Z`;
  };

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)},${yFor(d.netWorth)}`)
    .join(" ");

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) / yTicks) * i);

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - margin.left;
    const ratio = Math.max(0, Math.min(1, x / innerWidth));
    const index = Math.round(ratio * (data.length - 1));
    setTooltip({
      index,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      containerWidth: rect.width,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const colors: Record<string, string> = {
    asset: "var(--color-text)",
    liability: "var(--color-debt)",
    freedom_fund: "var(--color-text)",
    valuable_liability: "var(--color-text-muted)",
    cash: "var(--color-text-dim)",
    debt: "var(--color-debt)",
  };

  const opacityFor = (key: string) => {
    if (key === "asset" || key === "freedom_fund") return 0.9;
    if (key === "valuable_liability") return 0.5;
    if (key === "cash") return 0.35;
    return 0.65;
  };

  return (
    <div ref={containerRef} className="relative aspect-video rounded-[16px] border border-hairline bg-surface">
      <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-text">Net worth over time</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-dim">
          {mode === "freedom_framework" ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-text/80" /> Freedom Fund
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-text-muted/60" /> Valuable Liabilities
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-text-dim/50" /> Cash
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-debt/70" /> Debts
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-text/80" /> Assets
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-debt/70" /> Liabilities
              </span>
            </>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-label="Net worth chart">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Y axis ticks */}
          {yTickValues.map((value, i) => (
            <g key={i}>
              <line
                x1={0}
                x2={innerWidth}
                y1={yFor(value)}
                y2={yFor(value)}
                stroke="var(--color-hairline)"
                strokeDasharray={value === 0 ? undefined : "3,3"}
              />
              <text
                x={-10}
                y={yFor(value)}
                dy="0.32em"
                textAnchor="end"
                fill="var(--color-text-dim)"
                fontSize={11}
                className="tabular-nums"
              >
                {formatValue(value)}
              </text>
            </g>
          ))}

          {/* X axis ticks */}
          {data.map((d, i) =>
            i % Math.max(1, Math.floor(data.length / 6)) === 0 ? (
              <text
                key={d.date}
                x={xFor(i)}
                y={innerHeight + 20}
                textAnchor="middle"
                fill="var(--color-text-dim)"
                fontSize={11}
                className="tabular-nums"
              >
                {formatDate(d.date)}
              </text>
            ) : null
          )}

          {/* Positive stacked areas */}
          {positiveKeys.map((key) => {
            const points = data.map((d, i) => {
              const layer = d.positives.find((p) => p.key === key);
              return {
                x: xFor(i),
                y0: layer?.y0 ?? 0,
                y1: layer?.y1 ?? 0,
              };
            });
            return (
              <path
                key={`pos-${key}`}
                d={buildAreaPath(points)}
                fill={colors[key]}
                fillOpacity={opacityFor(key)}
                stroke="none"
              />
            );
          })}

          {/* Negative stacked areas */}
          {negativeKeys.map((key) => {
            const points = data.map((d, i) => {
              const layer = d.negatives.find((n) => n.key === key);
              return {
                x: xFor(i),
                y0: layer?.y0 ?? 0,
                y1: layer?.y1 ?? 0,
              };
            });
            return (
              <path
                key={`neg-${key}`}
                d={buildAreaPath(points)}
                fill={colors[key]}
                fillOpacity={opacityFor(key)}
                stroke="none"
              />
            );
          })}

          {/* Net worth line */}
          <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />

          {/* Hover target */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          />
        </g>
      </svg>

      {tooltip && data[tooltip.index] && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-hairline bg-elevated px-3 py-2 text-xs shadow-card"
          style={{
            left: Math.min(tooltip.x + 12, tooltip.containerWidth - 180),
            top: Math.max(tooltip.y - 12, 0),
          }}
        >
          <p className="font-medium text-text">{formatDate(data[tooltip.index].date)}</p>
          <p className="mt-1 tabular-nums text-text">
            Net worth: {formatValue(data[tooltip.index].netWorth)}
          </p>
          <div className="mt-1 space-y-0.5 tabular-nums text-text-muted">
            {modeCategories[mode].map((key) => {
              const value = data[tooltip.index].totals[key] || 0;
              if (Math.abs(value) < 0.01) return null;
              return (
                <p key={key}>
                  {categoryLabel(key)}: {formatValue(value)}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkline({ data, className }: { data: { date: string; value: number }[]; className?: string }) {
  if (data.length < 2) {
    return <div className={cn("rounded-md bg-hairline", className)} />;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 90 - 5;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("overflow-visible", className)} aria-hidden="true">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
