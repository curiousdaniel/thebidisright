import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceExact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function timeRemaining(closesAt: string | null): string {
  if (!closesAt) return "No end date";
  const now = new Date();
  const end = new Date(closesAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Closed";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function isWithinLockout(
  closesAt: string | null,
  lockoutMinutes: number
): boolean {
  if (!closesAt) return false;
  const now = new Date();
  const end = new Date(closesAt);
  const lockoutMs = lockoutMinutes * 60 * 1000;
  return end.getTime() - now.getTime() <= lockoutMs;
}

export function percentDeviation(predicted: number, actual: number): number {
  if (actual === 0) return predicted === 0 ? 0 : 1;
  return Math.abs(predicted - actual) / actual;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
