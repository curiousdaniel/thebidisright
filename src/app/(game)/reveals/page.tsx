"use client";

import { useRevealQueue } from "@/hooks/useRevealQueue";
import RevealQueue from "@/components/game/RevealQueue";
import { Layers } from "lucide-react";

export default function RevealsPage() {
  const { reveals, loading } = useRevealQueue();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Layers className="text-[#D4A843]" size={24} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Reveals
          </h1>
          <p className="text-sm text-[#8888A0]">
            See how your predictions stacked up
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-[#141420] border border-[#2A2A40] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <RevealQueue reveals={reveals} />
      )}
    </div>
  );
}
