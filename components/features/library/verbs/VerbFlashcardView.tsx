"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlashcardMaster from "@/components/features/flashcards/master/FlashcardMaster";
import * as wanakana from "wanakana";
import { VerbData } from "./types";

interface VerbFlashcardViewProps {
  filteredVerbs: VerbData[];
  drillMode: "meaning" | "masu" | "te" | "nai" | "ta";
  setDrillMode: (mode: "meaning" | "masu" | "te" | "nai" | "ta") => void;
  onBack: () => void;
}

/**
 * Tampilan sesi latihan flashcard untuk kata kerja.
 */
export function VerbFlashcardView({
  filteredVerbs,
  drillMode,
  setDrillMode,
  onBack,
}: VerbFlashcardViewProps) {
  const flashcardData = filteredVerbs.map((verb) => {
    let displayWord = verb.jisho;
    let displayMeaning = verb.meaning;
    let targetFurigana = verb.furigana || verb.jisho;

    if (drillMode !== "meaning") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetValue = (verb as any)[drillMode];
      if (targetValue) {
        displayWord = `${verb.jisho} (${drillMode.toUpperCase()})`;
        displayMeaning = `Ubah "${verb.jisho}" ke bentuk ${drillMode.toUpperCase()}`;
        targetFurigana = targetValue;
      }
    }

    return {
      _id: verb._id,
      word: displayWord,
      meaning: displayMeaning,
      furigana: targetFurigana,
      romaji: wanakana.toRomaji(targetFurigana),
      level: { code: "library" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mnemonic: (verb as any).mnemonic,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relatedKanji: (verb as any).relatedKanji,
    };
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto w-full mt-10 px-4 flex-1 pb-24">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center justify-center gap-3 px-8 py-6 rounded-2xl text-xs md:text-xs font-bold uppercase tracking-widest w-full sm:w-auto neo-card bg-muted border-border hover:bg-primary hover:text-white dark:hover:text-black transition-all"
        >
          <ArrowLeft size={18} /> Kembali
        </Button>

        <div className="flex bg-muted p-1 rounded-xl border border-border w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(["meaning", "masu", "te", "nai", "ta"] as const).map((m) => (
            <Button
              key={m}
              variant="ghost"
              size="sm"
              onClick={() => setDrillMode(m)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                drillMode === m ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m === "meaning" ? "Arti" : m.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <FlashcardMaster cards={flashcardData} />
    </div>
  );
}
