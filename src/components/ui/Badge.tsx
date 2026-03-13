import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "green" | "amber" | "red" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "bg-[#1E1E30] text-[#8888A0] border border-[#2A2A40]":
            variant === "default",
          "bg-[#D4A843]/20 text-[#F0D78C] border border-[#D4A843]/30":
            variant === "gold",
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":
            variant === "green",
          "bg-amber-500/20 text-amber-400 border border-amber-500/30":
            variant === "amber",
          "bg-red-500/20 text-red-400 border border-red-500/30":
            variant === "red",
          "bg-blue-500/20 text-blue-400 border border-blue-500/30":
            variant === "blue",
        },
        {
          "text-xs px-2 py-0.5": size === "sm",
          "text-sm px-3 py-1": size === "md",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
