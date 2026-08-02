"use client";

import { useMemo } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { CalcShell } from "@/components/calc/CalcShell";
import { CalcSlider } from "@/components/calc/CalcSlider";
import { CalcChart } from "@/components/calc/CalcChart";
import { CalcResult } from "@/components/calc/CalcResult";
import { useCalcState } from "@/components/calc/useCalcState";
import { calculateFire, type FireInputs } from "@/lib/calc/fire";
import { ukRegion, usRegion } from "@/lib/regions";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { useTrackEvent } from "@/lib/analytics";

type FireState = {
  annualSpend: number;
  withdrawalRate: number;
  currentSavings: number;
  monthlyContribution: number;
  currentAge: number;
  targetAge: number;
  endAge: number;
};

const initialFireState: FireState = {
  annualSpend: 40000,
  withdrawalRate: 0.04,
  currentSavings: 100000,
  monthlyContribution: 1000,
  currentAge: 30,
  targetAge: 50,
  endAge: 95,
};

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function FireNumberTool({ region }: { region: "uk" | "us" }) {
  const config = region === "uk" ? ukRegion : usRegion;
  const { state, setState, copyLink, exportJson } = useCalcState<FireState>({
    key: "fire-number",
    initial: initialFireState,
  });
  const track = useTrackEvent();

  const currentAge = clamp(state.currentAge, 18, 80);
  const targetAge = clamp(state.targetAge, currentAge + 1, 90);
  const endAge = clamp(state.endAge, targetAge + 1, 110);

  const outputs = useMemo(() => {
    const inputs: FireInputs = {
      ...state,
      currentAge,
      targetAge,
      endAge,
    };
    return calculateFire(inputs);
  }, [state, currentAge, targetAge, endAge]);

  const cta = (
    <Card variant="surface" className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-text">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">Model the income, not just the number</CardTitle>
          <CardDescription className="mt-1">
            Your FIRE number is a portfolio size. If you want to see the actual yearly dividend income that portfolio
            could produce,{" "}
            <a
              href="https://dividendmapper.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover"
              onClick={() => track("dividendmapper_cta_click", { region, path: "fire-number-tool" })}
            >
              DividendMapper <ArrowUpRight className="h-3.5 w-3.5" />
            </a>{" "}
            models the cash flows behind it.
          </CardDescription>
        </div>
      </div>
    </Card>
  );

  return (
    <CalcShell
      title="FIRE Number"
      slug="fire-number"
      state={state}
      setState={setState}
      initial={initialFireState}
      copyLink={copyLink}
      exportJson={exportJson}
      cta={cta}
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-hairline bg-surface p-6">
            <div className="space-y-5">
              <CalcSlider
                label="Annual spending"
                value={state.annualSpend}
                min={0}
                max={200000}
                step={1000}
                onChange={(v) => setState((s) => ({ ...s, annualSpend: v }))}
                format={config.formatValue}
              />
              <CalcSlider
                label="Withdrawal rate"
                value={state.withdrawalRate}
                min={0.025}
                max={0.06}
                step={0.001}
                onChange={(v) => setState((s) => ({ ...s, withdrawalRate: v }))}
                format={percent}
              />
              <CalcSlider
                label="Current savings"
                value={state.currentSavings}
                min={0}
                max={2000000}
                step={10000}
                onChange={(v) => setState((s) => ({ ...s, currentSavings: v }))}
                format={config.formatValue}
              />
              <CalcSlider
                label="Monthly contribution"
                value={state.monthlyContribution}
                min={0}
                max={10000}
                step={100}
                onChange={(v) => setState((s) => ({ ...s, monthlyContribution: v }))}
                format={config.formatValue}
              />
              <CalcSlider
                label="Current age"
                value={currentAge}
                min={18}
                max={80}
                step={1}
                onChange={(v) =>
                  setState((s) => ({
                    ...s,
                    currentAge: v,
                    targetAge: Math.max(s.targetAge, v + 1),
                    endAge: Math.max(s.endAge, v + 2),
                  }))
                }
                format={(v) => `${v}`}
              />
              <CalcSlider
                label="Target retirement age"
                value={targetAge}
                min={currentAge + 1}
                max={90}
                step={1}
                onChange={(v) =>
                  setState((s) => ({
                    ...s,
                    targetAge: v,
                    endAge: Math.max(s.endAge, v + 1),
                  }))
                }
                format={(v) => `${v}`}
              />
              <CalcSlider
                label="Planning horizon"
                value={endAge}
                min={targetAge + 1}
                max={110}
                step={1}
                onChange={(v) => setState((s) => ({ ...s, endAge: v }))}
                format={(v) => `${v}`}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <CalcChart
            data={outputs.series}
            currentAge={currentAge}
            endAge={endAge}
            formatValue={config.formatCompact}
            title="Portfolio projection by age"
          />
          <CalcResult
            primary={{ label: "Your FIRE number", value: config.formatValue(outputs.fireNumber) }}
            secondary={[
              { label: "Coast FIRE", value: config.formatValue(outputs.coastNumber) },
              {
                label: "Years to FIRE (median)",
                value: outputs.yearsToFire !== null ? `${outputs.yearsToFire}` : "50+",
              },
              { label: "Safe annual spend", value: config.formatValue(outputs.fireNumber * state.withdrawalRate) },
              { label: "Plan success rate", value: `${(outputs.successRate * 100).toFixed(0)}%` },
            ]}
          />
          <p className="text-xs text-text-dim">
            Not financial advice. The shaded bands show p10 to p90 and p25 to p75 outcomes from a seeded simulation. The darkening right edge is the Wedge of Death: the probability that you are no longer alive at that age. Your inputs stay in your browser.
          </p>
        </div>
      </div>
    </CalcShell>
  );
}
