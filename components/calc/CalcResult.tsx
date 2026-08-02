type CalcResultProps = {
  primary: { label: string; value: string };
  secondary: { label: string; value: string }[];
};

export function CalcResult({ primary, secondary }: CalcResultProps) {
  return (
    <div className="rounded-[16px] border border-hairline bg-surface p-6">
      <p className="text-sm text-text-muted">{primary.label}</p>
      <p className="mt-1 text-5xl font-bold tracking-tight text-text tabular-nums">{primary.value}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {secondary.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-text-dim">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-text-muted tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
