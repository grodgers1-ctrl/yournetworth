import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-ring",
  {
    variants: {
      variant: {
        primary: "bg-accent text-text hover:bg-accent-hover",
        secondary: "border border-hairline bg-elevated text-text-muted hover:border-stroke hover:text-text",
        ghost: "text-text-muted hover:text-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}

export type LinkButtonProps = React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function LinkButton({ className, variant, size, children, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
