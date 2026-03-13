"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { ACCURACY_TIERS, type AccuracyTier } from "@/types/game";
import Button from "@/components/ui/Button";

interface RevealAnimationProps {
  itemTitle: string;
  imageUrl: string | null;
  predictedPrice: number;
  hammerPrice: number;
  accuracyTier: AccuracyTier;
  pointsEarned: number;
  onComplete: () => void;
}

type Phase = "drumroll" | "split" | "verdict" | "points";

export default function RevealAnimation({
  itemTitle,
  imageUrl,
  predictedPrice,
  hammerPrice,
  accuracyTier,
  pointsEarned,
  onComplete,
}: RevealAnimationProps) {
  const [phase, setPhase] = useState<Phase>("drumroll");
  const [countUp, setCountUp] = useState({ predicted: 0, hammer: 0 });

  const tier = ACCURACY_TIERS[accuracyTier];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase("split"), 3000));
    timers.push(setTimeout(() => setPhase("verdict"), 5500));
    timers.push(setTimeout(() => setPhase("points"), 7000));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "split") return;

    const duration = 2000;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountUp({
        predicted: Math.round(predictedPrice * eased),
        hammer: Math.round(hammerPrice * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [phase, predictedPrice, hammerPrice]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0F] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "drumroll" && (
          <motion.div
            key="drumroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {imageUrl && (
              <motion.img
                src={imageUrl}
                alt={itemTitle}
                className="w-64 h-64 object-cover rounded-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            <motion.div
              className="w-4 h-4 rounded-full bg-[#D4A843]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            <p className="text-[#8888A0] text-sm">Revealing...</p>
          </motion.div>
        )}

        {phase === "split" && (
          <motion.div
            key="split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row gap-8 items-center w-full max-w-lg px-6"
          >
            <div className="flex-1 text-center">
              <p className="text-xs text-[#8888A0] uppercase tracking-wider mb-2">
                Your Call
              </p>
              <p className="text-3xl font-mono font-bold text-[#60A5FA] tabular-nums">
                {formatPrice(countUp.predicted)}
              </p>
            </div>
            <div className="text-2xl text-[#555570]">vs</div>
            <div className="flex-1 text-center">
              <p className="text-xs text-[#8888A0] uppercase tracking-wider mb-2">
                Hammer Price
              </p>
              <p className="text-3xl font-mono font-bold text-[#D4A843] tabular-nums">
                {formatPrice(countUp.hammer)}
              </p>
            </div>
          </motion.div>
        )}

        {(phase === "verdict" || phase === "points") && (
          <motion.div
            key="verdict"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 px-6 text-center"
          >
            <motion.span
              className="text-7xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10, stiffness: 200 }}
            >
              {tier.emoji}
            </motion.span>
            <h2 className="text-3xl font-serif font-bold text-[#F1F1F5]">
              {tier.label}
            </h2>

            <div className="flex gap-8 text-center">
              <div>
                <p className="text-xs text-[#8888A0]">Your Call</p>
                <p className="font-mono text-xl text-[#F1F1F5]">
                  {formatPrice(predictedPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8888A0]">Hammer</p>
                <p className="font-mono text-xl text-[#D4A843]">
                  {formatPrice(hammerPrice)}
                </p>
              </div>
            </div>

            {phase === "points" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-2xl font-bold text-[#34D399]">
                  +{pointsEarned} points
                </p>
                <Button onClick={onComplete} variant="primary">
                  Continue
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
