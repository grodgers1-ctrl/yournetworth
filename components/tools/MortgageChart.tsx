"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { cn } from "@/lib/utils";

type MortgageChartPoint = {
  month: number;
  baselineBalance: number;
  overpaymentBalance: number;
};

type MortgageChartProps = {
  data: MortgageChartPoint[];
  formatValue: (value: number) => string;
  className?: string;
  title?: string;
};

const width = 800;
const height = 420;
const margin = { top: 20, right: 40, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export function MortgageChart({ data, formatValue, className, title }: MortgageChartProps) {
  const [tooltip, setTooltip] = useState<{
    month: number;
    baselineBalance: number;
    overpaymentBalance: number;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const xScale = useMemo(() => scaleLinear({ domain: [0, data.length], range: [0, innerWidth] }), [data.length]);

  const yMax = useMemo(() => {
    const max = Math.max(...data.map((d) => Math.max(d.baselineBalance, d.overpaymentBalance)), 0);
    return max * 1.05;
  }, [data]);

  const yScale = useMemo(() => scaleLinear({ domain: [0, yMax], range: [innerHeight, 0] }), [yMax]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      if (!svgRef.current || !wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - svgRect.left - margin.left;
      const svgX = (x / svgRect.width) * width;
      const month = Math.max(1, Math.min(data.length, Math.round(xScale.invert(svgX))));
      const point = data[month - 1];
      if (point) {
        setTooltip({
          month,
          baselineBalance: point.baselineBalance,
          overpaymentBalance: point.overpaymentBalance,
          x: Math.min(event.clientX - wrapperRect.left + 12, wrapperRect.width - 180),
          y: event.clientY - wrapperRect.top - 12,
        });
      }
    },
    [data, xScale]
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  if (data.length === 0) {
    return (
      <div className={cn("aspect-video rounded-[16px] border border-hairline bg-surface", className)}>
        <div className="flex h-full items-center justify-center text-sm text-text-muted">Chart will appear here.</div>
      </div>
    );
  }

  const hasInvalidData = data.some(
    (d) => !Number.isFinite(d.month) || !Number.isFinite(d.baselineBalance) || !Number.isFinite(d.overpaymentBalance)
  );
  if (hasInvalidData) {
    return (
      <div className={cn("aspect-video rounded-[16px] border border-hairline bg-surface", className)}>
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-text-muted">
          <span>Unable to draw chart.</span>
          <span className="text-xs text-text-dim">Check that all inputs are valid numbers.</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={cn("relative aspect-video rounded-[16px] border border-hairline bg-surface", className)}>
      {(title || tooltip) && (
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
          {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
          <div className="flex items-center gap-3 text-xs text-text-dim">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-text-muted" /> Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-text" /> With overpayment
            </span>
          </div>
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-label={title || "Mortgage balance chart"}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <LinePath
            data={data}
            x={(d) => xScale(d.month)}
            y={(d) => yScale(d.baselineBalance)}
            curve={curveMonotoneX}
            stroke="var(--color-text-muted)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <LinePath
            data={data}
            x={(d) => xScale(d.month)}
            y={(d) => yScale(d.overpaymentBalance)}
            curve={curveMonotoneX}
            stroke="var(--color-text)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            stroke="var(--color-hairline)"
            tickStroke="var(--color-hairline)"
            tickLabelProps={{
              fill: "var(--color-text-dim)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              textAnchor: "middle",
              className: "tabular-nums",
            }}
            numTicks={8}
            tickFormat={(d) => `${Math.round(Number(d) / 12)}y`}
          />
          <AxisLeft
            scale={yScale}
            stroke="var(--color-hairline)"
            tickStroke="var(--color-hairline)"
            tickLabelProps={{
              fill: "var(--color-text-dim)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              textAnchor: "end",
              className: "tabular-nums",
            }}
            numTicks={6}
            tickFormat={(d) => formatValue(Number(d))}
          />
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
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-hairline bg-elevated px-3 py-2 text-xs shadow-card"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="font-medium text-text">Year {Math.round(tooltip.month / 12)}</p>
          <div className="mt-1 space-y-0.5 tabular-nums text-text-muted">
            <p>Baseline: {formatValue(tooltip.baselineBalance)}</p>
            <p className="text-text">With overpayment: {formatValue(tooltip.overpaymentBalance)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
