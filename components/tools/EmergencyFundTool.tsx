"use client";

import { useMemo, useState } from "react";
import { Check, Code2 } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcSlider } from "@/components/calc/CalcSlider";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import { calculateEmergencyFund } from "@/lib/calc/emergency-fund";
import { ukRegion, usRegion } from "@/lib/regions";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { EmergencyFundChart } from "./EmergencyFundChart";
import { useTrackEvent } from "@/lib/analytics";

type EmergencyFundState = {
  monthlyExpenses: number;
  targetMonths: number;
  currentSavings: number;
  monthlyContribution: number;
  accountType: string;
};

const initialEmergencyFundState: EmergencyFundState = {
  monthlyExpenses: 2000,
  targetMonths: 3,
  currentSavings: 0,
  monthlyContribution: 200,
  accountType: "",
};

const scenarioMonths = [
  { label: "Baseline", months: 0 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "9 months", months: 9 },
];

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function EmergencyFundTool({ region, embed = false }: { region: "uk" | "us"; embed?: boolean }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const track = useTrackEvent();
  const { state, setState, copyLink, exportJson } = useCalcState<EmergencyFundState>({
    key: "emergency-fund",
    initial: {
      ...initialEmergencyFundState,
      accountType: region === "uk" ? "easy-access" : "hysa",
    },
  });

  const result = useMemo(
    () =>
      calculateEmergencyFund({
        monthlyExpenses: state.monthlyExpenses,
        targetMonths: state.targetMonths,
        currentSavings: state.currentSavings,
        monthlyContribution: state.monthlyContribution,
      }),
    [state]
  );

  const contributionWarning = state.monthlyContribution > state.monthlyExpenses && state.monthlyExpenses > 0;

  const applyScenario = (months: number, label: string) => {
    if (label === "Baseline") {
      setState({
        ...initialEmergencyFundState,
        accountType: region === "uk" ? "easy-access" : "hysa",
      });
      track("scenario_changed", { slug: "emergency-fund", scenario: label });
      return;
    }
    setState((s) => {
      const isDefaultContribution = s.monthlyContribution === initialEmergencyFundState.monthlyContribution || s.monthlyContribution === 0;
      const sensibleContribution = Math.min(5000, Math.round((s.monthlyExpenses * 0.1) / 50) * 50) || 200;
      return {
        ...s,
        targetMonths: months,
        monthlyContribution: isDefaultContribution ? sensibleContribution : s.monthlyContribution,
      };
    });
    track("scenario_changed", { slug: "emergency-fund", scenario: `${months} months` });
  };

  const scenarioChips = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-dim">Scenarios</span>
      {scenarioMonths.map(({ label, months }) => (
        <button
          key={label}
          type="button"
          onClick={() => applyScenario(months, label)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-ring",
            state.targetMonths === months
              ? "bg-accent text-text"
              : "border border-hairline bg-elevated text-text-muted hover:text-text"
          )}
          aria-pressed={state.targetMonths === months}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const embedBacklink = `https://yournetworth.net/${region}/tools/emergency-fund`;
  const embedCode = `<iframe\n  src="https://yournetworth.net/embed/${region}/tools/emergency-fund"\n  width="100%"\n  height="640"\n  frameborder="0"\n  loading="lazy"\n  title="Emergency fund calculator by Your Net Worth"\n></iframe>`;
  const [embedCopied, setEmbedCopied] = useState(false);

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    track("embed_code_copied", { slug: "emergency-fund", region });
    setEmbedCopied(true);
    window.setTimeout(() => setEmbedCopied(false), 1500);
  };

  const embedAction = !embed ? (
    <Button
      type="button"
      onClick={handleCopyEmbed}
      variant="secondary"
      size="sm"
      className={cn(embedCopied && "border-accent/30 bg-accent-muted text-accent")}
      aria-label="Copy embed code"
    >
      {embedCopied ? <Check className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
      {embedCopied ? "Copied" : "Embed"}
    </Button>
  ) : null;

  const primaryValue = Number.isFinite(result.monthsToFund)
    ? config.formatValue(result.target)
    : "Not reachable";

  const monthsToFundDisplay = Number.isFinite(result.monthsToFund)
    ? `${result.monthsToFund} month${result.monthsToFund === 1 ? "" : "s"}`
    : "Never at this contribution";

  return (
    <CalcShell
      title="Emergency Fund"
      slug="emergency-fund"
      state={state}
      setState={setState}
      initial={{
        ...initialEmergencyFundState,
        accountType: region === "uk" ? "easy-access" : "hysa",
      }}
      copyLink={copyLink}
      exportJson={exportJson}
      embed={embed}
      embedBacklink={embedBacklink}
      extraActions={embedAction}
      scenarioContent={scenarioChips}
      subtitle="See how much cash you need and how long it takes to build it."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-5">
            <p className="mb-4 text-xs text-text-muted">
              Example: {config.formatValue(2000)} monthly essentials, a {state.targetMonths}-month target, {config.formatValue(0)} already saved, and {config.formatValue(200)} monthly contributions.
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="monthly-expenses" className="text-sm font-medium text-text">
                  Monthly essential expenses
                </label>
                <CurrencyInput
                  id="monthly-expenses"
                  value={state.monthlyExpenses}
                  onCommit={(v) => setState((s) => ({ ...s, monthlyExpenses: v }))}
                  currencySymbol={config.currencySymbol}
                  hideZero
                />
              </div>

              <CalcSlider
                label="Target months covered"
                value={state.targetMonths}
                min={1}
                max={12}
                step={1}
                onChange={(v) => setState((s) => ({ ...s, targetMonths: v }))}
                format={(v) => `${v} months`}
              />

              <div className="space-y-2">
                <label htmlFor="current-savings" className="text-sm font-medium text-text">
                  Current emergency savings
                </label>
                <CurrencyInput
                  id="current-savings"
                  value={state.currentSavings}
                  onCommit={(v) => setState((s) => ({ ...s, currentSavings: v }))}
                  currencySymbol={config.currencySymbol}
                  hideZero
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="monthly-contribution" className="text-sm font-medium text-text">
                  Monthly contribution toward the fund
                </label>
                <CurrencyInput
                  id="monthly-contribution"
                  value={state.monthlyContribution}
                  onCommit={(v) => setState((s) => ({ ...s, monthlyContribution: v }))}
                  currencySymbol={config.currencySymbol}
                  hideZero
                />
                {contributionWarning && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Your monthly contribution is more than your monthly expenses. That is unusual but not wrong.
                  </p>
                )}
              </div>

              <details className="group pt-2">
                <summary className="cursor-pointer text-xs font-medium text-text-muted hover:text-text">
                  Advanced
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="account-type" className="text-xs font-medium text-text-dim">
                      Where is the fund held?
                    </label>
                    <select
                      id="account-type"
                      value={state.accountType}
                      onChange={(e) => setState((s) => ({ ...s, accountType: e.target.value }))}
                      className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-text focus:border-stroke focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {region === "uk" ? (
                        <>
                          <option value="easy-access">Easy-access savings account</option>
                          <option value="cash-isa">Cash ISA</option>
                          <option value="premium-bonds">Premium Bonds</option>
                          <option value="current-account">Current account</option>
                          <option value="other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="hysa">High-yield savings account (HYSA)</option>
                          <option value="money-market">Money market account</option>
                          <option value="cds">Certificate of deposit (CD)</option>
                          <option value="checking">Checking account</option>
                          <option value="other">Other</option>
                        </>
                      )}
                    </select>
                    <p className="text-xs text-text-dim">
                      {region === "uk"
                        ? "This is a label only. For true emergencies, keep the money where you can reach it quickly. Cash ISAs and Premium Bonds may have access delays or withdrawal limits."
                        : "This is a label only. For true emergencies, keep the money where you can reach it quickly. CDs may charge a penalty if you withdraw early."}
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
          <EmergencyFundChart
            data={result.series}
            monthlyExpenses={state.monthlyExpenses}
            formatValue={config.formatValue}
            title="Fund balance vs target"
          />

          <CalcResult
            primary={{
              label: "Target fund size",
              value: primaryValue,
              caption: `${state.targetMonths} months of essential expenses at ${config.formatValue(state.monthlyExpenses)} per month.`,
            }}
            secondary={[
              {
                label: "Months to fully funded",
                value: monthsToFundDisplay,
                caption: result.fundedDate ? `Fully funded by ${formatDate(result.fundedDate)}` : undefined,
              },
              {
                label: "Progress",
                value: `${(result.progress * 100).toFixed(0)}%`,
                caption: `${config.formatValue(state.currentSavings)} of ${config.formatValue(result.target)} saved`,
              },
              {
                label: "Current coverage",
                value: `${result.coverageMonths.toFixed(1)} months`,
                caption: "How long your current savings would last",
              },
              {
                label: "Fully funded date",
                value: result.fundedDate ? formatDate(result.fundedDate) : "—",
                caption: "Based on your monthly contribution",
              },
            ]}
          />

          <p className="text-xs text-text-dim">
            Not financial advice. The calculator assumes no interest on the emergency fund, fixed monthly contributions, and fixed essential spending. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
