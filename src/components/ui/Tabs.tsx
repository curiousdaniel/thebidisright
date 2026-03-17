"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, defaultTab, onTabChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  const handleClick = (id: string) => {
    setActive(id);
    onTabChange?.(id);
  };

  return (
    <div
      className={cn(
        "flex gap-1 rounded-lg p-1 overflow-x-auto",
        className
      )}
      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
            active === tab.id
              ? "shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
          style={active === tab.id ? { backgroundColor: "var(--surface-hover)", color: "var(--gold)" } : undefined}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
