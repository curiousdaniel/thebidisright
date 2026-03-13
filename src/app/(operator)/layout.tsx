"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Gavel,
  LayoutDashboard,
  Settings,
  Download,
  Users,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/players", label: "Players", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/export", label: "Export", icon: Download },
];

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#2A2A40] bg-[#0A0A0F]">
        <div className="p-5 border-b border-[#2A2A40]">
          <Link href="/" className="flex items-center gap-2">
            <Gavel className="text-[#D4A843]" size={20} />
            <span className="text-lg font-serif font-bold text-[#D4A843]">
              BidIQ
            </span>
          </Link>
          <p className="text-xs text-[#555570] mt-1">Operator Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#D4A843]/10 text-[#D4A843]"
                    : "text-[#8888A0] hover:text-[#F1F1F5] hover:bg-[#1E1E30]"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#2A2A40]">
          <Link
            href="/browse"
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#555570] hover:text-[#8888A0] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Game
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#2A2A40] px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gavel className="text-[#D4A843]" size={18} />
            <span className="font-serif font-bold text-[#D4A843]">
              BidIQ Operator
            </span>
          </Link>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex gap-1 px-4 py-2 overflow-x-auto border-b border-[#2A2A40]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-[#D4A843]/10 text-[#D4A843]"
                    : "text-[#8888A0]"
                )}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
