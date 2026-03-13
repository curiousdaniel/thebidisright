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
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#D4A843] text-[#0A0A0F] hover:bg-[#F0D78C] focus:ring-[#D4A843]":
              variant === "primary",
            "bg-[#1E1E30] text-[#F1F1F5] border border-[#2A2A40] hover:bg-[#2A2A40] focus:ring-[#2A2A40]":
              variant === "secondary",
            "text-[#8888A0] hover:text-[#F1F1F5] hover:bg-[#1E1E30] focus:ring-[#2A2A40]":
              variant === "ghost",
            "bg-red-500/20 text-[#F87171] border border-red-500/30 hover:bg-red-500/30 focus:ring-red-500":
              variant === "danger",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2.5": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
