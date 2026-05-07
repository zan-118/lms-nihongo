"use client";

import React from "react";
import { splitFurigana } from "@/lib/furigana";
import { useUIStore } from "@/store/useUIStore";
import * as wanakana from "wanakana";

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
  
  const currentMode = mode || (globalShowFurigana ? "furigana" : "kanji");
  const parts = splitFurigana(text, furigana);

  const sizeConfig = {
    small: { furi: "text-[10px]", kanji: "text-base" },
    medium: { furi: "text-[12px] md:text-[14px]", kanji: "text-xl md:text-2xl" },
    large: { furi: "text-sm md:text-lg", kanji: "text-2xl md:text-4xl" },
    xl: { furi: "text-base md:text-xl", kanji: "text-4xl md:text-6xl" },
  };

  const { furi: furiSize, kanji: kanjiSize } = sizeConfig[size];

  return (
    <div 
      className={`font-noto-serif leading-[2.8] tracking-normal inline-block w-full text-justify ${className}`}
      style={{ rubyPosition: 'over', rubyAlign: 'space-around' } as React.CSSProperties}
    >
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part.furi && (currentMode === "furigana" || currentMode === "hiragana") ? (
            <ruby className="group">
              <span className={`${kanjiSize} font-medium transition-colors ${currentMode === "hiragana" ? "text-primary" : "text-foreground"}`}>
                {currentMode === "hiragana" ? part.furi : part.text}
              </span>
              {currentMode === "furigana" && (
                <rt className={`${furiSize} text-primary/60 font-medium tracking-normal select-none`}>
                  {part.furi}
                </rt>
              )}
            </ruby>
          ) : (
            <span className={`${kanjiSize} font-medium transition-colors ${wanakana.isKanji(part.text) ? "text-foreground" : "text-foreground/90"}`}>
              {part.text}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
