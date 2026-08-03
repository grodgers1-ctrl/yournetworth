import { TrendingUp, Wallet, CreditCard, PieChart, ArrowUpRight } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const netWorthTrend = [420, 438, 452, 448, 465, 478, 492, 512];

export function DashboardMockup() {
  const max = Math.max(...netWorthTrend);
  const points = netWorthTrend.map((v, i) => {
    const x = (i / (netWorthTrend.length - 1)) * 100;
    const y = 40 - (v / max) * 35;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L 100,40 L 0,40 Z`;

  return (
    <div className="relative mx-auto w-full max-w-[1000px] rounded-[12px] border border-hairline bg-surface shadow-card overflow-hidden">
      {/* Browser chrome */}
      <div className="flex h-9 items-center gap-2 border-b border-hairline bg-elevated px-4">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#3a3a3c]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3a3a3c]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3a3a3c]" />
        </div>
        <div className="ml-4 flex-1 rounded-md bg-bg px-3 py-1 text-center text-[11px] text-text-dim">
          yournetworth.net/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-48 flex-col border-r border-hairline bg-elevated/50 p-4 md:flex">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-accent" />
            <span className="text-sm font-medium text-text">Your Net Worth</span>
          </div>
          <nav className="space-y-1">
            {["Overview", "Assets", "Liabilities", "Cash flow", "FIRE"].map((item, i) => (
              <div
                key={item}
                className={`rounded-md px-2.5 py-1.5 text-[13px] ${
                  i === 0 ? "bg-surface text-text" : "text-text-muted hover:text-text"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-text">Overview</h2>
            <div className="flex items-center gap-2 text-xs text-text-dim">
              <span>Monthly delta</span>
              <span className="flex items-center gap-0.5 rounded-full bg-green-950/50 px-2 py-0.5 text-green-400">
                <ArrowUpRight className="h-3 w-3" /> +£4,200
              </span>
            </div>
          </div>

          {/* Primary metrics */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-hairline bg-surface p-3">
              <p className="text-[11px] text-text-dim">Net worth</p>
              <p className="mt-1 text-2xl font-semibold text-text tabular-nums">£512,400</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-green-400">
                <TrendingUp className="h-3 w-3" /> +8.2% this year
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-3">
              <p className="text-[11px] text-text-dim">Assets</p>
              <p className="mt-1 text-xl font-medium text-text tabular-nums">£641,200</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
                <Wallet className="h-3 w-3" /> Investments + cash
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-3">
              <p className="text-[11px] text-text-dim">Liabilities</p>
              <p className="mt-1 text-xl font-medium text-text tabular-nums">£128,800</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
                <CreditCard className="h-3 w-3" /> Mortgage balance
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-3">
              <p className="text-[11px] text-text-dim">Allocation</p>
              <div className="mt-2 flex items-center gap-2">
                <PieChart className="h-8 w-8 text-text-muted" />
                <div className="text-[11px] text-text-muted">
                  <p>Equities 68%</p>
                  <p>Property 22%</p>
                  <p>Cash 10%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="rounded-lg border border-hairline bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-text">Net worth trend</p>
              <p className="text-[11px] text-text-dim">Last 8 months</p>
            </div>
            <div className="relative h-40 w-full">
              <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-text)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--color-text)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#chartFill)" />
                <path d={pathD} fill="none" stroke="var(--color-text)" strokeWidth="1" />
                {points.map((p, i) => {
                  const [x, y] = p.split(",").map(Number);
                  return (
                    <circle key={i} cx={x} cy={y} r="1" fill="var(--color-text)" />
                  );
                })}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-text-dim">
                {months.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
