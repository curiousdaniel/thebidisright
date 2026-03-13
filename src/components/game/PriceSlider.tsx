"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { Gavel, Lock } from "lucide-react";
import Button from "@/components/ui/Button";

interface PriceSliderProps {
  startingBid: number;
  maxPrice?: number;
  currentPrediction?: number | null;
  isLocked?: boolean;
  onSubmit: (price: number) => void;
  disabled?: boolean;
}

export default function PriceSlider({
  startingBid,
  maxPrice,
  currentPrediction,
  isLocked = false,
  onSubmit,
  disabled = false,
}: PriceSliderProps) {
  const max = maxPrice || Math.max(startingBid * 3, 100);
  const [value, setValue] = useState(currentPrediction || startingBid);
  const [isDragging, setIsDragging] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [locked, setLocked] = useState(isLocked);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPrediction) setValue(currentPrediction);
  }, [currentPrediction]);

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const handleRailInteraction = useCallback(
    (clientX: number) => {
      if (locked || disabled) return;
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const newValue = Math.round(pct * max);
      setValue(newValue);
    },
    [max, locked, disabled]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (locked || disabled) return;
    setIsDragging(true);
    handleRailInteraction(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) handleRailInteraction(e.clientX);
    },
    [isDragging, handleRailInteraction]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (locked || disabled) return;
    handleRailInteraction(e.touches[0].clientX);
  };

  const handleLockIn = () => {
    setLocked(true);
    onSubmit(value);
  };

  const handleExactInput = () => {
    const parsed = parseFloat(inputValue.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed >= 0) {
      setValue(Math.min(parsed, max));
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8888A0]">Your BidIQ Call</span>
        <button
          onClick={() => !locked && setShowInput(!showInput)}
          className="text-sm text-[#D4A843] hover:text-[#F0D78C] transition-colors"
          disabled={locked || disabled}
        >
          Type exact amount
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showInput ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555570]">
                $
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExactInput()}
                placeholder="0"
                className="w-full bg-[#0A0A0F] border border-[#2A2A40] rounded-lg pl-7 pr-4 py-3 text-[#F1F1F5] font-mono text-lg focus:outline-none focus:border-[#D4A843] transition-colors"
                autoFocus
              />
            </div>
            <Button onClick={handleExactInput}>Set</Button>
          </motion.div>
        ) : (
          <motion.div
            key="price"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <span className="font-mono text-4xl font-bold text-[#F1F1F5] tabular-nums">
              {formatPrice(value)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider Rail */}
      <div className="pt-4 pb-2">
        <div
          ref={railRef}
          className={cn(
            "relative h-3 bg-[#1E1E30] rounded-full cursor-pointer select-none",
            (locked || disabled) && "opacity-60 cursor-not-allowed"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={() => !locked && !disabled && setIsDragging(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#D4A843] to-[#F0D78C] transition-[width] duration-75"
            style={{ width: `${percentage}%` }}
          />

          {/* Hammer handle */}
          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-[#D4A843]/30",
              locked
                ? "bg-[#2A2A40] border-2 border-[#555570]"
                : "bg-gradient-to-br from-[#D4A843] to-[#8B6914] border-2 border-[#F0D78C]"
            )}
            style={{ left: `${percentage}%` }}
            animate={
              isDragging
                ? { scale: 1.2, boxShadow: "0 0 20px rgba(212,168,67,0.5)" }
                : { scale: 1 }
            }
          >
            {locked ? (
              <Lock size={16} className="text-[#555570]" />
            ) : (
              <Gavel size={16} className="text-[#0A0A0F]" />
            )}
          </motion.div>
        </div>

        {/* Price labels */}
        <div className="flex justify-between mt-2 text-xs text-[#555570] font-mono">
          <span>$0</span>
          <span>{formatPrice(max)}</span>
        </div>
      </div>

      {/* Lock-in button */}
      <AnimatePresence>
        {locked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl"
          >
            <Lock size={18} className="text-[#D4A843]" />
            <span className="font-semibold text-[#D4A843]">
              LOCKED IN at {formatPrice(value)}
            </span>
          </motion.div>
        ) : (
          <Button
            onClick={handleLockIn}
            disabled={disabled}
            size="lg"
            className="w-full text-base"
          >
            <Gavel size={18} className="mr-2" />
            Lock In {formatPrice(value)}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
