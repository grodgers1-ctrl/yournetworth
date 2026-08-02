import { cn } from "@/lib/utils";

type CalcResultProps = {
  primary: { label: string; value: string; caption?: string };
  secondary: { label: string; value: string; caption?: string }[];
  className?: string;
};

export function CalcResult({ primary, secondary, className }: CalcResultProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-[16px] border border-hairline bg-surface p-6">
        <p className="text-caption text-text-dim">{primary.label}</p>
        <p
          className="mt-1 text-5xl font-bold tracking-tight text-text tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {primary.value}
        </p>
        {primary.caption && <p className="mt-2 text-sm text-text-muted">{primary.caption}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {secondary.map((item) => (
          <div
            key={item.label}
            className="rounded-[16px] border border-hairline bg-surface p-4"
          >
            <p className="text-micro text-text-dim">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-text-muted tabular-nums">{item.value}</p>
            {item.caption && <p className="mt-1 text-xs text-text-dim">{item.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
