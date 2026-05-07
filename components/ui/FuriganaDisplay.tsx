"use client";

import React from "react";
import { splitFurigana } from "@/lib/furigana";
import { useUIStore } from "@/store/useUIStore";
import * as wanakana from "wanakana";
import { motion, AnimatePresence } from "framer-motion";

interface FuriganaDisplayProps {
  text: string;
  furigana: string;
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
  mode?: "kanji" | "furigana" | "hiragana";
}

export default function FuriganaDisplay({ 
  text, 
  furigana, 
  size = "medium", 
  className = "",
  mode
}: FuriganaDisplayProps) {
  const globalShowFurigana = useUIStore((state) => state.settings.showFurigana);
  
  // Use mode prop if provided, otherwise fallback to global store
  const currentMode = mode || (globalShowFurigana ? "furigana" : "kanji");
  
  const parts = splitFurigana(text, furigana);

  const sizeConfig = {
    small: { furi: "text-[9px]", kanji: "text-base" },
    medium: { furi: "text-[10px] md:text-sm", kanji: "text-xl md:text-3xl" },
    large: { furi: "text-xs md:text-base", kanji: "text-4xl md:text-7xl" },
    xl: { furi: "text-sm md:text-xl", kanji: "text-5xl md:text-8xl" },
  };

  const { furi: furiSize, kanji: kanjiSize } = sizeConfig[size];

  return (
    <div className={`flex flex-wrap items-baseline leading-[3] ${className}`}>
      {parts.map((part, i) => (
        <div key={i} className="inline-flex flex-col items-center leading-none align-bottom">
          <div className="h-[1.2em] flex items-end justify-center">
            <AnimatePresence>
              {(currentMode === "furigana") && part.furi && (
                <motion.span
                  initial={{ opacity: 0, y: 1 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 1 }}
                  className={`${furiSize} font-bold text-primary tracking-[-0.02em] whitespace-nowrap mb-[2px]`}
                >
                  {part.furi}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className={`${kanjiSize} font-black tracking-normal ${wanakana.isKanji(part.text) ? 'text-foreground' : 'text-foreground/80'}`}>
            {currentMode === "hiragana" && part.furi ? part.furi : part.text}
          </span>
        </div>
      ))}
    </div>
  );
}
