"use client";

import { useState, useEffect } from "react";

export function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;

    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isExpired = timeLeft <= 0;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { timeLeft, isExpired, days, hours, minutes, seconds };
}
