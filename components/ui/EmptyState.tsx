import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-[16px] border border-hairline bg-surface p-8 text-center", className)}>
      <p className="text-section">{title}</p>
      {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
    </div>
  );
}
