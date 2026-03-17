import Link from "next/link";
import { Gavel, Target, Trophy, Flame, BarChart3, Zap } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel size={24} style={{ color: "var(--gold)" }} />
            <span className="text-xl font-serif font-bold" style={{ color: "var(--gold)" }}>
              The Bid is Right
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm transition-colors hover:opacity-90"
              style={{ color: "var(--text-secondary)" }}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--gold)", color: "var(--background)" }}
            >
              Play Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ backgroundColor: "color-mix(in srgb, var(--gold) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)" }}>
            <Zap size={14} style={{ color: "var(--gold)" }} />
            <span className="text-sm" style={{ color: "var(--gold)" }}>
              The Auction Appraisal Game
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
            You think you know
            <br />
            <span style={{ color: "var(--gold)" }}>what it&apos;s worth?</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            Browse real auction lots. Lock in your price prediction before the
            hammer drops. Earn points, badges, and bragging rights for your
            appraisal accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: "var(--gold)", color: "var(--background)" }}
            >
              <Target size={20} />
              Start Predicting
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all border hover:opacity-90"
              style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-primary)", borderColor: "var(--border)" }}
            >
              <Trophy size={20} />
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-16" style={{ color: "var(--text-primary)" }}>
            The Game Loop
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Discover",
                desc: "Browse upcoming lots by auction, category, or closing time.",
              },
              {
                icon: "🎯",
                title: "Appraise",
                desc: "Lock in your price prediction with The Slider before bidding closes.",
              },
              {
                icon: "⏳",
                title: "Wait",
                desc: "Watch the countdown. See anonymized crowd predictions.",
              },
              {
                icon: "🔨",
                title: "Reveal",
                desc: "When the hammer drops, see how close you were with a dramatic reveal.",
              },
              {
                icon: "⭐",
                title: "Earn",
                desc: "Score points, unlock badges, and build accuracy streaks.",
              },
              {
                icon: "🏆",
                title: "Climb",
                desc: "Rise through the ranks from Browsing Bidder to The Oracle.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-xl p-6 transition-colors"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="text-3xl mb-4 block">{step.icon}</span>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy tiers */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            How Close Can You Get?
          </h2>
          <p className="mb-12" style={{ color: "var(--text-secondary)" }}>
            Every prediction is scored on accuracy. The closer you are to the
            hammer price, the more points you earn.
          </p>

          <div className="space-y-3">
            {[
              { emoji: "🎯", label: "Bullseye", range: "Within 5%", color: "border-emerald-500/30 bg-emerald-500/5" },
              { emoji: "🔥", label: "Hot Read", range: "Within 10%", color: "border-amber-500/30 bg-amber-500/5" },
              { emoji: "👍", label: "Good Eye", range: "Within 20%", color: "border-blue-500/30 bg-blue-500/5" },
              { emoji: "😬", label: "Swing and a Miss", range: "Within 50%", color: "" },
              { emoji: "💀", label: "Way Off", range: "Beyond 50%", color: "border-red-500/30 bg-red-500/5" },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`flex items-center justify-between px-6 py-4 rounded-xl border ${tier.color}`}
                style={!tier.color ? { borderColor: "var(--border)", backgroundColor: "var(--surface)" } : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tier.emoji}</span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {tier.label}
                  </span>
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{tier.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for operators */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              For Auction Operators
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              The Bid is Right isn&apos;t just a game — it&apos;s a crowd-sourced appraisal
              engine for your inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 size={24} />,
                title: "Appraisal Intelligence",
                desc: "See crowd-sourced valuations for every lot with confidence scores and prediction distributions.",
              },
              {
                icon: <Flame size={24} />,
                title: "Drive Engagement",
                desc: "Turn passive browsers into active participants. Gamification increases catalog views and registrations.",
              },
              {
                icon: <Target size={24} />,
                title: "Export & Reports",
                desc: "Generate CSV exports and PDF appraisal reports for consignors, lenders, and internal use.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl p-6"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="mb-4" style={{ color: "var(--gold)" }}>{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Ready to prove your expertise?
          </h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Every lot is a wager on your knowledge. Start predicting now.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ backgroundColor: "var(--gold)", color: "var(--background)" }}
          >
            <Gavel size={20} />
            Enter The Bid is Right
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gavel size={16} style={{ color: "var(--gold)" }} />
            <span className="text-sm font-serif" style={{ color: "var(--gold)" }}>The Bid is Right</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Where Every Lot Is a Wager on Your Expertise
          </p>
        </div>
      </footer>
    </div>
  );
}
