import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "accent" && "bg-accent text-text",
        variant === "muted" && "bg-elevated text-text-muted",
        variant === "default" && "border border-hairline bg-surface text-text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
