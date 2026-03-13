"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  closesAt: string | null;
  className?: string;
  compact?: boolean;
}

export default function CountdownTimer({
  closesAt,
  className,
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!closesAt) return;

    const update = () => {
      const diff = new Date(closesAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [closesAt]);

  if (!closesAt || !timeLeft) return null;

  if (timeLeft.total <= 0) {
    return (
      <span className={cn("text-red-400 font-mono font-bold", className)}>
        CLOSED
      </span>
    );
  }

  const isUrgent = timeLeft.total < 30 * 60 * 1000;
  const isCritical = timeLeft.total < 5 * 60 * 1000;

  if (compact) {
    const parts: string[] = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    parts.push(`${timeLeft.minutes}m`);
    return (
      <span
        className={cn(
          "font-mono text-sm",
          isCritical
            ? "text-red-400 animate-pulse"
            : isUrgent
            ? "text-amber-400"
            : "text-[#8888A0]",
          className
        )}
      >
        {parts.join(" ")}
      </span>
    );
  }

  return (
    <div className={cn("flex gap-2 font-mono", className)}>
      {timeLeft.days > 0 && (
        <TimeUnit value={timeLeft.days} label="D" urgent={false} />
      )}
      <TimeUnit value={timeLeft.hours} label="H" urgent={isUrgent} />
      <TimeUnit value={timeLeft.minutes} label="M" urgent={isUrgent} />
      <TimeUnit value={timeLeft.seconds} label="S" urgent={isCritical} />
    </div>
  );
}

function TimeUnit({
  value,
  label,
  urgent,
}: {
  value: number;
  label: string;
  urgent: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center bg-[#0A0A0F] rounded-lg px-2.5 py-1.5 min-w-[44px]",
        urgent && "ring-1 ring-red-500/50"
      )}
    >
      <span
        className={cn(
          "text-lg font-bold tabular-nums",
          urgent ? "text-red-400" : "text-[#F1F1F5]"
        )}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[#555570] uppercase">{label}</span>
    </div>
  );
}
