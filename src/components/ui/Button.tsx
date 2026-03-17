"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "hover:opacity-90": variant === "primary" || variant === "ghost",
            "border hover:opacity-90": variant === "secondary",
            "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500":
              variant === "danger",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2.5": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        style={
          variant === "primary"
            ? { backgroundColor: "var(--gold)", color: "var(--background)" }
            : variant === "secondary"
              ? { backgroundColor: "var(--surface-hover)", color: "var(--text-primary)", borderColor: "var(--border)" }
              : variant === "ghost"
                ? { color: "var(--text-secondary)" }
                : undefined
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
