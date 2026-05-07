"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { splitFurigana } from "@/lib/furigana";
import { VocabItem } from "./types";

interface VocabCardProps {
  item: VocabItem;
  idx: number;
  showRomaji: boolean;
}

/**
 * Komponen kartu kosakata individual.
 */
export function VocabCard({ item, idx, showRomaji }: VocabCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: (idx % 12) * 0.02 }}
      style={{ 
        contentVisibility: 'auto', 
        containIntrinsicSize: '0 250px',
        willChange: 'transform'
      }}
    >
      <Card className="p-5 md:p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all duration-300 group shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border h-auto bg-muted text-muted-foreground">
              {item.hinshi || (item._type === "verb_dictionary" ? "verb" : "-")}
            </Badge>
          </div>
          <TTSReader text={item.word} minimal={true} />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="text-2xl md:text-3xl font-black text-foreground font-japanese leading-tight tracking-tight group-hover:text-primary transition-colors">
            {splitFurigana(item.word, item.furigana || "").map((chunk, i) => (
              chunk.furi ? (
                <ruby key={i}>
                  {chunk.text}
                  <rt className="text-xs md:text-xs text-primary/80 font-bold tracking-widest not-italic">
                    {chunk.furi}
                  </rt>
                </ruby>
              ) : (
                <span key={i}>{chunk.text}</span>
              )
            ))}
          </div>
          
          <AnimatePresence>
            {showRomaji && item.romaji && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] md:text-xs font-bold text-muted-foreground/50 uppercase tracking-widest overflow-hidden"
              >
                {item.romaji}
              </motion.p>
            )}
          </AnimatePresence>
          
          <p className="text-sm md:text-base font-medium text-muted-foreground leading-snug group-hover:text-foreground transition-colors">
            {item.meaning}
          </p>
        </div>

        {(item.mnemonic || (item.relatedKanji && item.relatedKanji.length > 0)) && (
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {item.relatedKanji && item.relatedKanji.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.relatedKanji.map((kanji, kIdx) => (
                  <span key={kIdx} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-japanese" title={kanji.meaning}>
                    {kanji.character}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
