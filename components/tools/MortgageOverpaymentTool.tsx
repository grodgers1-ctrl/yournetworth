"use client";

import { useMemo } from "react";
import { ArrowUpRight, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcSlider } from "@/components/calc/CalcSlider";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import { calculateMortgage, type MortgageInputs } from "@/lib/calc/mortgage";
import { ukRegion, usRegion } from "@/lib/regions";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { useTrackEvent } from "@/lib/analytics";
import { MortgageChart } from "./MortgageChart";

type MortgageState = {
  principal: number;
  annualRate: number;
  termYears: number;
  monthlyOverpayment: number;
  initialPeriodYears: number;
  svrRate: number;
  investRate: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  showAdvanced: boolean;
};

function makeInitialState(region: "uk" | "us"): MortgageState {
  const defaults = region === "uk" ? ukRegion.mortgageDefaults : usRegion.mortgageDefaults;
  return {
    principal: region === "uk" ? 250000 : 400000,
    annualRate: region === "uk" ? 0.05 : 0.06,
    termYears: defaults.defaultTermYears,
    monthlyOverpayment: 200,
    initialPeriodYears: defaults.defaultFixedPeriodYears,
    svrRate: defaults.defaultSvrRate,
    investRate: defaults.defaultInvestRate,
    propertyTaxAnnual: region === "uk" ? 0 : 3600,
    insuranceAnnual: region === "uk" ? 0 : 1200,
    showAdvanced: false,
  };
}

function percent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function years(value: number): string {
  return `${value} years`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function MortgageOverpaymentTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const initial = makeInitialState(region);
  const { state, setState, copyLink, exportJson } = useCalcState<MortgageState>({
    key: "mortgage-overpayment",
    initial,
  });
  const track = useTrackEvent();

  const termYears = clamp(state.termYears, 5, 40);
  const initialPeriodYears = clamp(state.initialPeriodYears, 1, termYears);

  const outputs = useMemo(() => {
    const inputs: MortgageInputs = {
      principal: state.principal,
      annualRate: state.annualRate,
      termYears,
      monthlyOverpayment: state.monthlyOverpayment,
      initialPeriodYears,
      svrRate: state.svrRate,
      investRate: state.investRate,
      propertyTaxAnnual: state.propertyTaxAnnual,
      insuranceAnnual: state.insuranceAnnual,
    };
    return calculateMortgage(inputs);
  }, [state, termYears, initialPeriodYears]);

  const cta = (
    <Card variant="surface" className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">What if that overpayment grew as dividend income?</CardTitle>
          <CardDescription className="mt-1">
            If you invested your overpayment at {percent(state.investRate)} dividend growth,{" "}
            <a
              href="https://dividendmapper.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
              onClick={() => track("dividendmapper_cta_click", { region, path: "mortgage-overpayment-tool" })}
            >
              DividendMapper <ArrowUpRight className="h-3.5 w-3.5" />
            </a>{" "}
            models the actual income your portfolio could produce. It is worth comparing that against the guaranteed interest saving from overpaying.
          </CardDescription>
        </div>
      </div>
    </Card>
  );

  return (
    <CalcShell
      title="Mortgage Overpayment"
      slug="mortgage-overpayment"
      state={state}
      setState={setState}
      initial={initial}
      copyLink={copyLink}
      exportJson={exportJson}
      cta={cta}
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-6">
            <div className="space-y-5">
              <CalcSlider
                label="Loan amount"
                value={state.principal}
                min={50000}
                max={2000000}
                step={10000}
                onChange={(v) => setState((s) => ({ ...s, principal: v }))}
                format={config.formatValue}
              />
              <CalcSlider
                label="Interest rate"
                value={state.annualRate}
                min={0.005}
                max={0.15}
                step={0.0005}
                onChange={(v) => setState((s) => ({ ...s, annualRate: v }))}
                format={percent}
              />
              <CalcSlider
                label="Term"
                value={termYears}
                min={5}
                max={40}
                step={1}
                onChange={(v) =>
                  setState((s) => ({
                    ...s,
                    termYears: v,
                    initialPeriodYears: Math.min(s.initialPeriodYears, v),
                  }))
                }
                format={years}
              />
              <CalcSlider
                label="Monthly overpayment"
                value={state.monthlyOverpayment}
                min={0}
                max={5000}
                step={50}
                onChange={(v) => setState((s) => ({ ...s, monthlyOverpayment: v }))}
                format={config.formatValue}
              />
            </div>

            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, showAdvanced: !s.showAdvanced }))}
              className="mt-6 flex w-full items-center justify-between rounded-xl border border-hairline bg-elevated px-4 py-3 text-left text-sm font-medium text-text transition-colors hover:border-stroke focus-ring"
            >
              Advanced options
              {state.showAdvanced ? (
                <ChevronUp className="h-4 w-4 text-text-dim" />
              ) : (
                <ChevronDown className="h-4 w-4 text-text-dim" />
              )}
            </button>

            {state.showAdvanced && (
              <div className="mt-4 space-y-5">
                {region === "uk" && (
                  <>
                    <CalcSlider
                      label="Fixed-rate period"
                      value={initialPeriodYears}
                      min={1}
                      max={termYears}
                      step={1}
                      onChange={(v) => setState((s) => ({ ...s, initialPeriodYears: v }))}
                      format={years}
                    />
                    <CalcSlider
                      label="Reversion rate (SVR)"
                      value={state.svrRate}
                      min={0.005}
                      max={0.15}
                      step={0.0005}
                      onChange={(v) => setState((s) => ({ ...s, svrRate: v }))}
                      format={percent}
                    />
                  </>
                )}
                {region === "us" && (
                  <>
                    <CalcSlider
                      label="Property tax per year"
                      value={state.propertyTaxAnnual}
                      min={0}
                      max={20000}
                      step={100}
                      onChange={(v) => setState((s) => ({ ...s, propertyTaxAnnual: v }))}
                      format={config.formatValue}
                    />
                    <CalcSlider
                      label="Home insurance per year"
                      value={state.insuranceAnnual}
                      min={0}
                      max={10000}
                      step={100}
                      onChange={(v) => setState((s) => ({ ...s, insuranceAnnual: v }))}
                      format={config.formatValue}
                    />
                  </>
                )}
                <CalcSlider
                  label="Investment return assumption"
                  value={state.investRate}
                  min={0.01}
                  max={0.12}
                  step={0.0005}
                  onChange={(v) => setState((s) => ({ ...s, investRate: v }))}
                  format={percent}
                />
              </div>
            )}
          </div>

          {outputs.escrowMonthly > 0 && (
            <div className="rounded-[16px] border border-hairline bg-surface p-5">
              <p className="text-sm text-text-muted">
                <span className="font-medium text-text">Escrow estimate:</span>{" "}
                {config.formatValue(outputs.escrowMonthly)} per month for tax and insurance. This is shown for
                budgeting but is not compounded into the loan balance.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-7">
          <MortgageChart
            data={outputs.series}
            formatValue={config.formatValue}
            title="Balance remaining over time"
          />

          <CalcResult
            primary={{
              label: "Interest saved",
              value: config.formatValue(outputs.interestSaved),
              caption: `By overpaying ${config.formatValue(state.monthlyOverpayment)} a month`,
            }}
            secondary={[
              { label: "Months saved", value: `${outputs.monthsSaved}` },
              {
                label: "Total cost",
                value: config.formatValue(outputs.totalCostOverpayment),
                caption: `${config.formatValue(outputs.totalCostBaseline)} without overpayment`,
              },
              {
                label: "Invest instead",
                value: config.formatValue(outputs.investValue),
                caption: `At ${percent(state.investRate)} over ${termYears} years`,
              },
              {
                label: "Invest delta",
                value: config.formatValue(outputs.investDelta),
                caption: outputs.investDelta >= 0 ? "Investing wins" : "Overpaying wins",
              },
            ]}
          />

          <p className="text-xs text-text-dim">
            Not financial advice. The chart assumes your lender allows unlimited overpayments and that the rate schedule
            you entered applies for the full term. The &quot;invest instead&quot; figure uses a fixed annual return assumption; real
            returns will vary. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
