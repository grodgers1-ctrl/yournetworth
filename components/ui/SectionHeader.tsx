import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-caption mb-3 font-medium uppercase tracking-widest text-text-dim">
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-section", className)}>{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-body text-text-muted">{subtitle}</p>}
    </div>
  );
}
