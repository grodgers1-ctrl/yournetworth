"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcSlider } from "@/components/calc/CalcSlider";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import { solveCompound, calculateCompound } from "@/lib/calc/compound";
import type { SolveMode } from "@/lib/calc/compound";
import { ukRegion, usRegion } from "@/lib/regions";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CompoundInterestChart, type CompoundInterestChartPoint } from "./CompoundInterestChart";

type CompoundInterestState = {
  solveFor: SolveMode;
  principal: number;
  monthly: number;
  rate: number;
  years: number;
  target: number;
  frequency: number;
  contributionFrequency: number;
};

const initialCompoundState: CompoundInterestState = {
  solveFor: "fv",
  principal: 10000,
  monthly: 500,
  rate: 0.07,
  years: 20,
  target: 250000,
  frequency: 12,
  contributionFrequency: 12,
};

const tabs: { id: SolveMode; label: string }[] = [
  { id: "fv", label: "Future value" },
  { id: "principal", label: "Starting amount" },
  { id: "monthly", label: "Contribution amount" },
  { id: "rate", label: "Rate" },
  { id: "years", label: "Years" },
];

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function frequencyLabel(frequency: number): string {
  if (frequency === 52) return "weekly";
  if (frequency === 4) return "quarterly";
  if (frequency === 1) return "annually";
  return "monthly";
}

export function CompoundInterestTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const { state, setState, copyLink, exportJson } = useCalcState<CompoundInterestState>({
    key: "compound-interest",
    initial: initialCompoundState,
  });

  const outputs = useMemo(
    () =>
      solveCompound({
        solveFor: state.solveFor,
        principal: state.principal,
        monthly: state.monthly,
        rate: state.rate,
        years: state.years,
        futureValue: state.target,
        frequency: state.frequency,
        contributionFrequency: state.contributionFrequency,
      }),
    [state]
  );

  const { result, inputs, series } = outputs;
  const finalPoint = series[series.length - 1] ?? { contributions: 0, value: 0 };

  const impossible = useMemo(() => {
    if (!Number.isFinite(result)) return true;
    if (state.solveFor === "principal" && result < 0) return true;
    if (state.solveFor === "monthly" && result < 0) return true;
    if (state.solveFor === "years" && result >= 200) return true;
    if (state.solveFor === "rate") {
      const fZero = calculateCompound({ ...inputs, rate: 0 }).futureValue;
      if (state.target < fZero) return true;
      if (result >= 2) return true;
    }
    return false;
  }, [result, inputs, state.solveFor, state.target]);

  const handleSolveForChange = (next: SolveMode) => {
    setState((s) => {
      const patch: Partial<CompoundInterestState> = { solveFor: next };
      if (s.solveFor === "fv" && next !== "fv") {
        patch.target = outputs.result;
      }
      return { ...s, ...patch };
    });
  };

  const primaryLabel =
    state.solveFor === "principal"
      ? "Starting amount needed"
      : state.solveFor === "monthly"
        ? "Contribution amount needed"
        : state.solveFor === "rate"
          ? "Annual return needed"
          : state.solveFor === "years"
            ? "Years needed"
            : "Future value";

  const primaryValue = impossible
    ? "Not reachable"
    : state.solveFor === "rate"
      ? formatPercent(result)
      : state.solveFor === "years"
        ? `${Math.round(result)} years`
        : config.formatValue(result);

  const primaryCaption = impossible
    ? state.solveFor === "principal"
      ? "The target is higher than the future value of the contribution plan at the selected rate and years. Lower the target or raise the other inputs."
      : state.solveFor === "monthly"
        ? "The target is lower than what the starting amount and growth already produce. A negative monthly contribution would be needed to match it exactly."
        : state.solveFor === "rate"
          ? "The target is below the total contributions alone, so a negative return would be required. Choose a higher target."
          : state.solveFor === "years"
            ? "The target is too high to reach within 200 years at this contribution level. Raise the rate, monthly contribution, or starting amount."
            : "The inputs do not produce a reachable outcome."
    : state.solveFor === "fv"
      ? `After ${inputs.years} years of ${config.formatValue(inputs.monthly)} monthly contributions paid ${frequencyLabel(inputs.contributionFrequency ?? 12)} at ${formatPercent(inputs.rate)}.`
      : state.solveFor === "principal"
        ? `Starting amount needed to reach ${config.formatValue(state.target)} in ${inputs.years} years at ${formatPercent(inputs.rate)}.`
        : state.solveFor === "monthly"
          ? `Monthly contribution needed to reach ${config.formatValue(state.target)} in ${inputs.years} years at ${formatPercent(inputs.rate)}.`
          : state.solveFor === "rate"
            ? `Annual return needed to reach ${config.formatValue(state.target)} in ${inputs.years} years.`
            : `Years needed to reach ${config.formatValue(state.target)} at ${formatPercent(inputs.rate)}.`;

  const cta = (
    <Card variant="surface" className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">Investing for dividends?</CardTitle>
          <CardDescription className="mt-1">
            DividendMapper models the actual income your portfolio could produce.{" "}
            <a
              href="https://dividendmapper.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
            >
              DividendMapper <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardDescription>
        </div>
      </div>
    </Card>
  );

  return (
    <CalcShell
      title="Compound Interest"
      slug="compound-interest"
      state={state}
      setState={setState}
      initial={initialCompoundState}
      copyLink={copyLink}
      exportJson={exportJson}
      cta={cta}
      subtitle="Project how a starting balance and regular contributions grow over time with compound interest. Move any slider to see the chart update."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSolveForChange(tab.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    state.solveFor === tab.id
                      ? "border-accent bg-accent-muted text-accent"
                      : "border-hairline bg-elevated text-text-muted hover:text-text"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className="mb-4 text-xs text-text-muted">
              Example: {config.formatValue(10000)} starting balance, {config.formatValue(500)} monthly contributions, {formatPercent(0.07)} annual return, over 20 years. Tap a tab to solve for a different missing number.
            </p>

            <div className="space-y-5">
              {state.solveFor !== "principal" && (
                <CalcSlider
                  label="Starting amount"
                  value={state.principal}
                  min={0}
                  max={100000}
                  step={500}
                  onChange={(v) => setState((s) => ({ ...s, principal: v }))}
                  format={config.formatValue}
                />
              )}

              {state.solveFor !== "monthly" && (
                <CalcSlider
                  label="Monthly contribution amount"
                  value={state.monthly}
                  min={0}
                  max={5000}
                  step={50}
                  onChange={(v) => setState((s) => ({ ...s, monthly: v }))}
                  format={config.formatValue}
                />
              )}

              {state.solveFor !== "years" && (
                <CalcSlider
                  label="Years"
                  value={state.years}
                  min={1}
                  max={40}
                  step={1}
                  onChange={(v) => setState((s) => ({ ...s, years: v }))}
                  format={(v) => `${v} years`}
                />
              )}

              {state.solveFor !== "rate" && (
                <CalcSlider
                  label="Annual return"
                  value={state.rate}
                  min={0}
                  max={0.12}
                  step={0.0025}
                  onChange={(v) => setState((s) => ({ ...s, rate: v }))}
                  format={formatPercent}
                />
              )}

              {state.solveFor !== "fv" && (
                <CalcSlider
                  label="Target future value"
                  value={state.target}
                  min={0}
                  max={2000000}
                  step={10000}
                  onChange={(v) => setState((s) => ({ ...s, target: v }))}
                  format={config.formatValue}
                />
              )}

              <details className="group pt-2">
                <summary className="cursor-pointer text-xs font-medium text-text-muted hover:text-text">
                  Advanced
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="frequency" className="text-xs font-medium text-text-dim">
                      Compounding frequency
                    </label>
                    <select
                      id="frequency"
                      value={state.frequency}
                      onChange={(e) => setState((s) => ({ ...s, frequency: Number(e.target.value) }))}
                      className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      <option value={12}>Monthly</option>
                      <option value={365}>Daily</option>
                      <option value={1}>Annual</option>
                    </select>
                    <p className="text-xs text-text-dim">
                      How often interest is applied to the balance. Daily is a common option for daily compound calculators; it usually adds only a small amount versus monthly.
                    </p>
                  </div>

                  <div className="space-y-2">
                  <label htmlFor="contributionFrequency" className="text-xs font-medium text-text-dim">
                      Contribution frequency
                    </label>
                    <select
                      id="contributionFrequency"
                      value={state.contributionFrequency}
                      onChange={(e) => setState((s) => ({ ...s, contributionFrequency: Number(e.target.value) }))}
                      className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      <option value={52}>Weekly</option>
                      <option value={12}>Monthly</option>
                      <option value={4}>Quarterly</option>
                      <option value={1}>Annual</option>
                    </select>
                    <p className="text-xs text-text-dim">
                      How often deposits are made. The monthly contribution slider is converted to match this schedule.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
          <CompoundInterestChart
            data={series as CompoundInterestChartPoint[]}
            formatValue={config.formatValue}
            title="Portfolio growth over time"
          />

          <CalcResult
            primary={{ label: primaryLabel, value: primaryValue, caption: primaryCaption }}
            secondary={[
              {
                label: "Total contributions",
                value: config.formatValue(finalPoint.contributions),
                caption: "Principal plus deposits",
              },
              {
                label: "Total growth",
                value: config.formatValue(finalPoint.value - finalPoint.contributions),
                caption: "Interest or investment returns",
              },
            ]}
          />

          <details className="group rounded-[16px] border border-hairline bg-surface p-5">
            <summary className="cursor-pointer text-sm font-medium text-text hover:text-text-muted">
              Year-by-year breakdown
            </summary>
            <div className="mt-4 max-h-96 overflow-x-auto overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface">
                  <tr className="border-b border-hairline text-left text-xs text-text-dim">
                    <th className="pb-2 font-medium">Year</th>
                    <th className="pb-2 font-medium">Contributions</th>
                    <th className="pb-2 font-medium">Value</th>
                    <th className="pb-2 font-medium">Growth</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted tabular-nums">
                  {series.map((point) => (
                    <tr key={point.year} className="border-b border-hairline last:border-b-0">
                      <td className="py-2 pr-4">{point.year}</td>
                      <td className="py-2 pr-4">{config.formatValue(point.contributions)}</td>
                      <td className="py-2 pr-4">{config.formatValue(point.value)}</td>
                      <td className="py-2 pr-4">{config.formatValue(point.value - point.contributions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <p className="text-xs text-text-dim">
            Not financial advice. The calculator assumes a fixed return, fixed contributions, and no taxes or fees. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
