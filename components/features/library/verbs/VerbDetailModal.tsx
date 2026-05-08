"use client";

import React from "react";
import { X, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { splitFurigana } from "@/components/ui/SmartJapanese";
import * as wanakana from "wanakana";
import { VerbData } from "./types";
import { getBadgeColor, getGroupAccent, getConjugationSections } from "./utils";
import { ConjugationCell } from "./ConjugationCell";

interface VerbDetailModalProps {
  selectedVerb: VerbData | null;
  onClose: () => void;
}

/**
 * Modal detail konjugasi kata kerja.
 */
export function VerbDetailModal({ selectedVerb, onClose }: VerbDetailModalProps) {
  if (!selectedVerb) return null;

  const groupStyle = getGroupAccent(selectedVerb.group);
  const sections = getConjugationSections(selectedVerb);

  return (
    <Dialog open={!!selectedVerb} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideClose className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl p-0 gap-0 shadow-2xl no-scrollbar z-[100]">
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-xl border-b border-border p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className={`px-3 py-1.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] rounded-xl border h-auto bg-muted ${getBadgeColor(selectedVerb.group)}`}
                >
                  Golongan {selectedVerb.group}
                </Badge>
                {selectedVerb.transitivity && (
                  <Badge
                    variant="outline"
                    className={`px-3 py-1.5 text-xs md:text-xs font-black uppercase tracking-[0.2em] rounded-xl border h-auto ${
                      selectedVerb.transitivity === "transitive" 
                        ? "text-warning text-warning bg-warning/10 border-warning/20" 
                        : "text-primary text-primary bg-primary/10 border-primary/20"
                    }`}
                  >
                    {selectedVerb.transitivity === "transitive" ? "Transitif" : "Intransitif"}
                  </Badge>
                )}
                <TTSReader text={selectedVerb.jisho} minimal={true} />
              </div>

              <DialogTitle asChild>
                <div className="text-3xl md:text-4xl font-black text-foreground font-japanese block leading-tight tracking-tight">
                  {(() => {
                    const jisho = selectedVerb.jisho;
                    const furi = selectedVerb.furigana || "";
                    const isRomaji = furi && /^[a-zA-Z\s.,?!'-]+$/.test(furi);
                    const hiraReading = isRomaji ? wanakana.toHiragana(furi) : furi;
                    
                    return splitFurigana(jisho, hiraReading).map((chunk, i) => (
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
                    ));
                  })()}
                </div>
              </DialogTitle>

              <DialogDescription asChild>
                <div className="mt-2 md:mt-3">
                  <p className="text-sm md:text-base font-medium text-muted-foreground">
                    {selectedVerb.meaning}
                  </p>
                </div>
              </DialogDescription>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-5 md:space-y-6">
          {sections.map((section) => {
            const hasValues = section.items.some((item) => item.value);
            if (!hasValues) return null;

            return (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4 md:mb-5">
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center ${groupStyle.bg} ${groupStyle.border} border`}>
                    <span className={groupStyle.accent}>{section.icon}</span>
                  </div>
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-muted-foreground">
                    {section.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {section.items.map((item) => (
                    <ConjugationCell
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-xl border-t border-border px-5 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-primary animate-pulse" />
            <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Matriks Konjugasi
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-auto px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-xs font-bold uppercase tracking-widest rounded-xl bg-muted border border-border text-muted-foreground hover:bg-primary hover:text-white dark:hover:text-foreground hover:border-none transition-all"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
