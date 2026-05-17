"use client";

import { motion } from "framer-motion";
import { Layers, PenTool, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ModeLatihan = "vocab" | "kanji" | "survival";

interface FlashcardModeSelectionProps {
  selectedCategory: string;
  onBack: () => void;
  onSelectMode: (mode: ModeLatihan) => void;
}

export function FlashcardModeSelection({
  selectedCategory,
  onBack,
  onSelectMode,
}: FlashcardModeSelectionProps) {
  return (
    <motion.div
      key="mode"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      <header className="mb-8 md:mb-12">
        <nav className="mb-4 md:mb-6 italic">
          <Button onClick={onBack} variant="ghost" className="h-auto text-muted-foreground text-xs font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:text-foreground">
            ← Kembali
          </Button>
        </nav>
        <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight italic">
          Mode <span className="text-primary">Latihan</span>
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mt-2 max-w-xl font-medium leading-relaxed">
          Kamu memilih kategori <strong className="text-foreground uppercase">{selectedCategory === "all" ? "Semua Materi" : selectedCategory}</strong>. Sekarang pilih cara kamu ingin berlatih.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card
          onClick={() => onSelectMode('vocab')}
          className="group p-6 sm:p-8 rounded-3xl border border-primary/20 bg-card hover:border-primary/60 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted border border-border text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
            <Layers size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">Kosakata</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-2 leading-relaxed">Latihan memori standar. Ingat arti dan bacaan kartu dengan santai.</p>
          </div>
        </Card>

        <Card
          onClick={() => onSelectMode('kanji')}
          className="group p-6 sm:p-8 rounded-3xl border border-secondary/20 bg-card hover:border-secondary/60 hover:bg-secondary/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted border border-border text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
            <PenTool size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground group-hover:text-secondary transition-colors">Kamus Kanji</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-2 leading-relaxed">Fitur lengkap Canvas menulis huruf. Pahami Onyomi, Kunyomi dan contoh katanya.</p>
          </div>
        </Card>

        <Card
          onClick={() => onSelectMode('survival')}
          className="group p-6 sm:p-8 rounded-3xl border border-destructive/20 bg-card hover:border-destructive/60 hover:bg-destructive/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted border border-border text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-destructive-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
            <Flame size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground group-hover:text-destructive transition-colors">Survival</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-2 leading-relaxed">Uji nyali! Modus tantangan ketat dengan Hit Points (HP) dan batas waktu.</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
