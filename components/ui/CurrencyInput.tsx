"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  onCommit: (value: number) => void;
  currencySymbol: string;
  /** Render a zero value as an empty field so untouched balances invite input. */
  hideZero?: boolean;
  inputClassName?: string;
};

export function CurrencyInput({
  value,
  onCommit,
  currencySymbol,
  hideZero = false,
  className,
  inputClassName,
  onFocus,
  onBlur,
  ...props
}: CurrencyInputProps) {
  // While focused, the raw text is kept locally so clearing the field does
  // not coerce to 0 mid-edit; empty commits 0 on blur.
  const [draft, setDraft] = React.useState<string | null>(null);

  const display = draft ?? (hideZero && value === 0 ? "" : String(value));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setDraft(next);
    if (next.trim() !== "") {
      const parsed = Number(next);
      if (Number.isFinite(parsed)) onCommit(parsed);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setDraft(display);
    event.target.select();
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === "") onCommit(0);
    setDraft(null);
    onBlur?.(event);
  };

  return (
    <div className={cn("relative", className)}>
      <span
        className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-text-dim"
        aria-hidden="true"
      >
        {currencySymbol}
      </span>
      <input
        type="number"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "flex h-9 w-full rounded-lg border border-stroke bg-surface py-2 pl-7 pr-3 text-right text-sm tabular-nums text-text placeholder:text-text-dim",
          "transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
