"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1E1E30] border border-[#2A2A40] text-xs text-[#F1F1F5] rounded-lg whitespace-nowrap z-50 shadow-xl">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2A2A40]" />
        </div>
      )}
    </div>
  );
}
