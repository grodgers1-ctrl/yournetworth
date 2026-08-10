"use client";

import { useMemo } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcSlider } from "@/components/calc/CalcSlider";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import { calculateDebtPayoff } from "@/lib/calc/debt";
import { ukRegion, usRegion } from "@/lib/regions";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { DebtPayoffChart, type DebtPayoffChartPoint } from "./DebtPayoffChart";

type DebtRow = {
  id: string;
  name: string;
  balance: number;
  /** APR as a percentage number, e.g. 24.9. */
  aprPercent: number;
  minPayment: number;
};

type DebtPayoffState = {
  debts: DebtRow[];
  monthlyBudget: number;
};

const defaultDebts: Record<"uk" | "us", DebtRow[]> = {
  uk: [
    { id: "1", name: "Credit card", balance: 4500, aprPercent: 24.9, minPayment: 115 },
    { id: "2", name: "Store card", balance: 1300, aprPercent: 29.9, minPayment: 40 },
    { id: "3", name: "Personal loan", balance: 6200, aprPercent: 9.9, minPayment: 135 },
  ],
  us: [
    { id: "1", name: "Credit card", balance: 6500, aprPercent: 24.99, minPayment: 165 },
    { id: "2", name: "Store card", balance: 1500, aprPercent: 29.99, minPayment: 50 },
    { id: "3", name: "Personal loan", balance: 8000, aprPercent: 11.99, minPayment: 180 },
  ],
};

function makeInitialState(region: "uk" | "us"): DebtPayoffState {
  return {
    debts: defaultDebts[region],
    monthlyBudget: region === "uk" ? 450 : 600,
  };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function debtFreeDate(months: number, locale: string): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

export function DebtPayoffTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const initial = makeInitialState(region);
  const { state, setState, copyLink, exportJson } = useCalcState<DebtPayoffState>({
    key: "debt-payoff",
    initial,
  });

  const outputs = useMemo(
    () =>
      calculateDebtPayoff({
        debts: state.debts.map((d) => ({
          id: d.id,
          name: d.name || "Debt",
          balance: d.balance,
          apr: d.aprPercent / 100,
          minPayment: d.minPayment,
        })),
        monthlyBudget: state.monthlyBudget,
      }),
    [state.debts, state.monthlyBudget]
  );

  const chartData = useMemo<DebtPayoffChartPoint[]>(() => {
    const { snowball, avalanche } = outputs;
    const length = Math.max(snowball.series.length, avalanche.series.length);
    return Array.from({ length }, (_, i) => ({
      month: i,
      snowballRemaining: snowball.series[i]?.totalRemaining ?? 0,
      avalancheRemaining: avalanche.series[i]?.totalRemaining ?? 0,
    }));
  }, [outputs]);

  const updateDebt = (id: string, patch: Partial<DebtRow>) => {
    setState((s) => ({
      ...s,
      debts: s.debts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  };

  const removeDebt = (id: string) => {
    setState((s) => ({ ...s, debts: s.debts.filter((d) => d.id !== id) }));
  };

  const addDebt = () => {
    setState((s) => ({
      ...s,
      debts: [...s.debts, { id: makeId(), name: "", balance: 1000, aprPercent: 24.9, minPayment: 30 }],
    }));
  };

  const best = outputs.bestStrategy === "avalanche" ? outputs.avalanche : outputs.snowball;
  const other = outputs.bestStrategy === "avalanche" ? outputs.snowball : outputs.avalanche;
  const showComparison =
    outputs.budgetValid && best.payable && other.payable && outputs.monthsSavedByBest > 0;

  const primary = !outputs.budgetValid
    ? {
        label: "Budget too low",
        value: config.formatValue(state.monthlyBudget),
        caption: `Minimum payments need ${config.formatValue(outputs.totalMinimums)} a month. Raise the budget to see your plan.`,
      }
    : !best.payable
      ? {
          label: "Not reachable at this budget",
          value: config.formatValue(state.monthlyBudget),
          caption: "Interest is growing faster than your payments. Increase the monthly budget to get ahead of it.",
        }
      : {
          label: "Debt-free in",
          value: `${best.monthsToDebtFree} months`,
          caption: `${debtFreeDate(best.monthsToDebtFree, config.locale)} with the ${outputs.bestStrategy} method${
            showComparison
              ? `, that's ${outputs.monthsSavedByBest} months and ${config.formatValue(outputs.interestSavedByBest)} interest sooner than the ${other.strategy}`
              : ""
          }`,
        };

  return (
    <CalcShell
      title="Debt Payoff"
      slug="debt-payoff"
      state={state}
      setState={setState}
      initial={initial}
      copyLink={copyLink}
      exportJson={exportJson}
      subtitle={
        region === "uk"
          ? "Add your cards and loans, set a monthly budget, and see the cheapest order to clear them."
          : "Add your debts, set a monthly budget, and compare snowball vs avalanche side by side."
      }
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Your debts</h2>
              <button
                type="button"
                onClick={addDebt}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text focus-ring"
              >
                <Plus className="h-3.5 w-3.5" /> Add a debt
              </button>
            </div>

            <div className="space-y-3">
              {state.debts.map((debt) => (
                <div key={debt.id} className="rounded-xl border border-debt/20 bg-debt/5 p-3 transition-colors">
                  <div className="grid grid-cols-[1fr_auto] items-start gap-2">
                    <div className="space-y-2">
                      <Input
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, { name: e.target.value })}
                        placeholder="Name, e.g. Credit card"
                        className="h-8 text-xs"
                        aria-label="Debt name"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="mb-1 block text-[11px] text-text-dim">Balance</span>
                          <CurrencyInput
                            value={debt.balance}
                            onCommit={(v) => updateDebt(debt.id, { balance: Math.max(0, v) })}
                            currencySymbol={config.currencySymbol}
                            inputClassName="h-8 text-xs"
                            aria-label="Balance"
                          />
                        </div>
                        <div>
                          <span className="mb-1 block text-[11px] text-text-dim">APR %</span>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            step={0.1}
                            value={debt.aprPercent}
                            onChange={(e) => updateDebt(debt.id, { aprPercent: Math.max(0, Number(e.target.value)) })}
                            className="h-8 text-right text-xs tabular-nums"
                            aria-label="APR percent"
                          />
                        </div>
                        <div>
                          <span className="mb-1 block text-[11px] text-text-dim">Min payment</span>
                          <CurrencyInput
                            value={debt.minPayment}
                            onCommit={(v) => updateDebt(debt.id, { minPayment: Math.max(0, v) })}
                            currencySymbol={config.currencySymbol}
                            inputClassName="h-8 text-xs"
                            aria-label="Minimum payment"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDebt(debt.id)}
                      className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-debt/10 hover:text-debt focus-ring"
                      aria-label={`Remove ${debt.name || "debt"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {state.debts.length === 0 && (
                <p className="text-sm text-text-dim">Add a debt to start building your plan.</p>
              )}
            </div>

            <div className="mt-5 border-t border-hairline pt-5">
              <CalcSlider
                label="Monthly budget for debt"
                value={state.monthlyBudget}
                min={0}
                max={3000}
                step={25}
                onChange={(v) => setState((s) => ({ ...s, monthlyBudget: v }))}
                format={config.formatValue}
              />
              <p className="mt-2 text-xs text-text-dim">
                Minimum payments total {config.formatValue(outputs.totalMinimums)}. Anything above that attacks the
                priority debt.
              </p>
            </div>
          </div>

          {!outputs.budgetValid && state.debts.length > 0 && (
            <div className="flex items-start gap-3 rounded-[16px] border border-debt/30 bg-debt/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-debt" />
              <p className="text-sm text-text-muted">
                Your budget of {config.formatValue(state.monthlyBudget)} is below the{" "}
                {config.formatValue(outputs.totalMinimums)} needed to cover every minimum payment. Increase the budget
                or check the minimums you entered.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-7">
          <DebtPayoffChart
            data={chartData}
            formatValue={config.formatValue}
            title="Total debt remaining"
          />

          <CalcResult
            primary={primary}
            secondary={[
              {
                label: "Snowball",
                value: outputs.snowball.payable ? `${outputs.snowball.monthsToDebtFree} months` : "—",
                caption: outputs.snowball.payable
                  ? `${config.formatValue(outputs.snowball.totalInterest)} interest · smallest balance first`
                  : "Not reachable at this budget",
              },
              {
                label: "Avalanche",
                value: outputs.avalanche.payable ? `${outputs.avalanche.monthsToDebtFree} months` : "—",
                caption: outputs.avalanche.payable
                  ? `${config.formatValue(outputs.avalanche.totalInterest)} interest · highest APR first`
                  : "Not reachable at this budget",
              },
              { label: "Total debt", value: config.formatValue(outputs.totalBalance) },
              {
                label: "Interest saved",
                value: showComparison ? config.formatValue(outputs.interestSavedByBest) : "—",
                caption: showComparison ? `${outputs.bestStrategy} vs ${other.strategy}` : "Both methods tie",
              },
            ]}
          />

          {outputs.budgetValid && best.payable && best.payoffOrder.length > 1 && (
            <div className="rounded-[16px] border border-hairline bg-surface p-5">
              <h2 className="text-sm font-semibold text-text">
                Payoff order ({outputs.bestStrategy})
              </h2>
              <ol className="mt-3 space-y-2">
                {best.payoffOrder.map((event, i) => (
                  <li key={event.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      <span className="mr-2 font-medium text-text">{i + 1}.</span>
                      {event.name}
                    </span>
                    <span className="tabular-nums text-text-dim">month {event.month}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="text-xs text-text-dim">
            Not financial advice. The chart assumes fixed APRs, fixed minimum payments, and that you never miss a
            payment or add new borrowing. Real minimum payments usually fall as the balance falls, which stretches the
            timeline. Fixing your payment at today&apos;s level is exactly what this plan does. Your inputs stay in
            your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
