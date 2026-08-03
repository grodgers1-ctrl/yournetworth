import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const data = [
  { month: "Jan", assets: 580, liabilities: 145, netWorth: 435 },
  { month: "Feb", assets: 592, liabilities: 142, netWorth: 450 },
  { month: "Mar", assets: 598, liabilities: 139, netWorth: 459 },
  { month: "Apr", assets: 604, liabilities: 137, netWorth: 467 },
  { month: "May", assets: 618, liabilities: 134, netWorth: 484 },
  { month: "Jun", assets: 625, liabilities: 131, netWorth: 494 },
  { month: "Jul", assets: 638, liabilities: 129, netWorth: 509 },
  { month: "Aug", assets: 645, liabilities: 127, netWorth: 518 },
];

export function NetWorthDeepDive() {
  const max = Math.max(...data.map((d) => d.assets));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 35 - (d.netWorth / max) * 32;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;

  return (
    <div className="rounded-[12px] border border-hairline bg-surface p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text">Net worth trend</p>
          <p className="mt-0.5 text-xs text-text-dim">Assets, liabilities, and net worth over time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-green-400">
            <ArrowUpRight className="h-3 w-3" /> Assets £645k
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <ArrowDownRight className="h-3 w-3" /> Liabilities £127k
          </span>
        </div>
      </div>

      <div className="relative h-48 w-full">
        <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="var(--color-text)" strokeWidth="1" />
          {points.map((p, i) => {
            const [x, y] = p.split(",").map(Number);
            return <circle key={i} cx={x} cy={y} r="1" fill="var(--color-text)" />;
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-text-dim">
          {data.map((d) => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {data.slice(-3).map((d) => (
          <div key={d.month} className="rounded-lg border border-hairline bg-elevated/50 p-3">
            <p className="text-[11px] text-text-dim">{d.month}</p>
            <p className="mt-1 text-lg font-semibold text-text tabular-nums">£{d.netWorth}k</p>
            <div className="mt-1 h-1 w-full rounded-full bg-hairline">
              <div
                className="h-1 rounded-full bg-text/60"
                style={{ width: `${(d.netWorth / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
