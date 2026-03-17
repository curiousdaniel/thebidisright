"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const theme = useTheme();
  if (!theme) return null;

  return (
    <button
      type="button"
      onClick={theme.toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      aria-label={theme.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme.theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
