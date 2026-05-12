"use client";

import React from "react";
import { splitFurigana } from "@/components/ui/SmartJapanese";
import { useUIStore } from "@/store/useUIStore";
import * as wanakana from "wanakana";

import WordPopover from "@/components/features/reading/components/WordPopover";

interface FuriganaDisplayProps {
  text: string;
  furigana: string;
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
  mode?: "kanji" | "furigana" | "hiragana" | "romaji";
  interactive?: boolean;
  romaji?: string;
}

export default function FuriganaDisplay({ 
  text, 
  furigana, 
  romaji,
  size = "medium", 
  className = "",
  mode,
  interactive = false
}: FuriganaDisplayProps) {
  const globalShowFurigana = useUIStore((state) => state.settings.showFurigana);
  const currentMode = mode || (globalShowFurigana ? "furigana" : "kanji");

  const sizeConfig = {
    small: { furi: "text-[10px]", kanji: "text-base" },
    medium: { furi: "text-[12px] md:text-[14px]", kanji: "text-xl md:text-2xl" },
    large: { furi: "text-sm md:text-lg", kanji: "text-2xl md:text-4xl" },
    xl: { furi: "text-base md:text-xl", kanji: "text-4xl md:text-6xl" },
  };

  const { furi: furiSize, kanji: kanjiSize } = sizeConfig[size];

  // Hiragana Mode: Direct return of furigana prop to ensure 100% no Kanji and high performance
  if (currentMode === "hiragana" && furigana) {
    return (
      <div className={`font-noto-serif leading-[2.8] tracking-normal inline-block w-full text-justify text-primary ${kanjiSize} ${className}`}>
        {furigana}
      </div>
    );
  }

  if (currentMode === "romaji" && romaji) {
    return (
      <div className={`font-sans font-medium text-primary/80 tracking-tight ${kanjiSize} ${className}`}>
        {romaji}
      </div>
    );
  }

  const parts = splitFurigana(text, furigana);

  const content = (
    <div 
      className={`font-noto-serif leading-[2.8] tracking-normal inline-block w-full text-justify ${className}`}
      style={{ rubyPosition: 'over', rubyAlign: 'space-around' } as React.CSSProperties}
    >
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {currentMode === "romaji" ? (
             <span className={`${kanjiSize} font-sans font-medium text-primary/80 tracking-tight`}>
               {part.furi ? wanakana.toRomaji(part.furi) : wanakana.toRomaji(part.text)}
             </span>
          ) : part.furi && currentMode === "furigana" ? (
            <ruby className="group">
              <span className={`${kanjiSize} font-medium transition-colors text-foreground`}>
                {part.text}
              </span>
              <rt className={`${furiSize} text-primary/60 font-medium tracking-normal select-none`}>
                {part.furi}
              </rt>
            </ruby>
          ) : (
            <span className={`${kanjiSize} font-medium transition-colors ${
              wanakana.isKanji(part.text.charAt(0)) ? "text-foreground" : "text-foreground/90"
            }`}>
              {part.text}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (interactive && text) {
    return (
      <WordPopover word={text} reading={furigana}>
        {content}
      </WordPopover>
    );
  }

  return content;
}
