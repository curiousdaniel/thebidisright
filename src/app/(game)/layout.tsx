"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#2A2A40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Gavel className="text-[#D4A843]" size={20} />
            <span className="text-lg font-serif font-bold text-[#D4A843]">
              BidIQ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#D4A843] bg-[#D4A843]/10"
                      : "text-[#8888A0] hover:text-[#F1F1F5] hover:bg-[#1E1E30]"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-[#2A2A40] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-[#D4A843]"
                    : "text-[#555570]"
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
