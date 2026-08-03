"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Plus, Trash2, RefreshCw, ArrowRightLeft, TrendingUp } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import {
  calculateMultiCurrency,
  type BudgetLine,
  COMMON_CURRENCIES,
  DEFAULT_FX_RATES,
  formatFxRate,
} from "@/lib/calc/fx";
import { ukRegion, usRegion } from "@/lib/regions";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { useTrackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type BudgetState = {
  baseCurrency: string;
  lines: BudgetLine[];
};

const defaultLines: Record<"uk" | "us", BudgetLine[]> = {
  uk: [
    { id: "1", name: "Salary", amount: 4000, currency: "GBP", kind: "income", category: "Salary" },
    { id: "2", name: "Freelance", amount: 800, currency: "USD", kind: "income", category: "Freelance" },
    { id: "3", name: "Rent", amount: 1200, currency: "GBP", kind: "expense", category: "Housing" },
    { id: "4", name: "Travel", amount: 300, currency: "EUR", kind: "expense", category: "Travel" },
    { id: "5", name: "Groceries", amount: 500, currency: "GBP", kind: "expense", category: "Food" },
  ],
  us: [
    { id: "1", name: "Salary", amount: 5000, currency: "USD", kind: "income", category: "Salary" },
    { id: "2", name: "Freelance", amount: 700, currency: "GBP", kind: "income", category: "Freelance" },
    { id: "3", name: "Rent", amount: 1800, currency: "USD", kind: "expense", category: "Housing" },
    { id: "4", name: "Travel", amount: 350, currency: "EUR", kind: "expense", category: "Travel" },
    { id: "5", name: "Groceries", amount: 600, currency: "USD", kind: "expense", category: "Food" },
  ],
};

const defaultCategories = ["Salary", "Freelance", "Housing", "Food", "Travel", "Utilities", "Subscriptions", "Savings"];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function currencySymbol(currency: string): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")
      ?.value || currency;
  } catch {
    return currency;
  }
}

export function MultiCurrencyBudgetTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const initial: BudgetState = {
    baseCurrency: config.currency,
    lines: defaultLines[region],
  };

  const { state, setState, copyLink, exportJson } = useCalcState<BudgetState>({
    key: "multi-currency-budget",
    initial,
  });
  const track = useTrackEvent();

  const loadCachedRates = (): Record<string, number> | null => {
    if (typeof window === "undefined") return null;
    const cached = window.localStorage.getItem("fx-rates");
    const cachedDate = window.localStorage.getItem("fx-rates-date");
    const today = new Date().toISOString().slice(0, 10);
    if (cached && cachedDate === today) {
      try {
        return JSON.parse(cached) as Record<string, number>;
      } catch {
        return null;
      }
    }
    return null;
  };

  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(() => loadCachedRates());
  const [ratesError, setRatesError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const rates = useMemo(() => liveRates || DEFAULT_FX_RATES, [liveRates]);
  const ratesLoading = liveRates === null && !ratesError;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().slice(0, 10);
    let cancelled = false;
    fetch("https://api.frankfurter.app/latest?from=USD")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("fetch failed"))))
      .then((data: { rates: Record<string, number> }) => {
        if (cancelled) return;
        const merged: Record<string, number> = { USD: 1, ...data.rates };
        setLiveRates(merged);
        window.localStorage.setItem("fx-rates", JSON.stringify(merged));
        window.localStorage.setItem("fx-rates-date", today);
        setRatesError(false);
      })
      .catch(() => {
        if (!cancelled) setRatesError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const outputs = useMemo(() => {
    return calculateMultiCurrency({ lines: state.lines, baseCurrency: state.baseCurrency, rates });
  }, [state.lines, state.baseCurrency, rates]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: state.baseCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const updateLine = (id: string, patch: Partial<BudgetLine>) => {
    setState((s) => ({
      ...s,
      lines: s.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }));
  };

  const removeLine = (id: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((line) => line.id !== id) }));
  };

  const addLine = (kind: BudgetLine["kind"]) => {
    const currency = state.baseCurrency;
    const category = kind === "income" ? "Salary" : "Housing";
    setState((s) => ({
      ...s,
      lines: [
        ...s.lines,
        { id: makeId(), name: "", amount: kind === "income" ? 1000 : 100, currency, kind, category },
      ],
    }));
  };

  const currenciesUsed = outputs.currenciesUsed;
  const multiCurrency = currenciesUsed.length >= 2;
  const hasGbpAndUsd = currenciesUsed.includes("GBP") && currenciesUsed.includes("USD");

  const categoryEntries = Object.entries(outputs.byCategory).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const maxCategory = Math.max(
    ...categoryEntries.map(([, v]) => Math.abs(v)),
    1
  );

  const cta = (
    <div className="space-y-4">
      {multiCurrency && (
        <Card variant="surface" className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Managing money across borders?</CardTitle>
              <CardDescription className="mt-1">
                You are budgeting in {currenciesUsed.join(" and ")}.{" "}
                <a
                  href="/go/wise"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
                  onClick={() => track("affiliate_click", { partner: "wise", tool: "multi-currency-budget", region })}
                >
                  Wise <ArrowUpRight className="h-3.5 w-3.5" />
                </a>{" "}
                offers real exchange rates and local account details in major currencies. This is an affiliate link. It does not affect our calculator&apos;s math.
              </CardDescription>
            </div>
          </div>
        </Card>
      )}
      {hasGbpAndUsd && (
        <Card variant="surface" className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Track the income behind the budget</CardTitle>
              <CardDescription className="mt-1">
                If some of your GBP or USD income comes from investments,{" "}
                <a
                  href="https://dividendmapper.com"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
                  onClick={() => track("dividendmapper_cta_click", { region, path: "multi-currency-budget-tool" })}
                >
                  DividendMapper <ArrowUpRight className="h-3.5 w-3.5" />
                </a>{" "}
                models the actual dividend cash flows.
              </CardDescription>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <CalcShell
      title="Multi-Currency Budget"
      slug="multi-currency-budget"
      state={state}
      setState={setState}
      initial={initial}
      copyLink={copyLink}
      exportJson={exportJson}
      cta={cta}
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Budget entries</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addLine("income")}
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text focus-ring"
                >
                  <Plus className="h-3.5 w-3.5" /> Income
                </button>
                <button
                  type="button"
                  onClick={() => addLine("expense")}
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text focus-ring"
                >
                  <Plus className="h-3.5 w-3.5" /> Expense
                </button>
              </div>
            </div>

            <div className="mb-4">
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

            <div className="space-y-3">
              {state.lines.map((line) => (
                <div
                  key={line.id}
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    line.kind === "income" ? "border-success/20 bg-success/5" : "border-debt/20 bg-debt/5"
                  )}
                >
                  <div className="grid grid-cols-[1fr_auto] items-start gap-2">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={line.name}
                          onChange={(e) => updateLine(line.id, { name: e.target.value })}
                          placeholder="Name"
                          className="h-8 text-xs"
                          aria-label="Entry name"
                        />
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={line.amount}
                          onChange={(e) => updateLine(line.id, { amount: Number(e.target.value) })}
                          placeholder="Amount"
                          className="h-8 text-xs"
                          aria-label="Amount"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={line.currency}
                          onChange={(e) => updateLine(line.id, { currency: e.target.value })}
                          className="h-8 rounded-lg border border-hairline bg-elevated px-2 text-xs text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                          aria-label="Currency"
                        >
                          {COMMON_CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <Input
                          value={line.category}
                          onChange={(e) => updateLine(line.id, { category: e.target.value })}
                          placeholder="Category"
                          list="category-suggestions"
                          className="h-8 text-xs"
                          aria-label="Category"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-debt/10 hover:text-debt focus-ring"
                      aria-label="Remove entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <datalist id="category-suggestions">
                {defaultCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {state.lines.length === 0 && (
              <p className="mt-4 text-sm text-text-dim">Add an income or expense to start.</p>
            )}
          </div>

          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Exchange rates</h2>
              <button
                type="button"
                onClick={() => {
                  setRatesError(false);
                  setRefreshKey((k) => k + 1);
                  track("fx_rates_refresh", { source: "manual" });
                }}
                disabled={ratesLoading}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text focus-ring disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", ratesLoading && "animate-spin")} /> Refresh
              </button>
            </div>
            <p className="mt-2 text-xs text-text-dim">
              {ratesError
                ? "Live rates unavailable. Using static fallback rates."
                : liveRates
                  ? "Using live rates from the European Central Bank via Frankfurter."
                  : "Using static fallback rates."}
            </p>
            {currenciesUsed.length > 0 && (
              <div className="mt-3 space-y-1">
                {currenciesUsed
                  .filter((c) => c !== state.baseCurrency)
                  .map((c) => (
                    <p key={c} className="text-xs tabular-nums text-text-muted">
                      {formatFxRate(c, state.baseCurrency, rates)}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <CalcResult
            primary={{
              label: "Net balance",
              value: formatValue(outputs.net),
              caption: outputs.net >= 0 ? "Income covers spending" : "Spending exceeds income",
            }}
            secondary={[
              { label: "Total income", value: formatValue(outputs.totalIncome) },
              { label: "Total expenses", value: formatValue(outputs.totalExpenses) },
              { label: "Currencies used", value: `${currenciesUsed.length}` },
              { label: "Base currency", value: state.baseCurrency },
            ]}
          />

          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <h2 className="text-sm font-semibold text-text">By category</h2>
            {categoryEntries.length === 0 ? (
              <p className="mt-4 text-sm text-text-dim">No categories yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {categoryEntries.map(([category, value]) => {
                  const isIncome = value > 0;
                  const width = `${(Math.abs(value) / maxCategory) * 100}%`;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-text">{category}</span>
                        <span className={cn("tabular-nums", isIncome ? "text-success" : "text-text-muted")}>
                          {formatValue(value)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevated">
                        <div
                          className={cn("h-full rounded-full transition-all", isIncome ? "bg-success" : "bg-debt")}
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-text-dim">
            Not financial advice. Exchange rates are indicative. Live rates are fetched from the European Central Bank via Frankfurter and cached for one day. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
