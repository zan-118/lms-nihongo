"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface FlashcardSelectionProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

export function FlashcardSelection({
  categories,
  onSelectCategory,
}: FlashcardSelectionProps) {
  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      <header className="mb-8 md:mb-12">
        <nav className="mb-4 md:mb-6 italic">
          <Button asChild variant="ghost" className="h-auto text-muted-foreground text-xs font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:text-foreground">
            <Link href="/tools">← Kembali ke Peralatan</Link>
          </Button>
        </nav>
        <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight italic">
          Pilih <span className="text-primary">Materi</span>
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mt-2 max-w-xl font-medium leading-relaxed">
          Pilih level atau kategori yang ingin kamu latih.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card
          onClick={() => onSelectCategory("all")}
          className="group p-5 md:p-6 rounded-3xl border border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer flex flex-col gap-4 relative overflow-hidden shadow-sm"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
            <Layers size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-foreground">Semua Materi</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-1 leading-relaxed">Campuran dari seluruh koleksi yang tersedia.</p>
          </div>
          <ArrowRight size={18} className="absolute bottom-5 right-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Card>

        {categories.map((cat) => (
          <Card
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="group p-5 md:p-6 rounded-3xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer flex flex-col gap-4 relative overflow-hidden shadow-sm"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0">
              <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-foreground">{cat.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-1 leading-relaxed">Fokus pada materi level {cat.title}.</p>
            </div>
            <ArrowRight size={18} className="absolute bottom-5 right-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
