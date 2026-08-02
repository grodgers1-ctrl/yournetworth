"use client";

import { useMemo } from "react";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
};

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => String(v) }: SliderProps) {
  const percent = useMemo(() => {
    const clamped = Math.min(max, Math.max(min, value));
    return ((clamped - min) / (max - min)) * 100;
  }, [value, min, max]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={`slider-${label}`} className="text-sm font-medium text-text">
          {label}
        </label>
        <span
          className="text-sm font-semibold text-text tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {format(value)}
        </span>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ynw-slider w-full"
        style={{ "--ynw-value-percent": `${percent}%` } as React.CSSProperties}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-xs text-text-dim">
        <span className="tabular-nums">{format(min)}</span>
        <span className="tabular-nums">{format(max)}</span>
      </div>
    </div>
  );
}
