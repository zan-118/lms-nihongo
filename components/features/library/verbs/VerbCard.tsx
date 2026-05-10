"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { splitFurigana } from "@/components/ui/SmartJapanese";
import * as wanakana from "wanakana";
import { VerbData } from "./types";
import { getBadgeColor } from "./utils";

interface VerbCardProps {
  verb: VerbData;
  idx: number;
  showRomaji: boolean;
  onClick: () => void;
}

/**
 * Komponen kartu kata kerja untuk grid daftar.
 */
export function VerbCard({ verb, idx, showRomaji, onClick }: VerbCardProps) {
  const badgeColor = getBadgeColor(verb.group);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: (idx % 12) * 0.02 }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className="h-full bg-card border border-border rounded-2xl cursor-pointer group hover:border-primary/40 hover:bg-primary/[0.03] transition-all duration-200 shadow-sm"
      >
        <div className="p-5 md:p-6 flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`px-2.5 py-1 text-xs md:text-xs font-bold uppercase tracking-wider rounded-lg border h-auto ${badgeColor}`}
              >
                Gol. {verb.group}
              </Badge>
              {verb.transitivity && (
                <Badge
                  variant="outline"
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border h-auto ${
                    verb.transitivity === "transitive" 
                      ? "text-warning text-warning bg-warning/10 border-warning/20" 
                      : "text-primary text-primary bg-primary/10 border-primary/20"
                  }`}
                >
                  {verb.transitivity === "transitive" ? "Tr" : "Intr"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TTSReader text={verb.jisho} minimal={true} />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="text-2xl md:text-3xl font-black text-foreground font-japanese block group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight">
              {splitFurigana(verb.jisho, verb.furigana || "").map((chunk, i) => (
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
              {showRomaji && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] md:text-xs font-bold text-muted-foreground/40 uppercase tracking-widest group-hover:text-muted-foreground transition-colors overflow-hidden"
                >
                  {wanakana.toRomaji(verb.furigana || verb.jisho)}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs md:text-[13px] font-medium text-muted-foreground leading-snug group-hover:text-foreground transition-colors line-clamp-2">
              {verb.meaning}
            </p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <div className="flex gap-1.5 flex-wrap min-w-0">
              {verb.masu && (
                <span className="px-2 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded-md border border-border font-japanese truncate">
                  {verb.masu}
                </span>
              )}
              {verb.te && (
                <span className="px-2 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded-md border border-border font-japanese truncate">
                  {verb.te}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors whitespace-nowrap shrink-0">
              Detail →
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
