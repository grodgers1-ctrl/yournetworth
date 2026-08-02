import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[16px] border transition-colors duration-100", {
  variants: {
    variant: {
      default: "border-hairline bg-surface shadow-card",
      surface: "border-hairline bg-surface",
      elevated: "border-border-subtle bg-elevated shadow-elevated",
      ghost: "border-transparent bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type CardProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-text", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-text-muted", className)}>{children}</p>;
}

export function CardContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}
