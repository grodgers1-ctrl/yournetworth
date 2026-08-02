"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { scaleLinear } from "@visx/scale";
import { Area, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { cn } from "@/lib/utils";

type FireChartPoint = {
  year: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
};

type CalcChartProps = {
  data: FireChartPoint[];
  currentAge: number;
  endAge: number;
  formatValue: (value: number) => string;
  className?: string;
  title?: string;
};

const width = 800;
const height = 450;
const margin = { top: 20, right: 40, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export function CalcChart({ data, currentAge, endAge, formatValue, className, title }: CalcChartProps) {
  const [tooltip, setTooltip] = useState<{
    year: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const xScale = useMemo(
    () => scaleLinear({ domain: [currentAge, endAge], range: [0, innerWidth] }),
    [currentAge, endAge]
  );

  const yMax = useMemo(() => {
    const max = Math.max(...data.map((d) => d.p90), 0);
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
      const year = Math.round(xScale.invert(svgX));
      const clampedYear = Math.max(currentAge, Math.min(endAge, year));
      const point = data.find((d) => d.year === clampedYear);
      if (point) {
        const rawX = event.clientX - wrapperRect.left;
        const rawY = event.clientY - wrapperRect.top;
        setTooltip({
          ...point,
          x: Math.min(rawX + 12, wrapperRect.width - 160),
          y: rawY - 12,
        });
      }
    },
    [currentAge, data, endAge, xScale]
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  if (data.length === 0) {
    return (
      <div className={cn("aspect-video rounded-[16px] border border-hairline bg-surface", className)}>
        <div className="flex h-full items-center justify-center text-sm text-text-muted">Chart will appear here.</div>
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
              <span className="h-1.5 w-4 rounded-full bg-text/20" /> p10–p90
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-text/40" /> p25–p75
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-text" /> median
            </span>
          </div>
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-label={title || "FIRE projection chart"}>
        <defs>
          <linearGradient id="wedge" gradientUnits="userSpaceOnUse" x1={xScale(currentAge)} y1={0} x2={xScale(endAge)} y2={0}>
            <stop offset="0%" stopColor="var(--color-bg)" stopOpacity={0} />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity={0.85} />
          </linearGradient>
          <linearGradient id="bandOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-text)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="var(--color-text)" stopOpacity={0.15} />
          </linearGradient>
          <linearGradient id="bandInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-text)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-text)" stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Area
            data={data}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.p90)}
            y0={(d) => yScale(d.p10)}
            curve={curveMonotoneX}
            fill="url(#bandOuter)"
          />
          <Area
            data={data}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.p75)}
            y0={(d) => yScale(d.p25)}
            curve={curveMonotoneX}
            fill="url(#bandInner)"
          />
          <LinePath
            data={data}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.p50)}
            curve={curveMonotoneX}
            stroke="var(--color-text)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <rect
            x={xScale(currentAge)}
            y={0}
            width={innerWidth - xScale(currentAge)}
            height={innerHeight}
            fill="url(#wedge)"
            style={{ pointerEvents: "none" }}
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
            tickFormat={(d) => String(Math.round(Number(d)))}
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
          <p className="font-medium text-text">Age {tooltip.year}</p>
          <div className="mt-1 space-y-0.5 tabular-nums text-text-muted">
            <p>p90: {formatValue(tooltip.p90)}</p>
            <p>p75: {formatValue(tooltip.p75)}</p>
            <p className="text-text">p50: {formatValue(tooltip.p50)}</p>
            <p>p25: {formatValue(tooltip.p25)}</p>
            <p>p10: {formatValue(tooltip.p10)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
