"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import {
  calculateNetWorth,
  categoryHint,
  categoryIsNegative,
  categoryLabel,
  type Account,
  type AccountCategory,
  type NetWorthMode,
  type NetWorthPreset,
  type NetWorthState,
  accountValueAt,
  categorySign,
  valueWithUnits,
  COMMON_CURRENCIES,
} from "@/lib/calc/networth";
import { convertToBase, DEFAULT_FX_RATES } from "@/lib/calc/fx";
import { ukRegion, usRegion } from "@/lib/regions";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
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

function monthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
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

function makeSnapshot(value = 0, date = today()): { id: string; date: string; value: number } {
  return { id: makeId(), date, value };
}

function sortSnapshots<T extends { date: string }>(snapshots: T[]): T[] {
  return [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
}

function starterPresetIds(region: "uk" | "us"): string[] {
  if (region === "uk") {
    return ["current-account", "stocks-isa", "main-residence", "mortgage"];
  }
  return ["checking", "roth-ira", "main-residence", "mortgage"];
}

function makeInitialState(region: "uk" | "us"): NetWorthState {
  const config = region === "uk" ? ukRegion : usRegion;
  const starters = new Set(starterPresetIds(region));
  return {
    mode: "freedom_framework",
    baseCurrency: config.currency,
    region,
    accounts: config.netWorthPresets
      .filter((preset) => starters.has(preset.id))
      .map((preset) => ({
        id: makeId(),
        presetId: preset.id,
        name: preset.name,
        category: preset.category,
        currency: preset.currency,
        snapshots: [makeSnapshot()],
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

  const removeAccount = (account: Account) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.filter((a) => a.id !== account.id),
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
          snapshots: [makeSnapshot()],
        },
      ],
    }));
  };

  const addPreset = (preset: NetWorthPreset) => {
    setState((s) => ({
      ...s,
      accounts: [
        ...s.accounts,
        {
          id: makeId(),
          presetId: preset.id,
          name: preset.name,
          category: preset.category,
          currency: preset.currency,
          snapshots: [makeSnapshot()],
        },
      ],
    }));
  };

  const addSnapshot = (accountId: string) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        const maxDate = account.snapshots.length > 0
          ? account.snapshots.reduce((max, snapshot) => (snapshot.date > max ? snapshot.date : max), account.snapshots[0].date)
          : today();
        const next = nextMonth(maxDate);
        return {
          ...account,
          snapshots: sortSnapshots([
            ...account.snapshots,
            makeSnapshot(accountValueAt(account, next), next),
          ]),
        };
      }),
    }));
  };

  const updateSnapshot = (accountId: string, snapshotId: string | undefined, patch: { date?: string; value?: number }) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        const snapshots = account.snapshots.map((snapshot) =>
          snapshot.id === snapshotId || (snapshotId === undefined && snapshot.id === undefined)
            ? { ...snapshot, ...patch }
            : snapshot
        );
        return { ...account, snapshots: sortSnapshots(snapshots) };
      }),
    }));
  };

  const removeSnapshot = (accountId: string, snapshotId: string | undefined) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((account) => {
        if (account.id !== accountId) return account;
        return { ...account, snapshots: account.snapshots.filter((snapshot) => snapshot.id !== snapshotId) };
      }),
    }));
  };

  const importJson = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<NetWorthState>;
      const accounts = parsed.accounts?.map((account) => ({
        ...account,
        snapshots: account.snapshots.map((snapshot) => ({
          id: snapshot.id ?? makeId(),
          date: snapshot.date,
          value: snapshot.value,
        })),
      })) ?? initial.accounts;
      setState({ ...initial, ...parsed, accounts });
      track("networth_import", { region });
    } catch {
      window.alert("Could not import that file. Make sure it is valid JSON exported from this tool.");
    }
  };

  const hasRealValues = state.accounts.some((account) =>
    account.snapshots.some((snapshot) => snapshot.value !== 0)
  );

  const loadExample = () => {
    if (hasRealValues && !window.confirm("Load example data? This replaces your current accounts.")) return;
    setState((s) => ({
      ...s,
      accounts: config.netWorthExample
        .map((example) => {
          const preset = config.netWorthPresets.find((p) => p.id === example.presetId);
          if (!preset) return undefined;
          const account: Account = {
            id: makeId(),
            presetId: preset.id,
            name: preset.name,
            category: modeMap[s.mode][preset.category],
            currency: preset.currency,
            snapshots: example.values.map((value, index) => ({
              id: makeId(),
              date: monthsAgo(example.values.length - 1 - index),
              value,
            })),
          };
          return account;
        })
        .filter((account): account is Account => account !== undefined),
    }));
    track("networth_load_example", { region });
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
      .map((account) => {
        if (account.presetId) return account.presetId;
        // Saved accounts from before presetId existed: fall back to name+category.
        return config.netWorthPresets.find((p) => p.name === account.name && p.category === account.category)?.id;
      })
      .filter((id): id is string => Boolean(id))
  );

  const netWorthDelta =
    outputs.series.length >= 2
      ? outputs.series[outputs.series.length - 1].netWorth - outputs.series[outputs.series.length - 2].netWorth
      : null;

  const downloadCsv = () => {
    const escape = (cell: string) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell);
    const dates = outputs.dates;
    const rows = [
      ["Account", "Category", ...dates],
      ...state.accounts.map((account) => [
        account.name,
        categoryLabel(account.category),
        ...dates.map((date) => {
          const snapshot = account.snapshots.find((s) => s.date === date);
          return snapshot ? String(snapshot.value) : "";
        }),
      ]),
      ["Net worth", "", ...outputs.series.map((point) => String(point.netWorth))],
    ];
    const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `net-worth-tracker-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    track("networth_download_csv", { region });
  };

  const unusedPresets = config.netWorthPresets.filter((preset) => !usedPresets.has(preset.id));

  const trendSeries = outputs.accountSeries.filter((series) => {
    const account = state.accounts.find((a) => a.id === series.id);
    return account !== undefined && account.snapshots.length >= 2;
  });

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
      subtitle="Add accounts and monthly snapshots to see your net worth chart update. Free, private, and no sign-up — your data stays in your browser."
      exportLabel="Back up data"
      importLabel="Restore backup"
      note="Backups save a small file to your computer so you can restore your tracker later."
      showRegionToggle={false}
      extraActions={
        <>
          <Button
            type="button"
            onClick={loadExample}
            variant="secondary"
            size="sm"
            aria-label="Load example data"
          >
            <Sparkles className="h-4 w-4" />
            Load example
          </Button>
          {outputs.dates.length > 0 && (
            <Button
              type="button"
              onClick={downloadCsv}
              variant="secondary"
              size="sm"
              aria-label="Download snapshots as CSV"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          )}
        </>
      }
    >
      <IntroStrip />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-text">Accounts</h2>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {unusedPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => addPreset(preset)}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-hairline bg-elevated px-2.5 text-xs font-medium text-text-muted transition-colors hover:border-stroke hover:text-text focus-ring"
                >
                  <Plus className="h-3 w-3" /> {preset.shortName ?? preset.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => addAccount(state.mode === "standard" ? "asset" : "freedom_fund")}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-hairline bg-elevated px-2.5 text-xs font-medium text-text-muted transition-colors hover:border-stroke hover:text-text focus-ring"
              >
                <Plus className="h-3 w-3" /> Custom
              </button>
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
                  hideCategory={
                    account.presetId !== undefined ||
                    config.netWorthPresets.some((p) => p.name === account.name && p.category === account.category)
                  }
                  formatValue={formatValue}
                  onUpdate={(patch) => updateAccount(account.id, patch)}
                  onRemove={() => removeAccount(account)}
                  onAddSnapshot={() => addSnapshot(account.id)}
                  onUpdateSnapshot={(snapshotId, patch) => updateSnapshot(account.id, snapshotId, patch)}
                  onRemoveSnapshot={(snapshotId) => removeSnapshot(account.id, snapshotId)}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-text-dim">
              {region === "uk" ? (
                <>
                  Tip: hunt down forgotten workplace pensions with the government&apos;s free{" "}
                  <a
                    href="https://www.gov.uk/find-pension-contact-details"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    Pension Tracing Service
                  </a>{" "}
                  before your first snapshot.
                </>
              ) : (
                "Tip: track down old 401(k)s from previous employers so your first snapshot is complete."
              )}
            </p>
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
            <div className="rounded-[16px] border border-hairline bg-surface p-5">
              <div className="grid grid-cols-2 gap-3">
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
              <p className="mt-3 text-sm text-text-muted">
                Currency, category and units fields are now shown on each account card above. Enter units held to track
                a fund by price per unit instead of total value.
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Exchange rates use static fallback values when currencies differ from the base. For precise
                cross-currency tracking, update values in the base currency directly.
              </p>
            </div>
          )}

          {cta}
        </div>

        <div className="space-y-6 lg:col-span-7 lg:self-start lg:sticky lg:top-6">
          <CalcResult
            primary={{
              label: "Net worth",
              value: formatValue(outputs.netWorth),
              caption: (
                <>
                  {outputs.netWorth >= 0 ? "Assets exceed liabilities" : "Liabilities exceed assets"}
                  {netWorthDelta !== null && Math.abs(netWorthDelta) >= 0.01 && (
                    <span className="text-text">
                      {" · "}
                      {netWorthDelta >= 0 ? "Up" : "Down"} {formatValue(Math.abs(netWorthDelta))} since{" "}
                      {formatDate(outputs.series[outputs.series.length - 2].date)}
                    </span>
                  )}
                </>
              ),
            }}
            secondary={[
              { label: "Total assets", value: formatValue(outputs.totalAssets) },
              { label: "Total liabilities", value: formatValue(outputs.totalLiabilities) },
              ...(state.mode === "freedom_framework"
                ? [
                    { label: "Freedom Fund", value: formatValue(outputs.freedomFundTotal) },
                    { label: "Yearly income at 4% withdrawal", value: formatValue(outputs.annual4PctCoverage) },
                  ]
                : []),
            ]}
          />

          <NetWorthChart data={outputs.series} mode={state.mode} formatValue={formatValue} formatAxis={formatCompact} />

          {trendSeries.length > 0 && (
            <div className="rounded-[16px] border border-hairline bg-surface p-5">
              <h3 className="text-sm font-semibold text-text">Account trends</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {trendSeries.map((series) => (
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
            </div>
          )}

          <p className="text-xs text-text-dim">
            Not financial advice. Net worth is assets minus liabilities, converted to your base currency using static
            fallback rates. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}

function IntroStrip() {
  const [dismissedLocally, setDismissedLocally] = useState(false);
  // Server snapshot is "dismissed" so the strip only appears after hydration.
  const storedDismissed = useSyncExternalStore(
    () => () => {},
    () => window.localStorage.getItem("nwt-intro-dismissed") === "1",
    () => true
  );

  if (dismissedLocally || storedDismissed) return null;

  const dismiss = () => {
    window.localStorage.setItem("nwt-intro-dismissed", "1");
    setDismissedLocally(true);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-hairline bg-surface px-4 py-2.5 text-xs text-text-muted">
      <p>
        1. Add your accounts → 2. Enter today&apos;s balances → 3. Come back monthly and add a snapshot.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-dim transition-colors hover:text-text focus-ring"
        aria-label="Dismiss introduction"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AccountCard({
  account,
  mode,
  baseCurrency,
  showAdvanced,
  hideCategory,
  formatValue,
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
  hideCategory: boolean;
  formatValue: (value: number) => string;
  onUpdate: (patch: Partial<Account>) => void;
  onRemove: () => void;
  onAddSnapshot: () => void;
  onUpdateSnapshot: (snapshotId: string | undefined, patch: { date?: string; value?: number }) => void;
  onRemoveSnapshot: (snapshotId: string | undefined) => void;
}) {
  const categories = modeCategories[mode];
  const latest = valueWithUnits(account, accountValueAt(account, today()));
  const signed = latest * categorySign(account.category);
  const converted = signed === 0 ? 0 : convertToBase(signed, account.currency, baseCurrency, DEFAULT_FX_RATES);
  const isDebt = categoryIsNegative(account.category);
  const usesUnits = Boolean(account.units && account.units > 0);
  const hint = categoryHint(account.category);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

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
          {hint && <p className="text-xs text-text-dim">{hint}</p>}
          {!hideCategory && (
            <select
              value={account.category}
              onChange={(e) => onUpdate({ category: e.target.value as AccountCategory })}
              className="h-8 w-full rounded-lg border border-hairline bg-surface px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
              aria-label="Category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          )}
          {showAdvanced && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {hideCategory && (
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
                )}
                <select
                  value={account.currency}
                  onChange={(e) => onUpdate({ currency: e.target.value })}
                  className={cn(
                    "h-8 rounded-lg border border-hairline bg-surface px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20",
                    !hideCategory && "col-span-2"
                  )}
                  aria-label="Currency"
                >
                  {COMMON_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
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
                  placeholder="Units held (optional)"
                  className="h-8 text-xs"
                  aria-label="Units held"
                />
                <p className="flex items-center text-xs text-text-dim">
                  {usesUnits ? "Snapshots become price per unit" : "Leave empty to track total value"}
                </p>
              </div>
            </div>
          )}
        </div>
        {confirmingRemove ? (
          <button
            type="button"
            onClick={onRemove}
            onMouseLeave={() => setConfirmingRemove(false)}
            onBlur={() => setConfirmingRemove(false)}
            className="mt-1 inline-flex h-7 items-center rounded-full bg-debt/10 px-2 text-xs font-medium text-debt focus-ring"
          >
            Delete?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (account.snapshots.length >= 2 ? setConfirmingRemove(true) : onRemove())}
            className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-debt/10 hover:text-debt focus-ring"
            aria-label="Remove account"
            title="Delete account"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 border-t border-hairline pt-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-text-dim">
            {account.snapshots.length === 1 ? (usesUnits ? "Price per unit" : "Today's balance") : "Snapshots"}
          </p>
          <button
            type="button"
            onClick={onAddSnapshot}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text focus-ring"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {account.snapshots.length === 0 && <p className="text-xs text-text-dim">No snapshots yet.</p>}
        {account.snapshots.length === 1 && (
          <CurrencyInput
            value={account.snapshots[0].value}
            onCommit={(value) => onUpdateSnapshot(account.snapshots[0].id, { value })}
            currencySymbol={currencySymbol(account.currency)}
            hideZero
            step={1}
            placeholder="0"
            aria-label={usesUnits ? "Price per unit" : "Today's balance"}
          />
        )}
        {account.snapshots.length > 1 && (
          <div className="space-y-2">
            {account.snapshots.map((snapshot) => (
              <div key={snapshot.id ?? snapshot.date} className="group grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                <Input
                  type="date"
                  value={snapshot.date}
                  onChange={(e) => onUpdateSnapshot(snapshot.id, { date: e.target.value })}
                  className="h-9 text-sm"
                  aria-label="Snapshot date"
                />
                <CurrencyInput
                  value={snapshot.value}
                  onCommit={(value) => onUpdateSnapshot(snapshot.id, { value })}
                  currencySymbol={currencySymbol(account.currency)}
                  hideZero
                  step={1}
                  placeholder="0"
                  aria-label={usesUnits ? "Price per unit" : "Snapshot value"}
                />
                <button
                  type="button"
                  onClick={() => onRemoveSnapshot(snapshot.id)}
                  title="Delete entry"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-text-dim opacity-0 transition hover:bg-debt/10 hover:text-debt focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 focus-ring"
                  aria-label="Remove snapshot"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {account.snapshots.length > 0 && (
          <p className="mt-2 text-xs tabular-nums text-text-muted">
            {isDebt ? `You owe: ${formatValue(Math.abs(converted))}` : `Latest: ${formatValue(converted)}`}
          </p>
        )}
      </div>
    </div>
  );
}

function NetWorthChart({
  data,
  mode,
  formatValue,
  formatAxis,
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
  formatAxis: (value: number) => string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    index: number;
    x: number;
    y: number;
    containerWidth: number;
  } | null>(null);

  const width = 800;
  const height = 450;
  const margin = { top: 30, right: 20, bottom: 50, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (data.length <= 1) {
    return (
      <div className="aspect-video rounded-[16px] border border-hairline bg-surface">
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-text-muted">
          {data.length === 0
            ? "Add accounts and snapshots to see the chart."
            : "Add next month's snapshot to start your trend line."}
        </div>
      </div>
    );
  }

  const yMin = Math.min(0, ...data.flatMap((d) => d.negatives.map((n) => n.y1)));
  let yMax = Math.max(
    0,
    ...data.flatMap((d) => d.positives.map((p) => p.y1)),
    Math.max(...data.map((d) => d.netWorth)) * 1.05
  );
  if (yMax === yMin) yMax = yMin + 1;

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

  const xTickStride = Math.max(1, Math.floor(data.length / 6));
  const xTickIndices = data.map((_, i) => i).filter((i) => i % xTickStride === 0);
  if (!xTickIndices.includes(data.length - 1)) xTickIndices.push(data.length - 1);

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
    asset: "var(--color-chart-investments)",
    liability: "var(--color-debt)",
    freedom_fund: "var(--color-chart-investments)",
    valuable_liability: "var(--color-chart-property)",
    cash: "var(--color-chart-cash)",
    debt: "var(--color-debt)",
  };

  const opacityFor = (key: string) => {
    if (key === "asset" || key === "freedom_fund") return 0.9;
    if (key === "valuable_liability") return 0.6;
    if (key === "cash") return 0.45;
    return 0.65;
  };

  return (
    <div ref={containerRef} className="relative flex flex-col rounded-[16px] border border-hairline bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 pt-4">
        <h3 className="text-sm font-semibold text-text">Net worth over time</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-dim">
          {mode === "freedom_framework" ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-chart-investments)" }} /> Investments
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-chart-property)" }} /> Property
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-chart-cash)" }} /> Cash
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-debt)" }} /> Debts
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-chart-investments)" }} /> Assets
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full" style={{ background: "var(--color-debt)" }} /> Liabilities
              </span>
            </>
          )}
        </div>
      </div>
      <div className="aspect-video">
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
                {formatAxis(value)}
              </text>
            </g>
          ))}

          {/* X axis ticks */}
          {xTickIndices.map((i, pos) => (
            <text
              key={data[i].date}
              x={xFor(i)}
              y={innerHeight + 20}
              textAnchor={pos === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
              fill="var(--color-text-dim)"
              fontSize={11}
              className="tabular-nums"
            >
              {formatDate(data[i].date)}
            </text>
          ))}

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
      </div>

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
