import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  caption?: string;
  className?: string;
};

export function StatCard({ label, value, caption, className }: StatCardProps) {
  return (
    <div className={cn("rounded-[16px] border border-hairline bg-surface p-5", className)}>
      <p className="text-micro text-text-dim">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-text tabular-nums">{value}</p>
      {caption && <p className="mt-1 text-xs text-text-muted">{caption}</p>}
    </div>
  );
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>{children}</div>;
}

export function PrimaryStat({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded-[16px] border border-hairline bg-surface p-6">
      <p className="text-caption text-text-dim">{label}</p>
      <p className="mt-1 text-5xl font-bold tracking-tight text-text tabular-nums">{value}</p>
      {caption && <p className="mt-2 text-sm text-text-muted">{caption}</p>}
    </div>
  );
}
