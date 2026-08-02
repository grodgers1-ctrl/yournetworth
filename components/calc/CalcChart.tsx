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
};

const width = 800;
const height = 450;
const margin = { top: 20, right: 40, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export function CalcChart({ data, currentAge, endAge, formatValue, className }: CalcChartProps) {
  const [tooltip, setTooltip] = useState<{ year: number; value: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - margin.left;
      const year = Math.round(xScale.invert((x / rect.width) * width));
      const clampedYear = Math.max(currentAge, Math.min(endAge, year));
      const point = data.find((d) => d.year === clampedYear);
      if (point) {
        setTooltip({
          year: clampedYear,
          value: point.p50,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
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
    <div className={cn("relative aspect-video rounded-[16px] border border-hairline bg-surface", className)}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" aria-label="FIRE projection chart">
        <defs>
          <linearGradient id="wedge" gradientUnits="userSpaceOnUse" x1={xScale(currentAge)} y1={0} x2={xScale(110)} y2={0}>
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
          className="pointer-events-none absolute rounded-lg border border-hairline bg-elevated px-3 py-2 text-xs shadow-studio"
          style={{ left: tooltip.x + 12, top: tooltip.y - 12 }}
        >
          <p className="font-medium text-text">Age {tooltip.year}</p>
          <p className="tabular-nums text-text-muted">{formatValue(tooltip.value)}</p>
        </div>
      )}
    </div>
  );
}
