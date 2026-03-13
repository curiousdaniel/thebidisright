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
        "flex gap-1 bg-[#0A0A0F] border border-[#2A2A40] rounded-lg p-1 overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
            active === tab.id
              ? "bg-[#1E1E30] text-[#D4A843] shadow-sm"
              : "text-[#8888A0] hover:text-[#F1F1F5]"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
