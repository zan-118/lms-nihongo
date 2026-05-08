"use client";

import { motion } from "framer-motion";

interface QuizProgressProps {
  current: number;
  total: number;
  color?: string;
  indicatorClassName?: string;
}

export function QuizProgress({ current, total, color = "bg-primary", indicatorClassName = "" }: QuizProgressProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full h-2 md:h-3 bg-background/[0.03] dark:bg-background/[0.05] rounded-full overflow-hidden relative border border-white/5 neo-inset">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`h-full ${color} relative rounded-full ${indicatorClassName}`}
      >
        {/* Glow Tip */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-background shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      </motion.div>
    </div>
  );
}
