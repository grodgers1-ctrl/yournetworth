import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[16px] bg-elevated",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <div className={cn("h-4 animate-pulse rounded bg-elevated", className)} />;
}
