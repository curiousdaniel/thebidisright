"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge as BadgeType } from "@/types/game";
import Button from "@/components/ui/Button";

interface BadgeUnlockProps {
  badge: BadgeType | null;
  onClose: () => void;
}

export default function BadgeUnlock({ badge, onClose }: BadgeUnlockProps) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" onClick={onClose} />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 text-center px-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-[#D4A843]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Badge Unlocked!
            </motion.p>

            <motion.span
              className="text-8xl"
              initial={{ scale: 0, y: -100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 150,
                delay: 0.3,
              }}
            >
              {badge.icon}
            </motion.span>

            <motion.h2
              className="text-2xl font-serif font-bold text-[#F1F1F5]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {badge.name}
            </motion.h2>

            <motion.p
              className="text-sm text-[#8888A0] max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {badge.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button onClick={onClose} variant="primary">
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
