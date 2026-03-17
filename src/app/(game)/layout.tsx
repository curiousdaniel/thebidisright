"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/contexts/DemoModeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Gavel,
  Search,
  Zap,
  Layers,
  Trophy,
  User,
} from "lucide-react";

const navItems = [
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/quick-play", label: "Quick Play", icon: Zap },
  { href: "/reveals", label: "Reveals", icon: Layers },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const demo = useDemoMode();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href={demo?.demoHref("/") ?? "/"}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Gavel className="text-[var(--gold)]" size={20} />
            <span className="text-lg font-serif font-bold" style={{ color: "var(--gold)" }}>
              The Bid is Right
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {demo?.isDemoMode && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--gold)]/20 text-[var(--gold)]">
                Demo Mode
              </span>
            )}
            <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const href = demo?.demoHref(item.href) ?? item.href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--gold)] bg-[var(--gold)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t pb-[env(safe-area-inset-bottom)]" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const href = demo?.demoHref(item.href) ?? item.href;
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-[var(--gold)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}
