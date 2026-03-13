"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AMItem } from "@/types/auction";
import PriceSlider from "./PriceSlider";
import { formatPrice } from "@/lib/utils";
import { getItemImageUrl } from "@/lib/image-url";
import { Timer, Trophy } from "lucide-react";

interface QuickPlayRoundProps {
  items: AMItem[];
  onComplete: (predictions: Array<{ itemId: number; price: number }>) => void;
}

export default function QuickPlayRound({
  items,
  onComplete,
}: QuickPlayRoundProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [predictions, setPredictions] = useState<
    Array<{ itemId: number; price: number }>
  >([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const handleSubmit = useCallback(
    (price: number) => {
      const newPredictions = [
        ...predictions,
        { itemId: items[currentIdx].am_item_id, price },
      ];
      setPredictions(newPredictions);

      if (currentIdx + 1 >= items.length) {
        setFinished(true);
        onComplete(newPredictions);
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    },
    [predictions, currentIdx, items, onComplete]
  );

  if (finished) {
    const inTime = timeLeft > 0;
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        <Trophy size={48} className="text-[#D4A843]" />
        <h2 className="text-2xl font-serif font-bold text-[#F1F1F5]">
          {inTime ? "Speed Round Complete!" : "Time's Up!"}
        </h2>
        <p className="text-[#8888A0]">
          {predictions.length} of {items.length} predictions made
          {inTime && " — Speed bonus earned!"}
        </p>
        <div className="space-y-2 w-full max-w-sm">
          {predictions.map((p, i) => (
            <div
              key={i}
              className="flex justify-between text-sm bg-[#1E1E30] rounded-lg px-4 py-2"
            >
              <span className="text-[#F1F1F5] truncate">
                {items[i]?.title}
              </span>
              <span className="font-mono text-[#D4A843]">
                {formatPrice(p.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const item = items[currentIdx];
  const imageSrc = getItemImageUrl(item.image_url);
  const progress = ((currentIdx + 1) / items.length) * 100;
  const urgency = timeLeft <= 15;

  return (
    <div className="space-y-6">
      {/* Timer and progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer
            size={18}
            className={urgency ? "text-red-400 animate-pulse" : "text-[#D4A843]"}
          />
          <span
            className={`font-mono text-xl font-bold tabular-nums ${
              urgency ? "text-red-400" : "text-[#F1F1F5]"
            }`}
          >
            {timeLeft}s
          </span>
        </div>
        <span className="text-sm text-[#8888A0]">
          {currentIdx + 1} / {items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#1E1E30] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4A843] to-[#F0D78C] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Current item */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-4"
      >
        <div className="flex gap-4">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
          ) : null}
          <div>
            <h3 className="text-lg font-semibold text-[#F1F1F5]">
              {item.title}
            </h3>
            {item.category && (
              <span className="text-xs text-[#D4A843]">{item.category}</span>
            )}
            {item.starting_bid && (
              <p className="text-sm text-[#8888A0] mt-1">
                Starting: {formatPrice(item.starting_bid)}
              </p>
            )}
          </div>
        </div>

        <PriceSlider
          startingBid={item.starting_bid || 100}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}
