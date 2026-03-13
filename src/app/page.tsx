import Link from "next/link";
import { Gavel, Target, Trophy, Flame, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Nav */}
      <nav className="border-b border-[#2A2A40] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="text-[#D4A843]" size={24} />
            <span className="text-xl font-serif font-bold text-[#D4A843]">
              BidIQ
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-[#8888A0] hover:text-[#F1F1F5] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm bg-[#D4A843] text-[#0A0A0F] px-4 py-2 rounded-lg font-semibold hover:bg-[#F0D78C] transition-colors"
            >
              Play Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-full px-4 py-1.5 mb-8">
            <Zap size={14} className="text-[#D4A843]" />
            <span className="text-sm text-[#D4A843]">
              The Auction Appraisal Game
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#F1F1F5] leading-tight mb-6">
            You think you know
            <br />
            <span className="text-[#D4A843]">what it&apos;s worth?</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8888A0] max-w-2xl mx-auto mb-10">
            Browse real auction lots. Lock in your price prediction before the
            hammer drops. Earn points, badges, and bragging rights for your
            appraisal accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 bg-[#D4A843] text-[#0A0A0F] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#F0D78C] transition-all hover:scale-105"
            >
              <Target size={20} />
              Start Predicting
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 bg-[#1E1E30] text-[#F1F1F5] border border-[#2A2A40] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#2A2A40] transition-all"
            >
              <Trophy size={20} />
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-[#2A2A40]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-[#F1F1F5] mb-16">
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
                className="bg-[#141420] border border-[#2A2A40] rounded-xl p-6 hover:border-[#D4A843]/30 transition-colors"
              >
                <span className="text-3xl mb-4 block">{step.icon}</span>
                <h3 className="text-lg font-semibold text-[#F1F1F5] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#8888A0]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy tiers */}
      <section className="px-6 py-20 border-t border-[#2A2A40]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-[#F1F1F5] mb-4">
            How Close Can You Get?
          </h2>
          <p className="text-[#8888A0] mb-12">
            Every prediction is scored on accuracy. The closer you are to the
            hammer price, the more points you earn.
          </p>

          <div className="space-y-3">
            {[
              { emoji: "🎯", label: "Bullseye", range: "Within 5%", color: "border-emerald-500/30 bg-emerald-500/5" },
              { emoji: "🔥", label: "Hot Read", range: "Within 10%", color: "border-amber-500/30 bg-amber-500/5" },
              { emoji: "👍", label: "Good Eye", range: "Within 20%", color: "border-blue-500/30 bg-blue-500/5" },
              { emoji: "😬", label: "Swing and a Miss", range: "Within 50%", color: "border-[#2A2A40] bg-[#141420]" },
              { emoji: "💀", label: "Way Off", range: "Beyond 50%", color: "border-red-500/30 bg-red-500/5" },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`flex items-center justify-between px-6 py-4 rounded-xl border ${tier.color}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tier.emoji}</span>
                  <span className="font-semibold text-[#F1F1F5]">
                    {tier.label}
                  </span>
                </div>
                <span className="text-sm text-[#8888A0]">{tier.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for operators */}
      <section className="px-6 py-20 border-t border-[#2A2A40]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#F1F1F5] mb-4">
              For Auction Operators
            </h2>
            <p className="text-[#8888A0] max-w-xl mx-auto">
              BidIQ isn&apos;t just a game — it&apos;s a crowd-sourced appraisal
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
                className="bg-[#141420] border border-[#2A2A40] rounded-xl p-6"
              >
                <div className="text-[#D4A843] mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#F1F1F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8888A0]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-[#2A2A40]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-[#F1F1F5] mb-4">
            Ready to prove your expertise?
          </h2>
          <p className="text-[#8888A0] mb-8">
            Every lot is a wager on your knowledge. Start predicting now.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0F] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#F0D78C] transition-all hover:scale-105"
          >
            <Gavel size={20} />
            Enter BidIQ
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A40] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gavel className="text-[#D4A843]" size={16} />
            <span className="text-sm font-serif text-[#D4A843]">BidIQ</span>
          </div>
          <p className="text-xs text-[#555570]">
            Where Every Lot Is a Wager on Your Expertise
          </p>
        </div>
      </footer>
    </div>
  );
}
