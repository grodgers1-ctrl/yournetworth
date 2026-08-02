"use client";

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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text">{label}</label>
        <span className="text-sm font-medium text-text tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ynw-slider w-full"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-text-dim">
        <span className="tabular-nums">{format(min)}</span>
        <span className="tabular-nums">{format(max)}</span>
      </div>
    </div>
  );
}
